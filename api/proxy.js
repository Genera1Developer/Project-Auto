const https = require('https');
const http = require('http');
const url = require('url');
const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'), 'hex');
const ENCRYPTION_ENABLED = process.env.ENCRYPTION_ENABLED === 'true';

const decryptBody = require('./encryption').decrypt; // Import decrypt function
const encryptBody = require('./encryption').encrypt; // Import encrypt function

module.exports = (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('URL parameter is missing');
        return;
    }

    try {
        new URL(targetUrl);
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
            'User-Agent': 'EncryptedProxy/1.0',
            'Accept-Encoding': 'gzip, deflate, br',
        },
        timeout: 10000,
    };

    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const proxyReq = protocol.request(options, (proxyRes) => {
        let body = [];

        proxyRes.on('data', (chunk) => {
            body.push(chunk);
        });

        proxyRes.on('end', () => {
            const buffer = Buffer.concat(body);

            let encoding = proxyRes.headers['content-encoding'];
            let decodedBody = buffer;

            if (encoding === 'gzip' || encoding === 'deflate' || encoding === 'br') {
                const zlib = require('zlib');
                let decompress;

                if (encoding === 'gzip') {
                    decompress = zlib.gunzip;
                } else if (encoding === 'deflate') {
                    decompress = zlib.inflate;
                } else if (encoding === 'br') {
                    decompress = zlib.brotliDecompress;
                }

                decompress(buffer, (err, uncompressed) => {
                    if (err) {
                        console.error('Decompression error:', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Proxy error: Content decoding failed.');
                        return;
                    }
                    decodedBody = uncompressed;
                    processResponse(proxyRes, decodedBody, res);
                });
            } else {
                processResponse(proxyRes, decodedBody, res);
            }
        });
    }).on('error', (err) => {
        console.error('Proxy error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy error: ' + err.message);
    });

    proxyReq.on('timeout', () => {
        proxyReq.abort();
        res.writeHead(504, { 'Content-Type': 'text/plain' });
        res.end('Proxy timeout.');
    });

    proxyReq.end();
};

function processResponse(proxyRes, decodedBody, res) {
    let encryptedBody;
    if (ENCRYPTION_ENABLED) {
        try {
            encryptedBody = encryptBody(decodedBody.toString()); // Use imported function
        } catch (encryptErr) {
            console.error('Encryption error:', encryptErr);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Proxy error: Encryption failed.');
            return;
        }

        res.writeHead(proxyRes.statusCode, {
            ...proxyRes.headers,
            'Content-Type': 'text/encrypted',
            'Content-Encoding': 'identity',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'Content-Security-Policy': "default-src 'none'; script-src 'none'; object-src 'none'; style-src 'unsafe-inline'; img-src data:; media-src 'none'; frame-src 'none'; connect-src 'none'; font-src 'none';",
            'X-XSS-Protection': '1; mode=block',
        });
        res.end(encryptedBody);
    } else {
        res.writeHead(proxyRes.statusCode, {
            ...proxyRes.headers,
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'Content-Security-Policy': "default-src 'none'; script-src 'none'; object-src 'none'; style-src 'unsafe-inline'; img-src data:; media-src 'none'; frame-src 'none'; connect-src 'none'; font-src 'none';",
            'X-XSS-Protection': '1; mode=block',
        });
        res.end(decodedBody);
    }
}