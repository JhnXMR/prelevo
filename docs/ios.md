# Prelevo sur iPhone

Ce dossier prépare l’app iOS. Il n’envoie rien sur l’App Store et ne contient aucun compte Apple, certificat, profil de signature, clé APNs ni identifiant d’équipe.

Le site publié et la PWA dans `/app` restent inchangés. GitHub Pages sert toujours la racine du dépôt sur `main`. Le workflow Pages ne se déclenche que si le paquet du site, les icônes ou le fichier de workflow changent. Ajouter `ios-app/` ne republie pas le site.

## Ce que contient `ios-app/`

| Élément | Rôle |
| --- | --- |
| `capacitor.config.json` | Identifiant provisoire `fr.prelevo.app`, nom Prelevo |
| `www/` | Copie de `/app`, plus le pont natif |
| `native/` | Verrouillage, notifications, partage, liens entrants |
| `ios/` | Projet Xcode (Swift Package Manager, pas CocoaPods) |
| `templates/apple-app-site-association` | Modèle d’universal link, avec `TEAMID` à remplacer |
| `resources/` | Icône 1024 et splash 2732, fond `#0066FF` |

Plugins déjà déclarés : Face ID / Touch ID, notifications push, haptique, barre de statut, splash, partage, fichiers, et ouverture des liens. Ils existent pour que l’app ne soit pas un simple site dans une coquille (règle 4.2 d’Apple). L’envoi APNs et l’achat intégré ne sont pas branchés.

Cible de déploiement : iOS 15. Signature automatique, sans équipe renseignée. Vous choisirez la vôtre dans Xcode.

## Copie locale, ou adresse publiée

Par défaut, l’app embarque `ios-app/www`. C’est une copie figée de `/app` au moment de la commande `npm run sync`. Le service worker de la PWA n’y est pas enregistré, pour ne pas mélanger le cache du site et celui de l’app.

Si vous voulez afficher le site déjà en ligne, sans recopier le front :

```bash
cd ios-app
CAPACITOR_SERVER_URL=https://jhnxmr.github.io/prelevo/app/ npm run sync
```

Cette adresse charge alors la PWA publiée. Le pont natif (verrouillage, partage, note de paiement) n’est pas dans cette PWA : il n’existe que dans la copie `www`. Gardez la copie locale pour tester Face ID, le partage du CSV et le blocage du paiement web.

Pour revenir à la copie :

```bash
cd ios-app
npm run sync
```

## Commandes, depuis `ios-app/`

Node.js 22 suffit. Aucun Mac n’est nécessaire pour ces commandes.

```bash
cd ios-app
npm ci
npm test
npm run icons
npm run sync
```

- `npm test` vérifie les liens entrants, et que `/app` n’a pas reçu le pont natif.
- `npm run icons` reconstruit l’icône et le splash à partir de `app/icons/icon-512.png`, puis les place dans le catalogue Xcode.
- `npm run sync` régénère `www/` et copie les fichiers web dans le projet iOS.
- `npm run open` ouvre `ios/App/App.xcodeproj` sur un Mac.

Pas de `pod install`. Les plugins sont des paquets Swift, référencés depuis `node_modules`.

## Compte développeur

1. Inscrivez-vous au [Apple Developer Program](https://developer.apple.com/programs/) (99 $ US par an).
2. Dans Certificates, Identifiers & Profiles, créez un App ID explicite `fr.prelevo.app`.
3. Activez **Associated Domains** et **Push Notifications** sur cet App ID.
4. Ne copiez ni Team ID, ni certificat, ni clé `.p8` dans ce dépôt. La signature reste Automatic : dans Xcode, Signing & Capabilities, choisissez votre équipe.

Tant que l’App ID payant n’a pas Associated Domains, la signature peut échouer à cause de `ios/App/App/App.entitlements`. Créez l’App ID avec cette capacité avant la première archive. Le fichier ne contient pas `aps-environment` : vous l’ajouterez en cochant Push Notifications dans Xcode, une fois le compte créé. Le mode arrière-plan `remote-notification` est déjà dans `Info.plist`.

## Construire l’app

Deux chemins, au choix.

**Xcode sur un Mac.** Ouvrez `ios/App/App.xcodeproj`, sélectionnez votre équipe, branchez un iPhone ou un simulateur, puis Run. Pour TestFlight : Product → Archive, puis Distribute App → App Store Connect.

**Un service de build, sans Mac.** [Codemagic](https://codemagic.io/) ou [Ionic Appflow](https://ionic.io/appflow) compilent le même projet. Vous y déposez le certificat de distribution et le profil, dans le coffre du service, pas dans Git. Exemple de réglage Codemagic, sans secret :

```yaml
workflows:
  ios-prelevo:
    environment:
      xcode: latest
      ios_signing:
        distribution_type: app_store
        bundle_identifier: fr.prelevo.app
    scripts:
      - cd ios-app && npm ci && npm test && npm run sync
```

Les valeurs de certificat, le mot de passe et l’issuer API App Store Connect restent dans l’interface du service.

## TestFlight, puis la fiche

1. Créez l’app dans App Store Connect avec le même identifiant `fr.prelevo.app`.
2. Envoyez l’archive. Le premier groupe est interne (les membres de l’équipe). Un groupe externe demande une courte revue Apple.
3. `ITSAppUsesNonExemptEncryption` est déjà à faux : le questionnaire de chiffrement peut rester sur « non » tant que vous n’ajoutez pas de chiffrement maison. Face ID et HTTPS ne comptent pas comme un chiffrement exempté à déclarer en plus.
4. Remplissez la fiche en français. Textes prêts à coller plus bas.
5. Préparez des captures iPhone 6,7 pouces et 6,5 pouces, et l’icône 1024 déjà fournie (fond `#0066FF`, marque blanche).

Nom : **Prelevo**. Sous-titre (30 caractères maximum) : **Prélèvements et abonnements**.

Description :

> Prelevo affiche vos prélèvements et vos abonnements à partir d’une lecture de vos comptes. Vous voyez ce qui part, ce qui augmente, et ce qu’il vous reste avant la prochaine paie.
>
> L’app ne déplace pas d’argent. Pas de virement, pas de carte, pas de conseil sponsorisé. La connexion bancaire, quand elle est active, passe par un agrégateur en lecture seule.
>
> Sur cet iPhone, vous pouvez verrouiller l’app avec Face ID ou Touch ID, recevoir des notifications une fois qu’elles seront branchées, et exporter vos opérations en CSV par le partage du système.

Mots-clés possibles : prélèvement, abonnement, budget, banque, CSV.

### Confidentialité (étiquette App Store)

À déclarer dans App Privacy, sans tracking :

- **Informations financières** : opérations lues via l’agrégateur, liées à l’utilisateur, non utilisées pour vous suivre, non vendues.
- **Identifiant de l’appareil pour les notifications** : le jeton APNs, stocké pour vous envoyer les alertes que vous avez acceptées. Aujourd’hui il reste sur l’iPhone ; l’envoi serveur n’existe pas encore.
- **Données non collectées par Face ID** : le résultat du déverrouillage reste dans le système. Prelevo ne reçoit ni image ni empreinte.

Texte pour la politique, à côté de celle du site :

> Sur iPhone, Face ID ou Touch ID sert uniquement à verrouiller l’ouverture de Prelevo. Apple ne nous transmet pas la donnée biométrique. Les notifications ne partent qu’après votre accord, dans Réglages. L’export CSV est un fichier que vous partagez vous-même, par la feuille de partage d’iOS. L’abonnement, lorsqu’il sera proposé dans l’app, sera un achat Apple. La version web, elle, reste sur son propre paiement.

## Liens entrants

Deux formes, déjà traduites par `native/links.js` :

- **Schéma** `prelevo://`, déclaré dans `Info.plist`.
- **Universal link** `https://jhnxmr.github.io/prelevo/app/…`, qui est déjà l’adresse de retour Powens.

Le `SceneDelegate` généré par Capacitor transmet ces ouvertures au plugin App. Le pont les réécrit vers l’adresse que la PWA connaît déjà.

| Arrivée | Devient |
| --- | --- |
| `prelevo://connexion?token=…` | `#/connexion?token=…` |
| `https://jhnxmr.github.io/prelevo/app/#/connexion?token=…` | le même fragment |
| `https://jhnxmr.github.io/prelevo/app/?token=…` | `#/connexion?token=…` |
| `prelevo://powens?connection_id=…&state=…` | `?connection_id=…&state=…` sans fragment |
| `https://jhnxmr.github.io/prelevo/app/?connection_id=…&state=…` | les mêmes paramètres |
| Erreur Powens `?error=…&error_description=…` | conservée telle quelle |

Le retour Powens garde `connection_id`, `connection_ids`, `state`, `error` et `error_description`. Au chargement, le code existant envoie vers `#/pwscan` (sandbox) ou termine la connexion API. Le lien magique est lu dans le fragment `#/connexion?token=`, comme sur le web.

Pour que les universal links s’ouvrent dans l’app, et non dans Safari :

1. Remplacez `TEAMID` dans `ios-app/templates/apple-app-site-association` par l’identifiant d’équipe (10 caractères, visible dans le compte développeur).
2. Publiez ce fichier, sans extension, à `https://jhnxmr.github.io/.well-known/apple-app-site-association`.
3. Ne le publiez pas tant que `TEAMID` est encore le mot de remplacement : un fichier faux casse l’association.

Le fichier n’est pas dans la racine du site aujourd’hui. Le schéma `prelevo://` fonctionne sans lui.

## Verrouillage

Dans Compte → Paramètres, une ligne **Verrouillage Face ID** ou **Verrouillage Touch ID** apparaît seulement dans l’app iOS. Elle est désactivée au premier lancement. L’activer demande tout de suite une authentification. Ensuite, l’app se reverrouille quand elle revient au premier plan.

Le libellé vient du type d’appareil (`biometryType` 2 pour Face ID, 1 pour Touch ID). Le code de l’iPhone est proposé en secours. Le texte système est : « Prelevo utilise Face ID pour verrouiller l’app sur cet iPhone. »

La PWA a aussi un verrouillage : code de 4 à 6 chiffres haché sur l’appareil, et WebAuthn quand le navigateur a un authenticator de plateforme. À l’ouverture, et après 5 minutes en arrière-plan. Dans la coquille, `app.js` appelle déjà `BiometricAuthNative` (ou `BiometricAuth`) si `Capacitor.isNativePlatform()` est vrai. Le plugin `@aparajita/capacitor-biometric-auth` est celui qu’il faut garder : pas besoin d’en ajouter un autre. Après `npm run sync`, si `prelevo-lock` est activé, la ligne native « Verrouillage Face ID » se retire pour ne pas empiler deux verrous. Le code reste le repli si la biométrie est annulée.

## Notifications

La ligne **Notifications de l’iPhone** est aussi réservée à l’app, et elle est désactivée au départ. Le système ne demande la permission qu’au moment où vous l’activez. Le jeton est gardé sur l’appareil (`prelevo-apns-token`). Aucun serveur ne le reçoit.

Pour envoyer plus tard : capability Push dans Xcode, clé APNs dans App Store Connect, et un serveur qui parle à Apple. Rien de tout cela n’est dans le dépôt. Au lancement suivant, si la ligne est restée activée, l’app se réinscrit sans redemander la permission.

## Haptique, barre de statut, zones sûres

Un retour haptique léger accompagne les boutons, l’onglet du bas et les lignes de compte. La barre de statut passe en texte clair sur le thème sombre et en texte foncé sur le thème clair, par-dessus la page. Le WebView ne décale pas le contenu (`contentInset: never`) : les marges `safe-area` déjà présentes dans la PWA, complétées par `native.css`, gardent le contenu sous l’encoche et au-dessus de l’indicateur d’accueil.

L’écran de lancement est bleu `#0066FF`, avec la marque centrée.

## Export CSV

Dans l’app, le fichier est écrit dans le cache puis ouvert avec la feuille de partage iOS. Annuler le partage ne montre pas d’erreur. Sur le site, le comportement actuel est conservé : partage Safari s’il existe, sinon téléchargement. Le branchement est uniquement dans la copie `www`, pas dans `/app/app.js`.

## Paiement : rien n’est codé

Apple exige l’achat intégré pour un abonnement numérique débloqué dans l’app (règle 3.1.1). Un bouton qui ouvre Stripe, ou un autre paiement web, dans le binaire iOS serait refusé.

Trois options, à choisir plus tard :

1. **RevenueCat**, au-dessus de StoreKit. Moins de code autour des reçus, des essais et des restaurations. Un compte RevenueCat et des produits App Store Connect (`premium.month`, `premium.year`, par exemple) restent à créer.
2. **StoreKit 2** directement. Pas d’intermédiaire, plus de travail pour les reçus, la restauration et les renouvellements.
3. **Modèle « reader »**. Il ne convient que si l’app ne propose pas d’achat et se contente d’afficher un abonnement pris ailleurs (livres, magazines, audio, vidéo). Prelevo vend des fonctions dans l’app : ce modèle est un mauvais cadrage, et il ne dispense pas de la revue Apple.

La PWA sur le web peut garder Stripe. Dans la coquille iOS, les boutons d’abonnement et le portail de facturation web sont interceptés. Un message dit que l’abonnement iOS passera par l’achat intégré Apple, qui n’est pas en place. La bascule Gratuit / Premium du mode démo, dans Aide, continue de fonctionner pour regarder l’interface.

## Ce qu’il ne faut pas committer

`node_modules/`, le dossier de build Xcode, et `ios/App/App/public/` (régénéré par `npm run sync`). Aucune clé, aucun `.p8`, aucun mot de passe.
