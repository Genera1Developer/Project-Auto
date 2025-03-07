const passthroughHeaders = new Set([
  'content-encoding',
  'content-length',
  'content-type',
  'content-language',
  'etag',
  'last-modified',
  'accept-ranges',
  'content-range',
  'date',
  'expires',
  'cache-control',
  'vary',
  'connection',
  'transfer-encoding',
  'pragma',
  'age',
  'location',
  'content-disposition',
  'x-content-type-options',
  'x-frame-options',
  'x-xss-protection',
  'cross-origin-resource-policy',
  'content-security-policy',
  'strict-transport-security',
  'permissions-policy',
  'link',
  'x-robots-tag',
  'report-to',
  'nel',
  'alt-svc',
  'content-security-policy-report-only',
  'x-permitted-cross-domain-policies',
  'x-download-options',
]);

const disallowedResponseHeaders = new Set([
    'public-key-pins',
    'public-key-pins-report-only',
    'clear-site-data',
    'server',
    'x-powered-by',
    'x-aspnet-version',
    'x-drupal-cache',
    'x-generator',
]);

const HSTS_MAX_AGE = 31536000;

async function handleRequest(event) {
  try {
    let url = event.request.url;
    const urlObj = new URL(event.request.url);

    if (urlObj.pathname.startsWith('/service/')) {
      url = url.replace('/service/', '/');
    }

    const requestHeaders = new Headers(event.request.headers);
    requestHeaders.delete('service-worker');
    requestHeaders.delete('host');
    requestHeaders.delete('origin');
    requestHeaders.delete('referer');
    requestHeaders.delete('x-forwarded-for');
    requestHeaders.delete('x-real-ip');
    requestHeaders.delete('if-modified-since');
    requestHeaders.delete('if-none-match');
    requestHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    const fetchOptions = {
      method: event.request.method,
      headers: requestHeaders,
      redirect: 'manual',
    };

    if (event.request.body) {
      fetchOptions.body = event.request.body;
    }

    let response = await fetch(url, fetchOptions);

    let redirectCount = 0;
    while ((response.status === 301 || response.status === 302 || response.status === 307 || response.status === 308) && redirectCount < 5) {
      const redirectURL = response.headers.get('location');
      if (!redirectURL) {
        break;
      }

      const absoluteRedirectURL = new URL(redirectURL, url).href;
      url = absoluteRedirectURL;
      requestHeaders.delete('origin');
      requestHeaders.delete('referer');
      fetchOptions.body = event.request.body;
      response = await fetch(url, {
        method: event.request.method,
        headers: requestHeaders,
        redirect: 'manual',
        body: fetchOptions.body
      });
      redirectCount++;
    }

    if (!response.ok && response.status !== 301 && response.status !== 302 && response.status !== 307 && response.status !== 308) {
      console.error('Fetch failed:', response.status, response.statusText, url);
      return new Response(`Service Worker Error: ${response.status} ${response.statusText} - ${url}`, {
        status: response.status,
        statusText: 'Service Worker Error',
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const headers = new Headers();
    for (const [key, value] of response.headers.entries()) {
      const lowerKey = key.toLowerCase();
      if (passthroughHeaders.has(lowerKey) && !disallowedResponseHeaders.has(lowerKey)) {
        try {
          headers.set(key, value);
        } catch (e) {
          console.warn(`Failed to set header ${key}: ${e}`);
        }
      }
    }

    if (!headers.has('Content-Type')) {
        const contentType = response.headers.get('Content-Type');
        if (contentType) {
            headers.set('Content-Type', contentType);
        } else {
            headers.set('Content-Type', 'text/plain; charset=utf-8');
        }
    }

    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'no-referrer');
    headers.set('Feature-Policy', "microphone 'none'; camera 'none'; geolocation 'none'");
    headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; upgrade-insecure-requests; block-all-mixed-content;");
    headers.set('Strict-Transport-Security', `max-age=${HSTS_MAX_AGE}; includeSubDomains; preload`);
    headers.set('Cache-Control', 'no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    headers.set('Permissions-Policy', 'interest-cohort=()');
    headers.set('X-Robots-Tag', 'noindex, nofollow');

    const body = await response.blob();
    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  } catch (err) {
    console.error('Fetch error:', err);
    return new Response('Service Worker Error: ' + err.message, {
      status: 500,
      statusText: 'Service Worker Error',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith('https')) {
    event.respondWith(handleRequest(event));
  } else {
    event.respondWith(
      new Response('HTTPS required', {
        status: 400,
        statusText: 'HTTPS Required',
        headers: { 'Content-Type': 'text/plain' },
      })
    );
  }
});