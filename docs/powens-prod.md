# Passer Prelevo sur Powens en production

Ce dépôt contient le site et la PWA (`/`, `/app`). **Il ne contient pas le backend.** L’API Node/TypeScript `prelevo-api` tourne sur Clever Cloud ; la base est sur Supabase. Aucun dépôt `prelevo-api` n’est visible sur le compte GitHub `JhnXMR`.

Le jour J, changer la configuration ne suffit que si l’API applique déjà le contrat décrit ici. Le navigateur, lui, est prêt : la sandbox reste le défaut, et la production se branche sans nouveau développement front.

Référence testée (à copier dans `prelevo-api`, ce n’est pas un serveur déployé) : `server-contract/powens.mjs`. Tests : `node --test tests/powens-flow.test.mjs tests/powens-server.test.mjs`.

Documentation Powens utilisée : [authentification](https://docs.powens.com/api-reference/overview/authentication), [première connexion](https://docs.powens.com/documentation/integration-guides/quick-start/add-a-first-user-and-connection), [webview](https://docs.powens.com/api-reference/overview/webview), [webhooks](https://docs.powens.com/documentation/integration-guides/webhooks).

## Ce que le front fait déjà

- `app/config.js` → `powens.env` vaut `sandbox`. Domaine, `clientId` et `redirectUri` sont publics. Aucun `client_secret` dans le dépôt.
- Sandbox sans API, ou `?demo=1` : utilisateur Powens **temporaire** (`POST /auth/init` sans secret), jeton 30 minutes dans `sessionStorage`, webview puis retour dans le même onglet.
- Avec `apiBase` : le navigateur n’appelle plus Powens. Il demande `POST /bank/connect` et suit l’URL renvoyée. Le state est vérifié au retour. Annulation (`access_denied`, `tos_declined`) et erreur technique ne sont pas le même message. Le texte d’erreur Powens (`error_description`) n’est pas affiché.
- Renouvellement : `POST /bank/reconnect`. La webview `/reconnect` ne renvoie que le `state` en cas de succès.
- Écran Mes banques : si `GET /me` indique un accès SCA à renouveler (échéance dépassée ou dans les 14 jours), le bouton devient « Renouveler l’accès ». L’accueil et le dessin ne changent pas.
- Suppression de compte : l’écran existe déjà (`DELETE /me`). Le texte dit que l’accès est aussi retiré chez Powens. C’est à l’API de le faire vraiment.

`powens.env = 'production'` interdit au navigateur de créer un utilisateur Powens. Sans `domain`, `clientId` et `redirectUri`, la config production n’est pas considérée comme prête.

## Ce que Jhn doit fournir

Rien de tout ceci ne va dans git.

| Élément | Où le poser | Note |
| --- | --- | --- |
| Contrat Powens production signé | console Powens | Sans lui, le domaine de prod n’existe pas. |
| Domaine API | `POWENS_DOMAIN` et `config.js` `powens.domain` | Sandbox actuelle : `prelevo-sandbox.biapi.pro`. Prod : le domaine sans `-sandbox`, tel que Powens le donne. |
| `client_id` de l’application cliente **de prod** | `POWENS_CLIENT_ID` et `config.js` `powens.clientId` | Valeur publique (elle voyage dans l’URL de la webview). Ne pas réutiliser l’id de sandbox `80438676`. |
| `client_secret` | `POWENS_CLIENT_SECRET` sur Clever Cloud seulement | Jamais dans le front, jamais dans un ticket. |
| `redirect_uri` whitelisté | console Powens + `POWENS_REDIRECT_URI` + `config.js` `powens.redirectUri` | Exactement `https://jhnxmr.github.io/prelevo/app/` (slash final compris). |
| Fournisseur webhook HMAC | console ou `POST /webhooks/auth` | Type `hmac_signature`. Le `secret_key` ne s’affiche qu’une fois : le copier tout de suite dans `POWENS_WEBHOOK_SECRET`. |
| URL du webhook | console Powens | `https://<prelevo-api>/webhooks/powens` en HTTPS. Événements utiles : `CONNECTION_SYNCED`, `ACCOUNT_SYNCED`, `ACCOUNTS_FETCHED`, `CONNECTION_DELETED`, `USER_DELETED`. Les webhooks ne partent que pour un utilisateur **permanent**. |
| Clé de chiffrement du jeton | `POWENS_TOKEN_KEY` | 32 octets, base64 ou 64 caractères hex. `openssl rand -base64 32`. Une clé par environnement. La perdre rend les jetons déjà stockés illisibles : les utilisateurs devront reconnecter leur banque. |
| Utilisateur Powens lié au compte Supabase | table côté API | `user_id` Supabase, `powens_user_id`, `token_cipher`. Pas le jeton en clair. |

## Variables Clever Cloud

Défaut si `POWENS_ENV` est absent : **sandbox**. L’API actuelle peut continuer à créer des utilisateurs temporaires tant que `POWENS_CLIENT_ID` et `POWENS_CLIENT_SECRET` ne sont pas tous les deux posés.

| Variable | Sandbox | Production |
| --- | --- | --- |
| `POWENS_ENV` | `sandbox` (ou absente) | `production` |
| `POWENS_DOMAIN` | `prelevo-sandbox.biapi.pro` | domaine de prod |
| `POWENS_CLIENT_ID` | id public sandbox, si vous testez les utilisateurs permanents | id public prod |
| `POWENS_CLIENT_SECRET` | secret sandbox, seulement pour quitter les jetons temporaires | obligatoire |
| `POWENS_REDIRECT_URI` | `https://jhnxmr.github.io/prelevo/app/` | la même, si elle est whitelistée en prod |
| `POWENS_WEBHOOK_SECRET` | dès que le HMAC est activé | obligatoire |
| `POWENS_TOKEN_KEY` | dès que les jetons sont permanents | obligatoire |

En `production`, il manque une de ces variables : l’API ne démarre pas. Le message d’erreur ne doit pas contenir la valeur du secret.

Dès que `client_id` et `client_secret` sont tous les deux présents, l’API crée des utilisateurs **permanents**, y compris en sandbox. C’est le moyen de répéter la bascule sur le domaine de test avant le jour J.

## Contrat que prelevo-api doit appliquer

Le navigateur ne reçoit jamais le jeton permanent. Il reçoit une URL de webview.

1. **Lier l’utilisateur.** À la première connexion bancaire d’un compte Supabase : `POST https://{domain}/2.0/auth/init` avec `client_id` et `client_secret`. Refuser un jeton `type: "temporary"`. Chiffrer `auth_token` (AES-256-GCM, IV 12 octets + tag 16 octets + contenu, le tout en base64) et enregistrer le couple Supabase / `id_user` Powens.
2. **Code à usage court.** `GET /2.0/auth/token/code` avec le jeton permanent. Ne pas mettre ce jeton dans l’URL.
3. **Webview.** `POST /bank/connect` répond `{ "url": "https://webview.powens.com/fr/connect?domain&client_id&redirect_uri&code&state" }`. `state` aléatoire, stocké côté serveur et lié à la session. `POST /bank/reconnect` avec `{ "connectionId" }` ouvre `/fr/reconnect` et ajoute `connection_id`.
4. **Retour.** Le front envoie `POST /bank/callback` avec `state`, `connection_id` ou `connection_ids`, `flow` (`connect` ou `reconnect`). L’API vérifie que le `state` est celui qu’elle a émis. Annulation : ne rien synchroniser, répondre un message vouvoyant. Le front n’appelle déjà plus l’API si l’utilisateur a annulé.
5. **Synchro.** `GET /users/me/connections?expand=connector`, `GET /users/me/accounts`, `GET /users/me/transactions?limit=1000`. `POST /bank/sync` relit ces trois routes. `GET /me` expose `bank.connectionId`, `bank.status` (`ok`, `sca`, `error`), `bank.scaExpiresAt` (champ Powens `expire`), `bank.name`, `bank.logo`, `bank.color`.
6. **Webhooks.** `POST /webhooks/powens`, corps brut (pas un JSON déjà réinterprété). Signature Powens : `BASE64(HMAC_SHA256(METHOD + "." + endpoint + "." + BI-Signature-Date + "." + corps, secret))`. Exemple de la doc : `POST./v1/webhook-listener.2022-06-27T11:08:52.577831Z.{...}`. Ici l’endpoint à signer est le chemin enregistré, `/webhooks/powens`, sauf si la console montre une autre chaîne : elle doit être identique des deux côtés. Refuser si la date s’écarte de plus de 5 minutes, si la signature ne correspond pas (comparaison en temps constant), puis répondre 2xx. Sur `CONNECTION_SYNCED`, `ACCOUNT_SYNCED` et `ACCOUNTS_FETCHED`, relancer la synchro du compte lié. Les webhooks ne partent pas tant que l’utilisateur est temporaire.
7. **SCA, 180 jours.** Powens met une date dans `connection.expire`. Les états `SCARequired`, `webauthRequired`, `additionalInformationNeeded`, `decoupled` et `actionNeeded` veulent une reconnexion. `wrongpass`, `passwordExpired`, `bug`, `websiteUnavailable`, `rateLimiting` sont une erreur, pas un simple renouvellement. Le front prévient dans les 14 derniers jours et au-delà de l’échéance.
8. **Suppression de compte (RGPD).** `DELETE /me` : déchiffrer le jeton, `DELETE https://{domain}/2.0/users/me`, et seulement ensuite effacer les lignes Supabase (jeton, comptes, opérations, sessions) et le compte. Si Powens ne répond pas, ne pas effacer la base : sinon le jeton disparaît et l’utilisateur Powens reste. Répondre un message vouvoyant pour que la personne réessaie.

Le flux navigateur de sandbox (`/auth/init` sans secret, `type=singleAccess`) reste en place pour la démo sans API. Il ne doit pas servir en production.

## Étapes de bascule

1. Copier `server-contract/powens.mjs` dans `prelevo-api` et brancher les routes ci-dessus. Lancer `node --test tests/powens-server.test.mjs` dans ce dépôt pour vérifier le contrat, puis les tests de l’API.
2. Sur le domaine **sandbox**, poser `POWENS_CLIENT_ID`, `POWENS_CLIENT_SECRET` et `POWENS_TOKEN_KEY`. Créer le fournisseur HMAC et `POWENS_WEBHOOK_SECRET`. Laisser `POWENS_ENV=sandbox`.
3. Créer un compte Prelevo, connecter « Demo Institution » (usecase `bank`, mot de passe quelconque, tout sélectionner). Vérifier : pas de jeton en clair en base, webview qui revient sur `/app/`, comptes et opérations visibles, webhook `CONNECTION_SYNCED` accepté, mauvais signature refusée.
4. Forcer une échéance SCA proche (ou un état `SCARequired`) et vérifier « Renouveler l’accès », puis le retour qui ne contient que `state`.
5. Supprimer le compte. Vérifier l’absence de l’utilisateur chez Powens et dans Supabase. Couper le réseau vers Powens et vérifier que la base n’est pas effacée.
6. Jour J, après signature du contrat : créer l’application cliente de prod, whitelister `https://jhnxmr.github.io/prelevo/app/`, copier les secrets de prod dans Clever Cloud, passer `POWENS_ENV=production` et `POWENS_DOMAIN` au domaine de prod.
7. Dans `app/config.js`, passer `powens.env` à `'production'` et renseigner `domain`, `clientId`, `redirectUri` publics. Incrémenter `?v=` et `CACHE` dans `app/sw.js` si ce n’est pas déjà fait pour ce changement. Merger. Ne pas déployer autre chose à la main : GitHub Pages sert `main`.
8. Refaire un parcours réel sur une banque, puis une suppression de compte de test.

Tant que l’étape 7 n’est pas mergée, le site publié reste en sandbox.

## Points d’attention

- Le `client_id` de sandbox `80438676` est public. Le secret correspondant ne doit pas être cherché dans ce dépôt : il n’y est pas.
- Le `redirect_uri` doit être strictement celui de la console, sinon Powens refuse la webview. En local, le retour part vers l’URL publiée, pas vers `localhost`.
- Le retour doit avoir lieu dans le même navigateur : le `state` est en `sessionStorage`.
- Un utilisateur temporaire ne déclenche pas de webhook. Les basculer vers un jeton permanent avant d’activer les webhooks.
- La clé `POWENS_TOKEN_KEY` ne se tourne pas toute seule. Prévoir une reconnexion des banques si elle change.
- `POST /bank/callback` reçoit en plus `flow` et `connection_ids`. Si l’API actuelle rejette les champs inconnus, il faut l’assouplir avant la prod.
- `POST /bank/reconnect` n’existe pas encore sur l’API déployée. Le bouton n’apparaît que lorsque `GET /me` envoie un statut SCA : le comportement sandbox actuel ne change pas.
- Ce dépôt ne déploie rien. Pas de merge depuis cette préparation.
