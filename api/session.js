const security = require('./security');

const sessionStore = {}; // In-memory session store (replace with DB in production)

function createSession() {
    const sessionId = security.generateSessionId();
    const sessionKey = security.generateRandomKey(32); // AES-256 key
    sessionStore[sessionId] = {
        key: sessionKey,
        data: {} // Session data
    };
    return { sessionId, sessionKey };
}

function getSession(sessionId) {
    return sessionStore[sessionId];
}

function updateSessionData(sessionId, data) {
    if (sessionStore[sessionId]) {
        sessionStore[sessionId].data = { ...sessionStore[sessionId].data, ...data };
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