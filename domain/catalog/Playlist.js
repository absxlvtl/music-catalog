class Playlist {
  constructor(id, name, tracks = []) {
    this.id = id;
    this.name = name;
    this.tracks = tracks; // масив id треків
  }

  addTrack(trackId) {
    this.tracks.push(trackId);
  }

  removeTrack(trackId) {
    this.tracks = this.tracks.filter(id => id !== trackId);
  }
}

module.exports = Playlist;
