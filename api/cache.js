const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

const getCache = async (url) => {
    if (!isValidURL(url)) {
        console.warn(`Attempted to get cache with invalid URL: ${url}`);
        return null;
    }
    try {
        return await cache.get(url);
    } catch (error) {
        console.error(`Cache get operation failed for URL: ${url}`, error);
        return null;
    }
};

const setCache = async (url, data, ttl = 3600) => {
    if (!isValidURL(url)) {
        console.warn(`Attempted to set cache with invalid URL: ${url}`);
        return false;
    }
    if (data === null || data === undefined) {
        console.warn(`Attempted to set cache with null/undefined data for URL: ${url}`);
        return false;
    }
    try {
        await cache.set(url, data, ttl);
        return true;
    } catch (error) {
        console.error(`Cache set operation failed for URL: ${url}`, error);
        return false;
    }
};

const clearCache = async (url) => {
    if (!isValidURL(url)) {
        console.warn(`Attempted to clear cache with invalid URL: ${url}`);
        return false;
    }
    try {
        const result = cache.del(url);
        return result > 0; // Indicate success if at least one key was deleted
    } catch (error) {
        console.error(`Cache clear operation failed for URL: ${url}`, error);
        return false;
    }
};

const flushCache = async () => {
    try {
        cache.flushAll();
        return true;
    } catch (error) {
        console.error('Error flushing cache', error);
        return false;
    }
};

const getCacheStats = async () => {
    try {
        return cache.getStats();
    } catch (error) {
        console.error('Error getting cache stats', error);
        return null;
    }
};

const getCacheKeys = async () => {
    try {
        return cache.keys();
    } catch (error) {
        console.error('Error getting cache keys', error);
        return null;
    }
};

module.exports = {
    get: getCache,
    set: setCache,
    clear: clearCache,
    flush: flushCache,
    stats: getCacheStats,
    keys: getCacheKeys
};