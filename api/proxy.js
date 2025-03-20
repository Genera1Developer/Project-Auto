const https = require('https');
const http = require('http');
const crypto = require('crypto');
const url = require('url');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'); // Generate a random key if not provided
const IV_LENGTH = 16;

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    try {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
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
        };

        delete options.headers['x-target-url']; // Prevent loop
        delete options.headers['host']; // Ensure correct host

        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        const proxyReq = protocol.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
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