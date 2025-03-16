const https = require('https');
const http = require('http');
const url = require('url');

module.exports = (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('URL parameter is missing');
        return;
    }

    try {
        new URL(targetUrl); // Validate URL
    } catch (err) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid URL');
        return;
    }

    const parsedUrl = url.parse(targetUrl);
    const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        method: 'GET',
        headers: {
            'User-Agent': 'EncryptedProxy/1.0', // Add a custom user agent
            'Accept-Encoding': 'gzip, deflate', // Accept compressed content
        },
    };

    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const proxyReq = protocol.request(options, (proxyRes) => {
        let body = [];

        proxyRes.on('data', (chunk) => {
            body.push(chunk);
        });

        proxyRes.on('end', () => {
            const buffer = Buffer.concat(body);

            // Handle compressed content
            let encoding = proxyRes.headers['content-encoding'];
            let decodedBody = buffer;

            if (encoding === 'gzip') {
                const zlib = require('zlib');
                decodedBody = zlib.gunzipSync(buffer);
            } else if (encoding === 'deflate') {
                const zlib = require('zlib');
                decodedBody = zlib.inflateSync(buffer);
            }

            const contentType = proxyRes.headers['content-type'] || 'text/plain';
            res.writeHead(proxyRes.statusCode, {
                ...proxyRes.headers,
                'Content-Type': contentType,
                'Content-Encoding': 'identity', // Remove content encoding
                'Cache-Control': 'no-store', // Disable caching
            });
            res.end(decodedBody);
        });
    }).on('error', (err) => {
        console.error('Proxy error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy error: ' + err.message);
    });

    proxyReq.end();
};