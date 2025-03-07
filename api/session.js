// api/session.js
const { generateSecureKey, encryptData, decryptData } = require('./security');

// Session management using encrypted cookies
const sessions = {};

function createSession(userId) {
  const sessionId = generateSecureKey(16); // 16 bytes for a 32-character hex string
  const encryptionKey = generateSecureKey(32); // AES-256 key
  const sessionData = {
    userId: userId,
    createdAt: Date.now(),
    encryptionKey: encryptionKey,
  };
  sessions[sessionId] = sessionData;
  return { sessionId: sessionId, encryptionKey: encryptionKey };
}

function getSession(sessionId) {
  return sessions[sessionId];
}

function updateSession(sessionId, data) {
  if (sessions[sessionId]) {
    // Encrypt the session data before storing
    const encryptionKey = sessions[sessionId].encryptionKey;
    const encryptedData = encryptData(JSON.stringify(data), encryptionKey);
    sessions[sessionId].data = encryptedData; // Store encrypted data
  }
}

function getSessionData(sessionId) {
  const session = getSession(sessionId);
  if (session && session.data) {
    try {
      const encryptionKey = session.encryptionKey;
      const decryptedData = decryptData(session.data, encryptionKey);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error decrypting session data:', error);
      return null; // Or handle the error appropriately
    }
  }
  return null;
}

function destroySession(sessionId) {
  delete sessions[sessionId];
}

module.exports = {
  createSession,
  getSession,
  updateSession,
  getSessionData,
  destroySession,
};