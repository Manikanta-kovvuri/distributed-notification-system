const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  requestId: { type: String, unique: true },
  to: String,
  message: String,
  channel: String,
  status: { type: String, default: "pending" },
  retryCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
