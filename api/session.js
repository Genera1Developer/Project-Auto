// api/session.js

const { generateSecureKey, encryptData, decryptData } = require('./security');

// Session management using encrypted cookies
const sessionStore = {};

function createSession(userId) {
  const sessionId = generateSecureKey(32); // Generate a unique session ID
  const encryptionKey = generateSecureKey(16); // AES key
  const sessionData = {
    userId: userId,
    createdAt: Date.now(),
  };

  const encryptedSessionData = encryptData(JSON.stringify(sessionData), encryptionKey);
  sessionStore[sessionId] = {
    encryptedData: encryptedSessionData,
    encryptionKey: encryptionKey,
  };
  return sessionId;
}

function getSession(sessionId) {
  const session = sessionStore[sessionId];
  if (!session) {
    return null;
  }

  try {
    const decryptedData = decryptData(session.encryptedData, session.encryptionKey);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Session decryption error:', error);
    return null; // Or handle the error appropriately
  }
}

function destroySession(sessionId) {
  delete sessionStore[sessionId];
}

module.exports = {
  createSession,
  getSession,
  destroySession,
};