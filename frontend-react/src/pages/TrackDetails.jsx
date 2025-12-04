import { useEffect, useState, useContext } from "react";
import { getTrack, deleteTrack } from "../api/tracksApi";
import { useNavigate, useParams } from "react-router-dom";
import { NowPlayingContext } from "../context/NowPlayingContext";
import { colors } from "../theme/colors";

export default function TrackDetails() {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const navigate = useNavigate();
  const { setNowPlaying } = useContext(NowPlayingContext);

  useEffect(() => {
    getTrack(id).then(setTrack);
  }, [id]);

  if (!track) return <p>Loading...</p>;

  return (
    <div>
      <h2>{track.title}</h2>
      <p style={{ color: colors.textMuted }}>{track.artist}</p>

      <button
        onClick={() => setNowPlaying(track)}
        style={{
          padding: "10px",
          background: colors.accent,
          borderRadius: "6px",
          marginRight: "10px"
        }}
      >
        ▶ Play
      </button>

      <button
        onClick={() =>
          deleteTrack(track.id).then(() => navigate("/"))
        }
        style={{
          padding: "10px",
          background: "tomato",
          borderRadius: "6px",
          color: "white"
        }}
      >
        Delete
      </button>

      <button
        onClick={() => navigate(-1)}
        style={{
          marginLeft: "10px",
          padding: "10px",
          background: colors.card,
          borderRadius: "6px"
        }}
      >
        ← Back
      </button>
    </div>
  );
}
