const https = require('https');
const http = require('http');
const urlModule = require('url');

module.exports = (req, res) => {
    const targetUrl = req.url.substring(req.url.indexOf('url=') + 4);

    if (!targetUrl) {
        return res.status(400).send('url parameter is required');
    }

    try {
        const parsedUrl = urlModule.parse(targetUrl);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        const proxyReq = protocol.request(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': req.headers['user-agent'] || 'EncryptedProxy',
                'Accept': req.headers['accept'] || '*/*',
                'Referer': req.headers['referer'] || parsedUrl.origin || targetUrl,
                'Origin': parsedUrl.origin || null,
                'Accept-Language': req.headers['accept-language'] || 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Connection': 'close',
            },
        }, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });

        proxyReq.on('error', (error) => {
            console.error('Proxy request error:', error);
            res.status(500).send(`Proxy Error: ${error.message}`);
        });

        proxyReq.end();

    } catch (error) {
        console.error('URL parsing error:', error);
        res.status(400).send(`Invalid URL: ${error.message}`);
    }
};