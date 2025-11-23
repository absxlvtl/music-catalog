let counters = {
  requests: 0,
  tracks_created: 0
};

function incrementRequestCount() {
  counters.requests++;
}

function recordTrackCreated() {
  counters.tracks_created++;
}

function getMetrics() {
  return {
    requests: counters.requests,
    tracks_created: counters.tracks_created
  };
}

module.exports = {
  incrementRequestCount,
  recordTrackCreated,
  getMetrics
};
