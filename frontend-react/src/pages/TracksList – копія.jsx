import { useEffect, useState } from "react";
import { getTracks, deleteTrack } from "../api/tracksApi";
import { Link } from "react-router-dom";
import { colors } from "../theme/colors";

import { FaTrash, FaInfoCircle } from "react-icons/fa";

export default function TracksList() {
  const [tracks, setTracks] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => {
    getTracks().then(data => setTracks(data));
  }, []);

  const paginated = tracks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Music Tracks</h2>

      {/* Кнопка створити трек */}
      <Link
        to="/add-track"
        style={{
          background: colors.accent,
          padding: "10px 16px",
          borderRadius: "8px",
          display: "inline-block",
          marginBottom: "20px",
          fontWeight: "600"
        }}
      >
        + Add Track
      </Link>

      <div style={{ display: "grid", gap: "14px" }}>
        {paginated.map(t => (
          <div
            key={t.id}
            style={{
              background: colors.card,
              padding: "16px",
              borderRadius: "10px",
              transition: "0.2s",
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

      {/* Пагінація */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{
            padding: "8px 16px",
            background: colors.card,
            borderRadius: "6px"
          }}
        >
          Prev
        </button>

        <button
          disabled={page * PAGE_SIZE >= tracks.length}
          onClick={() => setPage(page + 1)}
          style={{
            padding: "8px 16px",
            background: colors.card,
            borderRadius: "6px"
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
