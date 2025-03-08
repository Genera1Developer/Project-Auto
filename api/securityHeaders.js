const crypto = require('crypto');

function generateNonce(length = 16) {
  return crypto.randomBytes(length).toString('base64');
}

function setSecurityHeaders(res, options = {}) {
  const { nonceValue } = options;
  const scriptSrcNonce = nonceValue || generateNonce();

  // HSTS to ensure browser enforces HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Prevent Clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', `frame-ancestors 'none'; script-src 'nonce-${scriptSrcNonce}' 'strict-dynamic' 'unsafe-inline' https: http:; object-src 'none'; base-uri 'none';`);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Mitigate XSS attacks
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Remove server identification
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');

  return scriptSrcNonce;
}

module.exports = setSecurityHeaders;