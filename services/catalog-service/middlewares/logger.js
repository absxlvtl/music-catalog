module.exports = function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.url} → ${res.statusCode} (${ms} ms)`);
  });

  next();
};
