const security = require('./security');

const sessionStore = {}; // In-memory session store (replace with DB in production)

function createSession() {
    const sessionId = security.generateSessionId();
    const sessionKey = security.generateRandomKey(32); // AES key for encrypting session data
    sessionStore[sessionId] = {
        key: sessionKey,
        data: {}
    };
    return { sessionId, sessionKey };
}

function getSession(sessionId) {
    return sessionStore[sessionId];
}

function updateSessionData(sessionId, data) {
    const session = getSession(sessionId);
    if (session) {
        session.data = { ...session.data, ...data };
    }
}

function encryptSessionData(data, key) {
    const dataString = JSON.stringify(data);
    return security.encrypt(dataString, key);
}

function decryptSessionData(encryptedData, key, iv) {
    try {
        const decryptedString = security.decrypt(encryptedData, key, iv);
        return JSON.parse(decryptedString);
    } catch (error) {
        console.error("Decryption error:", error);
        return null; // Or handle the error as needed
    }
}

module.exports = {
    createSession,
    getSession,
    updateSessionData,
    encryptSessionData,
    decryptSessionData
};