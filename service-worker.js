
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
  self.skipWaiting(); // activate worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_FILES))
  );
});

// On every network request: check the cache first. If it's there,
// serve it instantly. If not, fall back to a normal network request.
self.addEventListener("fetch", (event) => {
  const requestUrl = event.request.url;

  // Only step in for our core shell files (the ones actually saved
  // during install — see CORE_FILES above). Everything else — product
  // images, hero images, Google Fonts, etc. — is left completely
  // alone and handled by a normal browser request, exactly as if this
  // service worker didn't exist. This is what avoids ever generating
  // a fake error response for files we never promised to manage.
  const isCoreFile = CORE_FILES.some((file) => requestUrl.endsWith(file));
  if (event.request.method !== "GET" || !isCoreFile) {
    return; // do nothing — browser handles this request normally
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((cached) => {
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
  self.clients.claim(); // become available to all pages
});
