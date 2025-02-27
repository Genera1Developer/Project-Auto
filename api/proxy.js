const { URL } = require('url');
const https = require('https');
const http = require('http');

module.exports = (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        res.status(400).send('URL parameter is required');
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

    const proxyReq = protocol.request(targetUrl, {
        method: req.method,
        headers: req.headers,
        rejectUnauthorized: false
    }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (error) => {
        console.error('Proxy request error:', error);
        res.status(500).send('Proxy error: ' + error.message);
    });

    req.pipe(proxyReq, { end: true });
};