import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, '../logs/proxy.log');

export function logRequest(req) {
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
    fs.appendFile(logFilePath, logMessage, err => {
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
        fs.writeFileSync(logFilePath, '');
        console.log('Logs cleared successfully.');
    } catch (err) {
        console.error('Error clearing logs:', err);
    }
}
edit filepath: api/proxy.js
content: import https from 'https';
import http from 'http';
import { URL } from 'url';
import { addSecurityHeaders } from './security.js';
import { logRequest } from './logs.js';
import { encode, decode } from '../uv/codec.js';

export async function proxyRequest(req, res, targetUrl, encryptionKey, encryptionSalt) {
    logRequest(req);

    try {
        let decodedUrl = targetUrl;
        if (encryptionKey && encryptionSalt) {
            decodedUrl = await decode(targetUrl, encryptionKey, encryptionSalt);
        }

        if (!decodedUrl) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid URL.');
            return;
        }

        const parsedUrl = new URL(decodedUrl);
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            method: req.method,
            headers: req.headers,
        };

        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        const proxyReq = protocol.request(options, proxyRes => {
            addSecurityHeaders(proxyRes);
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });

        proxyReq.on('error', (err) => {
            console.error('Proxy request error:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Proxy error.');
        });

        req.pipe(proxyReq, { end: true });

    } catch (error) {
        console.error('URL parsing or proxy error:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error.');
    }
}
edit filepath: public/settings.js
content: document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveSettings');
    const encryptionKeyInput = document.getElementById('encryptionKey');
    const encryptionSaltInput = document.getElementById('encryptionSalt');

    const savedKey = localStorage.getItem('encryptionKey') || '';
    const savedSalt = localStorage.getItem('encryptionSalt') || '';

    encryptionKeyInput.value = savedKey;
    encryptionSaltInput.value = savedSalt;

    saveButton.addEventListener('click', function() {
        const encryptionKey = encryptionKeyInput.value;
        const encryptionSalt = encryptionSaltInput.value;

        localStorage.setItem('encryptionKey', encryptionKey);
        localStorage.setItem('encryptionSalt', encryptionSalt);

        alert('Settings saved!');
    });
});
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Proxy</title>
    <link rel="stylesheet" href="/theme/default.css">
    <link rel="stylesheet" href="/visuals/animations.css">
</head>
<body>
    <div class="container">
        <h1>Web Proxy</h1>
        <form id="urlForm">
            <input type="url" id="url" placeholder="Enter URL" required>
            <button type="submit">Go</button>
        </form>
        <a href="/settings.html">Settings</a>
    </div>
    <script src="/script.js"></script>
</body>
</html>
edit filepath: public/settings.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings</title>
    <link rel="stylesheet" href="/theme/settings.css">
</head>
<body>
    <div class="settings-container">
        <h1>Settings</h1>
        <div class="setting-item">
            <label for="encryptionKey">Encryption Key:</label>
            <input type="text" id="encryptionKey" placeholder="Enter encryption key">
        </div>
        <div class="setting-item">
            <label for="encryptionSalt">Encryption Salt:</label>
            <input type="text" id="encryptionSalt" placeholder="Enter encryption salt">
        </div>
        <button id="saveSettings">Save Settings</button>
    </div>
    <script src="/settings.js"></script>
</body>
</html>
edit filepath: server.js
content: import express from 'express';
import cookieParser from 'cookie-parser';
import { proxyRequest } from './api/proxy.js';
import { addSecurityHeaders } from './api/security.js';
import { attachSession } from './api/session.js';
import { getLogs, clearLogs } from './api/logs.js';

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

app.get('/api/logs', (req, res) => {
    const logs = getLogs();
    res.json(logs);
});

app.post('/api/logs/clear', (req, res) => {
    clearLogs();
    res.status(200).send('Logs cleared');
});

app.get('*', async (req, res) => {
    const targetUrl = req.url.slice(1);
    const encryptionKey = req.session?.encryptionKey || req.cookies.encryptionKey || null;
    const encryptionSalt = req.session?.encryptionSalt || req.cookies.encryptionSalt || null;

    await proxyRequest(req, res, targetUrl, encryptionKey, encryptionSalt);
});

app.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
});
edit filepath: public/theme/settings.css
content: body {
    font-family: sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.settings-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 400px;
}

.settings-container h1 {
    text-align: center;
    color: #333;
}

.setting-item {
    margin-bottom: 15px;
}

.setting-item label {
    display: block;
    margin-bottom: 5px;
    color: #555;
}

.setting-item input[type="text"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.settings-container button {
    background-color: #5cb85c;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
}

.settings-container button:hover {
    background-color: #449d44;
}
edit filepath: encryption/key_management.js
content: import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const algorithm = 'aes-256-cbc';
const keySize = 32; // 256 bits
const ivSize = 16; // 128 bits

// Function to generate a random encryption key
export function generateEncryptionKey() {
  return randomBytes(keySize).toString('hex');
}

// Function to generate a random initialization vector (IV)
export function generateInitializationVector() {
  return randomBytes(ivSize).toString('hex');
}

// Function to encrypt data using AES-256-CBC
export function encryptData(data, encryptionKey, iv) {
  const key = Buffer.from(encryptionKey, 'hex');
  const initializationVector = Buffer.from(iv, 'hex');

  const cipher = createCipheriv(algorithm, key, initializationVector);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

// Function to decrypt data using AES-256-CBC
export function decryptData(encryptedData, encryptionKey, iv) {
  const key = Buffer.from(encryptionKey, 'hex');
  const initializationVector = Buffer.from(iv, 'hex');

  const decipher = createDecipheriv(algorithm, key, initializationVector);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}