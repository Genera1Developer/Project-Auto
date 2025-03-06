const NodeCache = require("node-cache");

const DEFAULT_TTL = 60 * 60; // 1 hour (seconds)
const CHECK_PERIOD = 60 * 5; // 5 minutes (seconds)

class CacheService {
  constructor(ttl = DEFAULT_TTL, checkPeriod = CHECK_PERIOD) {
    this.cache = new NodeCache({ stdTTL: ttl, checkperiod: checkPeriod, useClones: false }); // disable clones for performance
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value, ttl = DEFAULT_TTL) {
    this.cache.set(key, value, ttl);
  }

  del(key) {
    this.cache.del(key);
  }

  flush() {
    this.cache.flushAll();
  }

  getStats() {
    return this.cache.getStats();
  }
}

module.exports = new CacheService();