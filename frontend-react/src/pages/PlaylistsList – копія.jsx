import { useEffect, useState } from "react";
import { getPlaylists, deletePlaylist } from "../api/playlistsApi";
import { Link } from "react-router-dom";
import { colors } from "../theme/colors";

import { FaTrash } from "react-icons/fa";

export default function PlaylistsList() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    getPlaylists().then(setPlaylists);
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Playlists</h2>

      <Link
        to="/add-playlist"
        style={{
          background: colors.accent,
          padding: "10px 16px",
          borderRadius: "8px",
          display: "inline-block",
          marginBottom: "20px",
          fontWeight: "600"
        }}
      >
        + Add Playlist
      </Link>

      <div style={{ display: "grid", gap: "14px" }}>
        {playlists.map(p => (
          <div
            key={p.id}
            style={{
              background: colors.card,
              padding: "16px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <h3>{p.name}</h3>

            <button
              onClick={() =>
                deletePlaylist(p.id).then(() =>
                  setPlaylists(playlists.filter(x => x.id !== p.id))
                )
              }
              style={{ background: "transparent", color: "tomato" }}
            >
              <FaTrash size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
