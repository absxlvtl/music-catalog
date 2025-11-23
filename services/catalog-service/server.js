const express = require("express");
const cors = require("cors");

const logger = require("./middlewares/logger");
const metricsMiddleware = require("./middlewares/metrics");
const routes = require("./api/routes");
const { getMetrics } = require("./metrics/metrics");

const app = express();

app.use(cors());
app.use(express.json());

app.use(logger);
app.use(metricsMiddleware);

// /health
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// /metrics
app.get("/metrics", (_, res) => {
  res.json(getMetrics());
});

// маршрути
app.use("/", routes);

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Music catalog service running at http://localhost:${PORT}`);
});
