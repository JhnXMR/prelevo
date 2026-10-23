# Prelevo – maquette cliquable (PWA)

(Anciennement « Scan Finance » puis « Radar Finance ». Charte : logo radar, palette bleu / blanc / noir, police Inter.)

Maquette statique, sans build. Toutes les données sont FICTIVES (« Données d'exemple »).
Aucune banque n'est contactée : connexion, scan, paiement, chat et e-mail sont simulés.

En ligne : https://jhndlt.github.io/prelevo/app/  (démo : https://jhndlt.github.io/prelevo/app/?demo=1). Page de lancement : https://jhndlt.github.io/prelevo/
Les icônes PNG (et les logos) sont envoyés en un paquet base64, décodé et enregistré par .github/workflows/pages.yml (à adapter au dossier app/icons).
GitHub Pages sert directement la branche main (racine).

Lancer en local :  python3 -m http.server 8090   depuis la racine du site, puis ouvrir http://localhost:8090/app/
Paramètres utiles : ?demo=1 (déjà connecté), &plan=free ou &plan=premium (mode démo).
Le mode Gratuit/Premium se change aussi dans Aide et réglages (icône ⚙︎ du tableau de bord).

Renommer l'app : modifier `name` dans config.js (tout le texte de l'interface suit).
Le nom apparaît aussi en dur dans manifest.json (name, short_name) et dans <title>/<meta> d'index.html :
  sed -i 's/Prelevo/NouveauNom/g' manifest.json index.html config.js
Après une modification, changer CACHE dans sw.js (ex. prelevo-app-v11) pour forcer la mise à jour hors ligne.

Prix et essai : config.js (priceMonth, priceYear, trial).

API Prelevo (alpha) : `apiBase` dans config.js. Vide (valeur publiée) = maquette seule, comportement inchangé.
Renseigné (ex. `http://localhost:8795`) = connexion par lien magique (`#/connexion?token=`), banque via `POST /bank/connect` puis
retour Webview `POST /bank/callback` (state vérifié), écrans depuis `GET /me`, Réglages > Se déconnecter / Supprimer mon compte (`DELETE /me`).
`?demo=1` reste toujours en données d'exemple. Le service worker ne met jamais en cache les appels API (autre origine, en-tête Authorization, /auth /bank /me).
`bankProvider: 'enablebanking'` dans config.js (pas un secret) : le bouton « Connecter ma banque » part vers l’API, qui parle à Enable Banking. Le retour est `?code=&state=`. La clé privée reste sur Clever Cloud. Voir server/README.md.

Écrans : #/onboarding, #/connect, #/scan, #/dashboard, #/abonnements (?f=up|small|eco), #/abo/<id>,
#/resilier/<id>/<1-4> (Premium), #/alertes, #/premium, #/aide, #/chat, #/banques

Identité visuelle stricte Bleu / Blanc / Noir : accent Bleu Radar #0066FF (mode Nuit : Bleu Signal #4D94FF ; thème Jour / Nuit / Automatique dans Aide et réglages),
Noir Radar #0A0B0D, Blanc #FFFFFF + gris neutres. Succès/synchro OK = bleu ; alertes (hausse, double prélèvement) = noir + icône ;
rouge sourd #C2372F réservé aux seules erreurs techniques (banque déconnectée). Variables CSS en tête de styles.css.
Icônes : icons/icon.svg (app), favicon.svg, logo-mark.svg, logo-horizontal(-white).svg, PNG 192/512/maskable 512/apple-touch 180.
