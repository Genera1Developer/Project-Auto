self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Add custom fetch logic here if needed.
  // For example, you can intercept requests and modify them.
  // Or you can serve cached content.
  // By default, just pass the request through.
  event.respondWith(fetch(event.request));
});