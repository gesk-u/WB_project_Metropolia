// controllers/authController.js

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const minPasswordLength = 8
const saltRounds = 10

const logError = (error, res) => {
    console.error(error.message)
    res.status(500).json({ error: 'something went wrong' })
}

const register = async (req, res) => {
    try {
        const { name, password } = req.body

        if (!name || !password) {
            return res.status(400).json({ error: 'both username and password are required' })
        }

        if (password.length < minPasswordLength) {
            return res.status(400).json({ error: 'password too short, minimum length is ' + minPasswordLength })
        }

        const existingUser = await User.findOne({ name })

        if (existingUser) {
            return res.status(409).json({ error: 'username already taken' })
        }

        const passwordHash = await bcrypt.hash(password, saltRounds)
        const user = await User.create({ name, passwordHash })

        res.status(201).json({ id: user.id, name: user.name })

    } catch (error) {
        logError(error, res)
    }
}

const login = async (req, res) => {
    try {
        const { name, password } = req.body

        if (!name || !password) {
            return res.status(400).json({ error: 'both username and password are required' })
        }

        const user = await User.findOne({ name })

        if (!user) {
            return res.status(401).json({ error: 'invalid username or password' })
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash)

        if (!passwordMatch) {
            return res.status(401).json({ error: 'invalid username or password' })
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )

        res.status(200).json({ token, user: { id: user.id, name: user.name } })

    } catch (error) {
        logError(error, res)
    }
}

module.exports = { register, login }