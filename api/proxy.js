const express = require('express');
const https = require('https');
const http = require('http');
const zlib = require('zlib');
const crypto = require('crypto');
const { URL } = require('url');

const app = express();
const port = 3000;

// Middleware to handle CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Proxy endpoint
app.get('/api/proxy', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL parameter is required');
    }

    try {
        const parsedURL = new URL(url);
        const protocol = parsedURL.protocol === 'https:' ? https : http;

        const options = {
            headers: { 'User-Agent': 'EncryptedProxy/1.0' },
            timeout: 10000 // Add a timeout to prevent indefinite waiting
        };

        const proxyReq = protocol.get(url, options, (proxyRes) => {
            const contentEncoding = proxyRes.headers['content-encoding'];
            let rawData = [];

            proxyRes.on('data', (chunk) => {
                rawData.push(chunk);
            });

            proxyRes.on('end', async () => {
                try {
                    let buffer = Buffer.concat(rawData);

                    if (contentEncoding === 'gzip') {
                        buffer = await gunzipAsync(buffer);
                    }

                    const response = await handleResponse(buffer, proxyRes);
                    res.status(proxyRes.statusCode).json(response);

                } catch (error) {
                    console.error('Error processing response:', error);
                    res.status(500).send('Error processing response: ' + error.message);
                }
            });
        }).on('error', (error) => {
            console.error('Proxy request error:', error);
            res.status(500).send('Proxy request failed: ' + error.message);
        });

        proxyReq.on('timeout', () => {
            proxyReq.destroy();
            res.status(504).send('Proxy request timed out');
        });

    } catch (error) {
        console.error('URL parsing error:', error);
        res.status(400).send('Invalid URL: ' + error.message);
    }
});

// Promisify zlib.gunzip
function gunzipAsync(buffer) {
    return new Promise((resolve, reject) => {
        zlib.gunzip(buffer, (err, unzippedBuffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(unzippedBuffer);
            }
        });
    });
}

// Function to handle the response, sanitize and encrypt
async function handleResponse(buffer, proxyRes) {
    let data = buffer.toString('utf-8');

    // Basic HTML sanitization (crude example)
    data = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Generate a secure, random encryption key
    const encryptionKey = crypto.randomBytes(32); // 256-bit key
    const iv = crypto.randomBytes(16); // Initialization vector

    // Encrypt the data using AES-256-CBC
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encryptedData = cipher.update(data, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');

    // Construct the response object
    const responseData = {
        encryptedData: encryptedData,
        encryptionKey: encryptionKey.toString('hex'),
        iv: iv.toString('hex')
    };

    return responseData;
}

// Start the server
app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});