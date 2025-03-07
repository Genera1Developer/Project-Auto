document.addEventListener('DOMContentLoaded', function() {
    // Load settings from localStorage when the page loads
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
        customEncryptionAlgo: customEncryptionAlgo
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

        // Trigger the change event to update the disabled states
        var encryptionTypeSelect = document.getElementById('encryptionType');
        encryptionTypeSelect.dispatchEvent(new Event('change'));

        document.getElementById('certificatePath').value = settings.certificatePath || '';
        document.getElementById('customEncryptionAlgo').value = settings.customEncryptionAlgo || '';
    }
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
    </div>

    <button onclick="saveSettings()">Save Settings</button>
    <div id="generalError" class="error-message"></div>

    <script src="settings.js"></script>
</body>
</html>