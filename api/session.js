const { generateSecureKey, encryptData, decryptData } = require('./security');

const sessionKeyLength = 32; // AES-256 key length

// Session storage (in-memory for simplicity, consider Redis for production)
const sessions = {};

function createSession() {
  const sessionId = generateSecureKey(16); // Unique session ID
  const encryptionKey = generateSecureKey(sessionKeyLength); // Session-specific encryption key
  sessions[sessionId] = {
    encryptionKey: encryptionKey,
    data: {}, // Store session data here
    createdAt: Date.now(),
  };
  return { sessionId, encryptionKey };
}

function getSession(sessionId) {
  return sessions[sessionId];
}

function updateSessionData(sessionId, data) {
  const session = getSession(sessionId);
  if (session) {
    session.data = { ...session.data, ...data };
  }
}

function encryptSessionData(sessionId, data) {
  const session = getSession(sessionId);
  if (!session) {
    return null;
  }
  const plaintext = JSON.stringify(data);
  return encryptData(plaintext, session.encryptionKey);
}

function decryptSessionData(sessionId, encryptedData) {
  const session = getSession(sessionId);
  if (!session) {
    return null;
  }
  try {
    const plaintext = decryptData(encryptedData, session.encryptionKey);
    return JSON.parse(plaintext);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

function destroySession(sessionId) {
  delete sessions[sessionId];
}

module.exports = {
  createSession,
  getSession,
  updateSessionData,
  encryptSessionData,
  decryptSessionData,
  destroySession,
};