const CACHE = 'prelevo-app-v82';
const ASSETS = ['./', './index.html', './styles.css', './config.js', './powens.js', './api.js', './pwa.js', './push.js', './app.js', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon.svg',
  './icons/favicon.svg', './icons/logo-mark.svg', './icons/logo-mark-white.svg', './icons/favicon-32.png', './icons/apple-touch-icon-180.png'];
self.addEventListener('install', e => {
  // Précharge le cache ; l'activation attend le clic « Mettre à jour » (ou la 1ʳᵉ visite sans contrôleur).
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('message', e => {
  if (!e.data) return;
  if (e.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (e.data.type === 'SHOW_LOCAL') {
    const p = e.data.payload || {};
    e.waitUntil(showAlert({
      title: p.title || 'Prelevo',
      body: p.body || 'Nouvelle alerte',
      url: p.url || './#/alertes',
      tag: p.tag || 'prelevo-local'
    }));
  }
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

function showAlert(data) {
  return self.registration.showNotification(data.title || 'Prelevo', {
    body: data.body || '',
    icon: './icons/icon-192.png',
    badge: './icons/favicon-32.png',
    tag: data.tag || 'prelevo',
    data: { url: data.url || './#/alertes' },
    renotify: true,
    lang: 'fr'
  });
}

self.addEventListener('push', e => {
  let data = { title: 'Prelevo', body: 'Nouvelle alerte', url: './#/alertes', tag: 'prelevo-push' };
  try {
    if (e.data) data = Object.assign(data, e.data.json());
  } catch (err) {
    try { if (e.data) data.body = e.data.text(); } catch (err2) {}
  }
  e.waitUntil(showAlert(data));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = (e.notification.data && e.notification.data.url) || './#/alertes';
  e.waitUntil((async () => {
    const all = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if (c.url.includes('/app') && 'focus' in c) {
        await c.focus();
        try { c.postMessage({ type: 'PRELEVO_NAV', url: target }); } catch (err) {}
        return;
      }
    }
    await clients.openWindow(target);
  })());
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Jamais de cache pour les API (Powens / biapi) ni pour tout autre domaine : le navigateur va directement au réseau.
  if (url.origin !== self.location.origin) return;
  // API Prelevo hébergée sur la même origine (plus tard) ou requête authentifiée : jamais de cache
  if (e.request.headers.has('Authorization') || /^\/(auth|bank|me|webhooks|push)(\/|$)/.test(url.pathname)) return;
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
