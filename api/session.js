// api/session.js
const { generateSecureKey, encryptData, decryptData } = require('./security');
const crypto = require('crypto');

// Session storage (in-memory for simplicity, replace with DB for production)
const sessions = {};

// Function to create a new session
function createSession() {
  const sessionId = crypto.randomBytes(16).toString('hex'); // 16 bytes = 32 hex chars, using crypto
  const encryptionKey = generateSecureKey(32); // AES-256 key
  const hmacKey = generateSecureKey(32); // HMAC key for integrity check
  sessions[sessionId] = {
    encryptionKey: encryptionKey,
    hmacKey: hmacKey,
    data: {},
    createdAt: Date.now(),
  };
  return { sessionId, encryptionKey };
}

// Function to get session data (decrypts data and verifies integrity)
function getSessionData(sessionId, encryptionKey) {
  const session = sessions[sessionId];
  if (!session) {
    return null;
  }

  // Decrypt session data
  let decryptedData = {};
  for (const key in session.data) {
    if (session.data.hasOwnProperty(key)) {
      const encryptedData = session.data[key].ciphertext;
      const hmac = session.data[key].hmac;
      const hmacKey = session.hmacKey;

      // Verify integrity
      const expectedHmac = crypto.createHmac('sha256', hmacKey).update(encryptedData).digest('hex');
      if (hmac !== expectedHmac) {
        console.error('HMAC verification failed for key:', key);
        delete session.data[key];
        continue; // Skip to the next item
      }

      try {
        decryptedData[key] = decryptData(encryptedData, encryptionKey);
      } catch (error) {
        console.error('Decryption error:', error);
        delete session.data[key];
      }
    }
  }

  return decryptedData;
}

// Function to update session data (encrypts data and adds HMAC)
function updateSessionData(sessionId, encryptionKey, newData) {
  const session = sessions[sessionId];
  if (!session) {
    return false;
  }

  // Encrypt new data before storing
  for (const key in newData) {
    if (newData.hasOwnProperty(key)) {
      const ciphertext = encryptData(newData[key], encryptionKey);
      const hmacKey = session.hmacKey;
      const hmac = crypto.createHmac('sha256', hmacKey).update(ciphertext).digest('hex');
      session.data[key] = { ciphertext, hmac };
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