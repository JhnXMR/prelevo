# Alertes Web Push

Ce dossier est le serveur d’envoi des rappels de prélèvement (J-1, J-3, J-7). Il est fait pour être repris dans **prelevo-api**, pas pour tourner à la place de l’API déjà en ligne.

Rien ici ne se déploie tout seul. Aucune clé ne doit être commitée. `.env.example` ne contient que des noms.

## Clés VAPID

Depuis ce dossier, une seule fois, sur votre machine :

```sh
npm install
npm run generate-vapid
```

La commande écrit sur la sortie standard une paire de clés. Collez-les dans Clever Cloud, pas dans git.

| Variable | Rôle |
| --- | --- |
| `VAPID_PUBLIC_KEY` | Clé publique. Plus tard, la même valeur ira dans `app/config.js`, champ `vapidPublicKey`. Pas dans cette PR. |
| `VAPID_PRIVATE_KEY` | Clé privée. Clever Cloud seulement. |
| `VAPID_SUBJECT` | `mailto:` d’un contact à vous, ou une URL `https`. Le navigateur l’exige pour Web Push. |

`VAPID_SUBJECT=mailto:vous@example.com` dans l’exemple est un placeholder.

## Base

`SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` : les mêmes que le reste de prelevo-api, si elles existent déjà sous ces noms.

Appliquez `supabase/migrations/20261015090000_push_subscriptions.sql` dans le SQL editor Supabase (ou `supabase db push` si vous l’utilisez déjà). Deux tables : `push_subscriptions` et `push_alerts`. RLS activé, aucun accès pour `anon` ni `authenticated`. Seule la clé service, déjà côté API, écrit.

`user_id` est l’identifiant du compte Prelevo. La migration ne force pas la clé étrangère vers `auth.users` : ajoutez-la si c’est bien cette table chez vous.

## Routes

À monter dans le serveur existant, avec le **même** contrôle de session que les autres routes (celui qui répond `401 {"error":"Non connecté"}`).

```js
import { handlePushRequest } from './push/http.js';
import { supabaseStore } from './push/store.js';
import { createWebPush } from './push/send.js';

const handled = await handlePushRequest(req, res, {
  resolveUser: (request) => sessionUserId(request),
  store: supabaseStore({
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  }),
  sendPush: createWebPush(process.env),
  cronSecret: process.env.CRON_SECRET
});
if (handled) return;
```

- `POST /push/subscribe` — corps `{ subscription, alerts }`. `alerts[].leadDays` vaut 1, 3 ou 7. Toute autre valeur est enregistrée comme 3. `day` est le jour du mois (1–31), `debitOn` la prochaine date `AAAA-MM-JJ`.
- `DELETE /push/subscribe` — retire les abonnements de la personne.
- `POST /push/dispatch` — réservé à la tâche planifiée. En-tête `x-cron-secret` égal à `CRON_SECRET`. Une session utilisateur ne suffit pas.

La charge utile envoyée au service worker :

```json
{
  "title": "Prélèvement dans 3 jours",
  "body": "FibreBox Internet · 39,99 €",
  "url": "#/prelevements",
  "tag": "prelevement-fibrebox"
}
```

J-1 utilise le titre « Prélèvement demain ». Un clic ouvre `#/prelevements`. Un abonnement qui répond 404 ou 410 est retiré. Un même rappel n’est pas renvoyé deux fois le même jour, y compris si l’app renvoie le même planning.

Le fuseau du « jour J » est `Europe/Paris`.

## Tâche planifiée

`CRON_SECRET` : une valeur longue, différente des clés VAPID.

Quand vous déciderez de déployer (pas depuis cette PR), une tâche une fois par jour vers 8 h 05, heure de Paris, suffit :

```sh
node src/dispatch.js
```

ou, depuis l’extérieur :

```sh
curl -fsS -X POST -H "x-cron-secret: $CRON_SECRET" \
  https://app-109fa828-abfc-432e-921d-a6ec8590c26c.cleverapps.io/push/dispatch
```

Sur Clever Cloud, une application de type Cron peut lancer l’une ou l’autre. Ne la créez pas tant que la migration et les variables ne sont pas en place : la route n’existe pas encore sur l’API en ligne.

## Ce qu’il faudra poser dans Clever Cloud

Sur l’application `app-109fa828-abfc-432e-921d-a6ec8590c26c`, sans redéployer tant que ce n’est pas voulu :

1. `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`
2. `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` (si elles n’y sont pas déjà)
3. `CRON_SECRET`
4. La migration SQL dans Supabase
5. La tâche du matin, seulement au moment du déploiement
6. Plus tard, recopier **uniquement** la clé publique dans `vapidPublicKey` du client

## Tests

```sh
npm test
```
