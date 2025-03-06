const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

module.exports = {
    get: async (url) => {
        if (!url) {
            return null;
        }
        try {
            const value = await cache.get(url);
            return value || null;
        } catch (error) {
            console.error(`Error getting cache for URL: ${url}`, error);
            return null;
        }
    },
    set: async (url, data, ttl = 3600) => {
        if (!url || !data) {
            return;
        }
        try {
            await cache.set(url, data, ttl);
        } catch (error) {
            console.error(`Error setting cache for URL: ${url}`, error);
        }
    },
    clear: async (url) => {
        if (!url) {
            return;
        }
        try {
            await cache.del(url);
        } catch (error) {
            console.error(`Error clearing cache for URL: ${url}`, error);
        }
    },
    flush: async () => {
        try {
            await cache.flushAll();
        } catch (error) {
            console.error('Error flushing cache', error);
        }
    },
    stats: async () => {
        try {
            return await cache.getStats();
        } catch (error) {
            console.error('Error getting cache stats', error);
            return null;
        }
    }
};