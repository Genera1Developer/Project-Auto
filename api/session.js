import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from '../encryption/key_management.js';

const SESSION_COOKIE_NAME = 'proxy_session';
const sessionStore = {};

export function attachSession(req, res, next) {
    let sessionId = req.cookies[SESSION_COOKIE_NAME];

    if (!sessionId) {
        sessionId = uuidv4();
        res.cookie(SESSION_COOKIE_NAME, sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });
        sessionStore[sessionId] = {};
    } else {
        try {
            sessionId = decrypt(sessionId);
            if (!sessionStore[sessionId]) {
                sessionStore[sessionId] = {};
            }
        } catch (error) {
            console.error("Session decryption error:", error);
            sessionId = uuidv4();
            res.cookie(SESSION_COOKIE_NAME, sessionId, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            sessionStore[sessionId] = {};
        }
    }

    req.session = sessionStore[sessionId];
    next();
}
edit filepath: api/security.js
content: export function addSecurityHeaders(res) {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-XSS-Protection', '1; mode=block');
}
edit filepath: api/logs.js
content: import fs from 'fs';
import path from 'path';
import { encrypt } from '../encryption/key_management.js';

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
        return data.split('\n').filter(line => line.trim() !== '').map(line => {
            try {
                return JSON.stringify(line);
            } catch (error) {
                console.error("Error decrypting log line:", error);
                return "Decryption Error";
            }
        }).reverse();
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
edit filepath: encryption/tls.js
content: import https from 'https';
import fs from 'fs';
import path from 'path';

const keyPath = path.join(process.cwd(), 'ssl/key.pem');
const certPath = path.join(process.cwd(), 'ssl/cert.pem');

let httpsOptions = {};

try {
    httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
    };
} catch (error) {
    console.error("Error reading SSL certificates:", error);
    console.warn("Generating self-signed certificates is recommended for production.");
}

export { httpsOptions };
edit filepath: ssl/generate_ssl.js
content: import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const sslDir = path.join(process.cwd(), 'ssl');
const keyPath = path.join(sslDir, 'key.pem');
const certPath = path.join(sslDir, 'cert.pem');

function generateSelfSignedCerts() {
    if (!fs.existsSync(sslDir)) {
        fs.mkdirSync(sslDir);
    }

    try {
        execSync(`openssl genrsa -out ${keyPath} 2048`);
        execSync(`openssl req -new -key ${keyPath} -out ${sslDir}/csr.pem -subj "/CN=localhost"`);
        execSync(`openssl x509 -req -in ${sslDir}/csr.pem -signkey ${keyPath} -out ${certPath}`);

        console.log('Self-signed SSL certificates generated successfully.');
    } catch (error) {
        console.error('Error generating self-signed certificates:', error.message);
    } finally {
        if (fs.existsSync(path.join(sslDir, 'csr.pem'))) {
            fs.unlinkSync(path.join(sslDir, 'csr.pem'));
        }
    }
}

generateSelfSignedCerts();
edit filepath: server.js
content: import express from 'express';
import cookieParser from 'cookie-parser';
import { createProxy } from './api/proxy.js';
import { logRequest, getLogs } from './api/logs.js';
import { attachSession } from './api/session.js';
import { addSecurityHeaders } from './api/security.js';
import { httpsOptions } from './encryption/tls.js';
import https from 'https';

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static('public'));

app.use((req, res, next) => {
    attachSession(req, res, next);
    addSecurityHeaders(res);
    next();
});

app.get('/api/logs', (req, res) => {
    const logs = getLogs();
    res.json(logs);
});

app.get('/proxy/*', (req, res) => {
    const targetUrl = decodeURIComponent(req.url.slice(7));
    createProxy(targetUrl)(req, res);
});

if (httpsOptions.key && httpsOptions.cert) {
    https.createServer(httpsOptions, app).listen(port, () => {
        console.log(`Secure proxy server listening on port ${port}`);
    });
} else {
    app.listen(port, () => {
        console.log(`Proxy server listening on port ${port}`);
    });
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