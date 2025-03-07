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
                cache.put(event.request, responseToCache);
                console.log('ServiceWorker: Caching new resource:', event.request.url);
                return response;
              })
              .catch(err => {
                console.warn('ServiceWorker: Cache PUT failed.', err);
                return response;
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
        cacheNames.filter(cacheName => cacheName.startsWith('my-site-cache') && cacheName !== CACHE_NAME)
          .map(cacheName => {
            console.log('ServiceWorker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('ServiceWorker: Activated and ready to handle fetches!');
      return self.clients.claim();
    })
  );
});