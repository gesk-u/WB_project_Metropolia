async function optionalAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return next();                          // no token → anonymous, that's fine
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByIdAndUpdate(userId, { lastActiveAt: new Date() }, { new: true });
  } catch {
    res.clearCookie('token');                         // expired or tampered → anonymous
  }
  next();
}