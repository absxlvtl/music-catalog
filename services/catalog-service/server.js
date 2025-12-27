const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'] || 'req-' + Math.random().toString(36).substr(2, 9);
    req.id = requestId;
    res.setHeader('X-Request-Id', requestId);
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url} - TraceID: ${req.id}`);
    next();
});

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, "uploads/"),
    filename: (_, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

const db = new sqlite3.Database("catalog.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tracks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            artist TEXT NOT NULL,
            filePath TEXT
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS playlists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        )
    `);
});

app.post("/tracks", upload.single("file"), (req, res) => {
    const { title, artist } = req.body;
    const filePath = req.file ? req.file.filename : null;
    db.run(
        "INSERT INTO tracks (title, artist, filePath) VALUES (?, ?, ?)",
        [title, artist, filePath],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, title, artist, filePath });
        }
    );
});

app.get("/tracks", (req, res) => {
    db.all("SELECT * FROM tracks", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete("/tracks/:id", (req, res) => {
    db.run("DELETE FROM tracks WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Track not found" });
        res.json({ message: "Track deleted" });
    });
});

app.get("/playlists", (req, res) => {
    db.all("SELECT * FROM playlists", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post("/playlists", (req, res) => {
    const { name } = req.body;
    db.run("INSERT INTO playlists (name) VALUES (?)", [name], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name });
    });
});

app.delete("/playlists/:id", (req, res) => {
    db.run("DELETE FROM playlists WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted" });
    });
});

app.use("/uploads", express.static("uploads"));

app.get("/health-check", (_, res) => res.json({ status: "OK", timestamp: new Date().toISOString() }));

app.get('/test-error', (req, res, next) => {
    const err = new Error("Database connection timeout");
    err.status = 503;
    next(err);
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
        status: 'error',
        code: status,
        message: err.message || 'Internal Server Error',
        requestId: req.id,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});