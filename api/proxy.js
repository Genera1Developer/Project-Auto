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
const KEY_DERIVATION_SALT = process.env.KEY_DERIVATION_SALT || crypto.randomBytes(16).toString('hex');
const ITERATIONS = parseInt(process.env.PBKDF2_ITERATIONS) || 10000; // Adjust based on security needs and performance
const DIGEST = process.env.PBKDF2_DIGEST || 'sha512';

function deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, DIGEST); // 32 bytes for AES-256
}

function encrypt(text) {
    const salt = crypto.randomBytes(16); // Use byte array for salt
    const key = deriveKey(ENCRYPTION_KEY, salt.toString('hex'));
    let iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([salt, iv, authTag, encrypted]).toString('hex'); // Store salt as Buffer
}

function decrypt(text) {
    try {
        const buffer = Buffer.from(text, 'hex');
        const salt = buffer.slice(0, 16); // salt is now Buffer
        const iv = buffer.slice(16, 16 + IV_LENGTH);
        const authTag = buffer.slice(16 + IV_LENGTH, 16 + IV_LENGTH + AUTH_TAG_LENGTH);
        const encrypted = buffer.slice(16 + IV_LENGTH + AUTH_TAG_LENGTH);

        const key = deriveKey(ENCRYPTION_KEY, salt.toString('hex')); // use salt.toString('hex')
        const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

// Function to encrypt/decrypt headers
function transformHeaders(headers, encryptFlag) {
    const transformedHeaders = {};
    for (const key in headers) {
        if (headers.hasOwnProperty(key)) {
            const lowerKey = key.toLowerCase();
            // Skip certain headers that should not be encrypted
            if (['host', 'x-target-url', 'content-length', 'content-encoding', 'transfer-encoding'].includes(lowerKey)) {
                transformedHeaders[key] = headers[key];
            } else {
                const value = String(headers[key]); // Ensure value is a string
                transformedHeaders[encryptFlag ? encrypt(key) : decrypt(key)] = encryptFlag ? encrypt(value) : decrypt(value);
            }
        }
    }
    return transformedHeaders;
}

function proxyRequest(req, res) {
    const targetUrl = req.headers['x-target-url'];
    if (!targetUrl) {
        return res.status(400).send('Target URL is missing.');
    }

    try {
        const parsedUrl = new url.URL(targetUrl);
        let reqHeaders = transformHeaders(req.headers, false); // Decrypt incoming headers
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
            method: req.method,
            headers: reqHeaders,
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

            let resHeaders = transformHeaders(proxyRes.headers, true); // Encrypt outgoing headers
            delete resHeaders['content-encoding'];

            res.writeHead(proxyRes.statusCode, resHeaders);
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