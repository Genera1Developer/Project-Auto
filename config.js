const config = {
  prefix: '/proxy/',
  encodeUrl: true,
  decodeUrl: true,
  handler: '/handler.js',
  port: process.env.PORT || 3000, // Default port or from environment variable
  allowedOrigins: ['*'], // Allow all origins by default, consider restricting in production.  Example: ['http://example.com', 'https://example.org']
  cacheMaxAge: 0, // Cache control max-age in seconds. 0 disables caching.
  requestTimeout: 15000, // Request timeout in milliseconds
  followRedirects: true, // Whether to follow redirects
  maxRedirects: 5, // Maximum number of redirects to follow
};

export default config;