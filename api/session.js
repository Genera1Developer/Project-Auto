import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from '../encryption/key_management.js';

const SESSION_COOKIE_NAME = 'proxy_session';
const sessionStore = {};

function createSession(res) {
    const sessionId = uuidv4();
    sessionStore[sessionId] = {};
    res.cookie(SESSION_COOKIE_NAME, encrypt(sessionId), {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    });
    return sessionId;
}

export function attachSession(req, res, next) {
    let sessionId = req.cookies[SESSION_COOKIE_NAME];

    if (!sessionId) {
        sessionId = createSession(res);
    } else {
        try {
            sessionId = decrypt(sessionId);
            if (!sessionStore[sessionId]) {
                sessionId = createSession(res);
            }
        } catch (error) {
            console.error('Error decrypting session ID:', error);
            sessionId = createSession(res);
            res.clearCookie(SESSION_COOKIE_NAME);
        }
    }

    req.session = sessionStore[sessionId];

    res.on('finish', () => {
        // Session ID should already be encrypted and set, avoid re-setting on every request
    });

    next();
}