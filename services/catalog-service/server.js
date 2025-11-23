const express = require("express");
const cors = require("cors");

const logger = require("./middlewares/logger");
const metrics = require("./middlewares/metrics");
const routes = require("./api/routes");
const { getMetrics } = require("./metrics/metrics");

const app = express();

app.use(cors());
app.use(express.json());

// middleware
app.use(logger);
app.use(metrics);

// health
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// metrics endpoint
app.get("/metrics", (_, res) => {
  res.json(getMetrics());
});

// main routes
app.use("/", routes);

const PORT = 8081;
app.listen(PORT, () => console.log(`Music catalog service running on http://localhost:${PORT}`));
