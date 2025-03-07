const crypto = require('crypto');

// Function to generate a random key of a specific length (for AES encryption)
function generateRandomKey(length) {
    return crypto.randomBytes(length).toString('hex'); // Returns a hex-encoded string
}

// Function to encrypt data using AES-256-CBC
function encrypt(data, key) {
    try {
        const iv = crypto.randomBytes(16); // Initialization vector
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted.toString('hex')
        };
    } catch (err) {
        console.error('Encryption error:', err);
        return null; // Or throw the error, depending on desired behavior
    }
}

// Function to decrypt data using AES-256-CBC
function decrypt(data, key) {
    try {
        const iv = Buffer.from(data.iv, 'hex');
        const encryptedText = Buffer.from(data.encryptedData, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (err) {
        console.error('Decryption error:', err);
        return null; // Or throw the error, depending on desired behavior
    }
}

// Function to generate a secure session ID
function generateSessionId() {
    return crypto.randomBytes(32).toString('hex'); // Returns a 64-character hex string
}

// Function to hash data (e.g., for password storage)
function hashData(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

module.exports = {
    generateRandomKey,
    encrypt,
    decrypt,
    generateSessionId,
    hashData
};

edit filepath: settings.json
content: 
{
    "proxyHost": "localhost",
    "proxyPort": 8080,
    "encryptionType": "aes",
    "certificatePath": "/path/to/your/certificate.pem",
    "customEncryptionAlgo": "AES-256-CBC",
    "sessionEncryption": true
}

edit filepath: public/settings.js
content: 
document.addEventListener('DOMContentLoaded', function() {
    const settingsForm = document.getElementById('settingsForm');
    const proxyHostInput = document.getElementById('proxyHost');
    const proxyPortInput = document.getElementById('proxyPort');
    const encryptionTypeSelect = document.getElementById('encryptionType');
    const sessionEncryptionCheckbox = document.getElementById('sessionEncryption');
    const saveButton = document.getElementById('saveButton');
    const messageDiv = document.getElementById('message');

    // Load settings from local storage
    function loadSettings() {
        proxyHostInput.value = localStorage.getItem('proxyHost') || 'localhost';
        proxyPortInput.value = localStorage.getItem('proxyPort') || '8080';
        encryptionTypeSelect.value = localStorage.getItem('encryptionType') || 'none';
        sessionEncryptionCheckbox.checked = localStorage.getItem('sessionEncryption') === 'true';
    }

    loadSettings(); // Load settings on page load

    settingsForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const proxyHost = proxyHostInput.value;
        const proxyPort = proxyPortInput.value;
        const encryptionType = encryptionTypeSelect.value;
        const sessionEncryption = sessionEncryptionCheckbox.checked;

        // Save settings to local storage
        localStorage.setItem('proxyHost', proxyHost);
        localStorage.setItem('proxyPort', proxyPort);
        localStorage.setItem('encryptionType', encryptionType);
        localStorage.setItem('sessionEncryption', sessionEncryption);

        messageDiv.textContent = 'Settings saved!';
        messageDiv.style.color = 'green';

        // Clear message after 3 seconds
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 3000);
    });
});

edit filepath: public/settings.html
content: 
<!DOCTYPE html>
<html>
<head>
    <title>Proxy Settings</title>
    <link rel="stylesheet" href="theme/default.css">
    <link rel="stylesheet" href="theme/settings.css">
</head>
<body>
    <h1>Proxy Settings</h1>
    <form id="settingsForm">
        <label for="proxyHost">Proxy Host:</label>
        <input type="text" id="proxyHost" name="proxyHost" required><br><br>

        <label for="proxyPort">Proxy Port:</label>
        <input type="number" id="proxyPort" name="proxyPort" required><br><br>

        <label for="encryptionType">Encryption Type:</label>
        <select id="encryptionType" name="encryptionType">
            <option value="none">None</option>
            <option value="aes">AES</option>
            <!-- Add more encryption types as needed -->
        </select><br><br>

        <label for="sessionEncryption">Session Encryption:</label>
        <input type="checkbox" id="sessionEncryption" name="sessionEncryption"><br><br>

        <button type="submit" id="saveButton">Save Settings</button>
    </form>
    <div id="message"></div>
    <script src="settings.js"></script>
</body>
</html>

edit filepath: public/theme/settings.css
content: 
/* settings.css */

body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 20px;
}

h1 {
    color: #333;
}

form {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 400px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input[type="text"],
input[type="number"],
select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box; /* Ensures padding doesn't affect width */
}

button {
    background-color: #5cb85c;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #449d44;
}

#message {
    margin-top: 10px;
    font-weight: bold;
}

edit filepath: api/config.js
content: 
const fs = require('fs');

const configFilePath = 'config.json';

let config = {
    proxyHost: 'localhost',
    proxyPort: 8080,
    encryptionType: 'none',
    sessionEncryption: false,
    // Add other configuration options here
};

// Function to load configuration from file
function loadConfig() {
    try {
        const data = fs.readFileSync(configFilePath, 'utf8');
        config = JSON.parse(data);
    } catch (error) {
        console.warn(`Error loading config from ${configFilePath}: ${error.message}. Using default config.`);
        // Optionally, create the file with default config
        saveConfig();
    }
}

// Function to save configuration to file
function saveConfig() {
    try {
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf8');
        console.log(`Config saved to ${configFilePath}`);
    } catch (error) {
        console.error(`Error saving config to ${configFilePath}: ${error.message}`);
    }
}

// Initialize config on startup
loadConfig();

module.exports = {
    getConfig: () => config,
    setConfig: (newConfig) => {
        config = { ...config, ...newConfig };
        saveConfig();
    },
};

edit filepath: public/error.html
content: 
<!DOCTYPE html>
<html>
<head>
    <title>Proxy Error</title>
    <link rel="stylesheet" href="theme/default.css">
</head>
<body>
    <h1>Proxy Error</h1>
    <p id="errorMessage">An error occurred while processing your request.</p>
    <script>
        // Get the error message from the URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const errorMessage = urlParams.get('message');

        // Display the error message in the paragraph
        if (errorMessage) {
            document.getElementById('errorMessage').textContent = decodeURIComponent(errorMessage);
        }
    </script>
</body>
</html>

edit filepath: logs/logs.js
content: 
function displayLogs() {
    fetch('logs.txt') // Assuming the log file is named 'logs.txt'
        .then(response => response.text())
        .then(data => {
            document.getElementById('logContent').innerText = data;
        })
        .catch(error => {
            console.error('Error fetching logs:', error);
            document.getElementById('logContent').innerText = 'Error loading logs.';
        });
}

document.addEventListener('DOMContentLoaded', function() {
    displayLogs(); // Call displayLogs function on page load
    // Refresh logs every 5 seconds (adjust as needed)
    setInterval(displayLogs, 5000);
});
edit filepath: public/theme/logs.css
content: 
#logContent {
    font-family: monospace;
    white-space: pre-wrap;
    background-color: #f0f0f0;
    padding: 10px;
    border: 1px solid #ccc;
    margin-top: 10px;
    overflow-x: auto;
}
edit filepath: logs/logs.html
content: 
<!DOCTYPE html>
<html>
<head>
    <title>Proxy Logs</title>
    <link rel="stylesheet" href="../public/theme/default.css">
    <link rel="stylesheet" href="../public/theme/logs.css">
</head>
<body>
    <h1>Proxy Logs</h1>
    <div id="logContent">
        Loading logs...
    </div>
    <script src="logs.js"></script>
</body>
</html>