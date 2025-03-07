const security = require('./security');

const sessionStore = {}; // In-memory session store (replace with DB in production)
const SESSION_TIMEOUT = 3600; // Session timeout in seconds (1 hour)

function createSession() {
    const sessionId = security.generateSessionId();
    const sessionKey = security.generateRandomKey(32); // AES key for encrypting session data
    const iv = security.generateRandomIV(); // Initialization Vector for added security
    sessionStore[sessionId] = {
        key: sessionKey,
        iv: iv,
        data: {},
        expiry: Date.now() + SESSION_TIMEOUT * 1000 // Set session expiry
    };
    return { sessionId, sessionKey, iv };
}

function getSession(sessionId) {
    const session = sessionStore[sessionId];
    if (session && session.expiry > Date.now()) {
        // Extend the session expiry on each access
        session.expiry = Date.now() + SESSION_TIMEOUT * 1000;
        return session;
    } else {
        deleteSession(sessionId); // Remove expired session
        return null;
    }
}

function updateSessionData(sessionId, data) {
    const session = getSession(sessionId);
    if (session) {
        session.data = { ...session.data, ...data };
    }
}

function encryptSessionData(data, key, iv) {
    const dataString = JSON.stringify(data);
    return security.encrypt(dataString, key, iv);
}

function decryptSessionData(encryptedData, key, iv) {
    try {
        const decryptedString = security.decrypt(encryptedData, key, iv);
        return JSON.parse(decryptedString);
    } catch (error) {
        console.error("Decryption error:", error);
        deleteSession(sessionId); // Invalidate session on decryption failure
        return null; // Or handle the error as needed
    }
}

function deleteSession(sessionId) {
    delete sessionStore[sessionId];
}

module.exports = {
    createSession,
    getSession,
    updateSessionData,
    encryptSessionData,
    decryptSessionData
};