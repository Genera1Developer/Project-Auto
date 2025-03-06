const NodeCache = require( 'node-cache' );

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

module.exports = {
    get: (url) => {
        return cache.get(url) || null;
    },
    set: (url, data) => {
        cache.set(url, data);
    },
    clear: (url) => {
        cache.del(url);
    },
    flush: () => {
        cache.flushAll();
    }
};