const fs = require("fs");
const path = require("path");

const OUTBOX_FILE = path.join(__dirname, "events.json");

// якщо файлу нема — створюємо
if (!fs.existsSync(OUTBOX_FILE)) {
  fs.writeFileSync(OUTBOX_FILE, "[]", "utf-8");
}

function writeEvent(evt) {
  const json = JSON.parse(fs.readFileSync(OUTBOX_FILE, "utf-8"));
  json.push({
    ...evt,
    createdAt: new Date().toISOString()
  });
  fs.writeFileSync(OUTBOX_FILE, JSON.stringify(json, null, 2));
}

module.exports = { writeEvent };
