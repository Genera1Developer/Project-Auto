const config = {
  prefix: '/proxy/',
  encodeUrl: true,
  decodeUrl: true,
  handler: '/handler.js',
  port: process.env.PORT || 3000,
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'],
  cacheMaxAge: parseInt(process.env.CACHE_MAX_AGE, 10) || 0, // Parse cacheMaxAge from env and default to 0
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10) || 15000, // Parse requestTimeout from env and default to 15000
  followRedirects: process.env.FOLLOW_REDIRECTS === 'false' ? false : true, // Parse followRedirects from env
  maxRedirects: parseInt(process.env.MAX_REDIRECTS, 10) || 5, // Parse maxRedirects from env and default to 5
  logLevel: process.env.LOG_LEVEL || 'info',
  userAgent: 'WebProxy/1.0',
  xForwardedFor: process.env.X_FORWARDED_FOR === 'false' ? false : true, // Allow disabling X-Forwarded-For
  https: process.env.HTTPS === 'true', // Enable HTTPS if HTTPS environment variable is set to true
  httpsCert: process.env.HTTPS_CERT || '', // Path to HTTPS certificate
  httpsKey: process.env.HTTPS_KEY || '', // Path to HTTPS key
};

export default config;