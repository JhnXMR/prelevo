/**
 * Contrat Powens à reprendre dans prelevo-api (ce dépôt ne contient pas le backend).
 * Sandbox par défaut. Production : variables d'environnement, jamais de secret dans le code.
 * Jeton utilisateur chiffré avant stockage. Webhook : HMAC BI-Signature. Suppression Powens puis base.
 */
import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const flow = require('../app/powens-flow.js');

export const SCA_PERIOD_DAYS = 180;
export const SCA_WARN_DAYS = 14;
const SKEW_MS = 5 * 60 * 1000;

const SCA_STATES = new Set([
  'SCARequired', 'webauthRequired', 'additionalInformationNeeded', 'decoupled', 'actionNeeded'
]);
const ERROR_STATES = new Set([
  'wrongpass', 'passwordExpired', 'bug', 'websiteUnavailable', 'rateLimiting'
]);

const PROD_KEYS = ['domain', 'clientId', 'clientSecret', 'redirectUri', 'webhookSecret', 'tokenKey'];

export function resolveServerEnv(raw = {}) {
  const envName = String(raw.POWENS_ENV || 'sandbox').toLowerCase() === 'production' ? 'production' : 'sandbox';
  const env = {
    env: envName,
    domain: String(raw.POWENS_DOMAIN || '').trim(),
    clientId: String(raw.POWENS_CLIENT_ID || '').trim(),
    clientSecret: raw.POWENS_CLIENT_SECRET ? String(raw.POWENS_CLIENT_SECRET) : '',
    redirectUri: String(raw.POWENS_REDIRECT_URI || '').trim(),
    webhookSecret: raw.POWENS_WEBHOOK_SECRET ? String(raw.POWENS_WEBHOOK_SECRET) : '',
    tokenKey: raw.POWENS_TOKEN_KEY ? String(raw.POWENS_TOKEN_KEY) : ''
  };
  if (envName === 'production') {
    const missing = PROD_KEYS.filter((k) => !env[k]);
    if (missing.length) {
      const err = new Error('Configuration Powens de production incomplète');
      err.code = 'config';
      err.missing = missing;
      throw err;
    }
  }
  return env;
}

export function usesPermanentUsers(env) {
  return env.env === 'production' || !!(env.clientId && env.clientSecret);
}

function decodeKey(key) {
  if (Buffer.isBuffer(key) && key.length === 32) return key;
  const s = String(key || '').trim();
  if (/^[0-9a-f]{64}$/i.test(s)) return Buffer.from(s, 'hex');
  const b = Buffer.from(s, 'base64');
  if (b.length === 32) return b;
  const err = new Error('POWENS_TOKEN_KEY doit faire 32 octets');
  err.code = 'config';
  throw err;
}

export function encryptToken(plaintext, key) {
  const k = decodeKey(key);
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', k, iv);
  const enc = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
}

export function decryptToken(payload, key) {
  const k = decodeKey(key);
  const buf = Buffer.from(String(payload || ''), 'base64');
  if (buf.length < 12 + 16 + 1) throw new Error('Jeton chiffré illisible');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const enc = buf.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', k, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
}

export function scaFromExpire(expire, now = new Date()) {
  if (!expire) return { daysLeft: null, renew: false, expired: false, periodDays: SCA_PERIOD_DAYS };
  const end = new Date(expire).getTime();
  if (!Number.isFinite(end)) return { daysLeft: null, renew: false, expired: false, periodDays: SCA_PERIOD_DAYS };
  const daysLeft = Math.ceil((end - new Date(now).getTime()) / 86400000);
  return { daysLeft, renew: daysLeft <= SCA_WARN_DAYS, expired: daysLeft <= 0, periodDays: SCA_PERIOD_DAYS };
}

export function mapConnection(connection, now = new Date()) {
  const c = connection || {};
  const state = c.state || null;
  const sca = scaFromExpire(c.expire || null, now);
  let status = 'ok';
  if (ERROR_STATES.has(state)) status = 'error';
  else if (SCA_STATES.has(state) || sca.expired) status = 'sca';
  const connector = c.connector || {};
  return {
    id: c.id ?? null,
    status,
    renew: status === 'sca' || sca.renew,
    scaExpiresAt: c.expire || null,
    daysLeft: sca.daysLeft,
    state,
    name: connector.name || null,
    logo: connector.uuid ? `https://assets.powens.com/logos/${String(connector.uuid).toLowerCase()}-thumbnail@2x.webp` : null,
    color: connector.color ? `#${String(connector.color).replace(/^#/, '').toUpperCase()}` : null
  };
}

export function signWebhook({ method = 'POST', endpoint, date, rawBody, secret }) {
  const payload = `${String(method).toUpperCase()}.${endpoint}.${date}.${rawBody}`;
  return createHmac('sha256', secret).update(payload).digest('base64');
}

export function verifyWebhookSignature({ method = 'POST', endpoint, date, rawBody, signature, secret, now = new Date(), maxSkewMs = SKEW_MS }) {
  if (!endpoint || !date || rawBody == null || !signature || !secret) return false;
  const t = Date.parse(date);
  if (!Number.isFinite(t)) return false;
  if (Math.abs(new Date(now).getTime() - t) > maxSkewMs) return false;
  const expected = signWebhook({ method, endpoint, date, rawBody, secret });
  const a = Buffer.from(String(signature));
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function handleWebhook({ headers = {}, rawBody, endpoint, secret, now = new Date() }) {
  const lower = {};
  Object.keys(headers).forEach((k) => { lower[k.toLowerCase()] = headers[k]; });
  const ok = verifyWebhookSignature({
    method: 'POST',
    endpoint,
    date: lower['bi-signature-date'],
    rawBody,
    signature: lower['bi-signature'],
    secret,
    now
  });
  if (!ok) return { status: 401, body: { error: 'Signature refusée' } };
  let payload;
  try { payload = JSON.parse(rawBody); } catch (e) { return { status: 400, body: { error: 'JSON illisible' } }; }
  return {
    status: 200,
    body: { ok: true },
    event: payload.type || payload.event || null,
    idWebhookData: payload.id_webhook_data ?? null,
    powensUserId: payload.id_user ?? (payload.user && payload.user.id) ?? null,
    connectionId: payload.id_connection ?? (payload.connection && payload.connection.id) ?? null
  };
}

async function httpJson(http, req) {
  const res = await http(req);
  if (!res || res.ok === false) {
    const err = new Error((res && res.error) || 'Powens injoignable');
    err.status = res && res.status;
    throw err;
  }
  return res.body ?? res;
}

export async function createPermanentUser(http, env) {
  if (!usesPermanentUsers(env)) {
    const err = new Error('Utilisateur permanent impossible sans client_id et client_secret');
    err.code = 'config';
    throw err;
  }
  const data = await httpJson(http, {
    method: 'POST',
    url: `https://${env.domain}/2.0/auth/init`,
    body: { client_id: env.clientId, client_secret: env.clientSecret }
  });
  if (!data || !data.auth_token) throw new Error('Jeton Powens absent');
  if (data.type === 'temporary') throw new Error('Jeton temporaire refusé');
  return { token: data.auth_token, powensUserId: data.id_user ?? data.id ?? null, type: data.type || 'permanent' };
}

export async function createWebviewCode(http, env, token) {
  const data = await httpJson(http, {
    method: 'GET',
    url: `https://${env.domain}/2.0/auth/token/code`,
    token
  });
  if (!data || !data.code) throw new Error('Code de webview absent');
  return data.code;
}

export async function syncBank(http, env, token, now = new Date()) {
  const connections = await httpJson(http, { method: 'GET', url: `https://${env.domain}/2.0/users/me/connections?expand=connector`, token });
  const accounts = await httpJson(http, { method: 'GET', url: `https://${env.domain}/2.0/users/me/accounts`, token });
  const transactions = await httpJson(http, { method: 'GET', url: `https://${env.domain}/2.0/users/me/transactions?limit=1000`, token });
  const list = (connections && connections.connections) || [];
  return {
    connections: list.map((c) => mapConnection(c, now)),
    accounts: (accounts && accounts.accounts) || [],
    transactions: (transactions && transactions.transactions) || []
  };
}

export async function deletePowensUser(http, env, token) {
  if (!token) throw new Error('Jeton absent : suppression Powens impossible');
  await httpJson(http, { method: 'DELETE', url: `https://${env.domain}/2.0/users/me`, token });
}

/** Powens d'abord, base ensuite. Si Powens échoue, la base n'est pas effacée (nouvel essai possible). */
export async function deleteAccount(http, env, stored, db) {
  const token = decryptToken(stored.tokenCipher, env.tokenKey);
  await deletePowensUser(http, env, token);
  await db.deleteUser(stored.userId);
}

export function sealToken(token, env) {
  return encryptToken(token, env.tokenKey);
}

/**
 * Ouvre la webview pour un utilisateur Supabase.
 * Crée l'utilisateur Powens permanent s'il n'existe pas, chiffre le jeton, ne renvoie que l'URL.
 */
export async function openWebview({ http, env, state, db, userId, existing, flowName = 'connect', connectionId }) {
  if (!usesPermanentUsers(env)) {
    const err = new Error('Webview serveur : client_id et client_secret requis');
    err.code = 'config';
    throw err;
  }
  if (!state) throw new Error('state manquant');
  let token = existing && existing.tokenCipher ? decryptToken(existing.tokenCipher, env.tokenKey) : null;
  let powensUserId = existing && existing.powensUserId || null;
  if (!token) {
    const created = await createPermanentUser(http, env);
    token = created.token;
    powensUserId = created.powensUserId;
    await db.savePowensUser({
      userId,
      powensUserId,
      tokenCipher: sealToken(token, env)
    });
  }
  const code = await createWebviewCode(http, env, token);
  const url = flow.buildWebviewUrl({
    domain: env.domain,
    clientId: env.clientId,
    redirectUri: env.redirectUri,
    webviewBase: 'https://webview.powens.com/fr',
    code,
    state,
    flow: flowName,
    connectionId
  });
  if (url.includes(env.clientSecret) || url.includes(token)) throw new Error('Fuite d’un secret dans l’URL');
  return { url, powensUserId };
}
