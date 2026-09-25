/*
  SERVICE-WORKER.JS
  ------------------------------------------------------------------
  A minimal service worker — the piece that lets browsers treat
  Toy Haven as an installable app (the "Add to Home Screen" /
  install prompt requires one, alongside the manifest).

  It does ONE simple thing: cache the core files on install, then
  try to serve from that cache first before hitting the network.
  This means the site still loads (though with old data) if the
  connection drops — good enough for an academic project, without
  a more advanced caching strategy that would be hard to explain
  in a viva.
*/

const CACHE_NAME = "toy-haven-cache-v1";

// The files needed for the site's basic shell to load offline.
// Product/cart/wishlist DATA still lives in localStorage, not here.
const CORE_FILES = [
  "index.html",
  "products.html",
  "cart.html",
  "checkout.html",
  "collection.html",
  "support.html",
  "css/style.css",
  "js/products.js",
  "js/shopping-cart.js",
  "js/collection.js",
  "js/main.js",
  "js/products-page.js",
  "js/checkout.js",
  "js/support.js",
  "favicon/favicon.png",
  "manifest.json",
];

// On install: download and store every core file in the cache.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_FILES))
  );
});

// On every network request: check the cache first. If it's there,
// serve it instantly. If not, fall back to a normal network request.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Clean up old cache versions if CACHE_NAME is ever bumped later.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
});
