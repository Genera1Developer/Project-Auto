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

    // Store the settings securely (e.g., using encryption) before storing in localStorage
    encryptAndStoreSettings(settingsJSON);


    alert('Settings saved!');
}


function loadSettings() {
    // Retrieve settings, decrypt if necessary
    const encryptedSettings = localStorage.getItem('proxySettings');

    if (encryptedSettings) {
        // Decrypt settings before using
        const settingsJSON = decryptSettings(encryptedSettings);

        if(settingsJSON){
          try {
              const settings = JSON.parse(settingsJSON);

              document.getElementById('proxyHost').value = settings.proxyHost || 'localhost';
              document.getElementById('proxyPort').value = settings.proxyPort || '8080';
              document.getElementById('encryptionType').value = settings.encryptionType || 'none';

              // Trigger the change event to update disabled states
              let encryptionTypeSelect = document.getElementById('encryptionType');
              encryptionTypeSelect.dispatchEvent(new Event('change'));

              document.getElementById('certificatePath').value = settings.certificatePath || '';
              document.getElementById('customEncryptionAlgo').value = settings.customEncryptionAlgo || '';
          } catch (error) {
              console.error('Error parsing settings JSON:', error);
              alert('Error loading settings.');
          }
        } else {
          console.error("Failed to decrypt settings")
          alert('Failed to load settings: Decryption error')
        }
    }
}

// Placeholder functions for encryption/decryption
function encryptAndStoreSettings(settingsJSON) {
    // In a real application, use a secure encryption method like AES
    // and store the initialization vector (IV) securely as well.
    const key = "YOUR_ENCRYPTION_KEY"; // Replace with a real key management system
    const encryptedSettings = CryptoJS.AES.encrypt(settingsJSON, key).toString();
    localStorage.setItem('proxySettings', encryptedSettings);
}

function decryptSettings(encryptedSettings) {
    // Use the same encryption key and method to decrypt
    const key = "YOUR_ENCRYPTION_KEY"; // Replace with a real key management system
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedSettings, key).toString(CryptoJS.enc.Utf8);
        return decrypted;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }

}

edit filepath: public/index.html
content: 
<!DOCTYPE html>
<html>
<head>
    <title>Web Proxy</title>
    <link rel="stylesheet" href="theme/default.css">
    <style>
        body {
            font-family: sans-serif;
            margin: 20px;
        }
        #urlInput {
            width: 70%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        #proxyButton {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #proxyButton:hover {
            background-color: #3e8e41;
        }
        #outputFrame {
            width: 100%;
            height: 500px;
            border: 1px solid #ccc;
        }
        .error-message {
            color: red;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <h1>Web Proxy</h1>
    <input type="text" id="urlInput" placeholder="Enter URL">
    <button id="proxyButton">Go</button>
    <div id="urlError" class="error-message"></div>
    <iframe id="outputFrame"></iframe>

    <script>
        document.getElementById('proxyButton').addEventListener('click', function() {
            var url = document.getElementById('urlInput').value;
            document.getElementById('urlError').textContent = ''; // Clear previous errors

            if (!url) {
                document.getElementById('urlError').textContent = 'Please enter a URL.';
                return;
            }

            // Validate URL format (basic check)
            if (!isValidURL(url)) {
                document.getElementById('urlError').textContent = 'Please enter a valid URL (e.g., https://www.example.com).';
                return;
            }

            // Load proxy settings from localStorage
            let settings = getProxySettings();

            if (!settings) {
                document.getElementById('urlError').textContent = 'Proxy settings not found. Please configure them in settings page.';
                return;
            }

            // Construct the proxy URL based on settings
            let proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`; // Adjust the endpoint as needed

            // Load the URL in the iframe
            document.getElementById('outputFrame').src = proxyUrl;
        });

        function isValidURL(url) {
            try {
                new URL(url);
                return true;
            } catch (_) {
                return false;
            }
        }

        function getProxySettings() {
          let encryptedSettings = localStorage.getItem('proxySettings');
          if (encryptedSettings) {
            const settingsJSON = decryptSettings(encryptedSettings);
            try {
              return JSON.parse(settingsJSON);
            } catch (error) {
              console.error("Error parsing settings:", error)
              return null;
            }
          }
          return null;
        }

        function decryptSettings(encryptedSettings) {
            // Use the same encryption key and method to decrypt
            const key = "YOUR_ENCRYPTION_KEY"; // Replace with a real key management system
            try {
                const decrypted = CryptoJS.AES.decrypt(encryptedSettings, key).toString(CryptoJS.enc.Utf8);
                return decrypted;
            } catch (error) {
                console.error("Decryption error:", error);
                return null;
            }

        }
    </script>
    <script src="script.js"></script>
</body>
</html>

edit filepath: public/script.js
content: 
// Placeholder for global scripts, if any.  Can be used for general UI enhancements.
console.log("Script loaded");

edit filepath: api/security.js
content: 
const crypto = require('crypto');

// Function to generate a secure random key
function generateSecretKey(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Function to encrypt data using AES-256-CBC
function encrypt(data, key) {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Function to decrypt data using AES-256-CBC
function decrypt(data, key, iv) {
  const ivBuffer = Buffer.from(iv, 'hex');
  const encryptedDataBuffer = Buffer.from(data, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), ivBuffer);
  let decrypted = decipher.update(encryptedDataBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Function to hash data using SHA-256
function hashData(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

module.exports = {
  generateSecretKey,
  encrypt,
  decrypt,
  hashData,
};

edit filepath: api/proxy.js
content: 
const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');
const { encrypt, decrypt, generateSecretKey } = require('./security');

// Generate a unique encryption key for this session.  In a real
// application, you'd want to manage these keys more carefully.
const encryptionKey = generateSecretKey();

// Proxy endpoint
router.get('/proxy', (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL parameter is required');
    }

    // Determine whether to use http or https
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (proxyRes) => {
        let data = '';

        proxyRes.on('data', (chunk) => {
            data += chunk;
        });

        proxyRes.on('end', () => {
            // Encrypt the data before sending it to the client
            const encryptedData = encrypt(data, encryptionKey);

            // Send the encrypted data and the IV to the client
            res.json({
                iv: encryptedData.iv,
                data: encryptedData.encryptedData
            });
        });

    }).on('error', (err) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
    });
});

module.exports = router;

edit filepath: server.js
content: 
const express = require('express');
const app = express();
const proxyRoute = require('./api/proxy');
const securityRoute = require('./api/security');
const path = require('path');

const port = 3000;

// Middleware to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API route for proxy functionality
app.use('/api', proxyRoute);

// API route for security utilities
app.use('/api', securityRoute);

// Route to serve settings.html
app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

edit filepath: public/aes-encryption.js
content: 
// aes-encryption.js
// Client-side AES encryption and decryption functions using CryptoJS

function aesEncrypt(message, secretKey) {
    try {
        const key = CryptoJS.enc.Utf8.parse(secretKey);
        const iv = CryptoJS.lib.WordArray.random(16); // Generate a random IV
        const encrypted = CryptoJS.AES.encrypt(message, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        // Combine IV and ciphertext for transmission
        const ivString = CryptoJS.enc.Base64.stringify(iv);
        const ciphertextString = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
        return ivString + ":" + ciphertextString;  // Return IV and Ciphertext

    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
}

function aesDecrypt(encryptedMessage, secretKey) {
    try {
        const key = CryptoJS.enc.Utf8.parse(secretKey);
        const parts = encryptedMessage.split(':');
        const ivString = parts[0];
        const ciphertextString = parts[1];

        const iv = CryptoJS.enc.Base64.parse(ivString);
        const ciphertext = CryptoJS.enc.Base64.parse(ciphertextString);

        const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

edit filepath: public/index.html
content: 
<!DOCTYPE html>
<html>
<head>
    <title>Web Proxy</title>
    <link rel="stylesheet" href="theme/default.css">
    <style>
        body {
            font-family: sans-serif;
            margin: 20px;
        }
        #urlInput {
            width: 70%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        #proxyButton {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #proxyButton:hover {
            background-color: #3e8e41;
        }
        #outputFrame {
            width: 100%;
            height: 500px;
            border: 1px solid #ccc;
        }
        .error-message {
            color: red;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <h1>Web Proxy</h1>
    <input type="text" id="urlInput" placeholder="Enter URL">
    <button id="proxyButton">Go</button>
    <div id="urlError" class="error-message"></div>
    <iframe id="outputFrame"></iframe>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    <script src="aes-encryption.js"></script>
    <script>
        document.getElementById('proxyButton').addEventListener('click', function() {
            var url = document.getElementById('urlInput').value;
            document.getElementById('urlError').textContent = ''; // Clear previous errors

            if (!url) {
                document.getElementById('urlError').textContent = 'Please enter a URL.';
                return;
            }

            // Validate URL format (basic check)
            if (!isValidURL(url)) {
                document.getElementById('urlError').textContent = 'Please enter a valid URL (e.g., https://www.example.com).';
                return;
            }

            // Load proxy settings from localStorage
            let settings = getProxySettings();

            if (!settings) {
                document.getElementById('urlError').textContent = 'Proxy settings not found. Please configure them in settings page.';
                return;
            }

            // Construct the proxy URL based on settings
            let proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`; // Adjust the endpoint as needed

            // Fetch the encrypted content from the server
            fetch(proxyUrl)
                .then(response => response.json())
                .then(data => {
                    if (data && data.iv && data.data) {
                        // Decrypt the data using client-side AES decryption
                        const secretKey = "YOUR_ENCRYPTION_KEY"; // Replace with a key from settings, or a derived key
                        const decryptedContent = aesDecrypt(data.iv + ":" + data.data, secretKey);

                        if (decryptedContent) {
                            // Set the content of the iframe
                            document.getElementById('outputFrame').srcdoc = decryptedContent;
                        } else {
                            document.getElementById('urlError').textContent = 'Failed to decrypt content.';
                        }
                    } else {
                        document.getElementById('urlError').textContent = 'Invalid response from proxy server.';
                    }
                })
                .catch(error => {
                    console.error('Error fetching proxy content:', error);
                    document.getElementById('urlError').textContent = 'Error fetching proxy content.';
                });
        });

        function isValidURL(url) {
            try {
                new URL(url);
                return true;
            } catch (_) {
                return false;
            }
        }

        function getProxySettings() {
          let encryptedSettings = localStorage.getItem('proxySettings');
          if (encryptedSettings) {
            const settingsJSON = decryptSettings(encryptedSettings);
            try {
              return JSON.parse(settingsJSON);
            } catch (error) {
              console.error("Error parsing settings:", error)
              return null;
            }
          }
          return null;
        }

        function decryptSettings(encryptedSettings) {
            // Use the same encryption key and method to decrypt
            const key = "YOUR_ENCRYPTION_KEY"; // Replace with a real key management system
            try {
                const decrypted = CryptoJS.AES.decrypt(encryptedSettings, key).toString(CryptoJS.enc.Utf8);
                return decrypted;
            } catch (error) {
                console.error("Decryption error:", error);
                return null;
            }

        }
    </script>
    <script src="script.js"></script>
</body>
</html>