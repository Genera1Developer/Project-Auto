import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from '../encryption/key_management.js';

const SESSION_COOKIE_NAME = 'proxy_session';
const sessionStore = {};

function createSession(res) {
    const sessionId = uuidv4();
    const encryptedSessionId = encrypt(sessionId);
    res.cookie(SESSION_COOKIE_NAME, encryptedSessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
    sessionStore[sessionId] = {};
    return sessionId;
}

export function attachSession(req, res, next) {
    let sessionId;
    const encryptedSessionId = req.cookies[SESSION_COOKIE_NAME];

    if (!encryptedSessionId) {
        sessionId = createSession(res);
    } else {
        try {
            sessionId = decrypt(encryptedSessionId);
            if (!sessionStore[sessionId]) {
                sessionStore[sessionId] = {};
            }
        } catch (error) {
            console.error("Session decryption error:", error);
            sessionId = createSession(res);
        }
    }

    req.session = sessionStore[sessionId];
    next();
}