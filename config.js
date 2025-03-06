const config = {
  prefix: process.env.PROXY_PREFIX || '/proxy/',
  encodeUrl: process.env.ENCODE_URL === 'false' ? false : true,
  decodeUrl: process.env.DECODE_URL === 'false' ? false : true,
  handler: process.env.HANDLER_PATH || '/handler.js',
  port: parseInt(process.env.PORT, 10) || 3000,
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'],
  cacheMaxAge: parseInt(process.env.CACHE_MAX_AGE, 10) || 0,
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10) || 15000,
  followRedirects: process.env.FOLLOW_REDIRECTS === 'false' ? false : true,
  maxRedirects: parseInt(process.env.MAX_REDIRECTS, 10) || 5,
  logLevel: process.env.LOG_LEVEL || 'info',
  userAgent: process.env.USER_AGENT || 'WebProxy/1.0',
  xForwardedFor: process.env.X_FORWARDED_FOR === 'false' ? false : true,
  https: process.env.HTTPS === 'true',
  httpsCert: process.env.HTTPS_CERT || '',
  httpsKey: process.env.HTTPS_KEY || '',
  rewriteUrls: process.env.REWRITE_URLS === 'true', // Enable URL rewriting if REWRITE_URLS environment variable is set to true
  removeScriptTags: process.env.REMOVE_SCRIPT_TAGS === 'true', // Enable script tag removal
};

export default config;