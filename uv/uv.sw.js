self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Example: Intercept requests to a specific domain and redirect them.
  if (url.hostname === 'example.com') {
    event.respondWith(
      new Response('<h1>This domain is being proxied!</h1>', {
        headers: { 'Content-Type': 'text/html' },
      })
    );
    return;
  }

  event.respondWith(fetch(event.request));
});