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
  'connection', // Prevent connection issues
  'transfer-encoding', // Prevent transfer encoding issues
  'pragma', // Add pragma header
  'age' // Add age header for caching
]);

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/service/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response.ok) {
            console.error('Service worker fetch failed:', response.status, response.statusText, event.request.url);
            return new Response(`Service Worker Error: ${response.status} ${response.statusText} - ${event.request.url}`, {
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

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers
          });
        })
        .catch(err => {
          console.error('Error fetching from service worker:', err);
          return new Response('Service Worker Error: ' + err.message, {
            status: 500,
            statusText: 'Service Worker Error',
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
  } else {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response.ok) {
            console.error('Original request fetch failed:', response.status, response.statusText, event.request.url);
            return new Response(`Service Worker Error: ${response.status} ${response.statusText} - ${event.request.url}`, {
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
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers
          });
        })
        .catch(err => {
          console.error('Error fetching original request:', err);
          return new Response('Service Worker Error: Failed to fetch original request - ' + err.message, {
            status: 500,
            statusText: 'Service Worker Error',
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
  }
});