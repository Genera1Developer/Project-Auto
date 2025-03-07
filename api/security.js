export function addSecurityHeaders(res) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
}
edit filepath: api/session.js
content: import { encrypt, decrypt } from '../encryption/key_management.js';

const SESSION_COOKIE_NAME = 'proxy_session';

export function attachSession(req, res) {
    let sessionId = req.cookies[SESSION_COOKIE_NAME];

    if (!sessionId) {
        sessionId = generateSessionId();
        res.cookie(SESSION_COOKIE_NAME, encrypt(sessionId), {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });
    } else {
        try {
            sessionId = decrypt(sessionId);
        } catch (error) {
            console.error('Error decrypting session ID:', error);
            sessionId = generateSessionId();
            res.cookie(SESSION_COOKIE_NAME, encrypt(sessionId), {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict'
            });
        }
    }

    req.sessionId = sessionId;
}

function generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
edit filepath: api/proxy.js
content: import { createProxyMiddleware } from 'http-proxy-middleware';
import { logRequest } from './logs.js';
import { addSecurityHeaders } from './security.js';
import { encrypt } from '../encryption/key_management.js';
import https from 'https';

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

export function createProxy(target) {
    return createProxyMiddleware({
        target: target,
        secure: true,
        changeOrigin: true,
        agent: httpsAgent,
        onProxyReq: (proxyReq) => {
            if (proxyReq.getHeader('cookie')) {
                const encryptedCookie = encrypt(proxyReq.getHeader('cookie'));
                proxyReq.setHeader('cookie', encryptedCookie);
            }
        },
        onProxyRes: (proxyRes, req, res) => {
            addSecurityHeaders(res);
            logRequest(req, res, target);

            if (proxyRes.headers['set-cookie']) {
                proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(cookie => {
                    return encrypt(cookie);
                });
            }

        },
        onError: (err, req, res) => {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy Error');
        }
    });
}
edit filepath: public/script.js
content: document.getElementById('urlForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;
    window.location.href = '/proxy/' + encodeURIComponent(url);
});
edit filepath: public/settings.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings</title>
     <link rel="stylesheet" href="/theme/default.css">
    <link rel="stylesheet" href="/theme/forest.css" disabled>
    <link rel="stylesheet" href="/theme/sunset.css" disabled>
    <link rel="stylesheet" href="/visuals/animations.css">
    <link rel="stylesheet" href="/public/theme/settings.css">
</head>
<body>
    <div class="container">
        <h1>Settings</h1>
        <label for="theme">Theme:</label>
        <select id="theme">
            <option value="default">Default</option>
            <option value="forest">Forest</option>
            <option value="sunset">Sunset</option>
        </select>
        <a href="/">Home</a>
    </div>
    <script src="/settings.js"></script>
</body>
</html>
edit filepath: api/logs.js
content: import fs from 'fs';
import path from 'path';
import { encrypt, decrypt } from '../encryption/key_management.js';

const logFilePath = path.join(process.cwd(), 'proxy.log');

export function logRequest(req, res, url) {
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${url} - ${res.statusCode}\n`;
    fs.appendFile(logFilePath, encrypt(logMessage), (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

export function getLogs() {
    try {
        const data = fs.readFileSync(logFilePath, 'utf8');
        return data.split('\n').filter(line => line.trim() !== '').map(line => {
            try {
                return decrypt(line);
            } catch (error) {
                console.error('Error decrypting log line:', error);
                return 'Decryption Error';
            }
        }).reverse();
    } catch (err) {
        console.error('Error reading log file:', err);
        return [];
    }
}
edit filepath: package.json
content: {
  "name": "secure-web-proxy",
  "version": "1.0.0",
  "description": "A secure web proxy application",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "keywords": [
    "proxy",
    "web",
    "security",
    "encryption"
  ],
  "author": "GPT",
  "license": "ISC",
  "dependencies": {
    "cookie-parser": "^1.4.6",
    "express": "^4.18.2",
    "http-proxy-middleware": "^2.0.6"
  }
}