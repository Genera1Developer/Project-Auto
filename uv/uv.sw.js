self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const TRUSTED_TYPES_POLICY = trustedTypes && trustedTypes.createPolicy('ultraviolet', {
  createHTML: (string) => string,
  createScriptURL: (string) => string,
  createScript: (string) => string,
});

const isTrustedTypesSupported = typeof trustedTypes !== 'undefined' && trustedTypes.createPolicy;

const encoder = new TextEncoder();

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/service/')) {
    const proxiedUrl = url.searchParams.get('url');

    if (!proxiedUrl) {
      event.respondWith(new Response('<h1>Error: Missing URL parameter</h1>', {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
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
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
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
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            });
          }

          if (!response.ok) {
            console.error('HTTP error:', response.status, response.statusText);
            return new Response(`<h1>Error: Proxy request failed with status ${response.status}</h1><p>${response.statusText}</p>`, {
              status: response.status,
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            });
          }

          const headers = new Headers(response.headers);
          headers.set('Access-Control-Allow-Origin', '*');

          // Remove potentially harmful headers
          headers.delete('content-security-policy');
          headers.delete('content-security-policy-report-only');
          headers.delete('clear-site-data');
          headers.delete('feature-policy');
          headers.delete('permissions-policy');
          headers.delete('x-frame-options');
          headers.delete('x-xss-protection');
          headers.delete('x-content-type-options');
          headers.delete('strict-transport-security');

          let responseBody;
          try {
            responseBody = await response.blob();
          } catch (error) {
            console.error('Failed to read response body:', error);
            return new Response(`<h1>Error: Could not read response body from target</h1><p>${error}</p>`, {
              status: 502,
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            });
          }

          return new Response(responseBody, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
          });
        } catch (error) {
          console.error('Unexpected error:', error);
          return new Response(`<h1>Error: An unexpected error occurred</h1><p>${error}</p>`, {
            status: 500,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }
      })()
    );
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);

        // Check if the response is an Opaque response
        if (response.type === 'opaque') {
          return new Response('<h1>Error: Blocked Opaque Response</h1><p>The server returned an opaque response, which is likely due to CORS restrictions.  The requested resource may not be accessible from this proxy.</p>', {
            status: 502,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }

        const headers = new Headers(response.headers);
        const contentType = headers.get('Content-Type');

        if (contentType && (contentType.includes('text/html') || contentType.includes('application/xhtml+xml'))) {
          let responseText = await response.text();

          try {
            if (isTrustedTypesSupported) {
              responseText = TRUSTED_TYPES_POLICY.createHTML(responseText);
            }

          } catch (error) {
            console.error('TrustedTypes error:', error);
          }

          return new Response(responseText, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
          });
        }

        return response;
      } catch (error) {
        console.error('Fetch error for original request:', error);
          const errorResponse = `<h1>Error: Fetch failed for original request</h1><p>${error}</p>`;
          return new Response(errorResponse, {
            status: 500,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
    })()
  );
});