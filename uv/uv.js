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
      fetch(event.request).catch(err => {
        console.error('Error fetching from service worker:', err);
        return new Response('Service Worker Error', {
          status: 500,
          statusText: 'Service Worker Error'
        });
      })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});