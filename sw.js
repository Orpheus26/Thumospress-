/* ============================================================
   THUMOS — self-destructing service worker

   The previous build registered a worker here that precached the whole
   magazine. Browsers that still have it will check this file for updates
   and receive this version, which deletes every cache and unregisters
   itself, then reloads any open tabs onto the live site.

   Keep this file in place until returning visitors have been flushed.
   Do not add caching logic to it.
   ============================================================ */

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (key) { return caches.delete(key); }));
      })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: 'window' }); })
      .then(function (clients) {
        clients.forEach(function (client) { client.navigate(client.url); });
      })
      .catch(function () { /* best effort */ })
  );
});

// Never serve from cache again — always go to the network.
self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request));
});
