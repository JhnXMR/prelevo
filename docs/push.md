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
2. Exposer un endpoint authentifié, `POST /push/subscribe`, qui enregistre pour l’utilisateur l’abonnement et les rappels choisis :

```json
{
  "subscription": { "endpoint": "…", "keys": { "p256dh": "…", "auth": "…" } },
  "alerts": [{ "id": "fibrebox", "name": "FibreBox Internet", "amount": 39.99, "day": 12, "leadDays": 3, "debitOn": "2026-10-12" }]
}
```

`leadDays` vaut 1, 3 ou 7. Sans valeur, le serveur retient 3. `day` est le jour du mois (1 à 31). `debitOn` est la prochaine date de prélèvement (`AAAA-MM-JJ`).
3. Exposer le retrait, par exemple `DELETE /push/subscribe`, quand la personne désactive les alertes ou quand le service de push répond 404 ou 410.
4. Envoyer un Web Push (RFC 8030, chiffrement RFC 8291, authentification VAPID RFC 8292) avec une charge utile JSON :

```json
{
  "title": "Prélèvement dans 3 jours",
  "body": "FibreBox Internet · 39,99 €",
  "url": "#/prelevements",
  "tag": "prelevement-fibrebox"
}
```

`title` et `body` sont le texte affiché. Pour J-1, le titre est « Prélèvement demain ». `url` est une ancre de l’app (`#/…`). `tag` remplace une alerte du même prélèvement déjà affichée.

Les quatre types à envoyer :

| tag | moment |
| --- | --- |
| `prelevement` | J-1, J-3 ou J-7 avant un prélèvement, selon le choix (défaut J-3) |
| `hausse` | le prix d’un abonnement augmente |
| `budget-80` | les dépenses du mois atteignent 80 % du budget |
| `budget-100` | les dépenses du mois atteignent 100 % du budget |

Chaque envoi doit afficher une notification : un push silencieux n’est pas délivré de façon fiable, surtout sur iPhone.

## iPhone

Les notifications Web Push n’arrivent que si Prelevo est ajouté à l’écran d’accueil, à partir d’iOS 16.4. Un onglet Safari ne suffit pas. L’autorisation doit venir d’un geste de la personne, ce que l’écran Notifications respecte.
