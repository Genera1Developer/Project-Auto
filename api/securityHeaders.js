const secureHeaders = {
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Feature-Policy": "microphone 'none'; camera 'none'; geolocation 'none'",
  "Permissions-Policy": "interest-cohort=()",
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

const addSecureHeaders = (response) => {
  for (const key in secureHeaders) {
    if (secureHeaders.hasOwnProperty(key)) {
      response.headers.set(key, secureHeaders[key]);
    }
  }
  return response;
};

module.exports = { addSecureHeaders, secureHeaders };