import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import TracksList from "./pages/TracksList";
import TrackDetails from "./pages/TrackDetails";
import PlaylistsList from "./pages/PlaylistsList";
import AddTrack from "./pages/AddTrack";
import AddPlaylist from "./pages/AddPlaylist";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TracksList />} />
        <Route path="/track/:id" element={<TrackDetails />} />
        <Route path="/playlists" element={<PlaylistsList />} />

        <Route path="/add-track" element={<AddTrack />} />
        <Route path="/add-playlist" element={<AddPlaylist />} />
      </Routes>
    </Layout>
  );
}
