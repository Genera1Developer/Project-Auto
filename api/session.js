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
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false, // Only save when modified
    cookie: {
      secure: isProduction, // Only send cookies over HTTPS in production
      httpOnly: true, // Prevent client-side access to cookies
      maxAge: 3600000, // Session duration (e.g., 1 hour)
      sameSite: 'strict', // Help prevent CSRF attacks
      domain: isProduction ? '.yourdomain.com' : undefined // Specify domain for production
    },
    store: new (require('connect-pg-simple')(session))({ // Example using PostgreSQL for session storage
      conString: process.env.DATABASE_URL, // Connection string from environment variables
      tableName: 'session' // Use a separate session table
    })
  }));

  // Middleware to encrypt session data
  app.use((req, res, next) => {
    if (req.session) {
      try {
        for (const key in req.session) {
          if (key !== 'cookie' && req.session.hasOwnProperty(key)) {
            if (typeof req.session[key] !== 'string') {
              const stringifiedData = JSON.stringify(req.session[key]);
              req.session[key] = security.encryptData(stringifiedData, sessionSecret);
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
      } catch (error) {
        console.error('Failed to encrypt session data:', error);
        return next(error); // Pass the error to the error handler
      }

    } else {
      next();
    }
  });


  // Middleware to decrypt session data
  app.use((req, res, next) => {
    if (req.session) {
      try {
        for (const key in req.session) {
          if (key !== 'cookie' && req.session.hasOwnProperty(key) && typeof req.session[key] === 'string') {
            const decryptedData = security.decryptData(req.session[key], sessionSecret);
            req.session[key] = JSON.parse(decryptedData);
          }
        }
        next();
      } catch (error) {
        console.error('Failed to decrypt session data:', error);
        // Handle decryption error appropriately, maybe destroy session
        req.session.destroy((err) => {
          if (err) console.error("Error destroying session:", err);
          res.clearCookie('connect.sid');
          return res.status(500).send('Session decryption failed.');
        });
        return;
      }
    } else {
      next();
    }
  });
}

module.exports = {
  configureSession
};