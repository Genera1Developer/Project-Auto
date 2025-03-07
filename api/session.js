// api/session.js

const session = require('express-session');
const crypto = require('crypto');
const security = require('./security');

// Function to generate a secure session secret
function generateSessionSecret() {
  return crypto.randomBytes(64).toString('hex');
}

// Configure session middleware with encryption
function configureSession(app) {
  const sessionSecret = generateSessionSecret();

  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true, // Only send cookies over HTTPS
      httpOnly: true, // Prevent client-side access to cookies
      maxAge: 3600000, // Session duration (e.g., 1 hour)
      sameSite: 'strict' // Help prevent CSRF attacks
    },
    store: new (require('connect-pg-simple')(session))({ // Example using PostgreSQL for session storage
      conString: process.env.DATABASE_URL, // Connection string from environment variables
      tableName: 'session' // Use a separate session table
    })
  }));

  // Middleware to encrypt/decrypt session data
  app.use((req, res, next) => {
    const originalSession = req.session.toJSON();

    req.session.regenerate(function(err) {
      if (err) next(err);
      for (const key in originalSession) {
        if(key !== 'cookie') {
          const encryptedData = security.encryptData(JSON.stringify(originalSession[key]), sessionSecret);
          req.session[key] = encryptedData
        }
      }
      req.session.save(function(err) {
        if (err) next(err);
        next();
      })
    })
  });

  app.use((req, res, next) => {
    const sessionSecret = generateSessionSecret();
    for (const key in req.session) {
      if(key !== 'cookie' && typeof req.session[key] === 'string'){
        try {
          const decryptedData = security.decryptData(req.session[key], sessionSecret);
          req.session[key] = JSON.parse(decryptedData);
        } catch (error) {
          console.error('Failed to decrypt session data:', error);
          // Handle decryption error appropriately, maybe destroy session
          req.session.destroy((err) => {
            if(err) console.error("Error destroying session:", err);
            res.redirect('/error'); // Redirect to error page or login
          });
          return;
        }
      }
    }
    next();
  });
}

module.exports = {
  configureSession
};