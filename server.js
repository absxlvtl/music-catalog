const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Головна сторінка (щоб не було "Cannot GET /")
app.get('/', (req, res) => {
  res.send('🎵 Сервер музичного каталогу працює успішно!');
});

// Підключення до бази даних
const db = new sqlite3.Database('./music.db', (err) => {
  if (err) {
    console.error('❌ Помилка підключення до бази:', err.message);
  } else {
    console.log('✅ Підключено до бази даних SQLite.');
  }
});

// Створюємо таблицю треків, якщо її ще немає
db.run(`
  CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    artist TEXT
  )
`);

// Endpoint: отримати всі треки
app.get('/tracks', (req, res) => {
  db.all("SELECT * FROM tracks", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint: додати трек
app.post('/tracks', (req, res) => {
  const { title, artist } = req.body;
  db.run("INSERT INTO tracks (title, artist) VALUES (?, ?)", [title, artist], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, title, artist });
  });
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => console.log(`🎶 Сервер запущено: http://localhost:${PORT}`));
