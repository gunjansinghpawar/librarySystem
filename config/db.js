const mongoose = require('mongoose');
require('dotenv').config(); // Ensure this is called to load environment variables

const db = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(db); // No need to pass options
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
