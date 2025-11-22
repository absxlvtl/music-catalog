const express = require('express');
const router = express.Router();

// ---- MOCK DATA (тимчасово) ---- //
let items = [
  { id: 1, name: "Random Track", artist: "Unknown Artist" },
  { id: 2, name: "Test Song", artist: "Tester" }
];

// GET /items
router.get('/items', (req, res) => {
  res.json(items);
});

// GET /items/:id
router.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

// POST /items
router.post('/items', (req, res) => {
  const newItem = {
    id: Date.now(),
    name: req.body.name,
    artist: req.body.artist
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

module.exports = router;
