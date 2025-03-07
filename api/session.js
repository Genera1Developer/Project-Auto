const security = require('./security');
const crypto = require('crypto');

const sessionKeys = {}; // In-memory session key storage (DO NOT USE IN PRODUCTION)

function createSession(userId) {
  const sessionId = crypto.randomBytes(16).toString('hex'); // Generate a random session ID
  const sessionKey = security.generateSecureKey(32); // 32 bytes = 64 hex chars
  const sessionExpiry = new Date(Date.now() + 3600000); // Session expires in 1 hour (1 hour = 3600000 ms)
  sessionKeys[sessionId] = { userId, key: sessionKey, expiry: sessionExpiry };
  return { sessionId, sessionKey };
}

function getSession(sessionId) {
  const session = sessionKeys[sessionId];
  if (session && session.expiry > new Date()) {
    return session;
  } else {
    deleteSession(sessionId); // Remove expired session
    return null;
  }
}

function deleteSession(sessionId) {
  delete sessionKeys[sessionId];
}

function protectRoute(req, res, next) {
  const sessionId = req.headers['x-session-id']; // Get session ID from header
  const sessionKey = req.headers['x-session-key']; // Get session key from header

  if (!sessionId || !sessionKey) {
    return res.status(401).json({ error: 'Unauthorized: Missing session credentials' });
  }

  const session = getSession(sessionId);

  if (!session || session.key !== sessionKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid session credentials' });
  }

  req.userId = session.userId; // Attach user ID to the request object
  next();
}

module.exports = {
  createSession,
  getSession,
  deleteSession,
  protectRoute,
};