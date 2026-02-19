const express = require("express");
const router = express.Router();
const { Notification } = require("../db/mongo");
const rateLimitMap = {};
const LIMIT = 5; // 5 requests
const WINDOW = 60 * 1000; // 1 minute


router.post("/send", async (req, res) => {
  const ip = req.ip;
  const now = Date.now();

  if (!rateLimitMap[ip]) {
    rateLimitMap[ip] = [];
  }

  // remove old timestamps
  rateLimitMap[ip] = rateLimitMap[ip].filter(
    time => now - time < WINDOW
  );

  if (rateLimitMap[ip].length >= LIMIT) {
    return res.status(429).json({ error: "Too many requests" });
  }

  rateLimitMap[ip].push(now);

  const { requestId, to, message, channel } = req.body;

  const existing = await Notification.findOne({ requestId });
  if (existing) {
    return res.json({
      success: true,
      id: existing._id,
      status: existing.status,
      message: "Duplicate request ignored"
    });
  }

  const notification = await Notification.create({
    requestId,
    to,
    message,
    channel
  });

  res.json({
    success: true,
    id: notification._id,
    status: "queued"
  });
});


module.exports = router;
