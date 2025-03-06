const CACHE_NAME = 'my-site-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/offline.html'
];

self.addEventListener('install', event => {
  console.log('ServiceWorker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('ServiceWorker: Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('ServiceWorker: Installation complete and ready!');
        return self.skipWaiting();
      })
      .catch(err => console.error('ServiceWorker: Cache opening failed: ', err))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('ServiceWorker: Found in cache:', event.request.url);
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              console.log('ServiceWorker: Invalid response:', response ? response.status : 'No response');
              return response;
            }

            const responseToCache = response.clone();

            return caches.open(CACHE_NAME)
              .then(cache => {
                return cache.put(event.request, responseToCache);
              })
              .then(() => {
                console.log('ServiceWorker: Caching new resource:', event.request.url);
                return response;
              })
              .catch(err => {
                console.warn('ServiceWorker: Cache PUT failed.', err);
                return response; // Return the original response even if caching fails
              });
          })
          .catch(() => {
            console.log('ServiceWorker: Network request failed, serving offline page');
            return caches.match('/offline.html');
          });
      })
      .catch(err => console.error('ServiceWorker: Fetch failed: ', err))
  );
});

self.addEventListener('activate', event => {
  console.log('ServiceWorker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('my-site-cache')) {
            console.log('ServiceWorker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve(); // Add a resolved promise for caches that don't need deleting
        })
      );
    }).then(() => {
      console.log('ServiceWorker: Activated and ready to handle fetches!');
      return self.clients.claim();
    })
  );
});