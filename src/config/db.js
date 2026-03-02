const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect("mongodb://mongo:27017/notifications");
  console.log("🟢 Mongo Connected");
}

module.exports = connectDB;
