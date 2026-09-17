// middleware/auth.js

const JWT = require('jsonwebtoken')

const requireAuth = (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'missing or mistyped token'})
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (error) {
        return res.status(401).json({ error: 'invalid or expired token' })
    }
}

module.exports = requireAuth