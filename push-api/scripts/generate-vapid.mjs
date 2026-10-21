import webpush from 'web-push';

const keys = webpush.generateVAPIDKeys();
process.stdout.write(
  [
    'Collez ces valeurs dans Clever Cloud. Ne les committez pas.',
    'VAPID_PUBLIC_KEY=' + keys.publicKey,
    'VAPID_PRIVATE_KEY=' + keys.privateKey,
    'VAPID_SUBJECT=mailto:vous@example.com',
    '',
    'Recopiez seulement VAPID_PUBLIC_KEY dans app/config.js (vapidPublicKey), plus tard.',
    ''
  ].join('\n')
);
