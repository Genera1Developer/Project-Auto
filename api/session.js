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
        return sessionId; // Return only session ID
    }

    getSession(sessionId) {
        const session = this.sessions[sessionId];
        if (!session) {
            return null;
        }
        // Deep copy to prevent modifications to the original session object.
        return JSON.parse(JSON.stringify(session));
    }

    updateSessionData(sessionId, data) {
        if (!sessionId || typeof data !== 'object' || data === null) {
            return false; // Input validation
        }

        const session = this.getSession(sessionId);
        if (!session) {
            return false; // Indicate session not found
        }

        try {
            const currentSession = this.sessions[sessionId];
            currentSession.data = { ...currentSession.data, ...data };
            return true; // Indicate success
        } catch (error) {
            console.error("Error updating session data:", error);
            return false; // Indicate failure
        }
    }

    encryptSessionData(sessionId, data) {
        if (!sessionId || typeof data !== 'object' || data === null) {
            return null;
        }

        const session = this.getSession(sessionId);
        if (!session) {
            return null;
        }
        try {
            const key = session.encryptionKey;
            const stringifiedData = JSON.stringify(data);
            return encryptData(stringifiedData, key);
        } catch (error) {
            console.error("Encryption error:", error);
            return null;
        }
    }

    decryptSessionData(sessionId, encryptedData) {
        if (!sessionId || typeof encryptedData !== 'string' || encryptedData.length === 0) {
            return null;
        }

        const session = this.getSession(sessionId);
        if (!session) {
            return null;
        }
        try {
            const key = session.encryptionKey;
            const decryptedData = decryptData(encryptedData, key);
            if (decryptedData === null) {
                return null; // Handle decryption failure gracefully
            }
            return JSON.parse(decryptedData);
        } catch (error) {
            console.error("Decryption error:", error);
            return null;
        }
    }

    destroySession(sessionId) {
        if (!sessionId) {
            return false;
        }

        if (this.sessions[sessionId]) {
            delete this.sessions[sessionId];
            return true;
        }
        return false;
    }
}

module.exports = new SessionManager();