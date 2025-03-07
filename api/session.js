const { generateSecureKey, encryptData, decryptData } = require('./security');

// Session management using encrypted cookies
const sessions = {};

const SESSION_TIMEOUT = 3600000; // 1 hour in milliseconds

function createSession(userId) {
  const sessionId = generateSecureKey(16); // 16 bytes for a 32-character hex string
  const encryptionKey = generateSecureKey(32); // AES-256 key
  const sessionData = {
    userId: userId,
    createdAt: Date.now(),
    encryptionKey: encryptionKey,
    data: {} // Initialize data as an empty object
  };
  sessions[sessionId] = sessionData;
  return { sessionId: sessionId, encryptionKey: encryptionKey };
}

function getSession(sessionId) {
  const session = sessions[sessionId];
  if (session && Date.now() - session.createdAt > SESSION_TIMEOUT) {
    destroySession(sessionId);
    return null;
  }
  return session;
}

function updateSession(sessionId, data) {
  const session = getSession(sessionId);
  if (!session) {
    return false; // Session not found or expired
  }

  try {
    const encryptionKey = session.encryptionKey;
    const mergedData = { ...session.data, ...data }; // Merge existing data with new data
    const encryptedData = encryptData(JSON.stringify(mergedData), encryptionKey);
    session.data = encryptedData; // Store encrypted data
    session.createdAt = Date.now(); // Reset session timeout
    return true;
  } catch (error) {
    console.error('Error updating session:', error);
    return false;
  }
}

function getSessionData(sessionId) {
  const session = getSession(sessionId);
  if (!session) {
    return null; // Session not found or expired
  }

  if (session.data) {
    try {
      const encryptionKey = session.encryptionKey;
      const decryptedData = decryptData(session.data, encryptionKey);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error decrypting session data:', error);
      return null; // Or handle the error appropriately
    }
  }
  return {}; // Return empty object if no data
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