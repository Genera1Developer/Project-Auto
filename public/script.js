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
			
			// Decrypt the data in the browser
			const encryptionKey = 'defaultEncryptionKey'; //TODO: Replace with secure key exchange

			async function decrypt(encryptedData, key) {
				return new Promise((resolve, reject) => {
					try {
						const textParts = encryptedData.split(':');
						const iv = Buffer.from(textParts.shift(), 'hex');
						const authTag = Buffer.from(textParts.shift(), 'hex');
						const encryptedText = Buffer.from(textParts.join(':'), 'hex');

						crypto.subtle.importKey(
							"raw",
							new TextEncoder().encode(key),
							"AES-CBC",
							false,
							["encrypt", "decrypt"]
						).then(key => {
							crypto.subtle.decrypt(
								{
									name: "AES-CBC",
									iv: iv,
									tagLength: 128,
								},
								key,
								encryptedText
							).then(decrypted => {
								resolve(new TextDecoder().decode(decrypted));
							}).catch(err => reject(err));
						}).catch(err => reject(err));
					} catch (error) {
						reject(error);
					}
				});
			}


            decrypt(encryptedData, encryptionKey)
                .then(decryptedData => {
                    contentDiv.textContent = decryptedData;
                })
                .catch(error => {
                    console.error("Decryption error:", error);
                    contentDiv.textContent = 'Decryption failed.  Check console for details.';
                    contentDiv.classList.add('error');
                });

        } catch (error) {
            console.error("Proxy error:", error);
            contentDiv.textContent = 'Proxy request failed. Check console for details.';
            contentDiv.classList.add('error');
        }
    });
});
edit filepath: api/encryption.js
content: // api/encryption.js

const crypto = require('crypto');

// Function to generate a secure encryption key
function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex'); // 256-bit key
}

// Function to encrypt data using AES-256-CBC
function encrypt(data, key) {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex'); // Store IV for decryption
}

// Function to decrypt data using AES-256-CBC
function decrypt(encryptedData, key) {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = Buffer.from(parts[1], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { generateEncryptionKey, encrypt, decrypt };