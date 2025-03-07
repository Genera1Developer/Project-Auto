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
        const value = cache.get(url);
        return value === undefined ? null : value;
    } catch (error) {
        console.error(`Cache get operation failed for URL: ${url}: ${error.message}`);
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
        cache.set(url, data, ttl);
        return true;
    } catch (error) {
        console.error(`Cache set operation failed for URL: ${url}: ${error.message}`);
        return false;
    }
};

const clearCache = async (url) => {
    if (!isValidURL(url)) {
        console.warn(`Attempted to clear cache with invalid URL: ${url}`);
        return false;
    }
    try {
        const deleted = cache.del(url);
        return deleted > 0;
    } catch (error) {
        console.error(`Cache clear operation failed for URL: ${url}: ${error.message}`);
        return false;
    }
};

const flushCache = async () => {
    try {
        cache.flushAll();
        return true;
    } catch (error) {
        console.error(`Error flushing cache: ${error.message}`);
        return false;
    }
};

const getCacheStats = async () => {
    try {
        return cache.getStats();
    } catch (error) {
        console.error(`Error getting cache stats: ${error.message}`);
        return null;
    }
};

const getCacheKeys = async () => {
    try {
        return cache.keys();
    } catch (error) {
        console.error(`Error getting cache keys: ${error.message}`);
        return null;
    }
};

module.exports = {
    getCache,
    setCache,
    clearCache,
    flushCache,
    getCacheStats,
    getCacheKeys
};