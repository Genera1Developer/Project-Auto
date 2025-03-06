self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/service/')) {
    // Handle requests to the proxy endpoint
    event.respondWith(
      fetch(event.request)
    );
  } else {
    // Bypass other requests
    event.respondWith(fetch(event.request));
  }
});