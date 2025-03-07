document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings when the page loads
    loadSettings();

    document.getElementById('encryptionType').addEventListener('change', function() {
        var encryptionType = this.value;
        document.getElementById('certificatePath').disabled = (encryptionType !== 'ssl');
        document.getElementById('customEncryptionAlgo').disabled = (encryptionType !== 'custom');

        // Clear error messages when encryption type changes
        document.getElementById('certificatePathError').textContent = '';
        document.getElementById('customEncryptionAlgoError').textContent = '';
    });
});

function saveSettings() {
    var proxyHost = document.getElementById('proxyHost').value;
    var proxyPort = document.getElementById('proxyPort').value;
    var encryptionType = document.getElementById('encryptionType').value;
    var certificatePath = document.getElementById('certificatePath').value;
    var customEncryptionAlgo = document.getElementById('customEncryptionAlgo').value;
    var sessionEncryption = document.getElementById('sessionEncryption').checked; // New setting

    // Clear all error messages
    document.getElementById('generalError').textContent = '';
    document.getElementById('certificatePathError').textContent = '';
    document.getElementById('customEncryptionAlgoError').textContent = '';

    let hasErrors = false;

    // Basic validation (can be improved)
    if (!proxyHost || !proxyPort) {
        document.getElementById('generalError').textContent = 'Proxy Host and Port are required.';
        hasErrors = true;
    }

    if (encryptionType === 'ssl' && !certificatePath) {
        document.getElementById('certificatePathError').textContent = 'Certificate path is required for SSL/TLS encryption.';
        hasErrors = true;
    }

    if (encryptionType === 'custom' && !customEncryptionAlgo) {
        document.getElementById('customEncryptionAlgoError').textContent = 'Custom encryption algorithm is required.';
        hasErrors = true;
    }

    if (hasErrors) {
        return; // Stop saving if there are errors
    }


    var settings = {
        proxyHost: proxyHost,
        proxyPort: proxyPort,
        encryptionType: encryptionType,
        certificatePath: certificatePath,
        customEncryptionAlgo: customEncryptionAlgo,
        sessionEncryption: sessionEncryption // Include the new setting
    };

    // Convert settings to JSON
    var settingsJSON = JSON.stringify(settings);

    // Store the settings (e.g., localStorage, cookies, or send to server)
    localStorage.setItem('proxySettings', settingsJSON);

    alert('Settings saved!');
}

function loadSettings() {
    var settingsJSON = localStorage.getItem('proxySettings');

    if (settingsJSON) {
        var settings = JSON.parse(settingsJSON);

        document.getElementById('proxyHost').value = settings.proxyHost || 'localhost';
        document.getElementById('proxyPort').value = settings.proxyPort || '8080';
        document.getElementById('encryptionType').value = settings.encryptionType || 'none';
        document.getElementById('certificatePath').value = settings.certificatePath || '';
        document.getElementById('customEncryptionAlgo').value = settings.customEncryptionAlgo || '';
        document.getElementById('sessionEncryption').checked = settings.sessionEncryption === true; // Load boolean

        // Trigger the change event to update disabled states
        var encryptionTypeSelect = document.getElementById('encryptionType');
        encryptionTypeSelect.dispatchEvent(new Event('change'));
    }
}

edit filepath: public/settings.html
content: 
<!DOCTYPE html>
<html>
<head>
    <title>Proxy Settings</title>
    <link rel="stylesheet" href="theme/settings.css">
</head>
<body>
    <h1>Proxy Settings</h1>

    <div class="settings-group">
        <h2>General Settings</h2>
        <label for="proxyHost">Proxy Host:</label>
        <input type="text" id="proxyHost" name="proxyHost" value="localhost">

        <label for="proxyPort">Proxy Port:</label>
        <input type="number" id="proxyPort" name="proxyPort" value="8080">
    </div>

    <div class="settings-group">
        <h2>Encryption Settings</h2>
        <label for="encryptionType">Encryption Type:</label>
        <select id="encryptionType" name="encryptionType">
            <option value="none">None</option>
            <option value="ssl">SSL/TLS</option>
            <option value="custom">Custom</option>
        </select>

        <label for="certificatePath">Certificate Path (for SSL/TLS):</label>
        <input type="text" id="certificatePath" name="certificatePath" placeholder="Path to certificate" disabled>
        <div id="certificatePathError" class="error-message"></div>

        <label for="customEncryptionAlgo">Custom Encryption Algorithm:</label>
        <input type="text" id="customEncryptionAlgo" name="customEncryptionAlgo" placeholder="Algorithm name" disabled>
         <div id="customEncryptionAlgoError" class="error-message"></div>

         <label for="sessionEncryption">Enable Session Encryption:</label>
         <input type="checkbox" id="sessionEncryption" name="sessionEncryption">
    </div>

    <button onclick="saveSettings()">Save Settings</button>
    <div id="generalError" class="error-message"></div>

    <script src="settings.js"></script>
</body>
</html>

edit filepath: public/theme/settings.css
content: 
body {
    font-family: sans-serif;
    margin: 20px;
}
label {
    display: block;
    margin-bottom: 5px;
}
input[type="text"], input[type="number"], select {
    width: 250px;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box; /* Important for consistent sizing */
}
button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
button:hover {
    background-color: #3e8e41;
}
.settings-group {
    margin-bottom: 20px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
}
.settings-group h2 {
    margin-top: 0;
    font-size: 1.2em;
}
.error-message {
    color: red;
    margin-top: 5px;
}

edit filepath: api/security.js
content: 
const crypto = require('crypto');

// Function to generate a secure random key
function generateRandomKey(length) {
    return crypto.randomBytes(length).toString('hex');
}

// Function to encrypt data using AES
function encrypt(data, key) {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Function to decrypt data using AES
function decrypt(data, key, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(data, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Function to hash data using SHA256
function hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Function to generate a secure session ID
function generateSessionId() {
    return generateRandomKey(32); // 32 bytes = 256 bits
}

module.exports = {
    generateRandomKey,
    encrypt,
    decrypt,
    hash,
    generateSessionId
};

edit filepath: api/proxy.js
content: 
const https = require('https');
const http = require('http');
const { URL } = require('url');
const security = require('./security'); // Import security functions

async function handleProxyRequest(req, res, settings) {
    try {
        const targetURL = req.url.slice(1); // Remove the leading slash
        if (!targetURL) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Target URL is missing.');
            return;
        }

        const parsedURL = new URL(targetURL);
        const options = {
            hostname: parsedURL.hostname,
            path: parsedURL.pathname + parsedURL.search,
            method: req.method,
            headers: req.headers,
        };

        // Choose http or https agent based on the target protocol
        const protocol = parsedURL.protocol === 'https:' ? https : http;

        const proxyReq = protocol.request(options, (proxyRes) => {
            let responseData = [];

            proxyRes.on('data', (chunk) => {
                responseData.push(chunk);
            });

            proxyRes.on('end', async () => {
                let buffer = Buffer.concat(responseData);
                let responseBody = buffer.toString();

                // Apply encryption if enabled in settings
                if (settings && settings.encryptionType === 'custom') {
                    const encryptionKey = 'your_encryption_key'; // Replace with secure key management
                    const encryptedData = security.encrypt(responseBody, encryptionKey);
                    responseBody = JSON.stringify(encryptedData); // Send encrypted data as JSON
                    proxyRes.headers['content-type'] = 'application/json'; // Update content type
                }

                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                res.end(responseBody);
            });
        });

        proxyReq.on('error', (err) => {
            console.error('Proxy request error:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Proxy request failed.');
        });

        req.on('data', (chunk) => {
            proxyReq.write(chunk);
        });

        req.on('end', () => {
            proxyReq.end();
        });

        req.on('error', (err) => {
            console.error('Client request error:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Client request failed.');
        });

    } catch (error) {
        console.error('Error handling proxy request:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error.');
    }
}

module.exports = { handleProxyRequest };

edit filepath: server.js
content: 
const http = require('http');
const { handleProxyRequest } = require('./api/proxy');
const security = require('./api/security');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

// Load settings from a file (or use defaults)
let settings = {
    proxyHost: 'localhost',
    proxyPort: 8080,
    encryptionType: 'none',
    certificatePath: '',
    customEncryptionAlgo: '',
    sessionEncryption: false
};

try {
    const settingsData = fs.readFileSync('settings.json');
    settings = JSON.parse(settingsData);
} catch (err) {
    console.log('No settings.json file found or invalid format, using default settings.');
}

const server = http.createServer((req, res) => {
    // Basic request logging
    console.log(`Received request for: ${req.url}`);

    // Add security headers (example)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains'); // HTTPS only

    // Handle the proxy request
    handleProxyRequest(req, res, settings);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// Example usage of security functions (for testing/demo purposes)
const randomKey = security.generateRandomKey(32);
console.log('Generated Random Key:', randomKey);

edit filepath: settings.json
content: 
{
    "proxyHost": "localhost",
    "proxyPort": 8080,
    "encryptionType": "ssl",
    "certificatePath": "/path/to/your/certificate.pem",
    "customEncryptionAlgo": "AES-256-CBC",
    "sessionEncryption": true
}

edit filepath: public/script.js
content: 
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('proxyForm');
    const urlInput = document.getElementById('url');
    const goButton = document.getElementById('goButton');
    const settingsButton = document.getElementById('settingsButton');
    const outputDiv = document.getElementById('output');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const url = urlInput.value;
        if (!url) {
            outputDiv.textContent = 'Please enter a URL.';
            return;
        }

        // Sanitize URL (basic check, more robust validation needed for production)
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            outputDiv.textContent = 'Invalid URL. Must start with http:// or https://';
            return;
        }

        // Construct the proxy URL (assuming your proxy runs on the same domain)
        const proxyUrl = '/' + url; // Prepend slash

        // Fetch content through the proxy
        fetch(proxyUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text(); // Get the response as text
            })
            .then(data => {
                outputDiv.textContent = data; // Display the fetched content
            })
            .catch(error => {
                console.error('Fetch error:', error);
                outputDiv.textContent = 'Failed to load content. Check the console for errors.';
            });
    });

    settingsButton.addEventListener('click', function() {
        window.location.href = 'settings.html'; // Navigate to settings page
    });
});