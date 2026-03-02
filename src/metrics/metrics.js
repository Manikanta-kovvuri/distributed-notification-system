const client = require("prom-client");

const sentCounter = new client.Counter({
  name: "notifications_sent_total",
  help: "Total sent notifications",
});

const failedCounter = new client.Counter({
  name: "notifications_failed_total",
  help: "Total failed notifications",
});

const retryCounter = new client.Counter({
  name: "notifications_retry_total",
  help: "Total retries",
});

const queueCounter = new client.Gauge({
  name: "notifications_processing",
  help: "Currently processing jobs",
});

module.exports = {
  sentCounter,
  failedCounter,
  retryCounter,
  queueCounter,
  client,
};