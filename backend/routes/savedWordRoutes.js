const express = require('express');
const { ensureUser } = require('../middleware/authMiddleware');
const { saveWord, getSavedWords, deleteSavedWord } = require('../controllers/savedWordControllers');

const router = express.Router();

router.get('/', getSavedWords);          // works for everyone
router.post('/', ensureUser, saveWord);  // creates a guest on the first save
router.delete('/:id', deleteSavedWord);  // only your own words

module.exports = router;