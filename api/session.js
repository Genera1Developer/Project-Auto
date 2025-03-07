const { generateSecureKey } = require('./security');

// Session storage (in-memory for simplicity, use a database in production)
const sessions = {};

// Session timeout (in milliseconds)
const SESSION_TIMEOUT = 3600000; // 1 hour

// Function to create a new session
function createSession() {
    const sessionId = generateSecureKey(32); // 32 bytes = 256 bits
    const session = {
        id: sessionId,
        createdAt: Date.now(),
        data: {}
    };
    sessions[sessionId] = session;
    return sessionId;
}

// Function to get a session by ID
function getSession(sessionId) {
    const session = sessions[sessionId];
    if (session) {
        // Check if the session has expired
        if (Date.now() - session.createdAt > SESSION_TIMEOUT) {
            deleteSession(sessionId);
            return null;
        }
        return session;
    }
    return null;
}

// Function to update session data
function updateSessionData(sessionId, data) {
    const session = getSession(sessionId);
    if (session) {
        session.data = { ...session.data, ...data };
        session.createdAt = Date.now(); // Reset the timeout
        return true;
    }
    return false;
}

// Function to delete a session
function deleteSession(sessionId) {
    delete sessions[sessionId];
}

module.exports = {
    createSession,
    getSession,
    updateSessionData,
    deleteSession
};