import { useEffect, useState } from "react";

export default function Playlists() {
  const [lists, setLists] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/playlists")
      .then(r => r.json())
      .then(setLists);
  }, []);

  function createPlaylist() {
    fetch("http://localhost:8081/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
      .then(r => r.json())
      .then(p => setLists([...lists, p]));
  }

  return (
    <div>
      <h2>Playlists</h2>

      <input
        placeholder="New playlist name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button onClick={createPlaylist}>Create</button>

      <ul style={{ marginTop: "20px" }}>
        {lists.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
