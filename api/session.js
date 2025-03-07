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
            sameSite: 'Strict'
        });
        sessionStore[sessionId] = {};
    } else {
        try {
            sessionId = decrypt(sessionId);
        } catch (error) {
            console.error('Error decrypting session ID:', error);
            sessionId = uuidv4();
            res.clearCookie(SESSION_COOKIE_NAME);
            res.cookie(SESSION_COOKIE_NAME, sessionId, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict'
            });
            sessionStore[sessionId] = {};
        }
    }

    req.session = sessionStore[sessionId];
    res.on('finish', () => {
        try {
            const encryptedSessionId = encrypt(sessionId);
            res.cookie(SESSION_COOKIE_NAME, encryptedSessionId, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict'
            });

        } catch (error) {
            console.error('Error encrypting session ID:', error);
        }
    });
}