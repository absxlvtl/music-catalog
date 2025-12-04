const express = require("express");
const router = express.Router();

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
    res.setHeader("Cache-Control", "public, max-age=10, stale-while-revalidate=20");
    return res.json(cached.data);
  }

  db.all("SELECT * FROM tracks", [], (err, rows) => {
    const etag = cache.makeETag(rows);

    cache.set("tracks", {
      etag,
      data: rows
    });

    res.setHeader("ETag", etag);
    res.setHeader("Cache-Control", "public, max-age=10, stale-while-revalidate=20");
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
  const { title, artist } = req.body;

  db.run(
    "INSERT INTO tracks (title, artist) VALUES (?, ?)",
    [title, artist],
    function () {
      const track = {
        id: this.lastID,
        title,
        artist
      };

      writeEvent({
        type: "track_created",
        track
      });

      recordTrackCreated();
      cache.invalidate("tracks");

      res.status(201).json(track);
    }
  );
});

// -----------------------------
// PUT /tracks/:id
// -----------------------------
router.put("/tracks/:id", (req, res) => {
  const { title, artist } = req.body;

  db.run(
    "UPDATE tracks SET title = ?, artist = ? WHERE id = ?",
    [title, artist, req.params.id],
    function () {
      if (this.changes === 0)
        return res.status(404).json({ error: "not_found" });

      cache.invalidate("tracks");

      res.json({ id: req.params.id, title, artist });
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

module.exports = router;
