import { useEffect, useState, useRef } from "react";
import { getTracks, deleteTrack } from "../api/tracksApi";
import { Link } from "react-router-dom";
import { colors } from "../theme/colors";

import { FaTrash, FaInfoCircle, FaPlay, FaPause } from "react-icons/fa";

export default function TracksList() {
  const [tracks, setTracks] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const audio = useRef(new Audio());

  useEffect(() => {
    loadTracks();

    audio.current.onended = () => setPlayingId(null);
  }, []);

  function loadTracks() {
    getTracks().then(data => setTracks(data));
  }

  function togglePlay(track) {
    const url = `http://localhost:3000/uploads/${track.filePath}`;

    if (playingId === track.id) {
      audio.current.pause();
      setPlayingId(null);
      return;
    }

    audio.current.src = url;
    audio.current.play();
    setPlayingId(track.id);
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

              {t.filePath ? (
                <small style={{ color: colors.textMuted }}>
                  🎵 File: {t.filePath}
                </small>
              ) : (
                <small style={{ color: "red" }}>— No file —</small>
              )}
            </div>

            <div style={{ display: "flex", gap: "14px", alignItems:"center" }}>

              {t.filePath && (
                <button
                  onClick={() => togglePlay(t)}
                  style={{
                    background: "transparent",
                    color: "limegreen",
                    cursor: "pointer"
                  }}
                >
                  {playingId === t.id ? <FaPause size={22} /> : <FaPlay size={22} />}
                </button>
              )}

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
