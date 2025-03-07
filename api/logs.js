import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '../logs/proxy.log');

export function logRequest(req, res, url) {
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${url} - ${res.statusCode}\n`;
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

export function getLogs() {
    try {
        const logs = fs.readFileSync(logFilePath, 'utf8');
        return logs.split('\n').filter(log => log.trim() !== '').reverse();
    } catch (err) {
        console.error('Error reading log file:', err);
        return [];
    }
}

export function clearLogs() {
    try {
        fs.writeFileSync(logFilePath, '', 'utf8');
    } catch (err) {
        console.error('Error clearing log file:', err);
    }
}

edit filepath: public/settings.js
content: document.addEventListener('DOMContentLoaded', function() {
    const clearLogsButton = document.getElementById('clearLogs');

    if (clearLogsButton) {
        clearLogsButton.addEventListener('click', function() {
            fetch('/api/logs/clear', {
                method: 'POST',
            })
            .then(response => {
                if (response.ok) {
                    alert('Logs cleared successfully!');
                } else {
                    alert('Failed to clear logs.');
                }
            })
            .catch(error => {
                console.error('Error clearing logs:', error);
                alert('An error occurred while clearing logs.');
            });
        });
    }
});
edit filepath: api/encryption.js
content: import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text) {
    try {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}
edit filepath: api/middleware.js
content: import { attachSession } from './session.js';
import { logRequest } from './logs.js';
import { addSecurityHeaders } from './security.js';

export function applyMiddleware(app) {
    app.use((req, res, next) => {
        attachSession(req, res);
        addSecurityHeaders(res);
        next();
    });
}

export function applyRequestLogging(app) {
    app.use((req, res, next) => {
        const originalSend = res.send;

        res.send = function (body) {
            logRequest(req, res, req.originalUrl);
            originalSend.call(this, body);
        };
        next();
    });
}
edit filepath: public/settings.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Proxy Settings</title>
    <link rel="stylesheet" href="/theme/settings.css">
</head>
<body>
    <h1>Settings</h1>
    <button id="clearLogs">Clear Logs</button>
    <script src="/settings.js"></script>
</body>
</html>
edit filepath: logs/logs.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Proxy Logs</title>
</head>
<body>
    <h1>Proxy Logs</h1>
    <div id="logs"></div>
    <script src="/logs.js"></script>
</body>
</html>
edit filepath: server.js
content: import express from 'express';
import cookieParser from 'cookie-parser';
import { applyMiddleware, applyRequestLogging } from './api/middleware.js';
import { getLogs, clearLogs } from './api/logs.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
applyMiddleware(app);
applyRequestLogging(app);
app.use(express.static('public'));
app.use(express.json());

app.get('/api/logs', (req, res) => {
    const logs = getLogs();
    res.json(logs);
});

app.post('/api/logs/clear', (req, res) => {
    clearLogs();
    res.sendStatus(200);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
edit filepath: encryption/key_manager.js
content: import crypto from 'crypto';
import fs from 'fs';

const keyFilePath = 'encryption/keys.json';

function generateKey() {
    return crypto.randomBytes(32).toString('hex');
}

function loadKeys() {
    try {
        const data = fs.readFileSync(keyFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading keys:", error);
        return {};
    }
}

function saveKeys(keys) {
    try {
        fs.writeFileSync(keyFilePath, JSON.stringify(keys, null, 2), 'utf8');
    } catch (error) {
        console.error("Error saving keys:", error);
    }
}

export function getKey(keyId) {
    const keys = loadKeys();
    if (!keys[keyId]) {
        console.warn(`Key with ID ${keyId} not found. Generating a new key.`);
        keys[keyId] = generateKey();
        saveKeys(keys);
    }
    return keys[keyId];
}

export function rotateKey(keyId) {
    const keys = loadKeys();
    const newKey = generateKey();
    keys[keyId] = newKey;
    saveKeys(keys);
    return newKey;
}

// Initialize keys file if it doesn't exist
if (!fs.existsSync(keyFilePath)) {
    saveKeys({});
}
edit filepath: uv/codec.js
content: import { subtle, getRandomValues } from 'crypto';

async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    const key = await subtle.deriveKey(
        {
            "name": "PBKDF2",
            salt: enc.encode(salt),
            iterations: 10000,
            hash: "SHA-256"
        },
        keyMaterial,
        { "name": "AES-GCM", "length": 256 },
        true,
        ["encrypt", "decrypt"]
    );
    return key;
}


export async function encode(str, key = null, salt = null) {
    try {
        const utf8Encode = new TextEncoder();
        const encoded = utf8Encode.encode(str);

        if (key && salt) {
            const iv = getRandomValues(new Uint8Array(12));
            const cryptoKey = await deriveKey(key, salt);
            const encrypted = await subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                cryptoKey,
                encoded
            );

            const combined = new Uint8Array(iv.length + encrypted.byteLength);
            combined.set(iv, 0);
            combined.set(new Uint8Array(encrypted), iv.length);

            return btoa(String.fromCharCode(...Array.from(combined)));

        }


        return btoa(String.fromCharCode(...Array.from(encoded)));
    } catch (e) {
        console.error("Encoding error:", e);
        return null;
    }
}

export async function decode(str, key = null, salt = null) {
    try {
        const binaryString = atob(str);
        let bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        if (key && salt) {
            const iv = bytes.slice(0, 12);
            const encrypted = bytes.slice(12);

            const cryptoKey = await deriveKey(key, salt);

            const decrypted = await subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                cryptoKey,
                encrypted
            );

            const utf8Decode = new TextDecoder();
            return utf8Decode.decode(decrypted);
        }


        const utf8Decode = new TextDecoder();
        return utf8Decode.decode(bytes);

    } catch (e) {
        console.error("Decoding error:", e);
        return null;
    }
}