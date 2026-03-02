const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "notification-system",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "notification-workers" });

module.exports = { kafka, producer, consumer };