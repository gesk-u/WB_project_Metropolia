// routes/authRoutes.js

const express = require('express')
const {register, login } = require('../controllers/authController')

const router = express.Router()
const requireAuth = require('../middleware/auth')

router.get('/me', requireAuth, (req, res) => {
    res.json({ userId: req.userId })
})

router.post('/register', register)
router.post('/login', login)

module.exports = router