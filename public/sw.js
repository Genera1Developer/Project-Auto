self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('my-site-cache')
      .then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/style.css',
          '/script.js',
          '/offline.html'
        ]);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }

      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        function(response) {
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();

          caches.open('my-site-cache')
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        }
      ).catch(function() {
        return caches.match('/offline.html');
      });
    })
  );
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['my-site-cache'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});