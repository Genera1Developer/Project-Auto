const secureHeaders = {
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Feature-Policy": "microphone 'none'; camera 'none'; geolocation 'none'",
    "Permissions-Policy": "interest-cohort=()",
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": 'no-store, must-revalidate',
    "Pragma": 'no-cache',
    "Expires": '0'
};

const HSTS_MAX_AGE = 31536000;

function setContentSecurityPolicy(isHttps) {
    let csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; upgrade-insecure-requests; block-all-mixed-content;";
    if (isHttps) {
        csp += " require-trusted-types-for 'script'; trusted-types default;";
    }
    return csp;
}

function getStrictTransportSecurityHeader() {
    return `max-age=${HSTS_MAX_AGE}; includeSubDomains; preload`;
}

module.exports = {
    secureHeaders,
    setContentSecurityPolicy,
    getStrictTransportSecurityHeader
};