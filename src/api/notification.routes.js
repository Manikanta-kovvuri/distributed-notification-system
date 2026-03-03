const express = require("express");
const router = express.Router();
const Notification = require("../models/notification.model");
const { producer } = require("../config/kafka");

/* ==============================
   SEND NOTIFICATION
============================== */
router.post("/send", async (req, res) => {
  try {
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

    // ONLY send to Kafka if producer exists (local Docker only)
    if (producer) {
      await producer.connect();
      await producer.send({
        topic: "notifications",
        messages: [
          {
            value: JSON.stringify({
              id: notification._id.toString(),
              requestId: notification.requestId
            })
          }
        ]
      });
    }

    return res.json({ success: true, id: notification._id });

  } catch (err) {
    console.error("Route error:", err);
    return res.status(500).json({ success: false });
  }
});

/* ==============================
   DEBUG ROUTE
============================== */
router.get("/debug", async (req, res) => {
  try {
    const data = await Notification.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;