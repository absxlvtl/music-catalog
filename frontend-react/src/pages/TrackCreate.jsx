import { useState } from "react";
import { createTrack } from "../api/tracksApi";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";

export default function TrackCreate() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const navigate = useNavigate();

  return (
    <div>
      <h2>Add Track</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          placeholder="Artist"
          value={artist}
          onChange={e => setArtist(e.target.value)}
        />

        <button
          onClick={() =>
            createTrack({ title, artist }).then(() => navigate("/"))
          }
          style={{
            background: colors.accent,
            color: "black",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none"
          }}
        >
          Create
        </button>
      </div>
    </div>
  );
}
