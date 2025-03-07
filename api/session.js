import { randomBytes } from 'crypto';
import { encrypt, decrypt } from '../encryption/key_management.js';

const SESSION_COOKIE_NAME = 'proxy_session';
const SESSION_DURATION = 60 * 60 * 24; // 1 day

const sessions = {};

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
            maxAge: SESSION_DURATION * 1000,
            sameSite: 'Strict'
        });
        sessions[sessionId] = {};
    } else {
        try {
            sessionId = decrypt(sessionId);
            if (!sessions[sessionId]) {
                sessions[sessionId] = {};
            }
        } catch (error) {
            console.error('Invalid session ID:', error);
            // Clear the invalid cookie
            res.clearCookie(SESSION_COOKIE_NAME);
            // Generate a new session
            sessionId = generateSessionId();
            const encryptedSessionId = encrypt(sessionId);
            res.cookie(SESSION_COOKIE_NAME, encryptedSessionId, {
                httpOnly: true,
                secure: true,
                maxAge: SESSION_DURATION * 1000,
                sameSite: 'Strict'
            });
            sessions[sessionId] = {};
        }
    }

    req.session = sessions[sessionId];
}