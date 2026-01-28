const express = require("express");
require("./db/mongo");

const app = express();
app.use(express.json());

const routes = require("./api/routes");
app.use("/api", routes);

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});
