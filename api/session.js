const session = require('express-session');
const crypto = require('crypto');
const security = require('./security');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

// Function to generate a session secret
function generateSessionSecret() {
  return crypto.randomBytes(64).toString('hex');
}

// Rotate session secret periodically
let sessionSecret = generateSessionSecret();

setInterval(() => {
  sessionSecret = generateSessionSecret();
  console.log('Session secret rotated.');
}, 24 * 60 * 60 * 1000); // Rotate every 24 hours

// Configure session middleware with encryption
function configureSession(app) {
  // Configure Redis client
  const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    },
    password: process.env.REDIS_PASSWORD, // Add password if needed
  });

  redisClient.on('error', function (err) {
    console.log('Could not establish a connection with Redis. ' + err);
  });
  redisClient.on('connect', function (err) {
    console.log('Connected to Redis successfully');
  });

  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false, // Only save when session data is actually modified
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
      httpOnly: true, // Prevent client-side JavaScript access
      sameSite: 'strict', // Help prevent CSRF attacks
      maxAge: 60 * 60 * 1000, // Session duration (e.g., 1 hour)
    },
    store: new RedisStore({ client: redisClient }), // Use Redis for session storage
  }));
}

module.exports = {
  configureSession,
};