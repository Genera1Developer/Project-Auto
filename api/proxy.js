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

    protocol.get(targetUrl, (proxyRes) => {
        let data = '';

        proxyRes.on('data', (chunk) => {
            data += chunk;
        });

        proxyRes.on('end', () => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            res.end(data);
        });
    }).on('error', (error) => {
        res.status(500).send('Proxy error: ' + error.message);
    });
};