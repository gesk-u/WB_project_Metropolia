const express = require('express');
const searchRouter = express.Router();
const {
    searchVideos,
} = require("../controllers/searchControllers.js")

// GET /youtube videos
app.get("/search", searchVideos)