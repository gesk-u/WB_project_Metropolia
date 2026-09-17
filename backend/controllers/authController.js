// controllers/authController.js

const bcrypt = require('bcrypt')
const User = require('../models/user')

const minPasswordLength = 8
const SaltRounds = 10

const register = async (req, res) => {
    try {

        const { name, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'both username and password are required'})
        }

        if (password.length < minPasswordLength) {
            return res.status(400).json({ error: 'password too short, minimum length is ' + minPasswordLength})
        }

        const existingUser = await User.findOne(name)

        if (existingUser) {
            return res.status(409).json({ error: 'username already taken' })
        }

        const passwordHash = await bcrypt.hash(password, SaltRounds)
        const user = await User.create({ name, passwordHash})

        res.status(201).json({ id: user.id, name: user.name })

    } catch (error) {
        logError(error)
    }
}

const JWT = require('jsonwebtoken')

const login = async (req, res) => {
    try {

        const { name, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'both username and password are required'})
        }

        const user = await User.findOne(name)
        const passwordMatch = await bcrypt.compare(password, user.passwordHash)

        if (!user || !passwordMatch) {
            return res.status(401).json({ error: 'invalid username or password' })
        }

        const token = JWT.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )

        res.status(200).json({ token, user: { id: user.id, name: user.name }})

    } catch (error) {
        logError(error)
    }
}

const logError = (error) => {
    console.error(error.message)
    res.status(500).json({ error: 'something went wrong' })
}

module.exports = { register, login }