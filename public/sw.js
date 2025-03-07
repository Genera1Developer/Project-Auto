self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/app.js',
        '/style.css'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Check if the request is for the proxy itself. If so, bypass the cache.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(event.request).catch(err => {
        console.error('Network error fetching from origin:', err);
        return new Response('<h1>Service Unavailable</h1>', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/html' }
        });
      })
    );
    return;
  }

  // Intercept and potentially encrypt the response for HTTPS requests.
  if (event.request.url.startsWith('https://')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if the response is valid.
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching.
            const responseToCache = response.clone();

            // Read the response body as text for potential encryption.
            return response.text().then(body => {
              // TODO: Implement actual encryption logic here. Replace with a real encryption algorithm.
              const key = 'secret key'; // Store this securely in a real implementation
              const encryptedBody = CryptoJS.AES.encrypt(body, key).toString();

              // Create a new response with the encrypted body.
              const encryptedResponse = new Response(encryptedBody, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
              });

              // Store the encrypted response in the cache.
              caches.open('my-cache').then(cache => {
                cache.put(event.request, encryptedResponse.clone());
              });

              return encryptedResponse;
            });
          })
          .catch(err => {
            console.error('Network error fetching (HTTPS):', err);
            return new Response('<h1>Service Unavailable</h1>', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/html' }
            });
          });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        (response) => {
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();

          caches.open('my-cache')
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }
      ).catch(err => {
        console.error('Network error fetching:', err);
          return new Response('<h1>Service Unavailable</h1>', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/html' }
          });
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['my-cache'];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js');