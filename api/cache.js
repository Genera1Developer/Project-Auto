const cache = {};

module.exports = {
    get: (key) => {
        return cache[key] || null;
    },
    set: (key, data, ttl = 3600) => { // Default TTL of 1 hour
        cache[key] = {
            data: data,
            expiry: Date.now() + ttl * 1000 // Convert TTL to milliseconds
        };
    },
    isExpired: (key) => {
        if (!cache[key]) {
            return true;
        }
        return Date.now() > cache[key].expiry;
    },
    clear: (key) => {
        delete cache[key];
    }
};
edit filepath: api/proxy.js
content: const { URL } = require('url');
const https = require('https');
const http = require('http');
const cache = require('./cache');

module.exports = (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        res.status(400).send('URL parameter is required');
        return;
    }

    const cacheKey = `proxy:${targetUrl}`;

    if (cache.get(cacheKey) && !cache.isExpired(cacheKey)) {
        const cachedResponse = cache.get(cacheKey);
        res.writeHead(cachedResponse.statusCode, cachedResponse.headers);
        res.end(cachedResponse.data);
        return;
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(targetUrl);
    } catch (error) {
        res.status(400).send('Invalid URL');
        return;
    }

    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    protocol.get(targetUrl, (proxyRes) => {
        let data = '';

        proxyRes.on('data', (chunk) => {
            data += chunk;
        });

        proxyRes.on('end', () => {
            const responseData = {
                statusCode: proxyRes.statusCode,
                headers: proxyRes.headers,
                data: data
            };

            cache.set(cacheKey, responseData);

            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            res.end(data);
        });
    }).on('error', (error) => {
        res.status(500).send('Proxy error: ' + error.message);
    });
};
edit filepath: package.json
content: {
  "name": "web-proxy",
  "version": "1.0.0",
  "description": "A simple web proxy",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "http": "0.0.1-security",
    "url": "^0.11.0"
  },
  "devDependencies": {
    "node-fetch": "^3.0.0"
  },
  "keywords": [
    "proxy",
    "web"
  ],
  "author": "Your Name",
  "license": "MIT"
}
edit filepath: