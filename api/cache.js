const cache = {};

module.exports = {
    get: (url) => {
        return cache[url] || null;
    },
    set: (url, data, ttl = 3600) => {
        cache[url] = {
            data,
            expiry: Date.now() + (ttl * 1000)
        };
    },
    check: (url) => {
        if (!cache[url]) {
            return null;
        }

        if (cache[url].expiry < Date.now()) {
            delete cache[url];
            return null;
        }

        return cache[url].data;
    }
};