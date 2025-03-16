document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', async () => {
        const url = urlInput.value;

        if (!url) {
            contentDiv.textContent = 'Please enter a URL.';
            return;
        }

        try {
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.iv || !data.encryptedData) {
                throw new Error('Invalid encrypted data format received.');
            }

            const decryptedData = decrypt(data.encryptedData, data.iv);

            contentDiv.textContent = decryptedData;

        } catch (error) {
            console.error('Error fetching or decrypting:', error);
            contentDiv.textContent = `Error: ${error.message}`;
        }
    });

    function decrypt(encryptedData, iv) {
        try {
            // Ensure Buffer is available in the browser
            if (typeof Buffer === 'undefined') {
                throw new Error('Buffer is not defined. Ensure buffer.js is loaded.');
            }
    
            const encryptionKey = 'defaultEncryptionKey'; // USE a more secure key management strategy
            const ivBuffer = Buffer.from(iv, 'hex');
            const encryptedTextBuffer = Buffer.from(encryptedData, 'hex');
    
            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), ivBuffer);
            let decrypted = decipher.update(encryptedTextBuffer);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        } catch (error) {
            console.error("Decryption error:", error);
            return 'Decryption Failed';
        }
    }
});
edit filepath: api/proxy.js
content: const express = require('express');
const router = express.Router();
const { encrypt } = require('./encryption');
const https = require('https');

router.get('/', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL parameter is required.');
    }

    try {
        const httpsResponse = await getWebContent(url);
        const { encryptedData, iv } = encrypt(httpsResponse);
        res.json({ iv, encryptedData });

    } catch (error) {
        console.error('Error fetching or encrypting:', error);
        res.status(500).send(`Proxy Error: ${error.message}`);
    }
});

function getWebContent(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(data);
            });

            res.on('error', (err) => {
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

module.exports = router;