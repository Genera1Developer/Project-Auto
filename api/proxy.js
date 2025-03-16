const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');

router.get('/proxy', (req, res) => {
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
                res.send(data);
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

module.exports = router;