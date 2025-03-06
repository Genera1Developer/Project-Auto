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
          const requestInit = {
            headers: event.request.headers,
            method: event.request.method,
            credentials: 'omit',
            redirect: 'follow'
          };

          if (event.request.method !== 'GET' && event.request.method !== 'HEAD') {
            try {
              requestInit.body = await event.request.blob();
            } catch (e) {
              console.error("Failed to read request body:", e);
              return new Response(`<h1>Error: Could not read request body</h1><p>${e}</p>`, {
                status: 400,
                headers: { 'Content-Type': 'text/html' },
              });
            }
          }
          
          const response = await fetch(proxiedUrl, requestInit);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const headers = new Headers(response.headers);
          headers.set('Access-Control-Allow-Origin', '*');

          const body = await response.blob();

          return new Response(body, {
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