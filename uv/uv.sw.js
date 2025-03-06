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
            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Clone the response so it can be used more than once
            const clonedResponse = response.clone();
            const contentType = clonedResponse.headers.get('content-type');

            // Check if the content type is text-based before reading as text
            if (contentType && contentType.includes('text')) {
              const bodyText = await clonedResponse.text();
              return new Response(bodyText, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
              });
            } else {
              // For non-text content, return the original cloned response
              return clonedResponse;
            }

          }).catch(error => {
            return new Response(`<h1>Error: Proxy request failed</h1><p>${error}</p>`, {
              status: 500,
              headers: { 'Content-Type': 'text/html' },
            });
          })
        );
      } catch (error) {
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