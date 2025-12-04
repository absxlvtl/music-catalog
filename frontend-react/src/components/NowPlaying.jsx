import { colors } from "../theme/colors";

export default function NowPlaying() {
  return (
    <div
      style={{
        width: "260px",
        background: "#111",
        padding: "20px",
        color: "white",
        borderLeft: "1px solid #222",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end"
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Now Playing</h3>

      <div style={{ background: colors.card, padding: "12px", borderRadius: "10px" }}>
        <p style={{ margin: 0, fontWeight: "bold" }}>No track selected</p>
      </div>
    </div>
  );
}
