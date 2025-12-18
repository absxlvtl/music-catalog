const sqlite3 = require("sqlite3").verbose();
const path = require("path");


const dbFile = process.env.DB_PATH
  ? process.env.DB_PATH
  : path.join(__dirname, "../../catalog.db");

console.log("Using DB file:", dbFile);

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("DB open error", err);
  } else {
    console.log("DB connected:", dbFile);
  }
});

// --- створюємо таблиці ---
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);
});


module.exports = db;
