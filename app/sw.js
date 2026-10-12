const CACHE = 'prelevo-app-v60-home';
const ASSETS = ['./', './index.html', './styles.css', './config.js', './powens.js', './api.js', './app.js', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon.svg',
  './icons/favicon.svg', './icons/logo-mark.svg', './icons/logo-mark-white.svg', './icons/favicon-32.png', './icons/apple-touch-icon-180.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Jamais de cache pour les API (Powens / biapi) ni pour tout autre domaine : le navigateur va directement au réseau.
  if (url.origin !== self.location.origin) return;
  // API Prelevo hébergée sur la même origine (plus tard) ou requête authentifiée : jamais de cache
  if (e.request.headers.has('Authorization') || /^\/(auth|bank|me|webhooks)(\/|$)/.test(url.pathname)) return;
  // Retour de la webview Powens (?connection_id=…) ou autre URL avec paramètres : réseau, sans mise en cache.
  if (url.search) {
    e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match('./index.html'))));
});
