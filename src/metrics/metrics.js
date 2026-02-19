const client = require("prom-client");

const sentCounter = new client.Counter({
  name: "notifications_sent_total",
  help: "Total sent notifications"
});

const failedCounter = new client.Counter({
  name: "notifications_failed_total",
  help: "Total failed notifications"
});

module.exports = { sentCounter, failedCounter, client };
