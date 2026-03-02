const express = require("express");
const connectDB = require("../config/db");
const Notification = require("../models/notification.model");
const { consumer, producer } = require("../config/kafka");

const {
  sentCounter,
  failedCounter,
  retryCounter,
  queueCounter,
  client,
} = require("../metrics/metrics");

/* ==============================
   METRICS SERVER (WORKER)
============================== */
const app = express();

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.send(await client.register.metrics());
});

app.listen(4000, () => {
  console.log("📊 Worker metrics running on port 4000");
});

/* ==============================
   WORKER LOGIC
============================== */
async function startWorker() {
  await connectDB();

  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: "notifications" });
  await consumer.subscribe({ topic: "notifications-retry" });

  console.log("🚀 Worker listening...");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {

      const job = JSON.parse(message.value.toString());

      console.log("=================================");
      console.log("📦 Topic:", topic);
      console.log("📨 Job ID:", job.id);

      queueCounter.inc();

      const notif = await Notification.findById(job.id);

      if (!notif) {
        console.log("⚠️ Notification not found");
        queueCounter.dec();
        return;
      }

      try {
        console.log("⚙️ Processing notification...");

        // simulate random failure
        if (Math.random() < 0.3) throw new Error("Send failed");

        notif.status = "sent";
        await notif.save();

        sentCounter.inc();

        console.log("✅ Sent successfully");

      } catch (err) {

        notif.retryCount++;
        console.log("🔁 Retry count:", notif.retryCount);

        if (notif.retryCount >= 3) {

          notif.status = "dlq";
          await notif.save();

          failedCounter.inc();

          await producer.send({
            topic: "notifications-dlq",
            messages: [{ value: JSON.stringify({ id: notif._id }) }],
          });

          console.log("🗑️ Sent to DLQ");

        } else {

          notif.status = "pending";
          await notif.save();

          retryCounter.inc();

          await producer.send({
            topic: "notifications-retry",
            messages: [{ value: JSON.stringify({ id: notif._id }) }],
          });

          console.log("🔁 Sent to retry queue");
        }
      }

      queueCounter.dec();
      console.log("=================================");
    },
  });
}

startWorker();