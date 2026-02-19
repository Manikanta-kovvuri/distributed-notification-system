const { Notification } = require("../db/mongo");
const { sentCounter, failedCounter } = require("../metrics");

async function startWorker() {
  console.log("🚀 Worker started...");

  setInterval(async () => {
    // pick one pending job
    const job = await Notification.findOneAndUpdate(
      { status: "pending" },
      { status: "processing" },
      { new: true }
    );

    if (!job) return;

    console.log("📦 Processing job:", job._id);

    try {
      console.log("📤 Sending:", job.message);

      // simulate random failure (30%)
      if (Math.random() < 0.3) throw new Error("Send failed");

      // SUCCESS
      job.status = "sent";
      await job.save();

      sentCounter.inc(); // DAY 6 metrics

      console.log("✅ Sent successfully:", job._id);

    } catch (err) {
      console.log("❌ Error:", err.message);

      job.retryCount++;

      if (job.retryCount >= 3) {
        job.status = "dlq";

        failedCounter.inc(); // DAY 6 metrics

        console.log("🗑️ Moved to DLQ:", job._id);
      } else {
        job.status = "pending";
        console.log("🔁 Retrying... attempt:", job.retryCount);
      }

      await job.save();
    }
  }, 3000);
}

startWorker();
