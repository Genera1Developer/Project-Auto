const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

module.exports = {
    get: (url) => {
        if (!url) {
            return null;
        }
        return cache.get(url) || null;
    },
    set: (url, data, ttl = 3600) => {
        if (!url || !data) {
            return;
        }
        cache.set(url, data, ttl);
    },
    clear: (url) => {
        if (!url) {
            return;
        }
        cache.del(url);
    },
    flush: () => {
        cache.flushAll();
    },
    stats: () => {
        return cache.getStats();
    }
};