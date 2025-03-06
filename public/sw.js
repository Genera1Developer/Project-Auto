const CACHE_NAME = 'my-site-cache-v2';
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
      .then(() => self.skipWaiting()) // Immediately activate
      .catch(err => console.error('ServiceWorker: Cache opening failed: ', err))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          console.log('ServiceWorker: Found in cache:', event.request.url);
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // to send to the server AND cache it, we need to clone it.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              console.log('ServiceWorker: Invalid response:', response ? response.status : 'No response');
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as cache it, we need to clone it here.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('ServiceWorker: Caching new resource:', event.request.url);
              })
              .catch(err => console.warn('ServiceWorker: Cache PUT failed.', err));

            return response;
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
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('ServiceWorker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('ServiceWorker: Activated and ready to handle fetches!');
      return self.clients.claim(); //Take control of uncontrolled pages
    })
  );
});