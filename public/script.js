document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('url-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const url = document.getElementById('url-input').value;
        
        // Basic URL validation (can be enhanced)
        if (!isValidURL(url)) {
            alert('Please enter a valid URL.');
            return;
        }

        // Simple encryption (replace with real encryption)
        const encryptedURL = btoa(url);

        // Redirect to proxy with encrypted URL
        window.location.href = '/api/proxy?url=' + encryptedURL;
    });

    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }
});
edit filepath: api/proxy.js
content: const https = require('https');
const http = require('http');
const url = require('url');

module.exports = (req, res) => {
    const { url: encryptedURL } = req.query;

    if (!encryptedURL) {
        res.status(400).send('Missing URL parameter');
        return;
    }

    try {
        const decodedURL = atob(encryptedURL);
        const parsedURL = url.parse(decodedURL);

        if (!parsedURL.protocol) {
            res.status(400).send('Invalid URL: Missing protocol (http/https)');
            return;
        }

        const proxyRequest = (parsedURL.protocol === 'https:' ? https : http).request({
            hostname: parsedURL.hostname,
            path: parsedURL.path,
            method: 'GET',
            headers: req.headers // Forward original headers
        }, (proxyResponse) => {
            res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
            proxyResponse.pipe(res, { end: true }); // Stream the response
        });

        proxyRequest.on('error', (error) => {
            console.error('Proxy request error:', error);
            res.status(500).send('Proxy error');
        });

        req.pipe(proxyRequest, { end: true }); // Stream the request body
    } catch (error) {
        console.error('Decoding or processing error:', error);
        res.status(500).send('Internal server error');
    }
};
edit filepath: api/encryption.js
content: // api/encryption.js

const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; // Use a strong algorithm
const key = crypto.randomBytes(32); // Generate a secure key
const iv = crypto.randomBytes(16); // Generate a secure IV

function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = { encrypt, decrypt };