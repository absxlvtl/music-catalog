# ADR 0004 — Data Ownership (Music Catalog)

## Контекст
У системі працюють два мікросервіси:
- catalog-service — відповідає за треки, альбоми, артистів.
- playlist-service — працює з плейлистами та посиланнями на треки.

## Рішення
1. **catalog-service є власником даних Track/Album/Artist**
   - таблиці tracks, albums, artists належать тільки каталогу
   - playlist-service не має права робити JOIN до них

2. **playlist-service є власником плейлистів**
   - таблиці playlists, playlist_tracks належать цьому сервісу

3. **Крос-контекстні JOIN заборонені**
   - playlist-service зберігає тільки trackId
   - деталі треку отримує через HTTP

4. **Eventual consistency**
   - catalog-service формує події (`track_created`)
   - playlist-service може підписуватись (через outbox pattern)

## Наслідки
- менше coupling
- можливість розгорнути сервіси окремо
- складніша синхронізація, але масштабованість краща
