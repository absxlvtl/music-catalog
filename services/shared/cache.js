const crypto = require("crypto");

class Cache {
  constructor() {
    this.map = new Map();
  }

  get(key) {
    return this.map.get(key);
  }

  set(key, value) {
    this.map.set(key, value);
  }

  invalidate(key) {
    this.map.delete(key);
  }

  makeETag(data) {
    return crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");
  }
}

module.exports = new Cache();
