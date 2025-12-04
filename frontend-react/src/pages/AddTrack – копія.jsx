import { useState } from "react";
import { createTrack } from "../api/tracksApi";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";

export default function AddTrack() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await createTrack(title, artist);
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h2>Add New Track</h2>

      <form onSubmit={submit} style={{ display: "grid", gap: "12px" }}>
        <input
          style={{ padding: "8px" }}
          placeholder="Track title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          style={{ padding: "8px" }}
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />

        <button
          style={{
            padding: "10px",
            background: colors.accent,
            color: "black",
            borderRadius: "6px"
          }}
        >
          Add
        </button>
      </form>
    </div>
  );
}
