self.importScripts('./uv.bundle.js', './uv.config.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', event => event.respondWith(
    sw.fetch(event)
));