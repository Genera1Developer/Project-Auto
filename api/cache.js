const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const isValidURL = (url) => {
    return typeof url === 'string' && url.trim() !== '';
};

module.exports = {
    get: async (url) => {
        if (!isValidURL(url)) {
            console.warn('Attempted to get cache with invalid URL');
            return null;
        }
        try {
            return cache.get(url) || null;
        } catch (error) {
            console.error(`Cache get operation failed for URL: ${url}`, error);
            return null;
        }
    },
    set: async (url, data, ttl = 3600) => {
        if (!isValidURL(url)) {
            console.warn('Attempted to set cache with invalid URL');
            return false;
        }
        if (!data) {
            console.warn('Attempted to set cache with null/undefined data for URL:', url);
            return false;
        }
        try {
            cache.set(url, data, ttl);
            return true;
        } catch (error) {
            console.error(`Cache set operation failed for URL: ${url}`, error);
            return false;
        }
    },
    clear: async (url) => {
        if (!isValidURL(url)) {
            console.warn('Attempted to clear cache with invalid URL');
            return false;
        }
        try {
            return cache.del(url) > 0;
        } catch (error) {
            console.error(`Cache clear operation failed for URL: ${url}`, error);
            return false;
        }
    },
    flush: async () => {
        try {
            cache.flushAll();
            return true;
        } catch (error) {
            console.error('Error flushing cache', error);
            return false;
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