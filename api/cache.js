const cache = new Map();

module.exports = {
    get: (url) => {
        const cachedItem = cache.get(url);
        if (!cachedItem) {
            return null;
        }
        if (cachedItem.expiry < Date.now()) {
            cache.delete(url);
            return null;
        }
        return cachedItem.data;
    },
    set: (url, data, ttl = 3600) => {
        cache.set(url, {
            data,
            expiry: Date.now() + (ttl * 1000)
        });
    },
    check: (url) => {
        const cachedItem = cache.get(url);

        if (!cachedItem) {
            return null;
        }

        if (cachedItem.expiry < Date.now()) {
            cache.delete(url);
            return null;
        }

        return cachedItem.data;
    }
};