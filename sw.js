/* =====================================================
   REPWELL — Service Worker
   Cache-first pour les assets statiques
   ===================================================== */

const CACHE_NAME = 'repwell-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/variables.css',
  '/css/components.css',
  '/css/screens.css',
  '/css/animations.css',
  '/css/missing.css',
  '/js/config.js',
  '/js/data/programmes.js',
  '/js/core/state.js',
  '/js/core/router.js',
  '/js/core/auth.js',
  '/js/ui/toast.js',
  '/js/ui/animations.js',
  '/js/ui/timer.js',
  '/js/ui/sounds.js',
  '/js/screens/auth.js',
  '/js/screens/audit.js',
  '/js/screens/result.js',
  '/js/screens/dashboard.js',
  '/js/screens/session.js',
  '/js/screens/recap.js',
  '/js/screens/programme.js',
  '/js/screens/progress.js',
  '/js/screens/badges.js',
  '/js/screens/profile.js',
  '/assets/images/logo-repwell.png',
  '/assets/images/logo-repwell-transparent.png',
];

// Installation — mise en cache des assets statiques
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activation — suppression des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache-first pour assets statiques, network-only pour Supabase
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Laisser passer les requêtes Supabase (API) sans cache
  if (url.hostname.includes('supabase.co') || url.hostname.includes('googleapis')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Mettre en cache les nouvelles ressources statiques
        if (response && response.status === 200 && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Fallback offline : retourner index.html pour la navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
