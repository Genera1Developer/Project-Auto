const security = require('./security');
const crypto = require('crypto');

const sessionStore = {}; // In-memory session store (replace with DB in production)
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const SESSION_ID_LENGTH = 64;

function createSession() {
    let sessionId;
    do {
        sessionId = security.generateSessionId(SESSION_ID_LENGTH);
    } while (sessionStore[sessionId]); // Ensure uniqueness
    const sessionKey = security.generateRandomKey(32); // AES-256 key
    const expiry = Date.now() + SESSION_TIMEOUT;

    // Store the session data with added security: Initialization Vector (IV)
    const iv = crypto.randomBytes(16); // Initialization Vector for AES
    sessionStore[sessionId] = {
        key: sessionKey,
        iv: iv.toString('hex'),
        data: {}, // Session data
        expiry: expiry
    };
    return { sessionId, sessionKey, expiry, iv: iv.toString('hex') };
}

function getSession(sessionId) {
    const session = sessionStore[sessionId];
    if (session && session.expiry > Date.now()) {
        // Extend session expiry
        session.expiry = Date.now() + SESSION_TIMEOUT;
        return session;
    } else {
        destroySession(sessionId);
        return null;
    }
}

function updateSessionData(sessionId, data) {
    const session = sessionStore[sessionId];
    if (session && session.expiry > Date.now()) {
        sessionStore[sessionId].data = { ...sessionStore[sessionId].data, ...data };
        sessionStore[sessionId].expiry = Date.now() + SESSION_TIMEOUT; //Extend session expiry
    }
}

function destroySession(sessionId) {
    delete sessionStore[sessionId];
}

module.exports = {
    createSession,
    getSession,
    updateSessionData,
    destroySession
};