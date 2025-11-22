import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

// storage
const idemStore = new Map();       // Idempotency-Key → result
const rate = new Map();            // ip → {count, ts}
const WINDOW_MS = 10_000;
const MAX_REQ = 8;
const now = () => Date.now();

// X-Request-Id middleware
app.use((req, res, next) => {
  const rid = req.get("X-Request-Id") || randomUUID();
  req.rid = rid;
  res.setHeader("X-Request-Id", rid);
  next();
});

// simple rate-limit + Retry-After
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "local";

  const b = rate.get(ip) ?? { count: 0, ts: now() };
  const within = now() - b.ts < WINDOW_MS;

  const state = within ? { count: b.count + 1, ts: b.ts } : { count: 1, ts: now() };
  rate.set(ip, state);

  if (state.count > MAX_REQ) {
    res.setHeader("Retry-After", "2");
    return res.status(429).json({
      error: "too_many_requests",
      requestId: req.rid,
      code: null,
      details: null
    });
  }

  next();
});

// fail injection delay / random errors
app.use(async (req, res, next) => {
  const r = Math.random();

  if (r < 0.15) {
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
  }

  if (r > 0.8) {
    const err = Math.random() < 0.5 ? "unavailable" : "unexpected";
    const code = err === "unavailable" ? 503 : 500;
    return res.status(code).json({ error: err, requestId: req.rid });
  }

  next();
});

// idempotent POST /orders
app.post("/orders", (req, res) => {
  const key = req.get("Idempotency-Key");

  if (!key) return res.status(400).json({
    error: "idempotency_key_required",
    code: null,
    details: null,
    requestId: req.rid
  });

  if (idemStore.has(key)) {
    return res.status(201).json({ ...idemStore.get(key), requestId: req.rid });
  }

  const order = {
    id: "ord_" + randomUUID().slice(0, 8),
    title: req.body?.title ?? "Untitled"
  };

  idemStore.set(key, order);
  return res.status(201).json({ ...order, requestId: req.rid });
});

// health with timeout limit
app.get("/health", async (req, res) => {
  const controller = new AbortController();

  const timer = setTimeout(() => controller.abort(), 1000);

  try {
    await new Promise(r => setTimeout(r, 200));   
    clearTimeout(timer);
    return res.json({ status: "ok" });
  } catch {
    return res.status(503).json({
      error: "timeout",
      requestId: req.rid
    });
  }
});

app.listen(8081, () => console.log("Server running :8081"));
