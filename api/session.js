const { generateSecureKey, encryptData, decryptData } = require('./security');

const sessionKeyLength = 32; // AES-256 key length
const sessionTimeout = 3600000; // 1 hour in milliseconds

// Session storage (in-memory for simplicity, consider Redis for production)
const sessions = {};

function createSession() {
  const sessionId = generateSecureKey(16); // Unique session ID
  const encryptionKey = generateSecureKey(sessionKeyLength); // Session-specific encryption key
  sessions[sessionId] = {
    encryptionKey: encryptionKey,
    data: {}, // Store session data here
    createdAt: Date.now(),
    lastAccessed: Date.now(),
  };
  return { sessionId, encryptionKey };
}

function getSession(sessionId) {
  const session = sessions[sessionId];
    if (session && Date.now() - session.lastAccessed > sessionTimeout) {
        destroySession(sessionId);
        return null;
    }
    if(session){
        session.lastAccessed = Date.now();
    }
  return session;
}

function updateSessionData(sessionId, data) {
  const session = getSession(sessionId);
  if (session) {
    session.data = { ...session.data, ...data };
    session.lastAccessed = Date.now();
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
    destroySession(sessionId); // Destroy session on decryption failure
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