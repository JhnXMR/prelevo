/* Ancien service worker de la maquette quand elle était à la racine.
   Il se désinstalle tout seul pour que la page de lancement s'affiche (la démo vit maintenant dans /app/). */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter(k => !k.startsWith('prelevo-app-')).map(k => caches.delete(k)));
  await self.registration.unregister();
  for (const c of await self.clients.matchAll({ type: 'window' })) c.navigate(c.url);
})()));
