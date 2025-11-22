import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

// --- In-memory storage (для лабораторної; замінити на DB пізніше) ---
const idemStore = new Map();       // Idempotency-Key -> result
const tracks = new Map();         // id -> track object
// simple auto increment fallback
let nextId = 1;

// rate limit store
const rate = new Map();            // ip -> {count, ts}
const WINDOW_MS = 10_000;
const MAX_REQ = 8;
const now = () => Date.now();

// --- Utility: unified error response ---
function errorFormat(err, req) {
  if (!err) return { error: "unknown", code: null, details: null, requestId: req?.rid ?? null };
  // expected err shape: { error: 'msg', code: 'CODE', details: [...] }
  return {
    error: err.error || (err.message ? "server_error" : String(err)),
    code: err.code || null,
    details: err.details || null,
    requestId: req?.rid ?? null
  };
}

// --- X-Request-Id middleware ---
app.use((req, res, next) => {
  const rid = req.get("X-Request-Id") || randomUUID();
  req.rid = rid;
  res.setHeader("X-Request-Id", rid);
  next();
});

// --- simple rate-limit + Retry-After header ---
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "local";
  const b = rate.get(ip) ?? { count: 0, ts: now() };
  const within = now() - b.ts < WINDOW_MS;
  const state = within ? { count: b.count + 1, ts: b.ts } : { count: 1, ts: now() };
  rate.set(ip, state);

  if (state.count > MAX_REQ) {
    res.setHeader("Retry-After", "2"); // seconds
    return res.status(429).json(errorFormat({ error: "too_many_requests", code: "RATE_LIMIT", details: null }, req));
  }
  next();
});

// --- fail injection: random delay and random 5xx to test retry/backoff ---
app.use(async (req, res, next) => {
  const r = Math.random();
  // 15% chance of slow response (simulate timeout)
  if (r < 0.15) {
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
  }
  // 20% chance of error (either 503 or 500)
  if (r > 0.8) {
    const err = Math.random() < 0.5 ? "unavailable" : "unexpected";
    const code = err === "unavailable" ? 503 : 500;
    return res.status(code).json(errorFormat({ error: err.toUpperCase(), code: null, details: null }, req));
  }
  next();
});

// --- Helpers ---
function makeTrackPayload(raw) {
  const nowIso = new Date().toISOString();
  return {
    id: raw.id,
    title: raw.title ?? "Untitled track",
    artist: raw.artist ?? "Unknown artist",
    album: raw.album ?? null,
    genre: raw.genre ?? null,
    createdAt: raw.createdAt ?? nowIso,
    updatedAt: raw.updatedAt ?? nowIso
  };
}

// --- ROUTES ---
// Create track (idempotent)
app.post("/tracks", (req, res) => {
  const key = req.get("Idempotency-Key");
  if (!key) {
    return res.status(400).json(errorFormat({ error: "idempotency_key_required", code: "IDEMPOTENCY_REQUIRED", details: [{ field: "Idempotency-Key", message: "Header required" }] }, req));
  }

  // if key already used -> return stored result
  if (idemStore.has(key)) {
    const previous = idemStore.get(key);
    return res.status(201).json({ ...previous, requestId: req.rid });
  }

  // create new track
  const id = `t-${nextId++}`;
  const raw = {
    id,
    title: req.body?.title,
    artist: req.body?.artist,
    album: req.body?.album,
    genre: req.body?.genre,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const track = makeTrackPayload(raw);
  tracks.set(id, track);
  // store in idempotency map the response body (without requestId)
  idemStore.set(key, track);

  return res.status(201).json({ ...track, requestId: req.rid });
});

// List tracks
app.get("/tracks", (req, res) => {
  const list = Array.from(tracks.values());
  res.status(200).json(list);
});

// Get track by id
app.get("/tracks/:id", (req, res) => {
  const id = req.params.id;
  const t = tracks.get(id);
  if (!t) return res.status(404).json(errorFormat({ error: "not_found", code: "TRACK_NOT_FOUND", details: null }, req));
  return res.json(t);
});

// Update track (replace/patch)
app.put("/tracks/:id", (req, res) => {
  const id = req.params.id;
  if (!tracks.has(id)) return res.status(404).json(errorFormat({ error: "not_found", code: "TRACK_NOT_FOUND", details: null }, req));

  const existing = tracks.get(id);
  const updated = {
    ...existing,
    title: req.body?.title ?? existing.title,
    artist: req.body?.artist ?? existing.artist,
    album: req.body?.album ?? existing.album,
    genre: req.body?.genre ?? existing.genre,
    updatedAt: new Date().toISOString()
  };
  tracks.set(id, updated);
  return res.status(200).json(updated);
});

// Delete track
app.delete("/tracks/:id", (req, res) => {
  const id = req.params.id;
  if (!tracks.has(id)) return res.status(404).json(errorFormat({ error: "not_found", code: "TRACK_NOT_FOUND", details: null }, req));
  tracks.delete(id);
  return res.status(204).send();
});

// Health with timeout (if operation takes >1s we return timeout)
app.get("/health", async (req, res) => {
  // simulate small work but abort if too slow
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1000);

  try {
    // simulate lightweight check (can be db ping later)
    await new Promise((r, reject) => {
      // early resolve to simulate ok; but keep signal for extensibility
      if (controller.signal.aborted) return reject(new Error("aborted"));
      setTimeout(r, 50);
      controller.signal.addEventListener("abort", () => reject(new Error("aborted")));
    });
    clearTimeout(timer);
    return res.json({ status: "ok" });
  } catch (e) {
    return res.status(503).json(errorFormat({ error: "timeout", code: "HEALTH_TIMEOUT", details: null }, req));
  }
});

// Generic 404
app.use((req, res) => {
  res.status(404).json(errorFormat({ error: "not_found", code: "ENDPOINT_NOT_FOUND", details: [{ path: req.path }] }, req));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json(errorFormat({ error: "internal_error", code: "INTERNAL", details: [{ message: err?.message }] }, req));
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Catalog service running on :${PORT}`));
