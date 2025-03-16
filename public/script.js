document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', async () => {
        const url = urlInput.value;

        if (!url) {
            contentDiv.textContent = 'Please enter a URL.';
            contentDiv.classList.add('error');
            return;
        }

        contentDiv.classList.remove('error');
        contentDiv.textContent = 'Loading...';

        try {
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const encryptedData = await response.text();
			const encryptionKey = 'defaultEncryptionKey';

			async function decryptData(encryptedData, encryptionKey) {
				try {
					const response = await fetch('/api/encryption/decrypt', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							encryptedData: encryptedData,
							encryptionKey: encryptionKey
						})
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const decryptedData = await response.text();
					return decryptedData;

				} catch (error) {
					console.error('Decryption error:', error);
					contentDiv.textContent = 'Decryption failed.';
					contentDiv.classList.add('error');
					return null;
				}
			}
			const decryptedData = await decryptData(encryptedData, encryptionKey);

			if (decryptedData) {
				contentDiv.textContent = decryptedData;
			}
        } catch (error) {
            console.error('Error fetching data:', error);
            contentDiv.textContent = 'Failed to load content.';
            contentDiv.classList.add('error');
        }
    });
});
edit filepath: api/encryption.js
content: const crypto = require('crypto');

function encrypt(text, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(encryptedData, key) {
    try {
        const textParts = encryptedData.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const authTag = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');

        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Decryption failed');
    }
}

module.exports = { encrypt, decrypt };
edit filepath: api/proxy.js
content: const https = require('https');
const http = require('http');
const encryption = require('./encryption');

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
            try {
                const encryptedData = encryption.encrypt(data, encryptionKey);
                res.status(200).send(encryptedData);
            } catch (error) {
                console.error('Encryption error:', error);
                res.status(500).send('Encryption error: ' + error.message);
            }
        });

    }).on('error', (err) => {
        console.error(err);
        res.status(500).send('Proxy error: ' + err.message);
    });
};
edit filepath: api/encryption/decrypt.js
content: const encryption = require('../encryption');

module.exports = (req, res) => {
    const encryptedData = req.body.encryptedData;
    const encryptionKey = req.body.encryptionKey || 'defaultEncryptionKey';

    if (!encryptedData) {
        return res.status(400).send('Encrypted data is required.');
    }

    try {
        const decryptedData = encryption.decrypt(encryptedData, encryptionKey);
        res.status(200).send(decryptedData);
    } catch (error) {
        console.error('Decryption error:', error);
        res.status(500).send('Decryption failed: ' + error.message);
    }
};