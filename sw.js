const CACHE_NAME = 'my-blog-pwa-v1';

// ⚠️ CHANGE THIS: Add your Blogger URL here
const BLOGGER_URL = 'https://laxmi-coaching.blogspot.com';

// Files to cache - Update with your actual URLs
const urlsToCache = [
  BLOGGER_URL + '/',
  BLOGGER_URL + '/?m=1'  // Mobile version
];

// Install event - cache essential files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        // Use addAll with catch to handle failures gracefully
        return cache.addAll(urlsToCache).catch(err => {
          console.log('Cache addAll failed:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) return;
  
  // Skip Blogger admin URLs
  if (event.request.url.includes('/b/')) return;
  if (event.request.url.includes('blogger.com')) return;
  if (event.request.url.includes('google.com/blogger')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response before caching
        const responseClone = response.clone();
        
        // Only cache successful responses from your domain
        if (response.status === 200 && response.type === 'basic') {
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
        }
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Return cached homepage for navigation requests (offline)
            if (event.request.mode === 'navigate') {
              return caches.match(BLOGGER_URL + '/');
            }
            
            // Return offline response
            return new Response('You are offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Handle push notifications (optional - for future use)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New post available!',
    icon: 'https://laxmi-coaching.blogspot.com/favicon.ico', // ⚠️ CHANGE THIS
    badge: 'https://laxmi-coaching.blogspot.com/favicon.ico', // ⚠️ CHANGE THIS
    vibrate: [100, 50, 100],
    data: {
      url: BLOGGER_URL
    }
  };

  event.waitUntil(
    self.registration.showNotification('Blog Update', options)
  );
});

// Handle notification click - opens your blog
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(BLOGGER_URL)
  );
});
