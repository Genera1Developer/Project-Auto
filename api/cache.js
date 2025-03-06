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
        try {
          const value = cache.get(url);
          return value || null;
        } catch (error) {
          console.error(`Cache get operation failed for URL: ${url}`, error);
          return null;
        }
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
        try {
          cache.set(url, data, ttl);
          return true;
        } catch (error) {
          console.error(`Cache set operation failed for URL: ${url}`, error);
          return null;
        }
    },
    clear: async (url) => {
        if (!url) {
            console.warn('Attempted to clear cache with null/undefined URL');
            return;
        }
        try {
          cache.del(url);
          return true;
        } catch (error) {
          console.error(`Cache clear operation failed for URL: ${url}`, error);
          return null;
        }
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