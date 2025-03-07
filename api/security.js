export function addSecurityHeaders(res) {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';");
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}
edit filepath: api/session.js
content: import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from '../encryption/key_management.js';

const SESSION_COOKIE_NAME = 'proxy_session';

export function attachSession(req, res) {
    let sessionId = req.cookies[SESSION_COOKIE_NAME];

    if (!sessionId) {
        sessionId = uuidv4();
        const encryptedSessionId = encrypt(sessionId);
        res.cookie(SESSION_COOKIE_NAME, encryptedSessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });
        req.sessionId = sessionId;
    } else {
        try {
            const decryptedSessionId = decrypt(sessionId);
            req.sessionId = decryptedSessionId;
        } catch (error) {
            console.error('Error decrypting session ID:', error);
            res.clearCookie(SESSION_COOKIE_NAME);
            req.sessionId = uuidv4();
            const encryptedSessionId = encrypt(req.sessionId);
             res.cookie(SESSION_COOKIE_NAME, encryptedSessionId, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict'
            });
        }
    }
}
edit filepath: public/script.js
content: document.addEventListener('DOMContentLoaded', function() {
    const urlForm = document.getElementById('urlForm');

    urlForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const url = document.getElementById('url').value;
        window.location.href = '/proxy/' + url;
    });
});
edit filepath: logs/logs.js
content: document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/logs')
        .then(response => response.json())
        .then(logs => {
            const logsContainer = document.getElementById('logs');
            logs.forEach(log => {
                const logEntry = document.createElement('p');
                logEntry.textContent = log;
                logsContainer.appendChild(logEntry);
            });
        })
        .catch(error => console.error('Error fetching logs:', error));
});
edit filepath: public/settings.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proxy Settings</title>
    <link rel="stylesheet" href="/theme/default.css">
    <link rel="stylesheet" href="/theme/forest.css" disabled>
    <link rel="stylesheet" href="/theme/sunset.css" disabled>
    <link rel="stylesheet" href="/public/theme/settings.css">
</head>
<body>
    <div class="container">
        <h1>Settings</h1>
        <div>
            <label for="theme">Theme:</label>
            <select id="theme">
                <option value="default">Default</option>
                <option value="forest">Forest</option>
                <option value="sunset">Sunset</option>
            </select>
        </div>
        <a href="/">Home</a>
    </div>
    <script src="/settings.js"></script>
</body>
</html>
edit filepath: public/theme/settings.css
content: .container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f0f0f0;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    color: #333;
}

label {
    display: block;
    margin-bottom: 5px;
    color: #555;
}

select {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

a {
    display: block;
    text-align: center;
    color: #007bff;
    text-decoration: none;
    margin-top: 10px;
}

a:hover {
    text-decoration: underline;
}
edit filepath: api/error_handler.js
content: export function handleProxyError(err, req, res, target) {
    console.error(`Proxy error for ${target}:`, err);
    res.status(500).json({
        error: 'Proxy Error',
        message: err.message,
    });
}
edit filepath: api/proxy.js
content: import { createProxyMiddleware } from 'http-proxy-middleware';
import { logRequest } from './logs.js';
import { addSecurityHeaders } from './security.js';
import { handleProxyError } from './error_handler.js';

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
            handleProxyError(err, req, res, target);
        }
    });
}