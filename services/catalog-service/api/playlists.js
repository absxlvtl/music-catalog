const express = require("express");
const router = express.Router();
const db = require("../infra/db");
const cache = require("../shared/cache");

// -----------------------------
// GET /playlists
// -----------------------------
router.get("/", (req, res) => {
  db.all("SELECT * FROM playlists", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "db_error" });

    res.json(rows);
  });
});

// -----------------------------
// GET /playlists/:id
// -----------------------------
router.get("/:id", (req, res) => {
  db.get("SELECT * FROM playlists WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ error: "not_found" });

    res.json(row);
  });
});

// -----------------------------
// POST /playlists
// -----------------------------
router.post("/", (req, res) => {
  const { name } = req.body;

  db.run("INSERT INTO playlists (name) VALUES (?)", [name], function () {
    const playlist = { id: this.lastID, name };
    res.status(201).json(playlist);
  });
});

// -----------------------------
// DELETE /playlists/:id
// -----------------------------
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM playlists WHERE id = ?", [req.params.id], function () {
    if (this.changes === 0)
      return res.status(404).json({ error: "not_found" });

    res.status(204).end();
  });
});

module.exports = router;
