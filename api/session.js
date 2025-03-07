const { generateSecureKey, encryptData, decryptData } = require('./security');
const crypto = require('crypto');

// Session management using encrypted cookies
const sessionStore = {};

// Session timeout in milliseconds (e.g., 30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

function createSession(userId) {
  const sessionId = generateSecureKey(32); // Generate a unique session ID, consider UUID
  const encryptionKey = generateSecureKey(16); // AES key
  const sessionData = {
    userId: userId,
    createdAt: Date.now(),
  };

  const encryptedSessionData = encryptData(JSON.stringify(sessionData), encryptionKey);
  sessionStore[sessionId] = {
    encryptedData: encryptedSessionData,
    encryptionKey: encryptionKey,
    lastActive: Date.now(), // Track last activity for timeout
  };
  return sessionId;
}

function getSession(sessionId) {
  const session = sessionStore[sessionId];
  if (!session) {
    return null;
  }

  // Check for session timeout
  if (Date.now() - session.lastActive > SESSION_TIMEOUT) {
    destroySession(sessionId);
    return null;
  }

  try {
    const decryptedData = decryptData(session.encryptedData, session.encryptionKey);
    const sessionData = JSON.parse(decryptedData);
    // Update last active timestamp on access
    session.lastActive = Date.now();
    return sessionData;
  } catch (error) {
    console.error('Session decryption error:', error);
    destroySession(sessionId); // Invalidate corrupted session
    return null;
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