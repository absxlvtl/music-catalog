const fs = require("fs");

function writeEvent(event) {
  const line = JSON.stringify({
    ...event,
    ts: Date.now()
  }) + "\n";

  fs.appendFileSync("./outbox.log", line);
}

module.exports = { writeEvent };
