const { generateSecureKey, encryptAES, decryptAES } = require('./security');

// Session storage (in-memory for simplicity, replace with a database in production)
const sessions = {};

// Function to create a new session
function createSession(userData) {
    const sessionId = generateSecureKey(32); // 32 bytes = 64 hex characters
    const sessionKey = generateSecureKey(16); // AES key (16 bytes = 32 hex characters)
    const encryptedUserData = encryptAES(JSON.stringify(userData), sessionKey);

    sessions[sessionId] = {
        key: sessionKey,
        data: encryptedUserData,
        createdAt: Date.now()
    };

    return sessionId;
}

// Function to retrieve session data
function getSessionData(sessionId) {
    const session = sessions[sessionId];
    if (session) {
        try {
            const decryptedData = decryptAES(session.data, session.key);
            return JSON.parse(decryptedData);
        } catch (error) {
            console.error("Error decrypting session data:", error);
            deleteSession(sessionId); // Invalidate corrupted session
            return null;
        }
    }
    return null;
}

// Function to update session data
function updateSessionData(sessionId, newData) {
    const session = sessions[sessionId];
    if (session) {
        try {
            const encryptedData = encryptAES(JSON.stringify(newData), session.key);
            session.data = encryptedData;
            return true;
        } catch (error) {
            console.error("Error encrypting session data:", error);
            return false;
        }
    }
    return false;
}


// Function to delete a session
function deleteSession(sessionId) {
    delete sessions[sessionId];
}

// Function to check if a session is expired (e.g., after 30 minutes)
function isSessionExpired(sessionId, maxAge = 30 * 60 * 1000) {
    const session = sessions[sessionId];
    if (session) {
        return (Date.now() - session.createdAt) > maxAge;
    }
    return true; // Treat non-existent session as expired
}

// Session cleanup function to remove expired sessions
function cleanupSessions() {
    for (const sessionId in sessions) {
        if (isSessionExpired(sessionId)) {
            deleteSession(sessionId);
        }
    }
}

// Periodically cleanup sessions (every 10 minutes)
setInterval(cleanupSessions, 10 * 60 * 1000);


module.exports = {
    createSession,
    getSessionData,
    updateSessionData,
    deleteSession,
    isSessionExpired
};