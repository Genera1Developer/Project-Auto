function loadSettings() {
    try {
        const settingsJSON = localStorage.getItem('proxySettings');
        if (settingsJSON) {
            const settings = JSON.parse(settingsJSON);
            document.getElementById('proxyHost').value = settings.proxyHost || 'localhost';
            document.getElementById('proxyPort').value = settings.proxyPort || '8080';
            document.getElementById('encryptionType').value = settings.encryptionType || 'none';

            const encryptionTypeSelect = document.getElementById('encryptionType');
            encryptionTypeSelect.dispatchEvent(new Event('change'));

            document.getElementById('certificatePath').value = settings.certificatePath || '';
            document.getElementById('customEncryptionAlgo').value = settings.customEncryptionAlgo || '';
            document.getElementById('sessionEncryption').checked = settings.sessionEncryption === true; // Handle boolean
        }
    } catch (error) {
        console.error("Error loading settings:", error);
        document.getElementById('generalError').textContent = 'Error loading settings. Please check console.';
    }
}

document.addEventListener('DOMContentLoaded', loadSettings);

function saveSettings() {
    var proxyHost = document.getElementById('proxyHost').value;
    var proxyPort = document.getElementById('proxyPort').value;
    var encryptionType = document.getElementById('encryptionType').value;
    var certificatePath = document.getElementById('certificatePath').value;
    var customEncryptionAlgo = document.getElementById('customEncryptionAlgo').value;
    var sessionEncryption = document.getElementById('sessionEncryption').checked; // Get boolean value

    document.getElementById('generalError').textContent = '';
    document.getElementById('certificatePathError').textContent = '';
    document.getElementById('customEncryptionAlgoError').textContent = '';

    let hasErrors = false;

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
        return;
    }

    var settings = {
        proxyHost: proxyHost,
        proxyPort: proxyPort,
        encryptionType: encryptionType,
        certificatePath: certificatePath,
        customEncryptionAlgo: customEncryptionAlgo,
        sessionEncryption: sessionEncryption // Save boolean
    };

    var settingsJSON = JSON.stringify(settings);
    localStorage.setItem('proxySettings', settingsJSON);

    alert('Settings saved!');
}

edit filepath: public/settings.html
content: 
<!DOCTYPE html>
<html>
<head>
    <title>Proxy Settings</title>
    <style>
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
            box-sizing: border-box;
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
    </style>
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

        <label for="sessionEncryption">Session Encryption:</label>
        <input type="checkbox" id="sessionEncryption" name="sessionEncryption">
    </div>

    <button onclick="saveSettings()">Save Settings</button>
    <div id="generalError" class="error-message"></div>

    <script src="settings.js"></script>
    <script>
        document.getElementById('encryptionType').addEventListener('change', function() {
            var encryptionType = this.value;
            document.getElementById('certificatePath').disabled = (encryptionType !== 'ssl');
            document.getElementById('customEncryptionAlgo').disabled = (encryptionType !== 'custom');

            document.getElementById('certificatePathError').textContent = '';
            document.getElementById('customEncryptionAlgoError').textContent = '';
        });
    </script>
</body>
</html>

edit filepath: api/securityHeaders.js
content: 
function addSecurityHeaders(res) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
}

module.exports = { addSecurityHeaders };

edit filepath: api/encryption.js
content: 
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // 256 bits
const iv = crypto.randomBytes(16); // Initialization vector, 128 bits

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = { encrypt, decrypt };