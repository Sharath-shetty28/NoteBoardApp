const CACHE_NAME = "thinkboard-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/login.webp",
  "/signup.webp",
  "/favicon.ico",
  "/manifest.json",
  // add your CSS/JS bundles here
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

