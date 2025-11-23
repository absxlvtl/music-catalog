const { recordRequest } = require("../metrics/metrics");

module.exports = function metricsMiddleware(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const latency = Date.now() - start;
    const success = res.statusCode < 400;
    recordRequest(latency, success);
  });

  next();
};
