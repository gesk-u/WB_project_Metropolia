require("dotenv").config();
const mongoose = require("mongoose");
const supertest = require("supertest");
const express = require("express");
const { google } = require("googleapis");
const { YoutubeTranscript } = require("youtube-transcript");

// Fake YouTube.
const mockSearchList = vi.fn();
const mockVideosList = vi.fn();
const mockCaptionsList = vi.fn();

vi.spyOn(google, "youtube").mockReturnValue({
  search: { list: mockSearchList },
  videos: { list: mockVideosList },
  captions: { list: mockCaptionsList },
});
const fetchTranscriptSpy = vi.spyOn(YoutubeTranscript, "fetchTranscript");

vi.spyOn(console, "log").mockImplementation(() => {});
vi.spyOn(console, "error").mockImplementation(() => {});

const searchRouter = require("../../routes/searchRoutes.js");
const { WordSearch } = require("../../models/wordSearchModel");

const app = express();
app.use(express.json());
app.use("/api/search", searchRouter);

const api = supertest(app);

const search = (params) => api.post("/api/search").query(params);

const seedCache = (overrides = {}) =>
  WordSearch.create({
    query: "kissa",
    lemma: "",
    results: [{ videoId: "abc123", startSec: 10, text: "kissa istuu ikkunalla" }],
    ...overrides,
  });

// The fake: two Finnish videos whose transcripts contain "päivä" three times.
const givenTwoVideos = () => {
  const videos = [
    {
      id: "vidA",
      transcript: [
        { text: "Joku päivä mä pääsen kertomaan", offset: 205519 },
        { text: "ei tässä mitään", offset: 210000 },
        { text: "Hyvä päivä!", offset: 918199 },
      ],
    },
    {
      id: "vidB",
      transcript: [
        { text: "syntymäpäivää kaikille", offset: 1000 },
        { text: "päivä alkaa", offset: 20119 },
      ],
    },
  ];
  mockSearchList.mockResolvedValue({
    data: { items: videos.map((v) => ({ id: { videoId: v.id } })) },
  });
  mockVideosList.mockResolvedValue({
    data: {
      items: videos.map((v) => ({ id: v.id, snippet: { defaultAudioLanguage: "fi" } })),
    },
  });
  fetchTranscriptSpy.mockImplementation(
    async (videoId) => videos.find((v) => v.id === videoId).transcript
  );
};

const expectNoYoutubeCalls = () => {
  expect(mockSearchList).not.toHaveBeenCalled();
  expect(mockVideosList).not.toHaveBeenCalled();
  expect(fetchTranscriptSpy).not.toHaveBeenCalled();
};
//---------------------------------

beforeAll(async () => {
  if (!process.env.TEST_MONGO_URI) {
    throw new Error("TEST_MONGO_URI is not set in .env");
  }
  await mongoose.connect(process.env.TEST_MONGO_URI);

  const { host, name } = mongoose.connection;
  const isLocal = ["localhost", "127.0.0.1"].includes(host);
  const looksLikeTest = name.toLowerCase().includes("test");
  const sameAsRealDb =
    Boolean(process.env.MONGO_URI) &&
    process.env.TEST_MONGO_URI === process.env.MONGO_URI;

  if (sameAsRealDb || !(isLocal || looksLikeTest)) {
    await mongoose.connection.close();
    throw new Error(
      `Refusing to run: "${name}" on "${host}" does not look like a test database.`
    );
  }
});

beforeEach(async () => {
  await WordSearch.deleteMany({});

  // Every fake gets a default, so a test can never reach the real YouTube.
  mockSearchList.mockReset().mockResolvedValue({ data: { items: [] } });
  mockVideosList.mockReset().mockResolvedValue({ data: { items: [] } });
  mockCaptionsList.mockReset().mockResolvedValue({ data: { items: [] } });
  fetchTranscriptSpy.mockReset();
  fetchTranscriptSpy.mockResolvedValue([]);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// `POST /api/search?word=...`

describe("POST /api/search", () => {
  describe("input validation", () => {
    it.each([
      ["missing", {}],
      ["empty", { word: "" }],
      ["only whitespace", { word: "   " }],
    ])("should return 400 when word is %s", async (_label, params) => {
      const response = await search(params).expect(400);

      expect(response.body).toEqual({ error: "word parameter required" });
      expectNoYoutubeCalls();
    });
  });

  describe("when the word is already cached", () => {
    it("should return the saved result without going to YouTube", async () => {
      await seedCache();

      const response = await search({ word: "kissa" }).expect(200);

      expectNoYoutubeCalls();
      expect(response.body).toEqual({
        query: "kissa",
        lemma: "",
        total: 1,
        page: 1,
        pageSize: 100,
        results: [
          {
            videoId: "abc123",
            startSec: 10,
            text: "kissa istuu ikkunalla",
            seekSec: 9,
            url: "https://youtube.com/watch?v=abc123&t=9s",
          },
        ],
      });
    });

    it("should treat different capitalisation and extra surrounding spaces as the same word", async () => {
      await seedCache();

      const response = await search({ word: "  KiSsA " }).expect(200);

      expectNoYoutubeCalls();
      expect(response.body.query).toBe("kissa");
      expect(await WordSearch.countDocuments()).toBe(1);
    });

    it("should normalise the lemma too", async () => {
      await seedCache({ lemma: "kissa" });

      const response = await search({ word: "kissa", lemma: " KISSA " }).expect(200);

      expectNoYoutubeCalls();
      expect(response.body.lemma).toBe("kissa");
    });
  });

  describe("pagination", () => {
    const fiveResults = [1, 2, 3, 4, 5].map((n) => ({
      videoId: `v${n}`,
      startSec: n * 10,
      text: `kissa ${n}`,
    }));

    beforeEach(async () => {
      await seedCache({ results: fiveResults });
    });

    it("should return the requested page and the full total", async () => {
      const response = await search({ word: "kissa", page: 2, pageSize: 2 }).expect(200);

      expect(response.body.total).toBe(5);
      expect(response.body.results.map((hit) => hit.videoId)).toEqual(["v3", "v4"]);
    });

    it("should return an empty page after the last one", async () => {
      const response = await search({ word: "kissa", page: 10, pageSize: 2 }).expect(200);

      expect(response.body.total).toBe(5);
      expect(response.body.results).toEqual([]);
    });

    it("should fall back to page 1 and pageSize 100 for invalid values", async () => {
      const response = await search({ word: "kissa", page: "abc", pageSize: 0 }).expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.pageSize).toBe(100);
    });
  });

  describe("when the word has not been searched before", () => {
    it("should return every matching line with correct seek times and urls", async () => {
      givenTwoVideos();

      const response = await search({ word: "päivä" })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.total).toBe(3);
      expect(response.body.results).toEqual([
        {
          videoId: "vidA",
          startSec: 205.519,
          text: "Joku päivä mä pääsen kertomaan",
          seekSec: 204,
          url: "https://youtube.com/watch?v=vidA&t=204s",
        },
        {
          videoId: "vidA",
          startSec: 918.199,
          text: "Hyvä päivä!",
          seekSec: 917,
          url: "https://youtube.com/watch?v=vidA&t=917s",
        },
        {
          videoId: "vidB",
          startSec: 20.119,
          text: "päivä alkaa",
          seekSec: 19,
          url: "https://youtube.com/watch?v=vidB&t=19s",
        },
      ]);
    });

    it("should save the result and answer the same word again from the database", async () => {
      givenTwoVideos();

      const first = await search({ word: "päivä" }).expect(200);
      const second = await search({ word: "päivä" }).expect(200);

      expect(mockSearchList).toHaveBeenCalledTimes(1);
      expect(second.body).toEqual(first.body);
      expect(await WordSearch.countDocuments()).toBe(1);
    });
  });
});