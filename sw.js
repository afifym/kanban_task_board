const staticCacheName = "site-static-v1";
// stores request urls (key)
// also add CDNs here, cdns can refer to other urls, so u will have to
// those too
const assets = [
  "/",
  "/index.html",
  "/images/logo.svg",
  "/js/view.js",
  "js/controller.js",
  "js/model.js",
  "/css/all.min.css",
];

self.addEventListener("install", (e) => {
  // makes install wait unitl caching is done
  e.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("activate", (e) => {
  // because if activate happens very quick, we may not
  // have time to execute the function
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName)
          .map((key) => {
            caches.delete(key);
          })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cacheRes) => {
      return cacheRes || fetch(e.request);
    })
  );
});
