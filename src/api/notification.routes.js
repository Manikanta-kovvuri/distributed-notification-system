const express = require("express");
const router = express.Router();
const Notification = require("../models/notification.model");
const { producer } = require("../config/kafka");

/* connect producer only once */
let kafkaConnected = false;

async function ensureKafka() {
  if (!producer) return; // 🚀 Skip Kafka in Railway

  if (!kafkaConnected) {
    await producer.connect();
    kafkaConnected = true;
    console.log("🟢 Kafka Producer Connected");
  }
}

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

    // 🚀 Only send to Kafka if producer exists
    if (producer) {
      await ensureKafka();

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

    res.json({ success: true, id: notification._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ==============================
   DEBUG ROUTE (VIEW DB DATA)
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