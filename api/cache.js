const cache = {};

module.exports = {
    get: (url) => {
        return cache[url] || null;
    },
    set: (url, data) => {
        cache[url] = data;
    },
    clear: (url) => {
        delete cache[url];
    }
};