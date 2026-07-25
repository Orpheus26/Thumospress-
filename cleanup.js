/* ============================================================
   THUMOS — one-time cleanup

   Earlier builds of this site installed a service worker that cached the
   whole magazine. Anyone who visited then would keep being served that
   old cached site instead of this one. This tears it out.

   Safe to delete once the site has been live long enough that returning
   visitors have all been flushed — a month is plenty.
   ============================================================ */
(function () {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(function (regs) { regs.forEach(function (reg) { reg.unregister(); }); })
      .catch(function () { /* nothing to clean up */ });
  }

  if (window.caches && caches.keys) {
    caches.keys()
      .then(function (keys) {
        keys.forEach(function (key) {
          if (key.indexOf('thumos-') === 0) caches.delete(key);
        });
      })
      .catch(function () { /* nothing to clean up */ });
  }
})();
