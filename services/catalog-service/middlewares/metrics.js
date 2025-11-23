const { incrementRequestCount } = require("../metrics/metrics");

module.exports = function metricsMiddleware(req, res, next) {
  incrementRequestCount();  // лічильник запитів

  res.on("finish", () => {
    // Можеш додати response time або статуси
  });

  next(); // 
};
