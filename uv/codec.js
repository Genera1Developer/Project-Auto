import { subtle, getRandomValues } from 'crypto';

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
edit filepath: api/encryption.js
content: import { subtle, getRandomValues } from 'crypto';

async function generateSalt() {
    return getRandomValues(new Uint8Array(16));
}

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
            salt: salt,
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

export async function encryptData(data, password) {
    try {
        const salt = await generateSalt();
        const key = await deriveKey(password, salt);
        const encodedData = new TextEncoder().encode(data);
        const iv = getRandomValues(new Uint8Array(12));

        const encryptedContent = await subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encodedData
        );

        const combinedData = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
        combinedData.set(salt, 0);
        combinedData.set(iv, salt.length);
        combinedData.set(new Uint8Array(encryptedContent), salt.length + iv.length);

        return btoa(String.fromCharCode(...combinedData));

    } catch (error) {
        console.error("Encryption failed:", error);
        throw error;
    }
}

export async function decryptData(encryptedBase64, password) {
    try {
        const combinedData = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
        const salt = combinedData.slice(0, 16);
        const iv = combinedData.slice(16, 28);
        const encryptedContent = combinedData.slice(28);

        const key = await deriveKey(password, salt);

        const decryptedContent = await subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encryptedContent
        );

        return new TextDecoder().decode(decryptedContent);

    } catch (error) {
        console.error("Decryption failed:", error);
        throw error;
    }
}
edit filepath: api/proxy.js
content: import { createProxyMiddleware } from 'http-proxy-middleware';
import { encryptData, decryptData } from './encryption.js';
import { addSecurityHeaders } from './security.js';

const ENCRYPTION_PASSWORD = process.env.ENCRYPTION_PASSWORD || 'defaultProxyPassword';

export function configureProxy(app) {
    app.use((req, res, next) => {
        addSecurityHeaders(res);
        next();
    });

    app.use('/proxy', createProxyMiddleware({
        target: 'https://example.com', // Default target, can be overridden
        changeOrigin: true,
        onProxyReq: async (proxyReq, req) => {
            let originalBody = req.body;
            if (originalBody) {
                try {
                    const encryptedBody = await encryptData(JSON.stringify(originalBody), ENCRYPTION_PASSWORD);
                    proxyReq.setHeader('Content-Type', 'text/plain');
                    proxyReq.write(encryptedBody);
                    proxyReq.end();
                } catch (error) {
                    console.error('Error encrypting request body:', error);
                    res.status(500).send('Encryption failed');
                }
            }
        },
        onProxyRes: async (proxyRes, req, res) => {
            let originalBody = await new Promise((resolve, reject) => {
                let body = [];
                proxyRes.on('data', (chunk) => {
                    body.push(chunk);
                });
                proxyRes.on('end', () => {
                    resolve(Buffer.concat(body).toString());
                });
                proxyRes.on('error', (error) => {
                    reject(error);
                });
            });

            try {
                const decryptedBody = await decryptData(originalBody, ENCRYPTION_PASSWORD);
                res.send(decryptedBody);
            } catch (error) {
                console.error('Error decrypting response body:', error);
                res.status(500).send('Decryption failed');
            }
        },
        onError: (err, req, res) => {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy error');
        }
    }));
}
edit filepath: public/settings.js
content: document.addEventListener('DOMContentLoaded', function() {
    const settingsForm = document.getElementById('settingsForm');

    settingsForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const proxyUrl = document.getElementById('proxyUrl').value;

        localStorage.setItem('proxyUrl', proxyUrl);

        alert('Settings saved!');
    });
});
edit filepath: public/settings.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Proxy Settings</title>
    <link rel="stylesheet" type="text/css" href="/theme/default.css">
    <link rel="stylesheet" type="text/css" href="/theme/settings.css">
</head>
<body>
    <h1>Proxy Settings</h1>
    <form id="settingsForm">
        <label for="proxyUrl">Proxy URL:</label>
        <input type="text" id="proxyUrl" name="proxyUrl" value="/">
        <button type="submit">Save Settings</button>
    </form>
    <script src="/settings.js"></script>
</body>
</html>
edit filepath: public/theme/settings.css
content: body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
}

h1 {
    color: #333;
}

form {
    margin-top: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input[type="text"] {
    width: 300px;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button[type="submit"] {
    background-color: #5cb85c;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button[type="submit"]:hover {
    background-color: #4cae4c;
}
edit filepath: api/logs.js
content: const logs = [];

export function log(message) {
    logs.push(message);
    console.log(message);
}

export function getLogs() {
    return logs;
}

export function clearLogs() {
    logs.length = 0;
}
edit filepath: api/middleware.js
content: import { log } from './logs.js';

export function requestLogger(req, res, next) {
    log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
}
edit filepath: index.js
content: import express from 'express';
import cookieParser from 'cookie-parser';
import { configureProxy } from './api/proxy.js';
import { addSecurityHeaders } from './api/security.js';
import { attachSession } from './api/session.js';
import { getLogs, clearLogs } from './api/logs.js';
import { requestLogger } from './api/middleware.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

app.use((req, res, next) => {
    addSecurityHeaders(res);
    attachSession(req, res);
    next();
});

configureProxy(app);

app.get('/api/logs', (req, res) => {
    res.json(getLogs());
});

app.post('/api/logs/clear', (req, res) => {
    clearLogs();
    res.send({ message: 'Logs cleared' });
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
});
edit filepath: public/index.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Secure Web Proxy</title>
    <link rel="stylesheet" type="text/css" href="/theme/default.css">
</head>
<body>
    <h1>Welcome to the Secure Web Proxy</h1>
    <form id="urlForm">
        <input type="text" id="url" placeholder="Enter URL">
        <button type="submit">Go</button>
    </form>
    <a href="/settings.html">Settings</a>
    <script src="/script.js"></script>
</body>
</html>