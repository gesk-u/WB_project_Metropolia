const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const videoSchema = new Schema({
    videoId: {
        type: String,
        required: true,
    },
    startSec: {
        type: Number,
        required: true
    },
    text: {
        type: String,
    },
}, { _id: false });



const wordSearchSchema = new Schema({
    query: {
        type: String, 
        required: true,
        lowercase: true,
        trim: true,
     },
     lemma: {
        type: String,
        default: '',
        lowercase: true,
        trim: true
     },
     results: [videoSchema],
     fetchAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 7
     },
});


wordSearchSchema.index({ query: 1, lemma: 1 }, { unique: true });

const WordSearch = mongoose.model('WordSearch', wordSearchSchema);

module.exports = { WordSearch };    