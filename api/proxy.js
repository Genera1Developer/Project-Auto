const express = require('express');
const https = require('https');
const http = require('http');
const zlib = require('zlib');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/api/proxy', (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL parameter is required');
    }

    try {
        const parsedURL = new URL(url);
        const protocol = parsedURL.protocol === 'https:' ? https : http;

        protocol.get(url, { headers: { 'User-Agent': 'EncryptedProxy/1.0' } }, (proxyRes) => {
            let rawData = [];

            proxyRes.on('data', (chunk) => {
                rawData.push(chunk);
            });

            proxyRes.on('end', () => {
                let buffer = Buffer.concat(rawData);

                // Attempt to decompress if content is gzipped
                if (proxyRes.headers['content-encoding'] === 'gzip') {
                    zlib.gunzip(buffer, (err, unzippedBuffer) => {
                        if (err) {
                            console.error('Error decompressing gzip:', err);
                            handleResponse(buffer, proxyRes, res); // Fallback to original buffer if decompression fails
                        } else {
                            handleResponse(unzippedBuffer, proxyRes, res);
                        }
                    });
                } else {
                    handleResponse(buffer, proxyRes, res);
                }
            });
        }).on('error', (error) => {
            console.error('Proxy request error:', error);
            res.status(500).send('Proxy request failed: ' + error.message);
        });

    } catch (error) {
        console.error('URL parsing error:', error);
        res.status(400).send('Invalid URL: ' + error.message);
    }
});

function handleResponse(buffer, proxyRes, res) {
    let data = buffer.toString('utf-8');

    // Basic HTML sanitization (crude example)
    data = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Encrypt the data using AES
    const encryptionKey = crypto.randomBytes(32); // 256-bit key
    const iv = crypto.randomBytes(16); // Initialization vector

    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encryptedData = cipher.update(data, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');

    // Send encryption details and encrypted data
    const responseData = {
        encryptedData: encryptedData,
        encryptionKey: encryptionKey.toString('hex'),
        iv: iv.toString('hex')
    };

    res.status(proxyRes.statusCode).json(responseData);
}

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});