// api/session.js
const { generateSecureKey, encryptData, decryptData } = require('./security');

// Session storage (in-memory for simplicity, replace with DB for production)
const sessions = {};

// Function to create a new session
function createSession() {
  const sessionId = generateSecureKey(16); // 16 bytes = 32 hex chars
  const encryptionKey = generateSecureKey(32); // AES-256 key
  sessions[sessionId] = {
    encryptionKey: encryptionKey,
    data: {},
    createdAt: Date.now(),
  };
  return { sessionId, encryptionKey };
}

// Function to get session data (decrypts data)
function getSessionData(sessionId, encryptionKey) {
  const session = sessions[sessionId];
  if (!session) {
    return null;
  }

  // Decrypt session data
  let decryptedData = {};
  for (const key in session.data) {
    if (session.data.hasOwnProperty(key)) {
      try {
        decryptedData[key] = decryptData(session.data[key], encryptionKey);
      } catch (error) {
        console.error('Decryption error:', error);
        // Handle decryption errors appropriately (e.g., remove corrupted data)
        delete session.data[key];
      }
    }
  }

  return decryptedData;
}

// Function to update session data (encrypts data)
function updateSessionData(sessionId, encryptionKey, newData) {
  const session = sessions[sessionId];
  if (!session) {
    return false;
  }

  // Encrypt new data before storing
  for (const key in newData) {
    if (newData.hasOwnProperty(key)) {
      session.data[key] = encryptData(newData[key], encryptionKey);
    }
  }
  return true;
}

// Function to destroy a session
function destroySession(sessionId) {
  delete sessions[sessionId];
}

// Session timeout middleware (example)
function sessionTimeoutMiddleware(req, res, next) {
  const sessionId = req.cookies.sessionId; // Assuming you're using cookies
  if (sessionId && sessions[sessionId]) {
    const session = sessions[sessionId];
    const now = Date.now();
    const sessionAge = now - session.createdAt;
    const timeout = 3600000; // 1 hour (in milliseconds)

    if (sessionAge > timeout) {
      destroySession(sessionId);
      res.clearCookie('sessionId');
      return res.status(401).send('Session timed out. Please log in again.');
    } else {
      session.createdAt = now; // Reset session timer
    }
  }
  next();
}

module.exports = {
  createSession,
  getSessionData,
  updateSessionData,
  destroySession,
  sessionTimeoutMiddleware,
};