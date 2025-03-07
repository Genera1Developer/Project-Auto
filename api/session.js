const { generateSecureKey } = require('./security');
const crypto = require('crypto');

// Session storage (in-memory for simplicity, use a database in production)
const sessions = {};

// Session timeout (in milliseconds)
const SESSION_TIMEOUT = 3600000; // 1 hour

// Function to create a new session
function createSession() {
    let sessionId;
    do {
        sessionId = generateSecureKey(32); // 32 bytes = 256 bits
    } while (sessions[sessionId]); // Ensure uniqueness

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
        session.createdAt = Date.now(); //Extend session life if accessed
        return session;
    }
    return null;
}

// Function to update session data
function updateSessionData(sessionId, data) {
    const session = getSession(sessionId);
    if (session) {
        const newData = { ...session.data, ...data };

        // Sanitize data to prevent injection
        for (const key in newData) {
            if (typeof newData[key] === 'string') {
                newData[key] = sanitizeString(newData[key]);
            }
        }
        session.data = newData;
        session.createdAt = Date.now(); // Reset the timeout
        return true;
    }
    return false;
}

// Function to delete a session
function deleteSession(sessionId) {
    delete sessions[sessionId];
}

// Basic string sanitization function (improve this for production)
function sanitizeString(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

module.exports = {
    createSession,
    getSession,
    updateSessionData,
    deleteSession
};