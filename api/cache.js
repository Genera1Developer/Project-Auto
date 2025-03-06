const NodeCache = require( "node-cache" );

const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 }); // TTL: 5 minutes, check every 2 minutes

module.exports = {
  get: (key) => {
    return cache.get(key);
  },
  set: (key, value) => {
    cache.set(key, value);
  },
  del: (key) => {
    cache.del(key);
  },
  flush: () => {
    cache.flushAll();
  }
};