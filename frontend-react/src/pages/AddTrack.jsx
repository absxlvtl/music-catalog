import { useState } from "react";
import { createTrack } from "../api/tracksApi";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";

export default function AddTrack() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await createTrack({ title, artist });
    navigate("/"); // повертаємося до списку треків
  }

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Add New Track</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px", width: "400px" }}
      >
        <input
          placeholder="Track title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px" }}
        />

        <input
          placeholder="Artist"
          value={artist}
          onChange={e => setArtist(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px" }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            background: colors.accent,
            color: "black",
            borderRadius: "8px",
            fontWeight: "bold"
          }}
        >
          Add
        </button>
      </form>
    </div>
  );
}
