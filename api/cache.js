const NodeCache = require( "node-cache" );

const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

module.exports = {
  get: (key) => {
    try {
      const value = cache.get(key);
      return value === undefined ? null : value; // Explicitly return null for cache misses
    } catch (err) {
      console.error(`Cache get error for key ${key}: ${err}`);
      return null; // Return null on error as well for consistency
    }
  },
  set: (key, value) => {
    try {
      cache.set(key, value);
    } catch (err) {
      console.error(`Cache set error for key ${key}: ${err}`);
    }
  },
  del: (key) => {
    try{
      cache.del(key);
    } catch (err) {
      console.error(`Cache delete error for key ${key}: ${err}`);
    }
  },
  flush: () => {
    try {
      cache.flushAll();
    } catch (err) {
      console.error(`Cache flush error: ${err}`);
    }
  },
  has: (key) => {
    try {
      return cache.has(key);
    } catch (err) {
      console.error(`Cache has error for key ${key}: ${err}`);
      return false;
    }
  }
};