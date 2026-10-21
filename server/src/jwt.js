import { createPrivateKey, createSign } from 'node:crypto';
import { assertPrivateKey, normalizePem } from './pem.js';

function b64url(value) {
  const buf = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return buf.toString('base64url');
}

/**
 * JWT applicatif Enable Banking.
 * kid = identifiant d’application, iss et aud imposés par l’API. Durée max 24 h.
 * La clé ne sort pas de cette fonction.
 */
export function signAppJwt({ appId, privateKey, now = new Date(), ttlSec = 600 }) {
  const kid = String(appId || '').trim();
  if (!kid) {
    const err = new Error('ENABLEBANKING_APP_ID manquant');
    err.code = 'config';
    throw err;
  }
  const ttl = Math.min(Math.max(Number(ttlSec) || 600, 30), 24 * 3600);
  const iat = Math.floor(now.getTime() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid }));
  const payload = b64url(JSON.stringify({
    iss: 'enablebanking.com',
    aud: 'api.enablebanking.com',
    iat,
    exp: iat + ttl
  }));
  const data = header + '.' + payload;
  const sign = createSign('RSA-SHA256');
  sign.update(data);
  sign.end();
  const key = createPrivateKey(assertPrivateKey(normalizePem(privateKey)));
  return data + '.' + sign.sign(key).toString('base64url');
}
