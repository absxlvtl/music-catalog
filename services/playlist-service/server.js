const express = require("express");
const cors = require("cors");
const sqlite = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite.Database("./playlists.db");

db.run(`
  CREATE TABLE IF NOT EXISTS playlists (
    id TEXT PRIMARY KEY,
    name TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS playlist_tracks (
    playlistId TEXT,
    trackId TEXT
  )
`);

// health
app.get("/health", (_, res) => res.json({ status: "ok" }));

// create playlist
app.post("/playlists", (req, res) => {
  const id = "pl_" + Math.random().toString(36).slice(2, 8);
  const name = req.body.name || "Untitled";

  db.run(
    "INSERT INTO playlists (id, name) VALUES (?, ?)",
    [id, name],
    () => res.status(201).json({ id, name })
  );
});

// add track
app.post("/playlists/:id/tracks", (req, res) => {
  const { id } = req.params;
  const { trackId } = req.body;

  db.run(
    "INSERT INTO playlist_tracks (playlistId, trackId) VALUES (?, ?)",
    [id, trackId],
    () => res.status(201).json({ ok: true })
  );
});

// get playlist content
app.get("/playlists/:id", (req, res) => {
  const { id } = req.params;

  db.all(
    "SELECT trackId FROM playlist_tracks WHERE playlistId = ?",
    [id],
    (err, rows) => {
      res.json({ id, tracks: rows.map(r => r.trackId) });
    }
  );
});

const PORT = 8082;
app.listen(PORT, () => console.log("playlist-service on", PORT));
