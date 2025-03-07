const session = require('express-session');
const crypto = require('crypto');
const security = require('./security');

// Function to generate a session secret
function generateSessionSecret() {
  return crypto.randomBytes(64).toString('hex');
}

const sessionSecret = generateSessionSecret(); // Generate a strong session secret

// Configure session middleware with encryption
function configureSession(app) {
  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true, // Only send cookies over HTTPS
      httpOnly: true, // Prevent client-side JavaScript access
      sameSite: 'strict', // Help prevent CSRF attacks
      maxAge: 60 * 60 * 1000, // Session duration (e.g., 1 hour)
    },
    store: new session.MemoryStore(), // Use a proper session store in production
  }));
}

module.exports = {
  configureSession,
};