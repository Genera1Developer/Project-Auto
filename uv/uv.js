self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

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
  'x-xss-protection'
]);

async function handleRequest(event) {
  try {
    let url = event.request.url;
    const urlObj = new URL(event.request.url);

    // Remove the /service/ prefix if it exists
    if (urlObj.pathname.startsWith('/service/')) {
      url = url.replace('/service/', '/');
    }

    const requestHeaders = new Headers(event.request.headers);
    // Remove potentially problematic headers
    requestHeaders.delete('service-worker');
    requestHeaders.delete('host');
    requestHeaders.delete('origin');
    requestHeaders.delete('referer'); // Remove referer header

    const fetchOptions = {
      method: event.request.method,
      headers: requestHeaders,
      redirect: 'manual' // Important to handle redirects manually
    };

    if (event.request.body) {
      fetchOptions.body = event.request.body;
    }

    let response = await fetch(url, fetchOptions);

    // Handle redirects manually
    let redirectCount = 0;
    while ((response.status === 301 || response.status === 302 || response.status === 307 || response.status === 308) && redirectCount < 5) {
      const redirectURL = response.headers.get('location');
      if (!redirectURL) {
        break;
      }

      const absoluteRedirectURL = new URL(redirectURL, url).href;
      url = absoluteRedirectURL;
      requestHeaders.delete('origin'); // Remove origin header for redirects
      requestHeaders.delete('referer'); // Remove referer header for redirects
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
      if (passthroughHeaders.has(key.toLowerCase())) {
        headers.set(key, value);
      }
    }

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

self.addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});