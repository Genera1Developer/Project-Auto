const settings = {
  httpsEnabled: true,
  encryptionKey: 'YOUR_SECURE_KEY_HERE',
  port: 8080,
  proxyServerAddress: 'http://default.proxy.server:3128',
  allowedDomains: ['*.example.com', 'example.org'],
  cacheEnabled: true,
  cacheExpiration: 3600,
  requestTimeout: 15000,
  maxFileSize: 10485760,
  logLevel: 'info',
  enableCompression: true,
  securityHeaders: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';"
  }
};

export default settings;