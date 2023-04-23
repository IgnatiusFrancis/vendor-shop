const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function DBConnection() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Database connected successfully!!!");
  } catch (error) {
    console.log("Error:", error.message);
  }
}

DBConnection();
