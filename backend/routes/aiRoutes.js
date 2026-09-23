const express = require('express');
const aiRouter = express.Router();

const {generateAiText} = require('../controllers/generateTextControllers');

// Text generation routes

aiRouter.post('/', generateAiText);

module.exports = aiRouter;