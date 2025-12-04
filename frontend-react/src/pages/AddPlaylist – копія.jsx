import { useState } from "react";
import { createPlaylist } from "../api/playlistsApi";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";

export default function AddPlaylist() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await createPlaylist(name);
    navigate("/playlists");
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h2>Create Playlist</h2>

      <form onSubmit={submit} style={{ display: "grid", gap: "12px" }}>
        <input
          style={{ padding: "8px" }}
          placeholder="Playlist name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <button
          style={{
            padding: "10px",
            background: colors.accent,
            borderRadius: "6px"
          }}
        >
          Create
        </button>
      </form>
    </div>
  );
}
