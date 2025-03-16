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
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const encryptedData = await response.text();

            // Decrypt the data in the browser
            const encryptionKey = 'defaultEncryptionKey'; // MUST MATCH SERVER KEY, REPLACE WITH SECURE METHOD
            const decryptedData = decrypt(encryptedData, encryptionKey);

            contentDiv.textContent = decryptedData;

        } catch (error) {
            console.error('Error fetching or decrypting:', error);
            contentDiv.textContent = `Error: ${error.message}`;
        }
    });

    // AES decryption function (keep in sync with server-side encryption)
    function decrypt(text, key) {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const authTag = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');

        try {
            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
            decipher.setAuthTag(authTag);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        } catch (error) {
            console.error("Decryption error:", error);
            return "Decryption Failed";
        }

    }

    // Import crypto-js (browser version)
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
    script.onload = () => {
        console.log('CryptoJS loaded');
        window.Buffer = window.Buffer || require('buffer').Buffer;
    };
    document.head.appendChild(script);


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

function decrypt(text, key) {
     try {
        if (!text || !key) {
            throw new Error("Invalid input: text or key is missing.");
        }

        const textParts = text.split(':');
        if (textParts.length < 3) {
            throw new Error("Invalid ciphertext format.");
        }

        const iv = Buffer.from(textParts.shift(), 'hex');
		const authTag = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');

        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
		decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Decryption error:", error);
        return null; // Or handle the error as needed
    }
}

module.exports = { encrypt, decrypt };