const https = require('https');
const http = require('http');
const crypto = require('crypto');

function encrypt(text, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text, key) {
    const textParts = text.split(':');
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
        res.status(400).send('URL is required');
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
            const encryptionKey = process.env.ENCRYPTION_KEY || 'defaultEncryptionKey';
            const encryptedData = encrypt(data, encryptionKey);
            res.status(200).send(encryptedData);
        });

    }).on('error', (err) => {
        console.error(err);
        res.status(500).send('Proxy error: ' + err.message);
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

        // Basic URL validation
        if (!isValidURL(url)) {
            contentDiv.innerHTML = '<p class="error">Please enter a valid URL.</p>';
            return;
        }

        // Display loading message
        contentDiv.innerHTML = '<p>Loading...</p>';

        fetch('/api/proxy?url=' + encodeURIComponent(url))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(encryptedData => {
                // Decrypt the data in the browser
                decryptData(encryptedData)
                    .then(decryptedData => {
                        contentDiv.innerHTML = decryptedData;
                    })
                    .catch(error => {
                        contentDiv.innerHTML = '<p class="error">Decryption Error: ' + error.message + '</p>';
                    });
            })
            .catch(error => {
                contentDiv.innerHTML = '<p class="error">Error: ' + error.message + '</p>';
            });
    });

    // Helper function to validate URL
    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    async function decryptData(encryptedData) {
        const encryptionKey = 'defaultEncryptionKey'; // Should be securely managed, not hardcoded

        return new Promise((resolve, reject) => {
            try {
                const textParts = encryptedData.split(':');
                const iv = Buffer.from(textParts.shift(), 'hex');
                const encryptedText = Buffer.from(textParts.join(':'), 'hex');

                // Import the key (consider using a more robust key derivation function)
                crypto.subtle.importKey(
                    "raw",
                    new TextEncoder().encode(encryptionKey),
                    { name: "AES-CBC", length: 256 },
                    false,
                    ["decrypt"]
                ).then(key => {
                    // Decrypt the data
                    crypto.subtle.decrypt(
                        { name: "AES-CBC", iv: iv },
                        key,
                        encryptedText
                    ).then(decrypted => {
                        const decryptedText = new TextDecoder().decode(decrypted);
                        resolve(decryptedText);
                    }).catch(err => {
                        reject(new Error("Decryption failed: " + err.message));
                    });
                }).catch(err => {
                    reject(new Error("Key import failed: " + err.message));
                });
            } catch (err) {
                reject(new Error("Data processing error: " + err.message));
            }
        });
    }
});
edit filepath: .env
content: ENCRYPTION_KEY=YourSecureEncryptionKeyHere