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
    saveUninitialized: false, // Only save when modified
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
      httpOnly: true, // Prevent client-side access to cookies
      maxAge: 3600000, // Session duration (e.g., 1 hour)
      sameSite: 'strict' // Help prevent CSRF attacks
    },
    store: new (require('connect-pg-simple')(session))({ // Example using PostgreSQL for session storage
      conString: process.env.DATABASE_URL, // Connection string from environment variables
      tableName: 'session' // Use a separate session table
    })
  }));

  // Middleware to encrypt session data
  app.use((req, res, next) => {
    if (req.session) {
      for (const key in req.session) {
        if (key !== 'cookie' && req.session.hasOwnProperty(key)) {
          try {
            const stringifiedData = JSON.stringify(req.session[key]);
            req.session[key] = security.encryptData(stringifiedData, sessionSecret);
          } catch (error) {
            console.error('Failed to encrypt session data:', error);
            return next(error); // Pass the error to the error handler
          }
        }
      }
      req.session.save(function (err) {
        if (err) {
          console.error('Failed to save encrypted session data:', err);
          return next(err);
        }
        next();
      });
    } else {
      next();
    }
  });


  // Middleware to decrypt session data
  app.use((req, res, next) => {
    if (req.session) {
      for (const key in req.session) {
        if (key !== 'cookie' && req.session.hasOwnProperty(key) && typeof req.session[key] === 'string') {
          try {
            const decryptedData = security.decryptData(req.session[key], sessionSecret);
            req.session[key] = JSON.parse(decryptedData);
          } catch (error) {
            console.error('Failed to decrypt session data:', error);
            // Handle decryption error appropriately, maybe destroy session
            req.session.destroy((err) => {
              if (err) console.error("Error destroying session:", err);
              return res.redirect('/error'); // Redirect to error page or login
            });
            return;
          }
        }
      }
    }
    next();
  });
}

module.exports = {
  configureSession
};