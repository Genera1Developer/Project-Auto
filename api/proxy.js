const https = require('https');
const http = require('http');
const crypto = require('crypto');

function encryptContent(data, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptContent(encryptedData, key) {
    const textParts = encryptedData.split(':');
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
        new URL(url); // Validate URL format
    } catch (error) {
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
            const encryptionKey = crypto.randomBytes(32).toString('hex'); // Generate a unique key for each request.
            const encryptedData = encryptContent(data, encryptionKey);
            // Store the encryption key securely (e.g., session or database) for decryption on the client-side
            // For demonstration, we'll pass it as a header - THIS IS NOT SECURE FOR PRODUCTION.
            res.setHeader('X-Encryption-Key', encryptionKey);
            res.setHeader('Content-Type', 'text/plain'); // Set content type to plain text because the body is encrypted.
            res.status(200).send(encryptedData);
        });

    }).on('error', (error) => {
        console.error('Proxy error:', error);
        res.status(500).send('Proxy error: ' + error.message);
    });
};
edit filepath: public/script.js
content: document.addEventListener('DOMContentLoaded', function() {
    const proxyButton = document.getElementById('proxyButton');
    const urlInput = document.getElementById('urlInput');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', function() {
        const url = urlInput.value;

        if (!url) {
            contentDiv.innerHTML = '<p class="error">Please enter a URL.</p>';
            return;
        }

        if (!isValidURL(url)) {
            contentDiv.innerHTML = '<p class="error">Please enter a valid URL.</p>';
            return;
        }

        contentDiv.innerHTML = '<p>Loading...</p>';

        fetch('/api/proxy?url=' + encodeURIComponent(url))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const encryptionKey = response.headers.get('X-Encryption-Key');
                if (!encryptionKey) {
                    throw new Error('Encryption key not found in response headers');
                }
                return Promise.all([response.text(), encryptionKey]);
            })
            .then(([encryptedData, encryptionKey]) => {
                const decryptedData = decryptContent(encryptedData, encryptionKey);
                contentDiv.innerHTML = decryptedData;
            })
            .catch(error => {
                contentDiv.innerHTML = '<p class="error">Error: ' + error.message + '</p>';
            });
    });

    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function decryptContent(encryptedData, key) {
        const textParts = encryptedData.split(':');
        const iv = textParts.shift();
        const encryptedText = textParts.join(':');

        const ivBuffer = hexToBytes(iv);
        const encryptedTextBuffer = hexToBytes(encryptedText);
        const keyBuffer = hexToBytes(key);

        return decryptAES(encryptedTextBuffer, keyBuffer, ivBuffer);
    }

    function hexToBytes(hex) {
        let bytes = [];
        for (let c = 0; c < hex.length; c += 2)
          bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    }

    async function decryptAES(encrypted, key, iv) {
        try {
            const keyMaterial = await window.crypto.subtle.importKey(
                "raw",
                new Uint8Array(key),
                "AES-CBC",
                false,
                ["decrypt"]
            );

            const decryptedData = await window.crypto.subtle.decrypt(
                {
                    name: "AES-CBC",
                    iv: new Uint8Array(iv),
                },
                keyMaterial,
                new Uint8Array(encrypted)
            );

            return new TextDecoder().decode(decryptedData);
        } catch (e) {
            console.error("Decryption error:", e);
            return '<p class="error">Decryption error: ' + e.message + '</p>';
        }
    }
});