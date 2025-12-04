const express = require("express");
const router = express.Router();

let playlists = [
  { id: 1, name: "Favorites", tracks: [] }
];

router.get("/", (req, res) => {
  res.json(playlists);
});

router.post("/", (req, res) => {
  const { name } = req.body;
  const playlist = { id: Date.now(), name, tracks: [] };
  playlists.push(playlist);
  res.status(201).json(playlist);
});

router.post("/:id/add", (req, res) => {
  const { trackId } = req.body;
  const playlist = playlists.find(p => p.id == req.params.id);
  if (!playlist) return res.status(404).json({ error: "not_found" });

  playlist.tracks.push(trackId);
  res.json(playlist);
});

module.exports = router;
