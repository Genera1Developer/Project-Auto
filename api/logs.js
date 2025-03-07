import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '../logs/proxy.log');

export function logRequest(req, res, url) {
    const logMessage = `${new Date().toISOString()} - ${req.method} ${url} - ${res.statusCode}\n`;
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
    fs.writeFileSync(logFilePath, '', 'utf8');
    console.log('Logs cleared successfully.');
  } catch (error) {
    console.error('Error clearing logs:', error);
  }
}
edit filepath: api/proxy.js
content: import { createProxyMiddleware } from 'http-proxy-middleware';
import { logRequest } from './logs.js';
import { addSecurityHeaders } from './security.js';
import { encode, decode } from '../uv/codec.js';

export function createSecureProxy(target, encryptionKey, encryptionSalt) {
    return createProxyMiddleware({
        target: target,
        secure: true,
        changeOrigin: true,
        onProxyRes: async (proxyRes, req, res) => {
            addSecurityHeaders(res);
            logRequest(req, res, target);

            const originalWrite = res.write.bind(res);
            const chunks = [];

            res.write = (chunk) => {
                chunks.push(chunk);
                return true;
            };

            const originalEnd = res.end.bind(res);

            res.end = async () => {
                let body = Buffer.concat(chunks).toString('utf8');

                if (encryptionKey && encryptionSalt) {
                    try {
                        body = await encode(body, encryptionKey, encryptionSalt);
                        res.setHeader('Content-Encoding', 'encrypted');

                        const encryptedBuffer = Buffer.from(body, 'utf8');
                        originalWrite(encryptedBuffer);
                    } catch (error) {
                        console.error('Encryption error:', error);
                        originalWrite(Buffer.from('Encryption failed'));
                        res.statusCode = 500;
                    }
                } else {
                    originalWrite(body);
                }

                originalEnd();
            };
        },
        onProxyReq: async (proxyReq, req) => {
            if (req.body && encryptionKey && encryptionSalt) {
                let body = JSON.stringify(req.body);
                try {
                    body = await encode(body, encryptionKey, encryptionSalt);
                    proxyReq.setHeader('Content-Encoding', 'encrypted');
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
                    proxyReq.write(body);
                } catch (error) {
                    console.error('Encryption error:', error);
                }
            }
        },
        onError: (err, req, res) => {
            console.error('Proxy error:', err);
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end('Proxy error occurred.');
        }
    });
}
edit filepath: public/settings.js
content: document.addEventListener('DOMContentLoaded', function() {
    const saveSettingsButton = document.getElementById('saveSettings');
    const encryptionKeyInput = document.getElementById('encryptionKey');
    const encryptionSaltInput = document.getElementById('encryptionSalt');
    const clearLogsButton = document.getElementById('clearLogsButton');

    // Load settings from localStorage
    encryptionKeyInput.value = localStorage.getItem('encryptionKey') || '';
    encryptionSaltInput.value = localStorage.getItem('encryptionSalt') || '';

    saveSettingsButton.addEventListener('click', function() {
        const encryptionKey = encryptionKeyInput.value;
        const encryptionSalt = encryptionSaltInput.value;

        localStorage.setItem('encryptionKey', encryptionKey);
        localStorage.setItem('encryptionSalt', encryptionSalt);

        alert('Settings saved!');
    });

    clearLogsButton.addEventListener('click', function() {
        fetch('/api/clearLogs', { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    alert('Logs cleared!');
                } else {
                    alert('Failed to clear logs.');
                }
            })
            .catch(error => console.error('Error clearing logs:', error));
    });
});
edit filepath: api/config.js
content: export const config = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    encryptionEnabled: process.env.ENCRYPTION_ENABLED === 'true',
};
edit filepath: server.js
content: import express from 'express';
import cookieParser from 'cookie-parser';
import { createSecureProxy } from './api/proxy.js';
import { attachSession } from './api/session.js';
import { logRequest, getLogs, clearLogs } from './api/logs.js';
import { addSecurityHeaders } from './api/security.js';
import { config } from './api/config.js';

const app = express();
const port = config.port;
const host = config.host;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
    attachSession(req, res);
    addSecurityHeaders(res);
    next();
});

app.post('/api/clearLogs', (req, res) => {
    clearLogs();
    res.sendStatus(200);
});

app.get('/api/logs', (req, res) => {
    const logs = getLogs();
    res.json(logs);
});

app.get('/proxy/*', async (req, res) => {
    const targetUrl = req.params[0];
    const encryptionKey = req.session.encryptionKey || req.cookies.encryptionKey || process.env.ENCRYPTION_KEY;
    const encryptionSalt = req.session.encryptionSalt || req.cookies.encryptionSalt || process.env.ENCRYPTION_SALT;

    if (!targetUrl) {
        return res.status(400).send('Target URL is required.');
    }

    const proxy = createSecureProxy(targetUrl, encryptionKey, encryptionSalt);
    proxy(req, res, (err) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
    });
});

app.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`);
});
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Web Proxy</title>
    <link rel="stylesheet" href="/theme/default.css">
    <link rel="stylesheet" href="/visuals/animations.css">
    <link rel="icon" href="/visuals/favicon.ico" type="image/x-icon">
</head>
<body>
    <header>
        <h1>Secure Web Proxy</h1>
        <nav>
            <a href="/">Home</a> |
            <a href="/settings.html">Settings</a> |
            <a href="/logs/logs.html">Logs</a>
        </nav>
    </header>

    <main>
        <section id="proxyForm">
            <h2>Enter URL to Access</h2>
            <form id="urlForm">
                <input type="url" id="url" placeholder="Enter URL" required>
                <button type="submit">Go</button>
            </form>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 Secure Web Proxy</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>
edit filepath: public/settings.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proxy Settings</title>
    <link rel="stylesheet" href="/theme/settings.css">
    <link rel="stylesheet" href="/visuals/animations.css">
    <link rel="icon" href="/visuals/favicon.ico" type="image/x-icon">
</head>
<body>
    <header>
        <h1>Proxy Settings</h1>
        <nav>
            <a href="/">Home</a> |
            <a href="/settings.html">Settings</a> |
            <a href="/logs/logs.html">Logs</a>
        </nav>
    </header>

    <main>
        <section id="settingsForm">
            <h2>Encryption Settings</h2>
            <label for="encryptionKey">Encryption Key:</label>
            <input type="text" id="encryptionKey" placeholder="Enter Encryption Key">

            <label for="encryptionSalt">Encryption Salt:</label>
            <input type="text" id="encryptionSalt" placeholder="Enter Encryption Salt">

            <button id="saveSettings">Save Settings</button>
        </section>

        <section id="logManagement">
            <h2>Log Management</h2>
            <button id="clearLogsButton">Clear Logs</button>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 Secure Web Proxy</p>
    </footer>
    <script src="settings.js"></script>
</body>
</html>
edit filepath: public/theme/settings.css
content: body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

header {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 1em 0;
    width: 100%;
}

nav {
    margin-top: 10px;
}

nav a {
    color: white;
    text-decoration: none;
    padding: 0.5em 1em;
    border-radius: 5px;
    background-color: #555;
}

main {
    width: 80%;
    padding: 20px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
}

section {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input[type="text"],
input[type="url"] {
    width: 100%;
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

footer {
    text-align: center;
    padding: 1em 0;
    background-color: #333;
    color: white;
    width: 100%;
    margin-top: 20px;
}
edit filepath: uv/uv.config.js
content: self.__uv$config = {
    prefix: '/service/',
    bare: '/uv/bare.js',
    encodeUrl: Ultraviolet.codec.encode,
    decodeUrl: Ultraviolet.codec.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};
edit filepath: uv/uv.handler.js
content: importScripts('./uv.bundle.js');
importScripts('./uv.config.js');

const uv = new Ultraviolet();

self.addEventListener('fetch', event => {
  try {
    event.respondWith(uv.fetch(event));
  } catch (e) {
    event.respondWith(new Response(e.stack, { status: 500 }));
  }
});
edit filepath: uv/bare.js
content: // This is a placeholder for the bare server.
// In a real deployment, this would be a separate server
// responsible for handling requests that the service worker cannot.
edit filepath: api/middleware.js
content: export function checkEncryptionSettings(req, res, next) {
    if (process.env.ENCRYPTION_REQUIRED === 'true' && (!req.session.encryptionKey || !req.session.encryptionSalt)) {
        return res.status(403).send('Encryption key and salt are required.');
    }
    next();
}