import { useState } from "react";
import { createPlaylist } from "../api/playlistsApi";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";

export default function AddPlaylist() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await createPlaylist(name);
    navigate("/playlists");
  }

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Add Playlist</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px", width: "400px" }}
      >
        <input
          placeholder="Playlist name"
          value={name}
          onChange={e => setName(e.target.value)}
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
