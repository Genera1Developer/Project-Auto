const https = require('https');
const http = require('http');
const urlModule = require('url');
const crypto = require('crypto');
const zlib = require('zlib');

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
        console.error('Decryption error:', error);
        return null; // Or throw an error, depending on your needs
    }
}


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
                'Accept-Encoding': 'gzip, deflate, br', // Accept compressed content
            },
        }, (proxyRes) => {
            let body = [];

            proxyRes.on('data', (chunk) => {
                body.push(chunk);
            });

            proxyRes.on('end', () => {
                let responseData = Buffer.concat(body);

                // Handle compressed content
                if (proxyRes.headers['content-encoding'] === 'gzip') {
                    responseData = zlib.gunzipSync(responseData);
                } else if (proxyRes.headers['content-encoding'] === 'deflate') {
                    responseData = zlib.inflateSync(responseData);
                }

                responseData = responseData.toString();

                // Encrypt the response data
                const encryptedData = encrypt(responseData);

                // Set appropriate headers for encrypted content
                res.setHeader('Content-Type', 'application/octet-stream'); // Or a custom type
                res.setHeader('Content-Disposition', 'attachment; filename="encrypted_data.enc"'); // Suggest a filename

                res.writeHead(proxyRes.statusCode);
                res.end(encryptedData);
            });
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