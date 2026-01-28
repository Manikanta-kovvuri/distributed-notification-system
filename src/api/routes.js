const express = require("express");
const router = express.Router();
const { Notification } = require("../db/mongo");

router.post("/send", async (req, res) => {
  const { to, message, channel } = req.body;

  const notification = await Notification.create({
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
