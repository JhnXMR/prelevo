# Scan Finance – maquette cliquable (PWA)

Maquette statique, sans build. Toutes les données sont FICTIVES (« Données d'exemple »).
Aucune banque n'est contactée : connexion, scan, paiement, chat et e-mail sont simulés.

En ligne : https://jhnxmr.github.io/scan-finance-maquette/  (démo : ?demo=1)
Les icônes PNG sont stockées en base64 (icons/*.png.b64) et décodées par .github/workflows/pages.yml.

Lancer en local :  python3 -m http.server 8090   puis ouvrir http://localhost:8090/
Paramètres utiles : ?demo=1 (déjà connecté), &plan=free ou &plan=premium (mode démo).
Le mode Gratuit/Premium se change aussi dans Aide et réglages (icône ⚙︎ du tableau de bord).

Renommer l'app : modifier `name` dans config.js (tout le texte de l'interface suit).
Le nom apparaît aussi en dur dans manifest.json (name, short_name) et dans <title>/<meta> d'index.html :
  sed -i 's/Scan Finance/NouveauNom/g' manifest.json index.html config.js
Après une modification, changer CACHE dans sw.js (ex. scan-finance-v3) pour forcer la mise à jour hors ligne.

Prix et essai : config.js (priceMonth, priceYear, trial).

Écrans : #/onboarding, #/connect, #/scan, #/dashboard, #/abonnements (?f=up|small|eco), #/abo/<id>,
#/resilier/<id>/<1-4> (Premium), #/alertes, #/premium, #/aide, #/chat, #/banques
