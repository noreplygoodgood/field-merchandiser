// Field Merchandiser — Service Worker
// Caches the app shell for offline access


const CACHE_NAME = "field-merchandiser-v14";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];


// Install: cache app shell
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL))
  );
  self.skipWaiting();
});


// Activate: clear old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});


// Fetch: serve from cache, fall back to network
self.addEventListener("fetch", event => {
  // Only handle GET requests — never cache POSTs to Apps Script
  if (event.request.method !== "GET") return;

  // Don't intercept these external services — pass straight to network
  const url = event.request.url;
  if (url.includes("login.microsoftonline.com") ||
      url.includes("graph.microsoft.com") ||
      url.includes("cdnjs.cloudflare.com") ||
      url.includes("script.google.com") ||
      url.includes("googleusercontent.com") ||
      url.includes("overpass-api.de") ||
      url.includes("nominatim.openstreetmap.org")) {
    return;
  }

  // Cache-first for app shell, fall back to network
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
