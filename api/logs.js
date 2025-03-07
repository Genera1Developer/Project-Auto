import fs from 'fs';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'proxy.log');

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
        const data = fs.readFileSync(logFilePath, 'utf8');
        return data.split('\n').filter(line => line.trim() !== '').reverse();
    } catch (err) {
        console.error('Error reading log file:', err);
        return [];
    }
}
edit filepath: api/proxy.js
content: import { createProxyMiddleware } from 'http-proxy-middleware';
import { logRequest } from './logs.js';
import { addSecurityHeaders } from './security.js';

export function createProxy(target) {
    return createProxyMiddleware({
        target: target,
        secure: true,
        changeOrigin: true,
        onProxyRes: (proxyRes, req, res) => {
            addSecurityHeaders(res);
            logRequest(req, res, target);
        },
        onError: (err, req, res) => {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy Error');
        }
    });
}
edit filepath: public/settings.js
content: document.addEventListener('DOMContentLoaded', function() {
    const themeSelect = document.getElementById('theme');
    const currentTheme = localStorage.getItem('theme') || 'default';
    themeSelect.value = currentTheme;

    themeSelect.addEventListener('change', function() {
        const selectedTheme = themeSelect.value;
        localStorage.setItem('theme', selectedTheme);
        document.documentElement.className = selectedTheme;
    });

    document.documentElement.className = currentTheme;
});
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Web Proxy</title>
    <link rel="stylesheet" href="/theme/default.css">
    <link rel="stylesheet" href="/theme/forest.css" disabled>
    <link rel="stylesheet" href="/theme/sunset.css" disabled>
    <link rel="stylesheet" href="/visuals/animations.css">
    <link rel="stylesheet" href="/public/theme/settings.css">

</head>
<body>
    <div class="container">
        <h1>Secure Web Proxy</h1>
        <form id="urlForm">
            <input type="url" id="url" placeholder="Enter URL" required>
            <button type="submit">Go</button>
        </form>
        <a href="/settings.html">Settings</a>
    </div>
    <script src="/script.js"></script>
</body>
</html>
edit filepath: server.js
content: import express from 'express';
import cookieParser from 'cookie-parser';
import { createProxy } from './api/proxy.js';
import { logRequest, getLogs } from './api/logs.js';
import { attachSession } from './api/session.js';
import { addSecurityHeaders } from './api/security.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static('public'));

app.use((req, res, next) => {
    attachSession(req, res);
    addSecurityHeaders(res);
    next();
});

app.get('/api/logs', (req, res) => {
    const logs = getLogs();
    res.json(logs);
});

app.get('/proxy/*', (req, res) => {
    const targetUrl = req.url.slice(7);
    createProxy(targetUrl)(req, res);
});

app.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
});
edit filepath: encryption/key_management.js
content: import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const algorithm = 'aes-256-cbc';
let key = process.env.ENCRYPTION_KEY || randomBytes(32).toString('hex'); // Generate if not exists
const iv = randomBytes(16);

export function encrypt(text) {
    const cipher = createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}