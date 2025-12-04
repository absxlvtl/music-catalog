// WEB2/services/catalog-service/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const logger = require("./middlewares/logger");      // якщо є
const metrics = require("./middlewares/metrics");    // якщо є
const routes = require("./api/routes");              // tracks routes
const playlistsRoutes = require("./api/playlists"); // якщо є

const PORT = process.env.PORT ? Number(process.env.PORT) : 8081;
const APP_MODE = process.env.APP_MODE || "dev";
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "../../catalog.db");
const SECRET_TOKEN = process.env.SECRET_TOKEN || null; // приклад використання secret

// ти можеш пробросити DB_PATH далі в модулі infra/db.js (нижче поясню)
process.env.DB_PATH = DB_PATH;

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(metrics);

// health
app.get("/health", (_, res) => res.json({ status: "ok", mode: APP_MODE }));

// metrics
const { getMetrics } = require("./metrics/metrics");
app.get("/metrics", (_, res) => res.json(getMetrics()));

// routes
app.use("/playlists", playlistsRoutes);
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Music catalog service running on http://localhost:${PORT} (mode=${APP_MODE})`);
});
