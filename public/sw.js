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
          .then(async response => {
            // Check if the response is valid.
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching.
            const responseToCache = response.clone();

            try {
              // Read the response body as ArrayBuffer for encryption.
              const body = await response.arrayBuffer();

              // Generate a unique encryption key per request (for demonstration purposes only, never do this in production).
              const key = await crypto.subtle.generateKey(
                { name: "AES-CBC", length: 256 },
                true,
                ["encrypt", "decrypt"]
              );

              // Generate a random initialization vector (IV).
              const iv = crypto.getRandomValues(new Uint8Array(16));

              // Encrypt the response body.
              const encrypted = await crypto.subtle.encrypt(
                { name: "AES-CBC", iv: iv },
                key,
                body
              );

              // Convert the encrypted ArrayBuffer to a Uint8Array.
              const encryptedArray = new Uint8Array(encrypted);

              // Create a new response with the encrypted body and necessary headers.
              const encryptedResponse = new Response(encryptedArray, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
              });
               encryptedResponse.headers.set('Content-Type', 'application/octet-stream'); // Indicate encrypted content
               encryptedResponse.headers.set('X-Encryption-IV', btoa(String.fromCharCode(...iv))); // Store IV in header

               // Convert the CryptoKey to a JSON string for storage (INSECURE! NEVER DO THIS IN PRODUCTION).
                const keyExported = await crypto.subtle.exportKey("jwk", key);
                const keyString = JSON.stringify(keyExported);
                encryptedResponse.headers.set('X-Encryption-Key', btoa(keyString));

              // Store the encrypted response in the cache.
              caches.open('my-cache').then(cache => {
                cache.put(event.request, encryptedResponse.clone());
              });

              return encryptedResponse;

            } catch (err) {
              console.error('Encryption error:', err);
              return new Response('<h1>Encryption Failed</h1>', {
                status: 500,
                statusText: 'Encryption Failed',
                headers: { 'Content-Type': 'text/html' }
              });
            }
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

//importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js');