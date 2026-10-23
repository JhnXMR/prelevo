# prelevo-api — lecture Enable Banking

Module Node (sans dépendance) pour l’app Clever Cloud **prelevo-api**. Lecture seule : soldes et opérations. Aucun paiement, aucun IBAN, aucune clé dans git ni dans le front GitHub Pages.

`BANK_PROVIDER=powens` (valeur par défaut) : les routes banque répondent 501 et n’appellent pas Enable Banking. `BANK_PROVIDER=enablebanking` : Société Générale, France, particulier.

## Variables d’environnement (Clever Cloud)

À poser uniquement sur l’application **prelevo-api**. Ne jamais les mettre dans `app/config.js` ni dans GitHub Pages.

| Variable | Valeur |
| --- | --- |
| `BANK_PROVIDER` | `enablebanking` |
| `ENABLEBANKING_APP_ID` | `44da9167-d944-40a8-ad58-6c35ce849ff7` |
| `ENABLEBANKING_PRIVATE_KEY` | PEM PKCS#8 de l’application. Les `\n` échappés sont acceptés. Ne jamais la commiter. |
| `ENABLEBANKING_REDIRECT_URL` | `https://jhndlt.github.io/prelevo/app/` |
| `ENABLEBANKING_ASPSP_NAME` | `Société Générale` |
| `ENABLEBANKING_ASPSP_COUNTRY` | `FR` |
| `ENABLEBANKING_PSU_TYPE` | `personal` |
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | clé **service**, jamais la clé anon |
| `PORT` | fourni par Clever Cloud |

Mode restreint : un seul établissement (Société Générale, compte courant et carte du fondateur). Le consentement demandé est de 180 jours (`access.balances` et `access.transactions` seulement). L’API peut le raccourcir à la durée max de la banque.

Ne pas définir `ENABLEBANKING_FIXTURE` en production. Cette variable ne sert qu’aux captures locales, et elle est ignorée dès que `NODE_ENV=production` ou qu’une clé privée est présente.

## Déploiement

Répertoire de l’app Node : `server/`. Commande : `npm start` (`node src/index.js`). Node 18+.

Appliquer `supabase/migrations/20261021170000_enablebanking.sql` dans l’éditeur SQL Supabase. RLS est activé. `anon` et `authenticated` n’ont aucun droit. Seul `service_role` a `SELECT`, `INSERT`, `UPDATE`, `DELETE`.

Le jeton Bearer du navigateur n’est pas stocké : `app_sessions.token_hash` est le SHA-256 hexadécimal du jeton, avec `user_id`. Le lien magique déjà en production doit écrire cette ligne (ce module ne l’émet pas). `GET /me` ici ne renvoie que la banque ; si le serveur existant a déjà un `GET /me` (compte, facturation), fusionnez `bank.me()` dedans. `DELETE /me` ici ne retire que l’accès bancaire.

Auth Enable Banking : JWT RS256, `kid` = identifiant d’application, `iss` `enablebanking.com`, `aud` `api.enablebanking.com`. Le PEM, le JWT et les corps d’erreur de l’agrégateur ne sont pas renvoyés au client.
