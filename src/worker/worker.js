const { Notification } = require("../db/mongo");

async function startWorker() {
  console.log("Worker started...");

  setInterval(async () => {
    const job = await Notification.findOneAndUpdate(
      { status: "pending" },
      { status: "processing" }
    );

    if (!job) return;

    try {
      console.log("Sending:", job.message);

      if (Math.random() < 0.3) throw new Error("Failed");

      job.status = "sent";
      await job.save();
      console.log("Sent!");
    } catch (err) {
      job.retryCount++;
      if (job.retryCount >= 3) {
        job.status = "dlq";
      } else {
        job.status = "pending";
      }
      await job.save();
      console.log("Retrying...");
    }
  }, 3000);
}

startWorker();
