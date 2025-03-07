export function addSecurityHeaders(res) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}
edit filepath: api/session.js
content: import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from '../encryption/key_management.js';

const sessionMap = new Map();
const SESSION_COOKIE_NAME = 'proxy_session';

export function attachSession(req, res) {
    let sessionId = req.cookies[SESSION_COOKIE_NAME];

    if (!sessionId) {
        sessionId = uuidv4();
        res.cookie(SESSION_COOKIE_NAME, encrypt(sessionId), {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });
    } else {
        try {
            sessionId = decrypt(sessionId);
        } catch (error) {
            console.error('Error decrypting session ID:', error);
            sessionId = uuidv4();
            res.cookie(SESSION_COOKIE_NAME, encrypt(sessionId), {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
        }
    }

    if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, {});
    }
    req.session = sessionMap.get(sessionId);
}
edit filepath: encryption/encryptionMiddleware.js
content: import { encrypt, decrypt } from './key_management.js';

export function encryptResponse(req, res, next) {
    const originalSend = res.send;

    res.send = function(body) {
        if (typeof body === 'string') {
            try {
                const encryptedBody = encrypt(body);
                arguments[0] = encryptedBody;
            } catch (error) {
                console.error('Encryption error:', error);
            }
        }
        originalSend.apply(this, arguments);
    };
    next();
}

export function decryptRequest(req, res, next) {
    if (req.method === 'POST' || req.method === 'PUT') {
        try {
            if (req.body) {
                for (const key in req.body) {
                    if (typeof req.body[key] === 'string') {
                        req.body[key] = decrypt(req.body[key]);
                    }
                }
            }
        } catch (error) {
            console.error('Decryption error:', error);
        }
    }
    next();
}
edit filepath: api/errorHandling.js
content: export function handleErrors(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('An unexpected error occurred.');
}
edit filepath: server.js
content: import express from 'express';
import cookieParser from 'cookie-parser';
import { createProxy } from './api/proxy.js';
import { logRequest, getLogs } from './api/logs.js';
import { attachSession } from './api/session.js';
import { addSecurityHeaders } from './api/security.js';
import { handleErrors } from './api/errorHandling.js';
import { encryptResponse, decryptRequest } from './encryption/encryptionMiddleware.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(decryptRequest);
app.use(encryptResponse);

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

app.use(handleErrors);

app.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
});
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
            res.status(500).send('Proxy Error: ' + err);
        },
        selfHandleResponse: true,
        on: {
            proxyRes: (proxyRes, req, res) => {
                let body = [];
                proxyRes.on('data', (chunk) => {
                    body.push(chunk);
                });
                proxyRes.on('end', () => {
                    body = Buffer.concat(body).toString();
                    res.status(proxyRes.statusCode);
                    res.set(proxyRes.headers);
                    res.send(body);
                });
            },
            error: (err, req, res) => {
                console.error('Proxy error:', err);
                res.status(500).send('Proxy Error');
            }
        }
    });
}
edit filepath: public/script.js
content: document.addEventListener('DOMContentLoaded', function() {
    const urlForm = document.getElementById('urlForm');

    urlForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const url = document.getElementById('url').value;
        window.location.href = '/proxy/' + encodeURIComponent(url);
    });
});