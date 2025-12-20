// src/api/tracksApi.js
import { API_URL } from "./config";

// GET all tracks
export async function getTracks() {
  const res = await fetch(`${API_URL}/tracks`);
  if (!res.ok) throw new Error("Failed to load tracks");
  return res.json();
}

// GET one track
export async function getTrack(id) {
  const res = await fetch(`${API_URL}/tracks/${id}`);
  if (!res.ok) throw new Error("Track not found");
  return res.json();
}

// CREATE track WITH FILE
export async function createTrack({ title, artist, file }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("artist", artist);
  if (file) formData.append("file", file);

  const res = await fetch(`${API_URL}/tracks`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) throw new Error("Failed to create track");
  return res.json();
}

// DELETE
export async function deleteTrack(id) {
  await fetch(`${API_URL}/tracks/${id}`, { method: "DELETE" });
}
