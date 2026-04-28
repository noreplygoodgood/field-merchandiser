// Field Merchandiser — Service Worker
// Caches the app shell for offline access


const CACHE_NAME = "field-merchandiser-v13";
const SHELL = [
  "./index.html",
  "./manifest.json"
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
  // Don't intercept Microsoft Graph / MSAL requests
  if (event.request.url.includes("login.microsoftonline.com") ||
      event.request.url.includes("graph.microsoft.com") ||
      event.request.url.includes("cdnjs.cloudflare.com")) {
    return;
  }


