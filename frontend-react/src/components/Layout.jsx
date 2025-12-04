import { Link } from "react-router-dom";
import { colors } from "../theme/colors";
import NowPlaying from "./NowPlaying";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh", background: colors.bg }}>
      <aside
        style={{
          width: "220px",
          background: "#000",
          padding: "20px",
          color: "white"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Music Catalog</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link style={{ color: "white" }} to="/">Tracks</Link>
          <Link style={{ color: "white" }} to="/playlists">Playlists</Link>
          <Link style={{ color: "white" }} to="/add-track">+ Add Track</Link>
          <Link style={{ color: "white" }} to="/add-playlist">+ Add Playlist</Link>
        </nav>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "30px",
          overflowY: "auto",
          color: colors.text
        }}
      >
        {children}
      </main>

      <NowPlaying />
    </div>
  );
}
