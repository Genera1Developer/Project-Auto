const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 }); // TTL in seconds, check period

module.exports = {
  get: (key) => {
    try {
      const value = cache.get(key);
      return value;
    } catch (error) {
      console.error(`Error getting cache for key ${key}:`, error);
      return undefined;
    }
  },
  set: (key, value) => {
    try {
      cache.set(key, value);
    } catch (error) {
      console.error(`Error setting cache for key ${key}:`, error);
    }
  },
  del: (key) => {
    try {
      cache.del(key);
    } catch (error) {
      console.error(`Error deleting cache for key ${key}:`, error);
    }
  },
  flush: () => {
    try {
      cache.flushAll();
      console.log("Cache flushed");
    } catch (error) {
      console.error("Error flushing cache:", error);
    }
  },
  getStats: () => {
    try {
      return cache.getStats();
    } catch (error) {
      console.error("Error getting cache stats:", error);
      return {};
    }
  },
};