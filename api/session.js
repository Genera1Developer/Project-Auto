const security = require('./security');

const sessionKeys = {}; // In-memory session key storage (DO NOT USE IN PRODUCTION)

function createSession(userId) {
  const sessionId = security.generateSecureKey(16); // 16 bytes = 32 hex chars
  const sessionKey = security.generateSecureKey(32); // 32 bytes = 64 hex chars
  sessionKeys[sessionId] = { userId, key: sessionKey };
  return { sessionId, sessionKey };
}

function getSession(sessionId) {
  return sessionKeys[sessionId] || null;
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