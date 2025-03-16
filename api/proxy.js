const https = require('https');
const http = require('http');
const url = require('url');
const crypto = require('crypto');

const algorithm = 'aes-256-gcm'; // Use a strong and authenticated encryption algorithm (GCM)
const encryptionKey = crypto.randomBytes(32); // Generate a secure encryption key (store securely in production)

function encrypt(text) {
    const iv = crypto.randomBytes(16); // Generate a unique IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex'); // Get the authentication tag

    return iv.toString('hex') + ':' + authTag + ':' + encrypted; // Include IV and authTag in the output
}

function decrypt(encryptedData) {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const authTag = Buffer.from(parts.shift(), 'hex');
    const encryptedText = parts.join(':');

    const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
    decipher.setAuthTag(authTag); // Set the authentication tag
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
                'X-Content-Type-Options': 'nosniff', // Prevent MIME sniffing
                'X-Frame-Options': 'DENY', // Prevent framing
                'Content-Security-Policy': "default-src 'none'; script-src 'none'; object-src 'none'; style-src 'unsafe-inline'; img-src data:; media-src 'none'; frame-src 'none'; connect-src 'none'; font-src 'none';",
                'X-XSS-Protection': '1; mode=block', // Enable XSS protection
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