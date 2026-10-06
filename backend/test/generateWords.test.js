// Tests for the generate-words controller. Run with: npm test
const assert = require("node:assert/strict");
const sinon = require("sinon");
const express = require("express");
const request = require("supertest");

const getAiGeneratedText = sinon.stub();
const servicePath = require.resolve("../models/generateService");
require.cache[servicePath] = {
  id: servicePath,
  filename: servicePath,
  loaded: true,
  exports: { getAiGeneratedText },
};

const { generateAiText } = require("../controllers/generateTextControllers");

// A fake Express `res` that records what the controller sends back
function mockRes() {
  const res = { statusCode: 200, body: undefined };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
}

const INVALID_WORD = { error: "Please provide a valid word." };

function useCleanStubs() {
  beforeEach(() => {
    getAiGeneratedText.reset();
    sinon.stub(console, "error"); // keep expected errors out of the test output
  });

  afterEach(() => {
    sinon.restore();
  });
}

describe("generateAiText", () => {
  describe("input validation", () => {
    useCleanStubs();
    const invalidBodies = {
      "body is missing": undefined,
      "word is missing": {},
      "word is null": { word: null },
      "word is a number": { word: 123 },
      "word is an array": { word: ["talo"] },
      "word is empty": { word: "" },
      "word is only spaces": { word: "   " },
      "word contains digits": { word: "talo123" },
      "word contains punctuation": { word: "talo!" },
      "word has non-Finnish letters": { word: "straße" },
      "word starts with a hyphen": { word: "-talo" },
      "word starts with an apostrophe": { word: "'talo" },
      "word is 51 characters long": { word: "a".repeat(51) },
    };

    for (const [description, body] of Object.entries(invalidBodies)) {
      it(`returns 400 when ${description}`, async () => {
        const res = mockRes();

        await generateAiText({ body }, res);

        assert.equal(res.statusCode, 400);
        assert.deepEqual(res.body, INVALID_WORD);
        sinon.assert.notCalled(getAiGeneratedText);
      });
    }

    const validWords = {
      "a plain word": ["talo", "talo"],
      "uppercase letters": ["TALO", "talo"],
      "surrounding spaces": ["  talo  ", "talo"],
      "Finnish letters": ["äiti", "äiti"],
      "uppercase Finnish letters": ["ÄITI", "äiti"],
      "a hyphenated word": ["työ-ura", "työ-ura"],
      "a phrase with a space": ["hyvää huomenta", "hyvää huomenta"],
      "exactly 50 characters": ["a".repeat(50), "a".repeat(50)],
    };

    for (const [description, [input, expected]] of Object.entries(validWords)) {
      it(`accepts ${description}`, async () => {
        getAiGeneratedText.resolves({ word: expected });
        const res = mockRes();

        await generateAiText({ body: { word: input } }, res);

        sinon.assert.calledOnceWithExactly(getAiGeneratedText, expected);
        assert.equal(res.statusCode, 200);
      });
    }
  });

  describe("results", () => {
    useCleanStubs();
    it("responds with the generated info", async () => {
      const info = {
        word: "talo",
        translation: "house",
        examples: ["Talo on iso."],
      };
      getAiGeneratedText.resolves(info);
      const res = mockRes();

      await generateAiText({ body: { word: "talo" } }, res);

      assert.equal(res.statusCode, 200);
      assert.deepEqual(res.body, info);
    });

    it("returns 404 when the word is not recognized as Finnish", async () => {
      getAiGeneratedText.resolves({ error: "not finnish" });
      const res = mockRes();

      await generateAiText({ body: { word: "Hello" } }, res);

      assert.equal(res.statusCode, 404);
      assert.deepEqual(res.body, {
        error: '"hello" was not recognized as a Finnish word.',
      });
    });
  });

  describe("service failures", () => {
    useCleanStubs();
    it("returns 429 when the rate limit is reached", async () => {
      getAiGeneratedText.rejects(
        Object.assign(new Error("Too many"), { status: 429 }),
      );
      const res = mockRes();

      await generateAiText({ body: { word: "talo" } }, res);

      assert.equal(res.statusCode, 429);
      assert.deepEqual(res.body, {
        error: "Rate limit reached, try again in a minute.",
      });
      sinon.assert.calledOnce(console.error);
    });

    it("returns 500 for other errors", async () => {
      getAiGeneratedText.rejects(new Error("boom"));
      const res = mockRes();

      await generateAiText({ body: { word: "talo" } }, res);

      assert.equal(res.statusCode, 500);
      assert.deepEqual(res.body, { error: "Failed to generate response." });
      sinon.assert.calledOnce(console.error);
    });

    it("returns 500 for upstream errors that are not 429", async () => {
      getAiGeneratedText.rejects(
        Object.assign(new Error("Unavailable"), { status: 503 }),
      );
      const res = mockRes();

      await generateAiText({ body: { word: "talo" } }, res);

      assert.equal(res.statusCode, 500);
    });
  });
});

describe("POST /api/ai (HTTP)", () => {
  useCleanStubs();
  const ROUTE = "/api/ai";

  const app = express();
  app.use(express.json());
  app.post(ROUTE, generateAiText);

  it("returns 200 and the generated info", async () => {
    const info = { word: "talo", translation: "house" };
    getAiGeneratedText.resolves(info);

    const res = await request(app).post(ROUTE).send({ word: " Talo " });

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, info);
    sinon.assert.calledOnceWithExactly(getAiGeneratedText, "talo");
  });

  it("returns 400 for an invalid word", async () => {
    const res = await request(app).post(ROUTE).send({ word: "talo123" });

    assert.equal(res.status, 400);
    assert.deepEqual(res.body, INVALID_WORD);
    sinon.assert.notCalled(getAiGeneratedText);
  });

  it("returns 400 for an empty request", async () => {
    const res = await request(app).post(ROUTE);

    assert.equal(res.status, 400);
    sinon.assert.notCalled(getAiGeneratedText);
  });

  it("returns 400 for malformed JSON", async () => {
    const res = await request(app)
      .post(ROUTE)
      .set("Content-Type", "application/json")
      .send('{"word": "talo"');

    assert.equal(res.status, 400);
    sinon.assert.notCalled(getAiGeneratedText);
  });

  it("returns 404 when the word is not Finnish", async () => {
    getAiGeneratedText.resolves({ error: "not finnish" });

    const res = await request(app).post(ROUTE).send({ word: "hello" });

    assert.equal(res.status, 404);
  });

  it("returns 429 on upstream rate limits", async () => {
    getAiGeneratedText.rejects(
      Object.assign(new Error("Too many"), { status: 429 }),
    );

    const res = await request(app).post(ROUTE).send({ word: "talo" });

    assert.equal(res.status, 429);
  });

  it("returns 500 on other errors", async () => {
    getAiGeneratedText.rejects(new Error("boom"));

    const res = await request(app).post(ROUTE).send({ word: "talo" });

    assert.equal(res.status, 500);
  });

  it("does not handle GET requests", async () => {
    const res = await request(app).get(ROUTE);

    assert.equal(res.status, 404);
  });
});
