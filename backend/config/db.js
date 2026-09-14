const mongoose = require("mongoose");

const connectDB = async () => {
    try {
    const conn = await mongoose.connect("mongodb://localhost:27017/sanahaku")
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if ((error.name) === 'ValidationError') {
            resizeBy.status(400).json({ message: "Invalid input", error: error.message })
        } else {
            res.status(500).json({message: "Failed to create car", error: error.message})
        }
    }
}

module.exports = connectDB;