const https = require('https');
const http = require('http');
const url = require('url');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; // Use a strong encryption algorithm
const encryptionKey = crypto.randomBytes(32); // Generate a secure encryption key (store securely in production)
const iv = crypto.randomBytes(16); // Generate a secure initialization vector (store securely in production)

function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

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
                try {
                    decodedBody = zlib.gunzipSync(buffer);
                } catch (err) {
                    console.error('Gunzip error:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Proxy error: Content decoding failed.');
                    return;
                }
            } else if (encoding === 'deflate') {
                const zlib = require('zlib');
                try {
                    decodedBody = zlib.inflateSync(buffer);
                } catch (err) {
                    console.error('Inflate error:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Proxy error: Content decoding failed.');
                    return;
                }
            }

            const contentType = proxyRes.headers['content-type'] || 'text/plain';
            let encryptedBody;
            try {
                encryptedBody = encrypt(decodedBody.toString());
            } catch (encryptErr) {
                console.error('Encryption error:', encryptErr);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Proxy error: Encryption failed.');
                return;
            }


            res.writeHead(proxyRes.statusCode, {
                ...proxyRes.headers,
                'Content-Type': 'text/encrypted',
                'Content-Encoding': 'identity', // Remove content encoding
                'Cache-Control': 'no-store', // Disable caching
            });
            res.end(encryptedBody);
        });
    }).on('error', (err) => {
        console.error('Proxy error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy error: ' + err.message);
    });

    proxyReq.end();
};