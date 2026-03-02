const express = require("express");
const connectDB = require("./config/db");
const routes = require("./api/notification.routes");
const { client } = require("./metrics/metrics");

const app = express();
app.use(express.json());

connectDB();

app.use("/api", routes);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.send(await client.register.metrics());
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});
