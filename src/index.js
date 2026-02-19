const express = require("express");
require("./db/mongo");

const app = express();
app.use(express.json());

const routes = require("./api/routes");
app.use("/api", routes);

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});



const { client } = require("./metrics");

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.send(await client.register.metrics());
});
