const config = {
  prefix: '/proxy/',
  encodeUrl: true,
  decodeUrl: true,
  handler: '/handler.js',
  port: process.env.PORT || 3000,
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'],
  cacheMaxAge: 0,
  requestTimeout: 15000,
  followRedirects: true,
  maxRedirects: 5,
  logLevel: process.env.LOG_LEVEL || 'info', // Add log level configuration, default to 'info'
  userAgent: 'WebProxy/1.0', // Add a default User-Agent header
  xForwardedFor: true, // Whether to add X-Forwarded-For header
};

export default config;