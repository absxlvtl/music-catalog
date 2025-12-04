import { API_URL } from "./config";

export async function getPlaylists() {
  const res = await fetch(`${API_URL}/playlists`);
  if (!res.ok) throw new Error("Failed to load playlists");
  return res.json();
}

export async function getPlaylist(id) {
  const res = await fetch(`${API_URL}/playlists/${id}`);
  if (!res.ok) throw new Error("Failed to load playlist");
  return res.json();
}

export async function createPlaylist(name) {
  const res = await fetch(`${API_URL}/playlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });

  if (!res.ok) throw new Error("Failed to create playlist");
  return res.json();
}

export async function deletePlaylist(id) {
  const res = await fetch(`${API_URL}/playlists/${id}`, { method: "DELETE" });

  if (!res.ok) throw new Error("Failed to delete playlist");
  return true;
}
