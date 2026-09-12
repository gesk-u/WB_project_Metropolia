const youtubeLib = require("../models/youtubeLib")

const searchVideos = async (req, res) => {
    const { word, page = 1, pageSize = 100 } = req.query
    
    if (!word?.trim()) {
    return res.status(400).json({ error: 'word parameter required' });
    }

    try {
        const matchesById = await youtubeLib.findWordAcrossFinnishVideos(word)
        res.json(youtubeLib.buildResponse(word, matchesByVideo, Number(page), Number(pageSize)))
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'search failed' });
    }
}

module.exports = {
    searchVideos,
}