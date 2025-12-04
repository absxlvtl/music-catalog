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

// CREATE track
export async function createTrack(data) {
  const res = await fetch(`${API_URL}/tracks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Failed to create track");
  return res.json();
}

// UPDATE track
export async function updateTrack(id, data) {
  const res = await fetch(`${API_URL}/tracks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Failed to update track");
  return res.json();
}

// DELETE track
export async function deleteTrack(id) {
  const res = await fetch(`${API_URL}/tracks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete track");
  return true;
}
