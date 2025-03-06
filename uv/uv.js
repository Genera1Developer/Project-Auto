self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

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
          return response;
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