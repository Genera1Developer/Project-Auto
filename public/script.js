const password = 'YOUR_DEFAULT_PASSWORD'; // Replace with a secure method
const encryptedMessage = CryptoJS.AES.encrypt('Sensitive data', password).toString();
const decryptedMessage = CryptoJS.AES.decrypt(encryptedMessage, password).toString(CryptoJS.enc.Utf8);

function encryptData(data, key) {
    try {
        if (!data || !key) {
            throw new Error("Data and key are required for encryption.");
        }
        const encrypted = CryptoJS.AES.encrypt(data, key).toString();
        return encrypted;
    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    }
}

function decryptData(data, key) {
    try {
        if (!data || !key) {
            throw new Error("Data and key are required for decryption.");
        }
        const decrypted = CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
        if (!decrypted) {
            throw new Error("Decryption failed. Invalid key or data.");
        }
        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
}

function generateEncryptionKey(length = 32) {
    const key = CryptoJS.lib.WordArray.random(length).toString();
    return key;
}
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}
const apiKey = "YOUR_API_KEY"; //CHANGE THIS
function callAPI(endpoint, method = 'GET', body = null) {
    const url = `/api/${endpoint}`;

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey
        },
        body: body ? JSON.stringify(body) : null
    };

    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('API call failed:', error);
            throw error;
        });
}
function testEncryption() {
    const originalText = "This is a test message!";
    const encryptionKey = generateEncryptionKey();
    const encryptedText = encryptData(originalText, encryptionKey);

    if (encryptedText) {
        const decryptedText = decryptData(encryptedText, encryptionKey);
        if (decryptedText === originalText) {
            console.log("Encryption Test Passed!");
            console.log("Original Text:", originalText);
            console.log("Encrypted Text:", encryptedText);
            console.log("Decrypted Text:", decryptedText);
        } else {
            console.error("Encryption Test Failed: Decryption mismatch!");
        }
    } else {
        console.error("Encryption Test Failed: Encryption returned null.");
    }
}

function init() {
    testEncryption();
}

document.addEventListener('DOMContentLoaded', init);
edit filepath: api/encryption.js
content: const crypto = require('crypto');

function encrypt(text, key) {
    try {
        if (!text || !key) {
            throw new Error("Text and key are required for encryption.");
        }
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encrypted = cipher.update(text);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    }
}

function decrypt(text, key) {
    try {
        if (!text || !key) {
            throw new Error("Text and key are required for decryption.");
        }

        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
}

function generateKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}
module.exports = {
    encrypt,
    decrypt,
    generateKey
};
edit filepath: api/proxy.js
content: const express = require('express');
const router = express.Router();
const encryption = require('./encryption');

router.post('/encrypt', (req, res) => {
    const { data, key } = req.body;

    if (!data || !key) {
        return res.status(400).json({ error: 'Data and key are required.' });
    }

    const encryptedData = encryption.encrypt(data, key);

    if (!encryptedData) {
        return res.status(500).json({ error: 'Encryption failed.' });
    }

    res.json({ encryptedData });
});

router.post('/decrypt', (req, res) => {
    const { data, key } = req.body;

    if (!data || !key) {
        return res.status(400).json({ error: 'Data and key are required.' });
    }

    const decryptedData = encryption.decrypt(data, key);

    if (!decryptedData) {
        return res.status(500).json({ error: 'Decryption failed.' });
    }

    res.json({ decryptedData });
});

router.get('/generateKey', (req, res) => {
    const key = encryption.generateKey();
    res.json({ key });
});

module.exports = router;
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Proxy</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>
    <div id="particles-js"></div>
    <h1>Welcome to the Encrypted Proxy</h1>
    <p>Enter URL to browse securely:</p>
    <input type="text" id="urlInput" placeholder="Enter URL">
    <button id="browseButton">Browse Securely</button>

    <script src="particles.js"></script>
    <script>
        particlesJS.load('particles-js', 'particles.json', function() {
            console.log('particles.json loaded - callback');
        });
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
edit filepath: public/index.css
content: body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #000;
    color: #fff;
    text-align: center;
    overflow: hidden; /* Hide scrollbars */
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
}

h1 {
    margin-top: 100px;
    color: #00ff00;
    text-shadow: 0 0 10px #00ff00;
}

p {
    font-size: 1.2em;
    color: #ddd;
}

input[type="text"] {
    padding: 10px;
    width: 50%;
    margin: 20px auto;
    display: block;
    background-color: #222;
    color: #fff;
    border: 1px solid #444;
    border-radius: 5px;
}

button {
    padding: 10px 20px;
    background-color: #00ff00;
    color: #000;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #00cc00;
}