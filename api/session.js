import { randomBytes } from 'crypto';
import { encrypt, decrypt } from '../encryption/key_management.js';

const sessionMap = new Map();
const SESSION_COOKIE_NAME = 'proxy_session';

function generateSessionId() {
    return randomBytes(16).toString('hex');
}

export function attachSession(req, res) {
    let sessionId = req.cookies[SESSION_COOKIE_NAME];

    if (!sessionId) {
        sessionId = generateSessionId();
        const encryptedSessionId = encrypt(sessionId);
        res.cookie(SESSION_COOKIE_NAME, encryptedSessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });
        sessionMap.set(sessionId, {});
    } else {
        try {
            sessionId = decrypt(sessionId);
            if (!sessionMap.has(sessionId)) {
                sessionId = generateSessionId();
                const encryptedSessionId = encrypt(sessionId);
                res.cookie(SESSION_COOKIE_NAME, encryptedSessionId, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict'
                });
                sessionMap.set(sessionId, {});
            }
        } catch (error) {
            console.error('Error decrypting session ID:', error);
            // Regenerate session if decryption fails
            sessionId = generateSessionId();
            const encryptedSessionId = encrypt(sessionId);
            res.cookie(SESSION_COOKIE_NAME, encryptedSessionId, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict'
            });
            sessionMap.set(sessionId, {});
        }
    }

    req.session = sessionMap.get(sessionId);
}
edit filepath: api/security.js
content: export function addSecurityHeaders(res) {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';");
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}
edit filepath: public/script.js
content: document.getElementById('urlForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;
    window.location.href = '/proxy/' + url;
});
edit filepath: api/logs.js
content: import fs from 'fs';
import path from 'path';
import { encrypt, decrypt } from '../encryption/key_management.js';

const logFilePath = path.join(process.cwd(), 'proxy.log');

export function logRequest(req, res, url) {
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${url} - ${res.statusCode}\n`;
    const encryptedLogMessage = encrypt(logMessage);

    fs.appendFile(logFilePath, encryptedLogMessage + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

export function getLogs() {
    try {
        const data = fs.readFileSync(logFilePath, 'utf8');
        return data.split('\n')
            .filter(line => line.trim() !== '')
            .map(encryptedLine => {
                try {
                    return decrypt(encryptedLine);
                } catch (error) {
                    console.error('Error decrypting log entry:', error);
                    return 'Failed to decrypt log entry';
                }
            })
            .reverse();
    } catch (err) {
        console.error('Error reading log file:', err);
        return [];
    }
}
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
    <link rel="stylesheet" href="/public/theme/settings.css">

</head>
<body>
    <div class="settings-container">
        <h1>Settings</h1>
        <div class="setting">
            <label for="theme">Theme:</label>
            <select id="theme">
                <option value="default">Default</option>
                <option value="forest">Forest</option>
                <option value="sunset">Sunset</option>
            </select>
        </div>
        <a href="/">Back to Proxy</a>
    </div>
    <script src="/settings.js"></script>
</body>
</html>
edit filepath: api/error_handling.js
content: export function handleProxyError(err, req, res) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy Error: ' + err.message });
}
edit filepath: api/proxy.js
content: import { createProxyMiddleware } from 'http-proxy-middleware';
import { logRequest } from './logs.js';
import { addSecurityHeaders } from './security.js';
import { handleProxyError } from './error_handling.js';

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
            handleProxyError(err, req, res);
        }
    });
}