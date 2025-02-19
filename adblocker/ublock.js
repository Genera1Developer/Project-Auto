## File Structure

- `adblocker/ublock.js`
- `adblocker/ublock.worker.js`
- `service-worker.js`
- `package.json`
- `README.md`

## Improved Raw Code for `adblocker/ublock.js`

```javascript
importScripts('ublock.worker.js');

const cacheName = 'ublock-cache';
const cacheAssets = [];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.addAll(cacheAssets);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        if (event.request.url.includes('google-analytics.com')) {
          return new Response('', {
            status: 200,
            headers: {
              'Content-Type': 'text/plain',
            },
          });
        }

        const clonedResponse = response.clone();
        if (clonedResponse.headers.get('Cross-Origin-Opener-Policy') === 'same-origin') {
          clonedResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
        }
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, clonedResponse);
        });

        return response;
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'blockRequest') {
    fetch(event.data.url).then((response) => {
      event.ports[0].postMessage({
        type: 'blockResponse',
        url: event.data.url,
        status: response.status
      });
    });
  }
});
```