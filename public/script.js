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
			
			const decryptionKey = 'defaultEncryptionKey';

			const decryptedData = await decryptData(encryptedData, decryptionKey);

            contentDiv.textContent = decryptedData;
        } catch (error) {
            console.error('Error fetching data:', error);
            contentDiv.textContent = `Error: ${error.message}`;
            contentDiv.classList.add('error');
        }
    });

    async function decryptData(encryptedData, key) {
        return new Promise((resolve, reject) => {
            // Simple AES decryption in JavaScript (for demonstration purposes)
            // **WARNING: This is NOT secure for production use.**
            // In a real application, use a secure, well-vetted library like CryptoJS.
            try {
                const textParts = encryptedData.split(':');
                const iv = Buffer.from(textParts.shift(), 'hex');
                const authTag = Buffer.from(textParts.shift(), 'hex');
                const encryptedText = Buffer.from(textParts.join(':'), 'hex');

                const keyBuffer = Buffer.from(key);
                const ivBuffer = Buffer.from(iv);
                const encryptedTextBuffer = Buffer.from(encryptedText);

                crypto.subtle.importKey(
                    "raw",
                    keyBuffer,
                    { name: "AES-CBC", length: 256 },
                    false,
                    ["encrypt", "decrypt"]
                ).then(key => {
                    crypto.subtle.decrypt(
                        { name: "AES-CBC", iv: ivBuffer },
                        key,
                        encryptedTextBuffer
                    ).then(decrypted => {
                        const decryptedText = new TextDecoder().decode(decrypted);
                        resolve(decryptedText);
                    }).catch(err => {
                        reject(err);
                    });
                }).catch(err => {
                    reject(err);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

});
edit filepath: api/encryption.js
content: const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; //Use AES 256 encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

//Test Functions
// var hw = encrypt("Testing Encryption");
// console.log(hw);
// console.log(decrypt(hw));

module.exports = { encrypt, decrypt };