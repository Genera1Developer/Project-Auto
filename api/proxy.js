const { URL } = require('url');
const https = require('https');
const http = require('http');

module.exports = (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('URL parameter is required');
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(targetUrl);
    } catch (error) {
        return res.status(400).send('Invalid URL');
    }

    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const proxyReq = protocol.request(targetUrl, {
        method: req.method,
        headers: req.headers,
        rejectUnauthorized: false // Consider making this configurable or removing it for production
    }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (error) => {
        console.error('Proxy request error:', error);
        res.status(500).send(`Proxy error: ${error.message}`);
    });

    req.pipe(proxyReq);
};