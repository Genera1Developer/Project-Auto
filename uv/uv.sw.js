self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/service/')) {
    // Handle proxied requests
    const proxiedUrl = url.searchParams.get('url');
    if (proxiedUrl) {
      event.respondWith(fetch(proxiedUrl, {
        headers: event.request.headers,
        method: event.request.method,
        body: event.request.body,
        mode: 'cors',
        credentials: 'omit',
      }));
      return;
    } else {
      event.respondWith(new Response('<h1>Error: Missing URL parameter</h1>', {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      }));
      return;
    }
  }

  event.respondWith(fetch(event.request));
});