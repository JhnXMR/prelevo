const CACHE = 'prelevo-app-v88-reset';
const ASSETS = ['./', './index.html', './styles.css', './config.js', './powens.js', './api.js', './store.js', './categories.js', './app.js', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/icon.svg',
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
  const fresh = /\.(?:js|css|html)$/.test(url.pathname) || url.pathname.endsWith('/');
  if (fresh) {
    e.respondWith(fetch(new Request(e.request, { cache: 'reload' })).then(res => {
      if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match('./index.html'))));
});

/* Alertes envoyées par le serveur (repo séparé) : prelevement (J-1), hausse, budget-80, budget-100.
   Charge utile JSON : { title, body, url, tag }. Aucune clé privée ici. */
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (err) { data = { body: event.data ? event.data.text() : '' }; }
  const title = data.title || 'Prelevo';
  const target = typeof data.url === 'string' && data.url.charAt(0) === '#' ? data.url : '#/alertes';
  event.waitUntil(self.registration.showNotification(title, {
    body: data.body || '',
    tag: data.tag || 'prelevo',
    icon: 'icons/icon-192.png',
    badge: 'icons/favicon-32.png',
    data: { url: target, kind: data.tag || '' }
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const raw = event.notification.data && event.notification.data.url;
  const hash = typeof raw === 'string' && raw.charAt(0) === '#' ? raw : '#/alertes';
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const client = list.find(c => c.url.indexOf(self.location.origin) === 0);
    if (client) {
      client.postMessage({ type: 'prelevo-open', url: hash });
      return client.focus();
    }
    return self.clients.openWindow(new URL(hash, self.registration.scope).href);
  }));
});
