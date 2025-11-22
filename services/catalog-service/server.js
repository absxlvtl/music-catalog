import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

// === STORE ===
const idemStore = new Map();   // Idempotency-Key → response
const tracks = new Map();      // id → track object
let counter = 1;

// === RATE LIMIT DATA ===
const rate = new Map();
const WINDOW_MS = 10_000;
const MAX_REQ = 8;

// === REQUEST ID MIDDLEWARE ===
app.use((req, res, next) => {
  const rid = req.get("X-Request-Id") || randomUUID();
  req.rid = rid;
  res.setHeader("X-Request-Id", rid);
  next();
});

// === RATE LIMIT ===
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const info = rate.get(ip) ?? { count: 0, ts: Date.now() };
  const within = Date.now() - info.ts < WINDOW_MS;

  const updated = within
    ? { count: info.count + 1, ts: info.ts }
    : { count: 1, ts: Date.now() };

  rate.set(ip, updated);

  if (updated.count > MAX_REQ) {
    res.setHeader("Retry-After", "2");
    return res.status(429).json({
      error: "too_many_requests",
      requestId: req.rid
    });
  }

  next();
});

// === FAIL INJECTION (delays + errors) ===
app.use(async (_, res, next) => {
  const r = Math.random();

  if (r < 0.15) {
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
  }

  if (r > 0.8) {
    const err = Math.random() < 0.5 ? "unavailable" : "unexpected";
    const code = err === "unavailable" ? 503 : 500;
    return res.status(code).json({
      error: err,
      requestId: _
    });
  }

  next();
});

// === POST /tracks (idempotent) ===
app.post("/tracks", (req, res) => {
  const key = req.get("Idempotency-Key");

  if (!key) {
    return res.status(400).json({
      error: "idempotency_key_required",
      requestId: req.rid
    });
  }

  if (idemStore.has(key)) {
    return res.status(201).json({
      ...idemStore.get(key),
      requestId: req.rid
    });
  }

  const track = {
    id: "t-" + counter++,
    title: req.body?.title ?? "Untitled",
    artist: req.body?.artist ?? "Unknown"
  };

  tracks.set(track.id, track);
  idemStore.set(key, track);

  return res.status(201).json({ ...track, requestId: req.rid });
});

// === GET /tracks ===
app.get("/tracks", (_, res) => {
  res.json({
    items: [...tracks.values()],
    requestId: _.rid
  });
});

// === GET /tracks/:id ===
app.get("/tracks/:id", (req, res) => {
  const t = tracks.get(req.params.id);
  if (!t) {
    return res.status(404).json({
      error: "not_found",
      requestId: req.rid
    });
  }

  res.json({ ...t, requestId: req.rid });
});

// === PUT /tracks/:id ===
app.put("/tracks/:id", (req, res) => {
  const t = tracks.get(req.params.id);
  if (!t) {
    return res.status(404).json({
      error: "not_found",
      requestId: req.rid
    });
  }

  const updated = {
    ...t,
    title: req.body?.title ?? t.title,
    artist: req.body?.artist ?? t.artist
  };

  tracks.set(updated.id, updated);

  res.json({ ...updated, requestId: req.rid });
});

// === DELETE /tracks/:id ===
app.delete("/tracks/:id", (req, res) => {
  if (!tracks.has(req.params.id)) {
    return res.status(404).json({
      error: "not_found",
      requestId: req.rid
    });
  }

  tracks.delete(req.params.id);
  res.status(204).send();
});

// === HEALTH ===
app.get("/health", async (req, res) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1000);

  try {
    await new Promise(r => setTimeout(r, 200));
    clearTimeout(timer);
    res.json({ status: "ok" });
  } catch {
    res.status(503).json({ error: "timeout", requestId: req.rid });
  }
});

app.listen(8081, () => console.log("Music catalog service running on :8081"));
