import { useEffect, useState } from "react";
import { getTracks, deleteTrack } from "../api/tracksApi";
import { Link } from "react-router-dom";
import { colors } from "../theme/colors";

import { FaTrash, FaInfoCircle } from "react-icons/fa";

export default function TracksList() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    loadTracks();
  }, []);

  function loadTracks() {
    getTracks().then(data => setTracks(data));
  }

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Music Tracks</h2>

      <Link
        to="/add-track"
        style={{
          background: colors.accent,
          padding: "10px 16px",
          borderRadius: "8px",
          display: "inline-block",
          marginBottom: "20px",
          color: "black",
          fontWeight: "bold"
        }}
      >
        + Add Track
      </Link>

      <div style={{ display: "grid", gap: "14px" }}>
        {tracks.map(t => (
          <div
            key={t.id}
            style={{
              background: colors.card,
              padding: "16px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <h3>{t.title}</h3>
              <p style={{ color: colors.textMuted }}>{t.artist}</p>
            </div>

            <div style={{ display: "flex", gap: "14px" }}>
              <Link to={`/track/${t.id}`} style={{ color: colors.accent }}>
                <FaInfoCircle size={20} />
              </Link>

              <button
                onClick={() =>
                  deleteTrack(t.id).then(() =>
                    setTracks(tracks.filter(x => x.id !== t.id))
                  )
                }
                style={{
                  background: "transparent",
                  color: "tomato",
                  cursor: "pointer"
                }}
              >
                <FaTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
