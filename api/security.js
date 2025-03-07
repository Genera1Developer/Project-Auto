export function addSecurityHeaders(res) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Feature-Policy', "geolocation 'none'; microphone 'none'; camera 'none'");
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
            console.error('Session decryption error:', error);
            // Clear the invalid cookie
            res.clearCookie(SESSION_COOKIE_NAME);
            // Generate a new session
            const newSessionId = uuidv4();
            const encryptedSessionId = encrypt(newSessionId);
            res.cookie(SESSION_COOKIE_NAME, encryptedSessionId, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict'
            });
            req.sessionId = newSessionId;
        }
    }
}
edit filepath: api/error_handler.js
content: export function handleProxyError(err, req, res, targetUrl) {
    console.error(`Proxy error to ${targetUrl}:`, err);

    // Sanitize error message to prevent information leakage
    const safeErrorMessage = 'A proxy error occurred. Please try again later.';

    res.status(500).json({ error: safeErrorMessage });
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
        },
    });
}