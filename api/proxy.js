const https = require('https');
const http = require('http');
const crypto = require('crypto');

function encryptData(data, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptData(encryptedData, key) {
    const textParts = encryptedData.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = (req, res) => {
    const { url } = req.query;

    if (!url) {
        res.status(400).send('URL parameter is required');
        return;
    }

    try {
        new URL(url);
    } catch (err) {
        res.status(400).send('Invalid URL');
        return;
    }

    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (proxyRes) => {
        let data = '';

        proxyRes.on('data', (chunk) => {
            data += chunk;
        });

        proxyRes.on('end', () => {
            const encryptionKey = crypto.randomBytes(32).toString('hex');
            const encryptedData = encryptData(data, encryptionKey);

            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('X-Encryption-Key', encryptionKey); // Send encryption key as header

            res.status(200).send(encryptedData);
        });
    }).on('error', (err) => {
        console.error(err);
        res.status(500).send('Proxy error: ' + err.message);
    });
};