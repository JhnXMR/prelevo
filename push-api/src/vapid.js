const VAPID_KEYS = ['VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY', 'VAPID_SUBJECT'];

export function missingVapid(env = {}) {
  return VAPID_KEYS.filter((key) => !String(env[key] || '').trim());
}

export function assertVapid(env = {}) {
  const missing = missingVapid(env);
  if (missing.length) {
    const err = new Error('Configuration VAPID incomplète');
    err.code = 'config';
    err.missing = missing;
    throw err;
  }
  const subject = String(env.VAPID_SUBJECT).trim();
  const mailto = /^mailto:[^\s@]+@[^\s@]+$/.test(subject);
  const https = /^https:\/\/[^\s]+$/.test(subject);
  if (!mailto && !https) {
    const err = new Error('VAPID_SUBJECT doit être un mailto: ou une URL https');
    err.code = 'config';
    throw err;
  }
  return {
    publicKey: String(env.VAPID_PUBLIC_KEY).trim(),
    privateKey: String(env.VAPID_PRIVATE_KEY).trim(),
    subject
  };
}
