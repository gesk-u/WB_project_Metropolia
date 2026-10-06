const mongoose = require('mongoose');

const savedWordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // What the user searched for, e.g. "ystävä"
    word: { type: String, required: true, trim: true, lowercase: true },
    // The form that actually appears in the subtitle, e.g. "ystäväni"
    matchedForm: { type: String, trim: true },
    // The subtitle line the word was found in
    sentence: { type: String, required: true },

    videoId: { type: String, required: true }, // YouTube id, e.g. "dQw4w9WgXcQ"
    videoTitle: { type: String, default: '' },
    start: { type: Number, required: true, min: 0 }, // seconds into the video

    // Spaced repetition (the review page will update these later)
    level: { type: Number, default: 0, min: 0, max: 6 },
    nextReviewAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // adds createdAt / updatedAt
);

// The same user can't save the same clip of the same word twice
savedWordSchema.index({ userId: 1, word: 1}, { unique: true });

module.exports = mongoose.model('SavedWord', savedWordSchema);