const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const safeCacheOperation = async (operation, url, data, ttl) => {
    try {
        return await operation(url, data, ttl);
    } catch (error) {
        console.error(`Cache operation failed for URL: ${url}`, error);
        return null;
    }
};

module.exports = {
    get: async (url) => {
        if (!url) {
            console.warn('Attempted to get cache with null/undefined URL');
            return null;
        }
        return safeCacheOperation(async (url) => {
            const value = cache.get(url);
            return value || null;
        }, url);
    },
    set: async (url, data, ttl = 3600) => {
        if (!url) {
            console.warn('Attempted to set cache with null/undefined URL');
            return;
        }
        if (!data) {
            console.warn('Attempted to set cache with null/undefined data for URL:', url);
            return;
        }
        return safeCacheOperation(async (url, data, ttl) => {
            cache.set(url, data, ttl);
            return true;
        }, url, data, ttl);
    },
    clear: async (url) => {
        if (!url) {
            console.warn('Attempted to clear cache with null/undefined URL');
            return;
        }
        return safeCacheOperation(async (url) => {
            cache.del(url);
            return true;
        }, url);
    },
    flush: async () => {
        try {
            cache.flushAll();
            return true;
        } catch (error) {
            console.error('Error flushing cache', error);
            return null;
        }
    },
    stats: async () => {
        try {
            return cache.getStats();
        } catch (error) {
            console.error('Error getting cache stats', error);
            return null;
        }
    }
};