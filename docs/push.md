# Notifications push

Ce dépôt est le client Prelevo. Le serveur qui envoie les notifications vit dans un autre dépôt. Aucune clé privée ne doit être ajoutée ici.

## Ce que fait déjà le client

L’opt-in est dans Compte → Notifications. `Notification.requestPermission()` est appelé depuis le bouton « Activer les notifications » ou « Voir un exemple », au moment où la personne le touche.

La clé publique se lit dans `app/config.js` :

```js
vapidPublicKey: ''
```

Tant que cette chaîne est vide, le client n’appelle pas `pushManager.subscribe`. Le bouton « Voir un exemple » affiche quand même une notification locale (prélèvement de démonstration, J-1) via `registration.showNotification`.

Quand la clé publique est renseignée, le client s’abonne :

```js
registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: /* clé publique VAPID, décodée en Uint8Array */
})
```

L’objet `PushSubscription.toJSON()` est conservé dans le Store de l’appareil (`prelevo-push`). Il contient `endpoint`, `keys.p256dh` et `keys.auth`. Ce ne sont pas la clé privée VAPID.

`app/sw.js` affiche la notification à la réception d’un push, et un clic ramène l’app ouverte (ou l’ouvre) sur l’ancre indiquée, par défaut `#/alertes`.

## Ce que le serveur doit faire

1. Générer une paire de clés VAPID et garder la clé privée dans un secret d’environnement (par exemple `VAPID_PRIVATE_KEY`). Copier uniquement la clé publique dans `APP_CONFIG.vapidPublicKey`.
2. Exposer un endpoint authentifié, par exemple `POST /push/subscribe`, qui enregistre pour l’utilisateur :
   - `endpoint`
   - `keys.p256dh`
   - `keys.auth`
3. Exposer le retrait, par exemple `DELETE /push/subscribe`, quand la personne désactive les alertes ou quand le service de push répond 404 ou 410.
4. Envoyer un Web Push (RFC 8030, chiffrement RFC 8291, authentification VAPID RFC 8292) avec une charge utile JSON :

```json
{
  "title": "Prélèvement demain",
  "body": "FibreBox Internet · 39,99 €",
  "url": "#/alertes",
  "tag": "prelevement"
}
```

`title` et `body` sont le texte affiché. `url` est une ancre de l’app (`#/…`). `tag` remplace une alerte du même type déjà affichée.

Les quatre types à envoyer :

| tag | moment |
| --- | --- |
| `prelevement` | la veille (J-1) d’un prélèvement prévu |
| `hausse` | le prix d’un abonnement augmente |
| `budget-80` | les dépenses du mois atteignent 80 % du budget |
| `budget-100` | les dépenses du mois atteignent 100 % du budget |

Chaque envoi doit afficher une notification : un push silencieux n’est pas délivré de façon fiable, surtout sur iPhone.

## iPhone

Les notifications Web Push n’arrivent que si Prelevo est ajouté à l’écran d’accueil, à partir d’iOS 16.4. Un onglet Safari ne suffit pas. L’autorisation doit venir d’un geste de la personne, ce que l’écran Notifications respecte.
