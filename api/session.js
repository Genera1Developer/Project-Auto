const { generateSecureKey, encryptData, decryptData } = require('./security');

// Session storage (in-memory for simplicity, replace with a database in production)
const sessions = {};

// Function to create a new session
function createSession() {
  const sessionId = generateSecureKey(32); // 32 bytes = 64 hex characters
  const encryptionKey = generateSecureKey(32); // Generate encryption key for session
  const session = {
    encryptionKey: encryptionKey,
    data: {},
    createdAt: Date.now(),
  };
  sessions[sessionId] = session;
  return { sessionId, encryptionKey };
}

// Function to get session data
function getSessionData(sessionId, encryptionKey) {
  const session = sessions[sessionId];
  if (!session) {
    return null;
  }

  if (!encryptionKey) {
    console.warn("Encryption key missing for session: ", sessionId);
    return null;
  }

  if (session.encryptionKey !== encryptionKey) {
    console.warn("Invalid encryption key for session: ", sessionId);
    return null;
  }

  try {
    const decryptedData = {};
    for (const key in session.data) {
      if (Object.hasOwn(session.data, key)) {
        decryptedData[key] = decryptData(session.data[key], encryptionKey);
      }
    }
    return decryptedData;
  } catch (error) {
    console.error("Decryption error: ", error);
    return null;
  }
}

// Function to update session data
function updateSessionData(sessionId, encryptionKey, newData) {
  const session = sessions[sessionId];
  if (!session) {
    return false;
  }

  if (!encryptionKey) {
    console.warn("Encryption key missing for session: ", sessionId);
    return false;
  }

  if (session.encryptionKey !== encryptionKey) {
    console.warn("Invalid encryption key for session: ", sessionId);
    return false;
  }

  try {
    const encryptedData = {};
    for (const key in newData) {
      if (Object.hasOwn(newData, key)) {
        encryptedData[key] = encryptData(newData[key], encryptionKey);
      }
    }

    // Atomic update using a new object
    const updatedSessionData = { ...session.data, ...encryptedData };
    sessions[sessionId] = { ...session, data: updatedSessionData }; // Create new session object

    return true;
  } catch (error) {
    console.error("Encryption error: ", error);
    return false;
  }
}


// Function to destroy a session
function destroySession(sessionId) {
  delete sessions[sessionId];
}

// Session timeout mechanism (example: 1 hour)
const SESSION_TIMEOUT = 3600000;

function cleanUpSessions() {
  const now = Date.now();
  for (const sessionId in sessions) {
    if (Object.hasOwn(sessions, sessionId)) { // Check if the property is directly in the object
        if (now - sessions[sessionId].createdAt > SESSION_TIMEOUT) {
          delete sessions[sessionId]; // Directly delete for thread safety.
        }
    }
  }
}

// Clean up sessions periodically (every 30 minutes)
const cleanupInterval = setInterval(cleanUpSessions, 1800000);

module.exports = {
  createSession,
  getSessionData,
  updateSessionData,
  destroySession,
  cleanupInterval, // Export the interval to allow stopping it if needed.
};