const https = require('https');
const http = require('http');
const crypto = require('crypto');
const url = require('url');
const zlib = require('zlib');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'); // Generate a random key if not provided
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16; //For GCM

//Consider using environment variables for cipher algorithm
const CIPHER_ALGORITHM = process.env.CIPHER_ALGORITHM || 'aes-256-gcm';

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, encrypted]).toString('hex');
}

function decrypt(text) {
    try {
        const buffer = Buffer.from(text, 'hex');
        const iv = buffer.slice(0, IV_LENGTH);
        const authTag = buffer.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
        const encrypted = buffer.slice(IV_LENGTH + AUTH_TAG_LENGTH);

        const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

function proxyRequest(req, res) {
    const targetUrl = req.headers['x-target-url'];
    if (!targetUrl) {
        return res.status(400).send('Target URL is missing.');
    }

    try {
        const parsedUrl = new url.URL(targetUrl);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
            method: req.method,
            headers: req.headers,
            rejectUnauthorized: false // Add this line.  Be careful using this in production without proper cert validation.
        };

        delete options.headers['x-target-url']; // Prevent loop
        delete options.headers['host']; // Ensure correct host
        delete options.headers['accept-encoding']; // Disable compression for proxy to handle it

        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        const proxyReq = protocol.request(options, (proxyRes) => {
            // Handle compressed responses
            let encoding = proxyRes.headers['content-encoding'];
            let raw = proxyRes;

            if (encoding == 'gzip' || encoding == 'deflate') {
                let gunzip = zlib.createUnzip();
                proxyRes.pipe(gunzip);
                raw = gunzip;
            } else if (encoding == 'br') {
                let brotliDecompress = zlib.createBrotliDecompress();
                proxyRes.pipe(brotliDecompress);
                raw = brotliDecompress;
            }

            delete proxyRes.headers['content-encoding'];

            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            raw.pipe(res);


        });

        proxyReq.on('error', (err) => {
            console.error('Proxy request error:', err);
            res.status(500).send('Proxy error');
        });

        req.pipe(proxyReq);
        req.on('error', (err) => {
            console.error("Request error:", err);
            proxyReq.destroy(err);
        });
    } catch (error) {
        console.error("URL parsing or proxy error:", error);
        res.status(500).send('Internal server error.');
    }
}

module.exports = {
    proxyRequest,
    encrypt,
    decrypt,
};