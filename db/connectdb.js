const mongoose = require('mongoose');
require('dotenv').config(); // make sure .env is loaded here

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // use env variable
    console.log("MongoDB Connected Successfully...");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1); // stop server if connection fails
  }
};

module.exports = connectDB;
