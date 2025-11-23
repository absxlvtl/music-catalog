const crypto = require("crypto");

let store = new Map();

// створює ETag із даних
function makeETag(data) {
  const json = JSON.stringify(data);
  return crypto.createHash("sha1").update(json).digest("hex");
}

// зберегти ключ у кеш
function set(key, value) {
  store.set(key, value);
}

// отримати з кешу
function get(key) {
  return store.get(key);
}

// інвалідація ключа
function invalidate(key) {
  store.delete(key);
}

module.exports = {
  makeETag,
  set,
  get,
  invalidate
};
