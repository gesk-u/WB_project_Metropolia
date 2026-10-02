// Tests for the saved-words controller. Run with: npm test
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const sinon = require('sinon');
const { MongoMemoryServer } = require('mongodb-memory-server');

const SavedWord = require('../models/savedWordModel');
const savedWordsLib = require('../models/savedWordsLib');
// Adjust this path to wherever your controller file lives
const { saveWord, getSavedWords, deleteSavedWord } = require('../controllers/savedWordControllers');

const VIDEO_ID = 'abcDEF12345'; // any 11-character id passes the format check

// A fake Express `res` that records what the controller sends back
function mockRes() {
    const res = { statusCode: 200, body: undefined, ended: false };
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (data) => { res.body = data; return res; };
    res.end = () => { res.ended = true; return res; };
    return res;
}

// A valid request body; override any field to test edge cases
function validBody(overrides = {}) {
    return {
        word: 'kissa',
        videoId: VIDEO_ID,
        sentence: 'Minulla on kissa.',
        start: 12.5,
        videoTitle: 'Test video', // included, so the controller never calls YouTube
        ...overrides,
    };
}

// A saved-word document for putting test data straight into the database.
// If your schema has other required fields, add them here.
function wordDoc(userId, word, createdAt = new Date()) {
    return {
        userId,
        word,
        videoId: VIDEO_ID,
        start: 10,
        sentence: `Tässä on ${word}.`,
        matchedForm: word,
        videoTitle: 'Test video',
        createdAt,
        updatedAt: createdAt,
    };
}

const newUser = () => ({ _id: new mongoose.Types.ObjectId() });

let mongod;

before(async function () {
    this.timeout(120000); // the first run downloads a MongoDB binary
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    await SavedWord.init(); // build the schema's indexes (e.g. unique ones)
});

afterEach(async () => {
    sinon.restore();
    await SavedWord.deleteMany({});
});

after(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

describe('saveWord', () => {
    it('saves a new word, trimmed and lowercased', async () => {
        const user = newUser();
        const res = mockRes();

        await saveWord({ user, body: validBody({ word: '  Kissa ' }) }, res);

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.word, 'kissa');
        assert.equal(res.body.matchedForm, 'kissa'); // falls back to the word
        assert.equal(await SavedWord.countDocuments({ userId: user._id }), 1);
    });

    it('updates the existing entry instead of creating a duplicate', async () => {
        const user = newUser();

        await saveWord({ user, body: validBody({ start: 5 }) }, mockRes());
        await saveWord({ user, body: validBody({ start: 42 }) }, mockRes());

        const docs = await SavedWord.find({ userId: user._id });
        assert.equal(docs.length, 1);
        assert.equal(docs[0].start, 42);
    });

    it("keeps different users' words separate", async () => {
        await saveWord({ user: newUser(), body: validBody() }, mockRes());
        await saveWord({ user: newUser(), body: validBody() }, mockRes());

        assert.equal(await SavedWord.countDocuments({ word: 'kissa' }), 2);
    });

    const invalidBodies = {
        'word is missing': { word: undefined },
        'word is only spaces': { word: '   ' },
        'sentence is missing': { sentence: undefined },
        'start is negative': { start: -1 },
        'start is not a number': { start: 'abc' },
        'videoId has the wrong format': { videoId: 'too-short' },
    };

    for (const [description, overrides] of Object.entries(invalidBodies)) {
        it(`returns 400 when ${description}`, async () => {
            const res = mockRes();

            await saveWord({ user: newUser(), body: validBody(overrides) }, res);

            assert.equal(res.statusCode, 400);
            assert.equal(await SavedWord.countDocuments(), 0);
        });
    }

    it('fetches the video title when the request does not include one', async () => {
        const getTitle = sinon.stub(savedWordsLib, 'getVideoTitle').resolves('Title from YouTube');
        const res = mockRes();

        await saveWord({ user: newUser(), body: validBody({ videoTitle: undefined }) }, res);

        sinon.assert.calledOnceWithExactly(getTitle, VIDEO_ID);
        assert.equal(res.body.videoTitle, 'Title from YouTube');
    });

    it('returns 500 when the database fails', async () => {
        sinon.stub(SavedWord, 'findOneAndUpdate').rejects(new Error('DB down'));
        sinon.stub(console, 'error'); // keep the expected error out of the test output
        const res = mockRes();

        await saveWord({ user: newUser(), body: validBody() }, res);

        assert.equal(res.statusCode, 500);
    });
});

describe('getSavedWords', () => {
    it('returns an empty list for a visitor without a user', async () => {
        const res = mockRes();

        await getSavedWords({}, res);

        assert.deepEqual(res.body, []);
    });

    it("returns only this user's words, newest first", async () => {
        const user = newUser();
        const otherUser = newUser();
        // Inserted directly so the createdAt dates are exactly what we set
        await SavedWord.collection.insertMany([
            wordDoc(user._id, 'koira', new Date('2026-01-01')),
            wordDoc(user._id, 'talo', new Date('2026-03-01')),
            wordDoc(otherUser._id, 'kissa', new Date('2026-02-01')),
        ]);
        const res = mockRes();

        await getSavedWords({ user }, res);

        assert.deepEqual(res.body.map((w) => w.word), ['talo', 'koira']);
    });
});

describe('deleteSavedWord', () => {
    it("deletes the user's own word", async () => {
        const user = newUser();
        const word = await SavedWord.create(wordDoc(user._id, 'kissa'));
        const res = mockRes();

        await deleteSavedWord({ user, params: { id: word._id.toString() } }, res);

        assert.equal(res.statusCode, 204);
        assert.equal(res.ended, true);
        assert.equal(await SavedWord.countDocuments(), 0);
    });

    it("returns 404 and keeps the word when another user tries to delete it", async () => {
        const owner = newUser();
        const word = await SavedWord.create(wordDoc(owner._id, 'kissa'));
        const res = mockRes();

        await deleteSavedWord({ user: newUser(), params: { id: word._id.toString() } }, res);

        assert.equal(res.statusCode, 404);
        assert.equal(await SavedWord.countDocuments(), 1);
    });

    it('returns 404 for a visitor without a user', async () => {
        const res = mockRes();
        const id = new mongoose.Types.ObjectId().toString();

        await deleteSavedWord({ params: { id } }, res);

        assert.equal(res.statusCode, 404);
    });
});