const security = require('./security');

const sessionStore = {}; // In-memory session store (replace with DB in production)
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

function createSession() {
    const sessionId = security.generateSessionId();
    const sessionKey = security.generateRandomKey(32); // AES-256 key
    const expiry = Date.now() + SESSION_TIMEOUT;
    sessionStore[sessionId] = {
        key: sessionKey,
        data: {}, // Session data
        expiry: expiry
    };
    return { sessionId, sessionKey, expiry };
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