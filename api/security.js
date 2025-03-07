export function addSecurityHeaders(res) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
}
edit filepath: api/session.js
content: import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from '../encryption/key_management.js';

const SESSION_COOKIE_NAME = 'proxy_session';
const sessionStore = {};

export function attachSession(req, res) {
    let sessionId = req.cookies[SESSION_COOKIE_NAME];

    if (!sessionId) {
        sessionId = uuidv4();
        res.cookie(SESSION_COOKIE_NAME, encrypt(sessionId), {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });
        sessionStore[sessionId] = {};
    } else {
        try {
            sessionId = decrypt(sessionId);
            if (!sessionStore[sessionId]) {
                sessionStore[sessionId] = {};
            }
        } catch (error) {
            console.error('Invalid session cookie:', error);
            sessionId = uuidv4();
            res.cookie(SESSION_COOKIE_NAME, encrypt(sessionId), {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict'
            });
            sessionStore[sessionId] = {};
        }
    }

    req.session = sessionStore[sessionId];
}
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
                } catch (err) {
                    console.error('Error decrypting log line:', err);
                    return 'Decryption Error';
                }
            })
            .reverse();
    } catch (err) {
        console.error('Error reading log file:', err);
        return [];
    }
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
edit filepath: encryption/config.js
content: export const encryptionConfig = {
    algorithm: 'aes-256-cbc',
    keyLength: 32,
    ivLength: 16
};