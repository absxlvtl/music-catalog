import { useState } from "react";
import { createTrack } from "../api/tracksApi";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";

export default function AddTrack() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await createTrack({ title, artist, file });
      navigate("/");
    } catch (err) {
      alert("Помилка при додаванні треку: " + err.message);
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Add New Track</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px", width: "400px" }}
      >
        <input
          type="text"
          placeholder="Track title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={e => setArtist(e.target.value)}
        />

        <input
          type="file"
          accept="audio/*"
          onChange={e => setFile(e.target.files[0])}
        />

        <button type="submit" style={{
          padding: "12px",
          background: colors.accent,
          borderRadius: "8px",
          fontWeight: "bold"
        }}>
          Add
        </button>
      </form>
    </div>
  );
}
