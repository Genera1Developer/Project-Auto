self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('my-site-cache')
      .then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/style.css',
          '/script.js',
          '/offline.html' // Add an offline page
        ]);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open('my-site-cache')
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(function() {
          // If both fail, show a generic fallback:
          return caches.match('/offline.html');
          // However, in reality you'd have many different
          // fallbacks, depending on the URL & headers.
          // Eg, a fallback silhouette image for avatars.
        });
      })
    );
});