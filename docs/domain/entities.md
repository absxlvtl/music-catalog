# Entities 

## Track


**Attributes:**
- `id`: унікальний ідентифікатор
- `title`: назва треку
- `artistId`: виконавець
- `albumId`: альбом
- `genre`: жанр

---

## Artist

**Attributes:**
- `id`: унікальний ідентифікатор
- `name`: ім’я виконавця

---

## Album

**Attributes:**
- `id`: унікальний ідентифікатор
- `title`: назва альбому
- `artistId`: виконавець
- `releaseYear`: рік випуску

---

## Playlist

**Attributes:**
- `id`: унікальний ідентифікатор
- `name`: назва плейлиста
- `tracks`: масив ідентифікаторів треків
