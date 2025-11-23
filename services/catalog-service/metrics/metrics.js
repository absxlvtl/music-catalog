let metrics = {
  totalRequests: 0,
  totalErrors: 0,
  totalLatency: 0,
  totalTracksCreated: 0
};

function recordRequest(latencyMs, success = true) {
  metrics.totalRequests++;
  metrics.totalLatency += latencyMs;
  if (!success) metrics.totalErrors++;
}

function recordTrackCreated() {
  metrics.totalTracksCreated++;
}

function getMetrics() {
  const avgLatency = metrics.totalRequests
    ? (metrics.totalLatency / metrics.totalRequests).toFixed(2)
    : 0;

  return {
    ...metrics,
    avgLatencyMs: avgLatency
  };
}

module.exports = {
  recordRequest,
  recordTrackCreated,
  getMetrics
};
