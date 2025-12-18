const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const db = require("../infra/db");
const { writeEvent } = require("../outbox");
const cache = require("../shared/cache");
const { recordTrackCreated } = require("../metrics/metrics");

// -----------------------------
// GET /tracks (з кешем + ETag)
// -----------------------------
router.get("/tracks", (req, res) => {
  const cached = cache.get("tracks");

  if (cached) {
    if (req.headers["if-none-match"] === cached.etag) {
      return res.status(304).end();
    }

    res.setHeader("ETag", cached.etag);
    res.setHeader(
      "Cache-Control",
      "public, max-age=10, stale-while-revalidate=20"
    );
    return res.json(cached.data);
  }

  db.all("SELECT * FROM tracks", [], (err, rows) => {
    const etag = cache.makeETag(rows);

    cache.set("tracks", {
      etag,
      data: rows,
    });

    res.setHeader("ETag", etag);
    res.setHeader(
      "Cache-Control",
      "public, max-age=10, stale-while-revalidate=20"
    );
    res.json(rows);
  });
});

// -----------------------------
// GET /tracks/:id
// -----------------------------
router.get("/tracks/:id", (req, res) => {
  db.get("SELECT * FROM tracks WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ error: "not_found" });
    res.json(row);
  });
});

// -----------------------------
// POST /tracks
// -----------------------------
router.post("/tracks", (req, res) => {
  const { title, artist, filename } = req.body;
  const key = req.header("Idempotency-Key");
  if (!key) {
    return res.status(400).json({ error: "Idempotency-Key header is required" });
  }

  db.run(
    "INSERT INTO tracks (title, artist, filename) VALUES (?, ?, ?)",
    [title, artist, filename],
    function () {
      const track = {
        id: this.lastID,
        title,
        artist,
        filename,
      };

      writeEvent({
        type: "track_created",
        track,
      });

      recordTrackCreated();
      cache.invalidate("tracks");

      res.status(201).json(track);
    }
  );
});

// -----------------------------
// DELETE /tracks/:id
// -----------------------------
router.delete("/tracks/:id", (req, res) => {
  db.run("DELETE FROM tracks WHERE id = ?", [req.params.id], function () {
    if (this.changes === 0)
      return res.status(404).json({ error: "not_found" });

    cache.invalidate("tracks");

    res.status(204).end();
  });
});

// -----------------------------
// UPLOAD MP3
// -----------------------------

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File not uploaded" });
  }

  res.json({
    success: true,
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
  });
});

// -----------------------------
// PATCH /tracks/:id (ОНОВЛЕННЯ)
// -----------------------------
router.patch("/tracks/:id", (req, res) => {
  const { title, artist } = req.body;
  const { id } = req.params;

  // Перевірка наявності даних для оновлення
  if (!title && !artist) {
    return res.status(400).json({ error: "No fields to update provided" });
  }

  // Створюємо динамічний SQL-запит
  const updates = [];
  const params = [];

  if (title) {
    updates.push("title = ?");
    params.push(title);
  }
  if (artist) {
    updates.push("artist = ?");
    params.push(artist);
  }

  // Додаємо ID як останній параметр WHERE
  params.push(id);

  const sql = `UPDATE tracks SET ${updates.join(", ")} WHERE id = ?`;

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "internal_error" });
    }
    
    if (this.changes === 0) {
      // Якщо жоден рядок не оновлено (ID не знайдено)
      return res.status(404).json({ error: "not_found" });
    }

    cache.invalidate("tracks");
    res.status(200).json({ id, title, artist }); // Повертаємо оновлені дані
  });
});

module.exports = router;
