const NodeCache = require( "node-cache" );

const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

module.exports = {
  get: (key) => {
    try {
      return cache.get(key);
    } catch (err) {
      console.error(`Cache get error for key ${key}: ${err}`);
      return undefined;
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
  }
};