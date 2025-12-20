// gateway-service/server.js
const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
const PORT = 8080;

// Middleware для ТРАСУВАННЯ (Lab 5)
app.use((req, res, next) => {
    // 1. Генеруємо унікальний ID, якщо клієнт його не надіслав
    const requestId = req.header('X-Request-Id') || Math.random().toString(36).substring(2, 9);
    
    // 2. Встановлюємо його у відповідь (для клієнта)
    res.set('X-Request-Id', requestId);
    
    // 3. Передаємо його далі до внутрішніх сервісів
    req.headers['X-Request-Id'] = requestId; 
    
    console.log(`[Request ID: ${requestId}] Routing request: ${req.method} ${req.path}`);
    next();
});

// --- ЛОГІКА ПРОКСІЮВАННЯ ---
// 1. Проксіювання запитів ТРЕКІВ
// URL у Docker-мережі: http://catalog-service:3000
app.use('/tracks', proxy('http://catalog-service:3000'));
app.use('/upload', proxy('http://catalog-service:3000')); // Для вашого upload

// 2. Проксіювання запитів ПЛЕЙЛИСТІВ
// URL у Docker-мережі: http://playlist-catalog-service:3001
app.use('/playlists', proxy('http://playlist-catalog-service:3001'));


app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});