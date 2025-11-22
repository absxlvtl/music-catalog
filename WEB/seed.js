// seed.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./music.db');

db.serialize(() => {
  // переконаємось, що таблиця існує
  db.run(`
    CREATE TABLE IF NOT EXISTS tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      artist TEXT
    )
  `);

  // Додаємо тестові рядки
  const stmt = db.prepare("INSERT INTO tracks (title, artist) VALUES (?, ?)");
  stmt.run("Shape of You", "Ed Sheeran");
  stmt.run("Blinding Lights", "The Weeknd");
  stmt.run("Levitating", "Dua Lipa");
  stmt.finalize();

  // Перевіримо всі записи і виведемо в консоль
  db.all("SELECT * FROM tracks", [], (err, rows) => {
    if (err) {
      console.error("Error reading tracks:", err);
    } else {
      console.log("Tracks in DB:");
      console.table(rows);
    }
    db.close();
  });
});
