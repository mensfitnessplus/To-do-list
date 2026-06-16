// 1. Update this version number to clear the cache and force an update
const CACHE_VERSION = 'v1.0.1'; 
const CACHE_NAME = `todo-pwa-cache-${CACHE_VERSION}`;

// 2. Define the core assets you want to cache for offline use
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon.png'
];

// Install Event - Caches the assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching App Shell');
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// Activate Event - Cleans up old, outdated caches when the version bumps
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Serves from cache if available, otherwise goes to the network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return the cached version if found
            if (response) {
                return response;
            }
            
            // Otherwise, fetch from the network
            return fetch(event.request).then((networkResponse) => {
                // Optional: You can dynamically cache new requests here if desired
                return networkResponse;
            }).catch(() => {
                // If both cache and network fail, you could return a custom offline page here
                console.error('[Service Worker] Fetch failed, returning offline fallback');
            });
        })
    );
});
