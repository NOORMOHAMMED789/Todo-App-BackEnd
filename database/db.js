const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dotenv = require("dotenv").config();
const url = process.env.DATABASE_URL || "http://localhost:27017/Todoapp";

const connection = async () => {
  try {
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const type = url === process.env.DATABASE_URL ? "remote" : "local";
    console.log(`connected to ${type} successfully`);
  } catch (err) {
    console.log("Error in connecting to the database", err.message);
  }
};

module.exports = connection;
