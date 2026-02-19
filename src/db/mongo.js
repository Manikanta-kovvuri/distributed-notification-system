const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/notifications")
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

const notificationSchema = new mongoose.Schema({
  requestId: { type: String, unique: true },
  to: String,
  message: String,
  channel: String,
  status: { type: String, default: "pending" },
  retryCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notification };

