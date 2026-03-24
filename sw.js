importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

const CACHE_NAME = 'lcc-pwa-v2'; // Incremented version
const BLOGGER_URL = 'https://laxmi-coaching.blogspot.com';

// Assets that should be available offline immediately
const STATIC_ASSETS = [
  BLOGGER_URL + '/',
  BLOGGER_URL + '/?m=1',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap'
];

// Install Event
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  return self.clients.claim();
});

// Intelligent Fetch Strategy
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. Skip non-GET and Admin pages
  if (event.request.method !== 'GET' || url.href.includes('blogger.com') || url.href.includes('/b/')) {
    return;
  }

  // 2. Strategy: Stale-While-Revalidate for Images and Scripts
  // This makes the app feel very fast because it shows cached items instantly.
  if (event.request.destination === 'image' || event.request.destination === 'script' || event.request.destination === 'style') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchedResponse = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchedResponse;
        });
      })
    );
    return;
  }

  // 3. Strategy: Network First, Fallback to Cache for HTML/Pages
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(match => {
          if (match) return match;
          if (event.request.mode === 'navigate') return caches.match(BLOGGER_URL + '/');
          
          // Professional Offline Response
          return new Response(
            `<html><body style="font-family:sans-serif;text-align:center;padding:50px;">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjeUqJ98ZmYOGoBx3QQ0cCMShQqv1HTjy93CjT0KKMj1UED1i6NK1hAwRVnWVmQwN2pyri_sG2Z490I8CzRy_4Ov2M16iVUdBO0lqROXhA0DDkIlI1lDnWdTzasUcgC1v0DpUimyE4NH2FAHq4q9ZOWbaPCR26FNUM_ZuFbq6X2WTX8CdYTWb1EFMJdD4Uu/s192/9550.png" width="100">
            <h2>You are currently offline</h2>
            <p>Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()" style="background:#21a03e;color:white;padding:10px 20px;border:none;border-radius:5px;">Retry</button>
            </body></html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      })
  );
});
