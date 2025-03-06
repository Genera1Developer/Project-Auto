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
      try {
        event.respondWith(
          fetch(proxiedUrl, {
            headers: event.request.headers,
            method: event.request.method,
            body: event.request.body,
            mode: 'cors',
            credentials: 'omit',
          }).then(async response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('text')) {
              try {
                const bodyText = await response.text();
                return new Response(bodyText, {
                  status: response.status,
                  statusText: response.statusText,
                  headers: response.headers
                });
              } catch (textError) {
                console.error('Error reading text:', textError);
                return new Response(`<h1>Error: Could not read response as text</h1><p>${textError}</p>`, {
                  status: 500,
                  headers: { 'Content-Type': 'text/html' },
                });
              }
            } else {
              return response;
            }
          }).catch(error => {
            console.error('Fetch error:', error);
            return new Response(`<h1>Error: Proxy request failed</h1><p>${error}</p>`, {
              status: 500,
              headers: { 'Content-Type': 'text/html' },
            });
          })
        );
      } catch (error) {
        console.error('General error:', error);
        event.respondWith(new Response(`<h1>Error: Proxy request failed</h1><p>${error}</p>`, {
          status: 500,
          headers: { 'Content-Type': 'text/html' },
        }));
      }
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