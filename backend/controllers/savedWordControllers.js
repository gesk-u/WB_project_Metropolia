const SavedWord = require('../models/savedWordModel');
const savedWordsLib = require("../models/savedWordsLib")


// POST: save a word (ensureUser runs first, so req.user always exists here)
async function saveWord(req, res) {
    try {
        const word = req.body.word?.trim().toLowerCase();
        const { videoId, sentence, matchedForm, videoTitle } = req.body;
        const start = Number(req.body.start);
        if (!word || !sentence || !Number.isFinite(start) || start < 0 || !/^[\w-]{11}$/.test(videoId ?? '')) {
            return res.status(400).json({ error: 'word, videoId, sentence and start are required' });
        }

        const title = videoTitle?.trim() || await savedWordsLib.getVideoTitle(videoId);

        const saved = await SavedWord.findOneAndUpdate(
            { userId: req.user._id, word },
            {
                videoId,
                start,
                sentence,
                matchedForm: matchedForm?.trim() || word,
                videoTitle: title,
            },
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        );
        res.json(saved);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not save word' })
    }
}

// GET: list saved words
async function getSavedWords(req, res) {
    try {
        if (!req.user) return res.json([]); // anonymous visitor → nothing saved yet
        const words = await SavedWord.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
        res.json(words);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not load saved words' });
    }
}

async function deleteSavedWord(req, res) {
    try {
        if (!req.user) return res.status(404).json({ error: 'Word not found' });
        const deleted = await SavedWord.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!deleted) return res.status(404).json({ error: 'Word not found' })
            res.status(204).end()
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Could not delete word' });
    }
}


module.exports = { saveWord, getSavedWords, deleteSavedWord };