const { generateSecureKey, encryptData, decryptData, generateSalt, hashData, verifyHmac } = require('./security');
const crypto = require('crypto');

const sessionKeyLength = 32; // AES-256 key length
const sessionTimeout = 3600000; // 1 hour in milliseconds
const sessionInactivityTimeout = 1800000; // 30 minutes of inactivity timeout
const sessionSaltLength = 16;

// Session storage (in-memory for simplicity, consider Redis for production)
const sessions = {};

function createSession() {
  const sessionId = generateSecureKey(16); // Unique session ID
  const encryptionKey = generateSecureKey(sessionKeyLength); // Session-specific encryption key
  const hmacKey = generateSecureKey(32); // Key for HMAC integrity check
  const salt = generateSalt(sessionSaltLength); // Salt for hashing session ID
  const hashedSessionId = hashData(sessionId, salt);

  sessions[hashedSessionId] = {
    sessionId: sessionId, // Store the original session ID
    encryptionKey: encryptionKey,
    hmacKey: hmacKey,
    salt: salt,
    data: {}, // Store session data here
    createdAt: Date.now(),
    lastAccessed: Date.now(),
  };
  return { sessionId, encryptionKey };
}

function getSession(sessionId) {
  const salt = Object.values(sessions).find(session => session.sessionId === sessionId)?.salt;

  if (!salt) {
      return null;
  }
  const hashedSessionId = hashData(sessionId, salt);
  const session = sessions[hashedSessionId];

  if (!session) {
    return null;
  }

  if (Date.now() - session.createdAt > sessionTimeout) {
    destroySession(sessionId);
    return null;
  }

  if (Date.now() - session.lastAccessed > sessionInactivityTimeout) {
    destroySession(sessionId);
    return null;
  }

  session.lastAccessed = Date.now();
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
    const hmac = crypto.createHmac('sha256', session.hmacKey);
    hmac.update(JSON.stringify(data));
    const calculatedHmac = hmac.digest('hex');

  const plaintext = JSON.stringify({data: data, hmac: calculatedHmac});

  return encryptData(plaintext, session.encryptionKey);
}

function decryptSessionData(sessionId, encryptedData) {
  const session = getSession(sessionId);
  if (!session) {
    return null;
  }
  try {
    const plaintext = decryptData(encryptedData, session.encryptionKey);
    if (!plaintext) {
        destroySession(sessionId);
        return null;
    }
    const parsedData = JSON.parse(plaintext);
    const receivedHmac = parsedData.hmac;
    const data = parsedData.data;

        const hmac = crypto.createHmac('sha256', session.hmacKey);
        hmac.update(JSON.stringify(data));
        const calculatedHmac = hmac.digest('hex');

        if (receivedHmac !== calculatedHmac) {
            console.error('HMAC verification failed. Possible tampering.');
            destroySession(sessionId);
            return null;
        }

    return data;
  } catch (error) {
    console.error('Decryption error:', error);
    destroySession(sessionId); // Destroy session on decryption failure
    return null;
  }
}

function destroySession(sessionId) {
    const salt = Object.values(sessions).find(session => session.sessionId === sessionId)?.salt;

    if (!salt) {
        return;
    }
    const hashedSessionId = hashData(sessionId, salt);
    delete sessions[hashedSessionId];
}

module.exports = {
  createSession,
  getSession,
  updateSessionData,
  encryptSessionData,
  decryptSessionData,
  destroySession,
};