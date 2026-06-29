/* ============================================================
   STAC Engage — Service Worker
   Handles: offline caching, background sync, push notifications
   ============================================================ */

const APP_VERSION   = 'stac-engage-v1.0.0';
const CACHE_STATIC  = `${APP_VERSION}-static`;
const CACHE_DYNAMIC = `${APP_VERSION}-dynamic`;

/* Files to cache immediately on install */
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.html',
  '/admin.html',
  '/manifest.json',
  '/css/main.css',
  '/css/admin.css',
  '/js/data.js',
  '/js/spaces-data.js',
  '/js/admin-data.js',
  '/js/state.js',
  '/js/components.js',
  '/js/auth.js',
  '/js/app-v2.js',
  '/js/supabase-client.js',
  '/js/tabs/dashboard.js',
  '/js/tabs/calendar.js',
  '/js/tabs/map.js',
  '/js/tabs/events.js',
  '/js/tabs/transcript.js',
  '/js/tabs/pathways.js',
  '/js/tabs/leaderboard.js',
  '/js/tabs/streaks.js',
  '/js/tabs/shop.js',
  '/js/tabs/feed.js',
  '/js/tabs/orgs.js',
  '/js/tabs/clubvclub.js',
  '/js/tabs/profile.js',
  '/js/tabs/notifications.js',
  '/js/admin/overview.js',
  '/js/admin/bookings.js',
  '/js/admin/events.js',
  '/js/admin/checkin.js',
  '/js/admin/students.js',
  '/js/admin/reports.js',
  '/js/admin/notifications.js',
  '/js/admin/app.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

/* External resources to cache (fonts, icons) */
const EXTERNAL_CACHE = [
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css',
];

/* ---- Install ---- */
self.addEventListener('install', event => {
  console.log('[SW] Installing', APP_VERSION);
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      return Promise.allSettled([
        ...STATIC_ASSETS.map(url => cache.add(url).catch(() => {})),
        ...EXTERNAL_CACHE.map(url => cache.add(url).catch(() => {})),
      ]);
    }).then(() => self.skipWaiting())
  );
});

/* ---- Activate — clean up old caches ---- */
self.addEventListener('activate', event => {
  console.log('[SW] Activating', APP_VERSION);
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_STATIC && k !== CACHE_DYNAMIC)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ---- Fetch — cache-first for static, network-first for API ---- */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension requests
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Supabase API — network first, no cache
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: 'Offline — please reconnect' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 503,
        })
      )
    );
    return;
  }

  // Static assets — cache first, fallback to network
  if (STATIC_ASSETS.some(a => url.pathname === a || url.pathname.endsWith(a))) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_STATIC).then(c => c.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Google Fonts + CDN — stale while revalidate
  if (url.hostname.includes('fonts.') || url.hostname.includes('jsdelivr') || url.hostname.includes('googleapis')) {
    event.respondWith(
      caches.match(request).then(cached => {
        const fetchPromise = fetch(request).then(response => {
          caches.open(CACHE_DYNAMIC).then(c => c.put(request, response.clone()));
          return response;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Everything else — network first, cache fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_DYNAMIC).then(c => c.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request).then(cached => {
        if (cached) return cached;
        // Offline fallback for HTML navigation
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/app.html');
        }
      }))
  );
});

/* ---- Push notifications ---- */
self.addEventListener('push', event => {
  if (!event.data) return;

  let data = {};
  try { data = event.data.json(); } catch(e) { data = { title: 'STAC Engage', body: event.data.text() }; }

  const options = {
    body:    data.body    || 'You have a new notification',
    icon:    data.icon    || '/icons/icon-192.png',
    badge:   data.badge   || '/icons/icon-72.png',
    tag:     data.tag     || 'stac-notif',
    data:    data.data    || { url: '/app.html' },
    actions: data.actions || [],
    vibrate: [100, 50, 100],
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'STAC Engage', options)
  );
});

/* ---- Notification click ---- */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/app.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // If app is already open, focus it
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus().then(() => client.navigate(url));
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

/* ---- Background sync (for offline actions) ---- */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-rsvps') {
    event.waitUntil(syncPendingRSVPs());
  }
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPendingPosts());
  }
});

async function syncPendingRSVPs() {
  // TODO: read from IndexedDB pending queue and flush to Supabase
  console.log('[SW] Syncing pending RSVPs');
}

async function syncPendingPosts() {
  // TODO: read from IndexedDB pending queue and flush to Supabase
  console.log('[SW] Syncing pending posts');
}
