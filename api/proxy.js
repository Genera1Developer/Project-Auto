const https = require('https');
const http = require('http');
const URL = require('url');

module.exports = (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('URL parameter is required');
    }

    try {
        const parsedUrl = new URL(targetUrl);
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET',
            headers: {} // Forward original request headers if needed (be careful)
        };

        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        const proxyReq = protocol.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });

        proxyReq.on('error', (err) => {
            console.error('Proxy request error:', err);
            res.status(500).send(`Proxy Error: ${err.message}`);
        });

        req.pipe(proxyReq, { end: true }); // Pipe the original request to the proxy request

    } catch (error) {
        console.error('URL parsing error:', error);
        res.status(400).send('Invalid URL');
    }
};