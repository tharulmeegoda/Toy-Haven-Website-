
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
  // Only handle GET requests for files on our own site. Ignore
  // everything else (POST requests, Google Fonts, browser extensions,
  // etc.) and let the browser handle those normally — trying to
  // manage those ourselves is what was causing the "Failed to fetch"
  // error, since we have no cached fallback for files we never saved.
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => response)
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          // If there's genuinely nothing cached for this either,
          // return a plain error response instead of undefined —
          // undefined is what was causing the crash.
          return cached || new Response("Offline and not cached.", { status: 503 });
        });
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
