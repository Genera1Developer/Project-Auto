const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_encryption_key'; // Use environment variable
const IV_LENGTH = 16;

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    try {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
}

router.get('/proxy', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL parameter is required');
    }

    try {
        const parsedURL = new URL(url);
        const protocol = parsedURL.protocol === 'https:' ? https : http;

        protocol.get(url, (proxyRes) => {
            let data = '';

            proxyRes.on('data', (chunk) => {
                data += chunk;
            });

            proxyRes.on('end', () => {
                const encryptedData = encrypt(data);
                res.send(encryptedData);
            });

            proxyRes.on('error', (err) => {
                console.error('Error during data transfer:', err);
                res.status(500).send('Error during data transfer');
            });
        }).on('error', (err) => {
            console.error('Error during request:', err);
            res.status(500).send('Error during request');
        });
    } catch (error) {
        console.error('Invalid URL:', error);
        res.status(400).send('Invalid URL');
    }
});

router.get('/decrypt', (req, res) => {
    const encryptedData = req.query.data;

    if (!encryptedData) {
        return res.status(400).send('Encrypted data is required');
    }

    const decryptedData = decrypt(encryptedData);

    if (decryptedData === null) {
        return res.status(500).send('Decryption failed');
    }

    res.send(decryptedData);
});

module.exports = router;