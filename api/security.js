export function addSecurityHeaders(res) {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self';");
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
}
edit filepath: api/session.js
content: import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from '../encryption/key_management.js';

const sessionStore = {};

export function attachSession(req, res) {
    let sessionId = req.cookies.sessionId;

    if (!sessionId) {
        sessionId = uuidv4();
        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });
        sessionStore[sessionId] = {};
    } else {
        try {
            const decryptedSessionId = decrypt(sessionId);
            if (!sessionStore[decryptedSessionId]) {
                sessionStore[decryptedSessionId] = {};
            }
            sessionId = decryptedSessionId;
        } catch (error) {
            console.error("Session decryption error:", error);
            sessionId = uuidv4();
            res.cookie('sessionId', sessionId, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict'
            });
            sessionStore[sessionId] = {};
        }
    }

    req.session = sessionStore[sessionId];
}
edit filepath: public/script.js
content: document.getElementById('urlForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;
    window.location.href = '/proxy/' + url;
});
edit filepath: encryption/encryptionMiddleware.js
content: import { encrypt, decrypt } from './key_management.js';

export function encryptResponse(req, res, next) {
    const originalSend = res.send;

    res.send = function(body) {
        if (typeof body === 'string') {
            const encryptedBody = encrypt(body);
            res.setHeader('Content-Type', 'application/octet-stream');
            originalSend.call(this, encryptedBody);
        } else {
            originalSend.call(this, body);
        }
    };

    next();
}

export function decryptRequest(req, res, next) {
    if (req.headers['content-type'] === 'application/octet-stream' && req.body) {
        try {
            const decryptedBody = decrypt(req.body);
            req.body = JSON.parse(decryptedBody);
        } catch (error) {
            console.error("Decryption error:", error);
            return res.status(400).send('Decryption Failed');
        }
    }
    next();
}
edit filepath: api/proxy.js
content: import { createProxyMiddleware } from 'http-proxy-middleware';
import { logRequest } from './logs.js';
import { addSecurityHeaders } from './security.js';
import { encryptResponse } from '../encryption/encryptionMiddleware.js';

export function createProxy(target) {
    return createProxyMiddleware({
        target: target,
        secure: true,
        changeOrigin: true,
        onProxyRes: (proxyRes, req, res) => {
            addSecurityHeaders(res);
            encryptResponse(req, res, () => {});
            logRequest(req, res, target);
        },
        onError: (err, req, res) => {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy Error');
        }
    });
}
edit filepath: server.js
content: import express from 'express';
import cookieParser from 'cookie-parser';
import { createProxy } from './api/proxy.js';
import { logRequest, getLogs } from './api/logs.js';
import { attachSession } from './api/session.js';
import { addSecurityHeaders } from './api/security.js';
import { decryptRequest } from './encryption/encryptionMiddleware.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(decryptRequest);

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
edit filepath: .env
content: ENCRYPTION_KEY=