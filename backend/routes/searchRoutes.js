const express = require('express');
const searchRouter = express.Router();
const search = require("../controllers/searchControllers.js")

// GET /youtube videos
searchRouter.post("/", search.searchVideos)

module.exports = searchRouter;