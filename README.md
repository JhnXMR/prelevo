# Prelevo – site de lancement + démo

En ligne (après publication) : https://jhnxmr.github.io/prelevo/
- `/` : page de lancement / liste d'attente (index.html, landing.css, landing.js, config.js)
- `/app/` : maquette cliquable de l'app (PWA). Démo : https://jhnxmr.github.io/prelevo/app/?demo=1

## Réglages (config.js à la racine)
- `incentive` : texte de l'offre de lancement (« Les 500 premiers inscrits : 3 mois de Premium offerts »), `enabled:false` pour la masquer.
- `waitlist` : où partent les inscriptions (`provider` : none | google-form | formspree | apps-script | json, `endpoint`, `field`).
  Avec `none`, rien n'est envoyé : l'e-mail reste dans le navigateur du visiteur (aperçu uniquement, à ne pas publier tel quel).
- `publisher`, `contactEmail` : affichés dans Mentions légales et Confidentialité.

## Divers
- Aucun cookie, aucun traceur, police Inter auto-hébergée (assets/fonts).
- Image de partage : assets/og.png (1200×630). Source : prelevo-brand/og-image.html.
- `sw.js` à la racine : désinstalle l'ancien service worker de la maquette (quand elle était à la racine) pour que la page de lancement s'affiche. Ne pas supprimer avant quelques semaines.
- Captures d'écran des fonctions : assets/shots/*.webp (issues de la maquette).
