const NodeCache = require( "node-cache" );

const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

module.exports = {
  get: async (key) => {
    try {
      const value = await cache.get(key);
      return value === undefined ? null : value; // Explicitly return null for cache misses
    } catch (err) {
      console.error(`Cache get error for key ${key}: ${err}`);
      return null; // Return null on error as well for consistency
    }
  },
  set: async (key, value) => {
    try {
      await cache.set(key, value);
    } catch (err) {
      console.error(`Cache set error for key ${key}: ${err}`);
    }
  },
  del: async (key) => {
    try{
      await cache.del(key);
    } catch (err) {
      console.error(`Cache delete error for key ${key}: ${err}`);
    }
  },
  flush: async () => {
    try {
      await cache.flushAll();
    } catch (err) {
      console.error(`Cache flush error: ${err}`);
    }
  },
  has: async (key) => {
    try {
      return await cache.has(key);
    } catch (err) {
      console.error(`Cache has error for key ${key}: ${err}`);
      return false;
    }
  }
};