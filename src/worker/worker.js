const Notification = require("../models/notification.model");
const { sentCounter, failedCounter } = require("../metrics/metrics");

async function startWorker() {
  console.log("🚀 Worker started...");

  setInterval(async () => {
    const job = await Notification.findOneAndUpdate(
      { status: "pending" },
      { status: "processing" },
      { new: true }
    );

    if (!job) return;

    console.log("📦 Processing:", job._id);

    try {
      if (Math.random() < 0.3) throw new Error("Failed");

      job.status = "sent";
      await job.save();

      sentCounter.inc();
      console.log("✅ Sent");

    } catch {
      job.retryCount++;

      if (job.retryCount >= 3) {
        job.status = "dlq";
        failedCounter.inc();
        console.log("🗑️ DLQ");
      } else {
        job.status = "pending";
        console.log("🔁 Retry");
      }

      await job.save();
    }
  }, 3000);
}

startWorker();
