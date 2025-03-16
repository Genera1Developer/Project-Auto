document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentArea = document.getElementById('content');

    proxyButton.addEventListener('click', async function() {
        const url = urlInput.value;
        if (url) {
            try {
                // Show loading indicator
                contentArea.innerHTML = '<div class="loader">Encrypting & Fetching...</div>';

                // Fetch through the proxy
                const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.text();
                contentArea.innerHTML = data; // Display fetched content
            } catch (error) {
                console.error('Error fetching data:', error);
                contentArea.innerHTML = `<div class="error">Error: ${error.message}</div>`;
            }
        } else {
            contentArea.innerHTML = '<div class="warning">Please enter a URL.</div>';
        }
    });

    // Improved URL validation (basic)
    urlInput.addEventListener('input', function() {
        if (urlInput.value.startsWith('http://') || urlInput.value.startsWith('https://')) {
            urlInput.classList.remove('invalid');
        } else {
            urlInput.classList.add('invalid');
        }
    });
});
edit filepath: public/index.css
content: body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #000; /* Dark background for encryption theme */
    color: #fff;
    overflow: hidden; /* Hide scrollbars */
}

.container {
    width: 80%;
    max-width: 800px;
    margin: 50px auto;
    background-color: rgba(30, 30, 30, 0.8); /* Semi-transparent dark container */
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.header {
    margin-bottom: 30px;
}

.header i {
    color: #00bcd4; /* Encryption-themed color */
    margin-right: 10px;
}

.header h1 {
    font-size: 2.5em;
    color: #00bcd4; /* Encryption-themed color */
}

.input-area {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.input-area input[type="text"] {
    padding: 12px;
    width: 70%;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    background-color: #444;
    color: #fff;
}

.input-area input[type="text"].invalid {
    border: 2px solid #f44336;
}

.input-area button {
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    background-color: #00bcd4; /* Encryption-themed color */
    color: #fff;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.input-area button:hover {
    background-color: #008ba7;
}

.content-area {
    background-color: #222;
    padding: 20px;
    border-radius: 5px;
    color: #eee;
    text-align: left;
    overflow-wrap: break-word;
    min-height: 100px;
}

.loader {
    border: 5px solid #f3f3f3; /* Light grey */
    border-top: 5px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
    margin: 20px auto;
}

.error, .warning {
    color: #f44336;
    padding: 10px;
    background-color: #333;
    border-radius: 5px;
    margin-top: 10px;
}

/* Particles.js styles */
#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
}

/* Keyframes for loader animation */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
edit filepath: api/proxy.js
content: const https = require('https');
const http = require('http');
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_encryption_key'; // Use environment variable
const IV_LENGTH = 16;

// Function to encrypt data
function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt data
function decrypt(text) {
    try {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}


module.exports = (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('URL parameter is required');
    }

    try {
        const targetURL = new URL(url);
        const protocol = targetURL.protocol === 'https:' ? https : http;

        protocol.get(url, (proxyRes) => {
            let rawData = '';

            proxyRes.on('data', (chunk) => {
                rawData += chunk;
            });

            proxyRes.on('end', () => {
                try {
                    const encryptedData = encrypt(rawData);
                    res.writeHead(200, { 'Content-Type': 'text/plain' }); // Return as plain text
                    res.end(encryptedData);
                } catch (e) {
                    console.error("Error encrypting response:", e);
                    res.status(500).send('Error encrypting response');
                }
            });
        }).on('error', (e) => {
            console.error("Got error: ", e);
            res.status(500).send('Proxy error: ' + e.message);
        });

    } catch (e) {
        console.error("Error with URL:", e);
        res.status(400).send('Invalid URL: ' + e.message);
    }
};