self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/service/')) {
    const proxiedUrl = url.searchParams.get('url');

    if (!proxiedUrl) {
      event.respondWith(new Response('<h1>Error: Missing URL parameter</h1>', {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      }));
      return;
    }

    event.respondWith(
      (async () => {
        try {
          const response = await fetch(proxiedUrl, {
            headers: event.request.headers,
            method: event.request.method,
            body: event.request.body,
            mode: 'cors',
            credentials: 'omit',
            redirect: 'follow'
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const headers = new Headers(response.headers);
          headers.set('Access-Control-Allow-Origin', '*');

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
          });
        } catch (error) {
          console.error('Fetch error:', error);
          return new Response(`<h1>Error: Proxy request failed</h1><p>${error}</p>`, {
            status: 500,
            headers: { 'Content-Type': 'text/html' },
          });
        }
      })()
    );
    return;
  }

  event.respondWith(fetch(event.request));
});