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
            const encryptedData = await response.text();

            // Decrypt the data here on the client-side
            const decryptionKey = 'defaultEncryptionKey'; // Should be securely managed, not hardcoded
            const decryptedData = decrypt(encryptedData, decryptionKey);

            contentDiv.textContent = decryptedData;

        } catch (error) {
            console.error('Error fetching or decrypting:', error);
            contentDiv.textContent = `Error: ${error.message}`;
        }
    });

    function decrypt(text, key) {
        const textParts = text.split(':');
        const iv = textParts.shift();
		const authTag = textParts.shift();
        const encryptedText = textParts.join(':');

        const ivBuffer = CryptoJS.enc.Hex.parse(iv);
		const authTagBuffer = CryptoJS.enc.Hex.parse(authTag);
        const encryptedBuffer = CryptoJS.enc.Hex.parse(encryptedText);

        const keyHex = CryptoJS.enc.Utf8.parse(key);

        const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedBuffer }, keyHex, {
            iv: ivBuffer,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
			authTag: authTagBuffer,
			authTagLength: 128 / 8
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }
});
edit filepath: public/aes-encryption.js
content: const CryptoJS = require('crypto-js');

function encrypt(message, key) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const salt = CryptoJS.lib.WordArray.random(128 / 8); 
    const keyParam = CryptoJS.PBKDF2(key, salt, {
        keySize: 256/32,
        iterations: 100
    });

    const encrypted = CryptoJS.AES.encrypt(message, keyParam, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return {
        ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
        iv: iv.toString(),
        salt: salt.toString()
    };
}

function decrypt(encryptedData, key) {
    const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);
    const salt = CryptoJS.enc.Hex.parse(encryptedData.salt);

    const keyParam = CryptoJS.PBKDF2(key, salt, {
        keySize: 256/32,
        iterations: 100
    });
    const ciphertext = CryptoJS.enc.Base64.parse(encryptedData.ciphertext);

    const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, keyParam, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt };