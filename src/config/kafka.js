const { Kafka } = require("kafkajs");

const isRailway = !!process.env.RAILWAY_ENVIRONMENT;

let kafka = null;
let producer = null;
let consumer = null;

if (!isRailway) {
  kafka = new Kafka({
    clientId: "notification-system",
    brokers: ["kafka:9092"],
  });

  producer = kafka.producer();
  consumer = kafka.consumer({ groupId: "notification-workers" });
}

module.exports = { kafka, producer, consumer };