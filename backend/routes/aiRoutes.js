const express = require('express');
const aiRouter = express.Router();

const {generateWordExamples, generateWordInfo} = require('../controllers/generateTextControllers');

// Text generation routes

aiRouter.post('/generate-word-examples', generateWordExamples);
aiRouter.post('/generate-word-info', generateWordInfo);


module.exports = aiRouter;