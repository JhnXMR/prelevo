/* Configuration de la maquette – changer le nom de l'app ICI (et dans manifest.json + <title> d'index.html, voir README). */
window.APP_CONFIG = {
  name: 'Prelevo',
  tagline: 'l’app qui traque vos abonnements',
  priceMonth: 1.99,
  priceYear: 14.99,
  trial: '1 mois offert pour essayer',
  supportEmail: 'support@exemple.fr',   // adresse fictive
  // Adresse de l'API Prelevo (backend). Vide = maquette seule (comportement actuel du site publié).
  // Ex. en local : 'http://localhost:8795'
  apiBase: 'https://app-109fa828-abfc-432e-921d-a6ec8590c26c.cleverapps.io',
  // Clé publique VAPID pour l'abonnement Web Push. Vide tant que le serveur ne l'a pas fournie.
  // La clé privée ne figure pas dans ce dépôt. Voir docs/push.md.
  vapidPublicKey: '',
};
