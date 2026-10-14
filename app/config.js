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
  /* Powens — valeurs PUBLIQUES uniquement. Le client_secret, le secret de webhook
     et la clé de chiffrement du jeton sont des variables Clever Cloud, jamais ici.
     Défaut : sandbox (banques de test). Jour J : env 'production' + domain, clientId, redirectUri
     fournis par Jhn. Voir docs/powens-prod.md. Le backend prelevo-api n'est pas dans ce dépôt. */
  powens: {
    env: 'sandbox',
    domain: 'prelevo-sandbox.biapi.pro',
    clientId: '80438676',
    redirectUri: 'https://jhnxmr.github.io/prelevo/app/',
    webviewBase: 'https://webview.powens.com/fr'
  }
};
