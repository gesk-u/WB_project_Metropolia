const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  isGuest: { type: Boolean, default: true },
  email: { type: String, unique: true, sparse: true },
  lastActiveAt: { type: Date, default: Date.now },
});

// Guests inactive for 30 days are deleted automatically
userSchema.index(
  { lastActiveAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30, partialFilterExpression: { isGuest: true } }
);

module.exports = mongoose.model('User', userSchema);