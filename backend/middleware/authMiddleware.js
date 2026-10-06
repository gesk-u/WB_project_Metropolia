const jwt = require('jsonwebtoken');
const GuestUser = require('../models/userModel');


const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// Finds the user from the cookie if there is one. Never blocks the request
async function optionalAuth(req, res, next) {
  req.user = null;
  const token = req.cookies.token;
  if (!token) return next();

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await GuestUser.findByIdAndUpdate(userId, { lastActiveAt: new Date() }, { new: true });
  } catch {
    // expired or fake token → continue as anonymous
  }
  if (!req.user) res.clearCookie('token');
  next();
}

// Creates a guest user the first time someone saves something
async function ensureUser(req, res, next) {
  if (req.user) return next();
  try {
    req.user = await GuestUser.create({ isGuest: true });
    const token = jwt.sign({ userId: req.user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, cookieOptions);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { optionalAuth, ensureUser };