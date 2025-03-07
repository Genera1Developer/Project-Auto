import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '../logs/proxy.log');

export function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

export function getLogs() {
    try {
        const data = fs.readFileSync(logFilePath, 'utf8');
        return data.split('\n').filter(line => line.trim() !== '').reverse();
    } catch (err) {
        console.error('Error reading log file:', err);
        return [];
    }
}

export function clearLogs() {
    fs.writeFile(logFilePath, '', (err) => {
        if (err) {
            console.error('Error clearing log file:', err);
        }
    });
}
edit filepath: api/proxy.js
content: import https from 'https';
import http from 'http';
import { URL } from 'url';
import { addSecurityHeaders } from './security.js';
import { log } from './logs.js';

export async function proxyRequest(req, res) {
    try {
        const targetUrl = req.query.url;

        if (!targetUrl) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('Target URL is missing.');
        }

        let parsedUrl;
        try {
            parsedUrl = new URL(targetUrl);
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('Invalid target URL.');
        }

        const options = {
            method: req.method,
            headers: req.headers,
            rejectUnauthorized: false // For testing purposes only! Remove in production.
        };

        const proxyReq = (parsedUrl.protocol === 'https:' ? https : http).request(targetUrl, options, (proxyRes) => {
            addSecurityHeaders(proxyRes);
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });

        proxyReq.on('error', (error) => {
            log(`Proxy request error: ${error.message}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Proxy error: ${error.message}`);
        });

        req.pipe(proxyReq, { end: true });
        log(`Proxy request to: ${targetUrl}`);

    } catch (error) {
        log(`Unexpected error: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Internal server error: ${error.message}`);
    }
}
edit filepath: public/settings.js
content: document.addEventListener('DOMContentLoaded', function() {
    const clearLogsButton = document.getElementById('clearLogs');
    const logsStatus = document.getElementById('logsStatus');

    clearLogsButton.addEventListener('click', function() {
        fetch('/api/logs/clear', {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                logsStatus.textContent = 'Logs cleared successfully!';
                setTimeout(() => {
                    logsStatus.textContent = '';
                }, 3000);
            } else {
                logsStatus.textContent = 'Failed to clear logs.';
            }
        })
        .catch(error => {
            console.error('Error clearing logs:', error);
            logsStatus.textContent = 'Error clearing logs.';
        });
    });
});
edit filepath: server.js
content: import express from 'express';
import cookieParser from 'cookie-parser';
import { proxyRequest } from './api/proxy.js';
import { addSecurityHeaders } from './api/security.js';
import { attachSession } from './api/session.js';
import { log, getLogs, clearLogs } from './api/logs.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
    attachSession(req, res);
    addSecurityHeaders(res);
    next();
});

app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: '.' });
});

app.get('/proxy', proxyRequest);

app.get('/api/logs', (req, res) => {
    const logs = getLogs();
    res.json(logs);
});

app.post('/api/logs/clear', (req, res) => {
    clearLogs();
    res.status(200).send({ message: 'Logs cleared' });
});

app.get('/settings', (req, res) => {
    res.sendFile('public/settings.html', {root: '.'});
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
edit filepath: encryption/key-management.js
content: import { subtle, getRandomValues } from 'crypto';

async function generateKey() {
    return await subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

async function exportKey(key) {
    return await subtle.exportKey("jwk", key);
}

async function importKey(jwk) {
    return await subtle.importKey(
        "jwk",
        jwk,
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

let currentKey = null;

async function initializeKey() {
    // In a real application, this would load the key from secure storage
    try {
        const storedKey = localStorage.getItem('encryptionKey');
        if (storedKey) {
            currentKey = await importKey(JSON.parse(storedKey));
        } else {
            currentKey = await generateKey();
            const jwk = await exportKey(currentKey);
            localStorage.setItem('encryptionKey', JSON.stringify(jwk));
        }
    } catch (error) {
        console.error("Key initialization error:", error);
        currentKey = await generateKey();
        const jwk = await exportKey(currentKey);
        localStorage.setItem('encryptionKey', JSON.stringify(jwk));
    }
}

async function getKey() {
    if (!currentKey) {
        await initializeKey();
    }
    return currentKey;
}

export { getKey, generateKey, exportKey, importKey };
edit filepath: uv/codec.js
content: import { subtle, getRandomValues } from 'crypto';
import { getKey } from '../encryption/key-management.js';

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
            //const cryptoKey = await deriveKey(key, salt);
            const cryptoKey = await getKey();
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

            //const cryptoKey = await deriveKey(key, salt);
            const cryptoKey = await getKey();

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
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Proxy</title>
    <link rel="stylesheet" href="/theme/default.css">
</head>
<body>
    <h1>Web Proxy</h1>
    <form id="urlForm">
        <label for="url">Enter URL:</label>
        <input type="text" id="url" name="url" placeholder="https://example.com" required>
        <button type="submit">Go</button>
    </form>
    <a href="/settings">Settings</a>
    <script src="/script.js"></script>
</body>
</html>