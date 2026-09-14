const youtubeLib = require("../models/youtubeLib")

const searchVideos = async (req, res) => {
    const { word, lemma='', page = 1, pageSize = 100 } = req.query
    
    if (!word?.trim()) {
    return res.status(400).json({ error: 'word parameter required' });
    }

    try {
        const results = await youtubeLib.findVideo(word, lemma, page, pageSize)
        res.status(200).json(results);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'search failed' });
    }
}

module.exports = {
    searchVideos,
}

