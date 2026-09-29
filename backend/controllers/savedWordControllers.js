const SavedWord = require('../models/savedWordModel');

// POST: save a word (ensureUser runs first, so req.user always exists here)
async function saveWord(req, res) {
    try {
        const word = req.body.word?.trim().toLowerCase();
        if (!word) return res.status(400).json({ erroe: 'word is required' })

        const saved = await SavedWord.findOneAndUpdate(
            { userId: req.user._id, word },
            { videoId: req.body.videoId, start: req.body.start },
            { upsert: true, new: true}
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
        const words = await SavedWord.find({ userId: req.user._id }).sort({ createdAt: -1 });
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