// api/session.js

const { generateSecureKey, encryptData, decryptData } = require('./security');

// Session storage (in-memory for simplicity, consider using a database in production)
const sessions = {};

// Function to create a new session
function createSession() {
  const sessionId = generateSecureKey(16); // 16 bytes = 32 hex chars
  const encryptionKey = generateSecureKey(32); // AES-256 key (32 bytes = 64 hex chars)

  sessions[sessionId] = {
    encryptionKey: encryptionKey,
    data: {},
    createdAt: Date.now(),
    lastAccessed: Date.now(),
  };

  return { sessionId, encryptionKey };
}

// Function to get session data
function getSessionData(sessionId) {
  const session = sessions[sessionId];
  if (!session) {
    return null;
  }

  session.lastAccessed = Date.now();
  return session.data;
}

// Function to update session data
function updateSessionData(sessionId, newData) {
  const session = sessions[sessionId];
  if (!session) {
    return false;
  }

  session.data = { ...session.data, ...newData };
  session.lastAccessed = Date.now();
  return true;
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
    });

    req.session = {
      sessionId: sessionId,
      encryptionKey: newSession.encryptionKey,
      data: {},
    };
  } else {
    req.session = {
      sessionId: sessionId,
      encryptionKey: sessions[sessionId].encryptionKey,
      data: getSessionData(sessionId),
    };
  }

  next();
}

module.exports = {
  createSession,
  getSessionData,
  updateSessionData,
  destroySession,
  sessionMiddleware,
};