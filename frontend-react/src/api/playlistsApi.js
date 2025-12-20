import { API_URL } from "./config";

// GET playlists
export async function getPlaylists() {
  const res = await fetch(`${API_URL}/playlists`);
  if (!res.ok) throw new Error("Failed to load playlists");
  return res.json();
}

// CREATE playlist
export async function createPlaylist(name) {
  const res = await fetch(`${API_URL}/playlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });

  if (!res.ok) throw new Error("Failed to create playlist");
  return res.json();
}

// DELETE playlist
export async function deletePlaylist(id) {
  await fetch(`${API_URL}/playlists/${id}`, { method: "DELETE" });
}
