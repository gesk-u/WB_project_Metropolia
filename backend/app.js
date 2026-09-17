require('dotenv').config()

const connectDB = require('./config/db')
const express = require('express')

const searchRouter = require('/routes/searchRoutes.js')
const authRouter = require('./routes/authRoutes.js')

const app = express()

connectDB()

app.use(express.json())

app.use('/api/search', searchRouter)
app.use('/api/auth', authRouter)

app.use((req, res) => {
  console.log('no match:', req.method, req.originalUrl);
  res.status(404).json({ error: 'unknown endpoint' });
});

const port = 4000
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`)
});