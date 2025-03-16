const https = require('https');
const http = require('http');
const crypto = require('crypto');

function encryptContent(content, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(content);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptContent(encryptedContent, key) {
    const textParts = encryptedContent.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = (req, res) => {
    const url = req.query.url;

    if (!url) {
        res.status(400).send('URL parameter is required');
        return;
    }

    try {
        new URL(url);
    } catch (error) {
        res.status(400).send('Invalid URL');
        return;
    }

    const proxyRequest = (url.startsWith('https') ? https : http).get(url, (proxyResponse) => {
        let rawData = '';

        proxyResponse.on('data', (chunk) => {
            rawData += chunk;
        });

        proxyResponse.on('end', () => {
            try {
                // Generate a secure encryption key
                const encryptionKey = crypto.randomBytes(32).toString('hex');

                // Encrypt the proxied content
                const encryptedData = encryptContent(rawData, encryptionKey);

                // Send the encrypted data and encryption key back to the client
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(JSON.stringify({
                    encryptedData: encryptedData,
                    encryptionKey: encryptionKey
                }));

            } catch (e) {
                console.error(e.message);
                res.status(500).send('Error processing the request');
            }
        });

    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
        res.status(500).send(`Proxy error: ${e.message}`);
    });
}