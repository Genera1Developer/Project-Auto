// api/session.js

const { generateSecureKey, encryptData, decryptData } = require('./security');

// Session storage (in-memory for simplicity, consider using a database in production)
const sessions = {};

// Session timeout in milliseconds (e.g., 30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Function to create a new session
function createSession() {
  const sessionId = generateSecureKey(16); // 16 bytes = 32 hex chars
  const encryptionKey = generateSecureKey(32); // AES-256 key (32 bytes = 64 hex chars)

  sessions[sessionId] = {
    encryptionKey: encryptionKey,
    encryptedData: encryptData('{}', encryptionKey), // Store data as encrypted JSON string
    createdAt: Date.now(),
    lastAccessed: Date.now(),
  };

  return { sessionId, encryptionKey };
}

// Function to get session data
function getSessionData(sessionId, encryptionKey) {
  const session = sessions[sessionId];
  if (!session) {
    return null;
  }

  if (Date.now() - session.lastAccessed > SESSION_TIMEOUT) {
    destroySession(sessionId);
    return null;
  }

  session.lastAccessed = Date.now();
  try {
    const decryptedData = decryptData(session.encryptedData, encryptionKey);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Error decrypting session data:", error);
    destroySession(sessionId); // Destroy potentially corrupted session.
    return null;
  }
}

// Function to update session data
function updateSessionData(sessionId, encryptionKey, newData) {
  const session = sessions[sessionId];
  if (!session) {
    return false;
  }

  if (Date.now() - session.lastAccessed > SESSION_TIMEOUT) {
    destroySession(sessionId);
    return false;
  }

  session.lastAccessed = Date.now();

  try {
    const decryptedData = decryptData(session.encryptedData, encryptionKey);
    const existingData = JSON.parse(decryptedData);
    const mergedData = { ...existingData, ...newData };
    const encryptedData = encryptData(JSON.stringify(mergedData), encryptionKey);
    session.encryptedData = encryptedData;
    return true;
  } catch (error) {
    console.error("Error updating session data:", error);
    destroySession(sessionId); // Destroy potentially corrupted session.
    return false;
  }
}

// Function to destroy a session
function destroySession(sessionId) {
  delete sessions[sessionId];
}

// Middleware to handle session management
function sessionMiddleware(req, res, next) {
  let sessionId = req.cookies.sessionId;

  if (!sessionId || !sessions[sessionId]) {
    const newSession = createSession();
    sessionId = newSession.sessionId;

    // Set the session cookie with HttpOnly and Secure flags
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: true, // Only send over HTTPS
      sameSite: 'Strict', // Recommended for security
      maxAge: SESSION_TIMEOUT,
    });

    req.session = {
      sessionId: sessionId,
      encryptionKey: newSession.encryptionKey,
    };
  } else {
    const session = sessions[sessionId];
    if (Date.now() - session.lastAccessed > SESSION_TIMEOUT) {
      destroySession(sessionId);
      res.clearCookie('sessionId');
      return res.status(401).send('Session expired. Please refresh the page.'); // Or redirect to login
    }
    req.session = {
      sessionId: sessionId,
      encryptionKey: session.encryptionKey,
    };
  }

  // Attach session data to req object after session creation or validation
  req.session.data = getSessionData(req.session.sessionId, req.session.encryptionKey) || {};
  req.updateSessionData = (newData) => updateSessionData(req.session.sessionId, req.session.encryptionKey, newData);

  next();
}

module.exports = {
  createSession,
  getSessionData,
  updateSessionData,
  destroySession,
  sessionMiddleware,
};