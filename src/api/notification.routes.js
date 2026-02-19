const express = require("express");
const router = express.Router();
const Notification = require("../models/notification.model");

router.post("/send", async (req, res) => {
  const { requestId, to, message, channel } = req.body;

  const existing = await Notification.findOne({ requestId });

  if (existing) {
    return res.json({
      success: true,
      message: "Duplicate request ignored"
    });
  }

  const notification = await Notification.create({
    requestId,
    to,
    message,
    channel
  });

  res.json({ success: true, id: notification._id });
});

module.exports = router;
