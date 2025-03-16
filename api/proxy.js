const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { encrypt, decrypt } = require('./encryption'); // Import encryption functions
const crypto = require('crypto');
const zlib = require('zlib');

const generateSecureHeaders = (nonce) => ({
    'Content-Security-Policy': `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'`,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Secure-Proxy-Nonce': nonce
});

router.get('/', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': req.headers['user-agent'] || 'SecureProxy/1.0',
                'Accept': req.headers['accept'] || 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': req.headers['accept-language'] || 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'close'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.text();

        // Compress the data before encryption
        zlib.gzip(data, async (err, compressedData) => {
            if (err) {
                console.error('Error compressing data:', err);
                return res.status(500).send(`Proxy Error: Compression failed: ${err.message}`);
            }

            // Encrypt the compressed data
            const encryptedData = encrypt(compressedData.toString('base64'));

            // Generate a unique nonce for each request
            const nonce = crypto.randomBytes(16).toString('hex');

            // Set secure headers
            const secureHeaders = generateSecureHeaders(nonce);
            for (const header in secureHeaders) {
                res.setHeader(header, secureHeaders[header]);
            }

            // Send the encrypted data back to the client
            res.send(encryptedData);
        });

    } catch (error) {
        console.error('Error fetching or encrypting data:', error);
        res.status(500).send(`Proxy Error: ${error.message}`);
    }
});

module.exports = router;