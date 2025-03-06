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
            headers: new Headers(event.request.headers),
            method: event.request.method,
            credentials: 'omit',
            redirect: 'follow'
          };

          let body = null;
          if (event.request.method !== 'GET' && event.request.method !== 'HEAD') {
            try {
              body = await event.request.blob();
            } catch (e) {
              console.error("Failed to read request body:", e);
              return new Response(`<h1>Error: Could not read request body</h1><p>${e}</p>`, {
                status: 400,
                headers: { 'Content-Type': 'text/html' },
              });
            }
            requestInit.body = body;
          }

          let response;
          try {
            response = await fetch(proxiedUrl, requestInit);
          } catch (error) {
            console.error('Fetch error:', error);
            return new Response(`<h1>Error: Target server unavailable or invalid URL</h1><p>${error}</p>`, {
              status: 502,
              headers: { 'Content-Type': 'text/html' },
            });
          }

          if (!response.ok) {
            console.error('HTTP error:', response.status, response.statusText);
            return new Response(`<h1>Error: Proxy request failed with status ${response.status}</h1><p>${response.statusText}</p>`, {
              status: response.status,
              headers: { 'Content-Type': 'text/html' },
            });
          }

          const headers = new Headers(response.headers);
          headers.set('Access-Control-Allow-Origin', '*');
          headers.delete('content-security-policy');
          headers.delete('content-security-policy-report-only');
          headers.delete('clear-site-data');

          let responseBody;
          try {
              responseBody = await response.blob();
          } catch (error) {
              console.error('Failed to read response body:', error);
              return new Response(`<h1>Error: Could not read response body from target</h1><p>${error}</p>`, {
                  status: 502,
                  headers: { 'Content-Type': 'text/html' },
              });
          }

          const contentType = response.headers.get('content-type');

          return new Response(responseBody, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
          });
        } catch (error) {
          console.error('Unexpected error:', error);
          return new Response(`<h1>Error: An unexpected error occurred</h1><p>${error}</p>`, {
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