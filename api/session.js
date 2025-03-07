// api/session.js
const { generateSecureKey, encryptData, decryptData } = require('./security');

class SessionManager {
    constructor() {
        this.sessions = {};
        this.sessionKeyLength = 32; // Key length for AES encryption (32 bytes = 256 bits)
    }

    createSession() {
        const sessionId = generateSecureKey(16); // Generate a 16-byte session ID
        const encryptionKey = generateSecureKey(this.sessionKeyLength); // Generate a session-specific encryption key
        this.sessions[sessionId] = {
            encryptionKey: encryptionKey,
            data: {}
        };
        return { sessionId: sessionId, encryptionKey: encryptionKey }; // Return both session ID and encryptionKey
    }

    getSession(sessionId) {
        return this.sessions[sessionId];
    }

    updateSessionData(sessionId, data) {
      if (this.sessions[sessionId]) {
        const session = this.sessions[sessionId];
        session.data = { ...session.data, ...data };
      }
    }

    encryptSessionData(sessionId, data) {
        const session = this.getSession(sessionId);
        if (!session) {
            return null; // Or throw an error
        }
        const key = session.encryptionKey;
        const stringifiedData = JSON.stringify(data);
        return encryptData(stringifiedData, key);
    }

    decryptSessionData(sessionId, encryptedData) {
        const session = this.getSession(sessionId);
        if (!session) {
            return null; // Or throw an error
        }
        const key = session.encryptionKey;
        try {
            const decryptedData = decryptData(encryptedData, key);
            return JSON.parse(decryptedData);
        } catch (error) {
            console.error("Decryption error:", error);
            return null; // Or throw an error
        }
    }

    destroySession(sessionId) {
        delete this.sessions[sessionId];
    }
}

module.exports = new SessionManager();