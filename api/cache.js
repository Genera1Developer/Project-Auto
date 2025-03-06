const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

module.exports = {
    get: (url) => {
        if (!url) {
            return null;
        }
        try {
            return cache.get(url) || null;
        } catch (error) {
            console.error(`Error getting cache for URL: ${url}`, error);
            return null;
        }
    },
    set: (url, data, ttl = 3600) => {
        if (!url || !data) {
            return;
        }
        try {
            cache.set(url, data, ttl);
        } catch (error) {
            console.error(`Error setting cache for URL: ${url}`, error);
        }
    },
    clear: (url) => {
        if (!url) {
            return;
        }
        try {
            cache.del(url);
        } catch (error) {
            console.error(`Error clearing cache for URL: ${url}`, error);
        }
    },
    flush: () => {
        try {
            cache.flushAll();
        } catch (error) {
            console.error('Error flushing cache', error);
        }
    },
    stats: () => {
        try {
            return cache.getStats();
        } catch (error) {
            console.error('Error getting cache stats', error);
            return null;
        }
    }
};