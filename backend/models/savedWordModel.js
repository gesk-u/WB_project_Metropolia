const mongoose = require('mongoose');

const savedWordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  word: { type: String, required: true },
  videoId: String,
  start: Number, // timestamp in seconds
}, { timestamps: true });

// The same user can't save the same word twice
savedWordSchema.index({ userId: 1, word: 1 }, { unique: true });

module.exports = mongoose.model('SavedWord', savedWordSchema);