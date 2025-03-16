const https = require('https');
const http = require('http');
const url = require('url');
const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'), 'hex'); // Use environment variable, generate if absent, store securely

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return iv.toString('hex') + ':' + authTag + ':' + encrypted;
}

function decrypt(encryptedData) {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const authTag = Buffer.from(parts.shift(), 'hex');
    const encryptedText = parts.join(':');
    const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

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
            'Accept-Encoding': 'gzip, deflate, br', // Add brotli support
        },
        timeout: 10000, // Add timeout
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
                const brotli = require('zlib');
                let decompress;
                if (encoding === 'gzip') {
                    decompress = zlib.gunzip;
                } else if (encoding === 'deflate') {
                    decompress = zlib.inflate;
                } else if (encoding === 'br') {
                    decompress = brotli.brotliDecompress;
                }

                decompress(buffer, (err, uncompressed) => {
                    if (err) {
                        console.error('Decompression error:', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Proxy error: Content decoding failed.');
                        return;
                    }
                    decodedBody = uncompressed;

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
                        'Content-Encoding': 'identity',
                        'Cache-Control': 'no-store',
                        'X-Content-Type-Options': 'nosniff',
                        'X-Frame-Options': 'DENY',
                        'Content-Security-Policy': "default-src 'none'; script-src 'none'; object-src 'none'; style-src 'unsafe-inline'; img-src data:; media-src 'none'; frame-src 'none'; connect-src 'none'; font-src 'none';",
                        'X-XSS-Protection': '1; mode=block',
                    });
                    res.end(encryptedBody);
                });
            } else {
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
                    'Content-Encoding': 'identity',
                    'Cache-Control': 'no-store',
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'Content-Security-Policy': "default-src 'none'; script-src 'none'; object-src 'none'; style-src 'unsafe-inline'; img-src data:; media-src 'none'; frame-src 'none'; connect-src 'none'; font-src 'none';",
                    'X-XSS-Protection': '1; mode=block',
                });
                res.end(encryptedBody);
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