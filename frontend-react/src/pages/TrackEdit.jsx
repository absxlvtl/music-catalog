import { useEffect, useState } from "react";
import { getTrack, updateTrack } from "../api/tracksApi";
import { useParams, useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";

export default function TrackEdit() {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTrack(id).then(setTrack);
  }, []);

  if (!track) return "Loading...";

  return (
    <div>
      <h2>Edit Track</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          value={track.title}
          onChange={e => setTrack({ ...track, title: e.target.value })}
        />

        <input
          value={track.artist}
          onChange={e => setTrack({ ...track, artist: e.target.value })}
        />

        <button
          onClick={() => updateTrack(id, track).then(() => navigate("/"))}
          style={{
            background: colors.accent,
            color: "black",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none"
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
