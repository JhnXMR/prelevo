import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import {
  resolveServerEnv, usesPermanentUsers, encryptToken, decryptToken, sealToken,
  verifyWebhookSignature, signWebhook, handleWebhook, mapConnection, scaFromExpire,
  createPermanentUser, openWebview, syncBank, deleteAccount
} from '../server-contract/powens.mjs';

const tokenKey = randomBytes(32).toString('base64');
const secret = 'webhook-secret-test';

function prodEnv(extra = {}) {
  return resolveServerEnv({
    POWENS_ENV: 'production',
    POWENS_DOMAIN: 'prelevo.biapi.pro',
    POWENS_CLIENT_ID: 'client-public',
    POWENS_CLIENT_SECRET: 'client-secret-test',
    POWENS_REDIRECT_URI: 'https://jhnxmr.github.io/prelevo/app/',
    POWENS_WEBHOOK_SECRET: secret,
    POWENS_TOKEN_KEY: tokenKey,
    ...extra
  });
}

test('sans POWENS_ENV, le serveur reste en sandbox et démarre', () => {
  const env = resolveServerEnv({});
  assert.equal(env.env, 'sandbox');
  assert.equal(usesPermanentUsers(env), false);
});

test('la production refuse de démarrer tant qu’une variable manque, sans répéter le secret', () => {
  assert.throws(() => resolveServerEnv({
    POWENS_ENV: 'production',
    POWENS_CLIENT_SECRET: 'super-secret-value'
  }), (err) => {
    assert.equal(err.code, 'config');
    assert.ok(err.missing.includes('domain'));
    assert.ok(err.missing.includes('tokenKey'));
    assert.equal(JSON.stringify(err).includes('super-secret-value'), false);
    assert.equal(String(err.message).includes('super-secret-value'), false);
    return true;
  });
});

test('le jeton permanent est chiffré avant stockage et illisible sans la clé', () => {
  const env = prodEnv();
  const cipher = sealToken('permanent-token-user', env);
  assert.equal(cipher.includes('permanent-token-user'), false);
  assert.equal(decryptToken(cipher, env.tokenKey), 'permanent-token-user');
  assert.throws(() => decryptToken(cipher, randomBytes(32).toString('base64')));
});

test('la signature webhook HMAC est vérifiée, un corps modifié ou une date trop vieille est refusé', () => {
  const now = new Date('2026-10-14T08:00:00.000Z');
  const date = '2026-10-14T07:59:30.000Z';
  const endpoint = '/webhooks/powens';
  const raw = JSON.stringify({ id_webhook_data: 9, type: 'CONNECTION_SYNCED', id_user: 3, id_connection: 7 });
  const signature = signWebhook({ endpoint, date, rawBody: raw, secret });
  assert.equal(verifyWebhookSignature({ endpoint, date, rawBody: raw, signature, secret, now }), true);
  assert.equal(verifyWebhookSignature({ endpoint, date, rawBody: raw + ' ', signature, secret, now }), false);
  assert.equal(verifyWebhookSignature({ endpoint, date, rawBody: raw, signature: 'autre', secret, now }), false);
  assert.equal(verifyWebhookSignature({
    endpoint, date: '2026-10-14T07:00:00.000Z', rawBody: raw, signature, secret, now
  }), false);

  const res = handleWebhook({
    headers: { 'BI-Signature': signature, 'BI-Signature-Date': date },
    rawBody: raw, endpoint, secret, now
  });
  assert.equal(res.status, 200);
  assert.equal(res.event, 'CONNECTION_SYNCED');
  assert.equal(res.powensUserId, 3);
  assert.equal(handleWebhook({ headers: { 'BI-Signature': 'nope', 'BI-Signature-Date': date }, rawBody: raw, endpoint, secret, now }).status, 401);
});

test('SCA : état Powens ou échéance dépassée, avertissement dans les 14 jours', () => {
  const now = new Date('2026-10-14T12:00:00Z');
  const ok = mapConnection({ id: 1, expire: '2027-03-01T00:00:00Z', connector: { name: 'Démo', color: '0066ff' } }, now);
  assert.equal(ok.status, 'ok');
  assert.equal(ok.renew, false);
  assert.equal(ok.color, '#0066FF');

  const soon = mapConnection({ id: 2, expire: '2026-10-20T12:00:00Z' }, now);
  assert.equal(soon.status, 'ok');
  assert.equal(soon.renew, true);
  assert.equal(soon.daysLeft <= 14, true);

  const expired = mapConnection({ id: 3, expire: '2026-04-01T00:00:00Z', state: null }, now);
  assert.equal(expired.status, 'sca');
  const asked = mapConnection({ id: 4, state: 'SCARequired', expire: '2027-01-01T00:00:00Z' }, now);
  assert.equal(asked.status, 'sca');
  const bad = mapConnection({ id: 5, state: 'wrongpass' }, now);
  assert.equal(bad.status, 'error');
  assert.equal(scaFromExpire(null).periodDays, 180);
});

function mockHttp(routes) {
  const calls = [];
  const http = async (req) => {
    calls.push(req);
    const hit = routes.find((r) => r.method === req.method && req.url.startsWith(r.url));
    if (!hit) return { ok: false, status: 404, error: 'introuvable ' + req.url };
    return { ok: true, status: 200, body: typeof hit.body === 'function' ? hit.body(req) : hit.body };
  };
  return { http, calls };
}

test('un utilisateur permanent est créé avec le secret, et l’URL renvoyée au navigateur ne le contient pas', async () => {
  const env = prodEnv();
  const { http, calls } = mockHttp([
    { method: 'POST', url: 'https://prelevo.biapi.pro/2.0/auth/init', body: { auth_token: 'tok-permanent', type: 'permanent', id_user: 55 } },
    { method: 'GET', url: 'https://prelevo.biapi.pro/2.0/auth/token/code', body: { code: 'tmp-code' } }
  ]);
  const saved = [];
  const db = { savePowensUser: async (row) => { saved.push(row); } };
  const out = await openWebview({ http, env, state: 'state-1', db, userId: 'supa-user' });
  assert.equal(calls[0].body.client_secret, 'client-secret-test');
  assert.equal(calls[0].body.client_id, 'client-public');
  assert.equal(saved[0].userId, 'supa-user');
  assert.equal(saved[0].powensUserId, 55);
  assert.equal(saved[0].tokenCipher.includes('tok-permanent'), false);
  assert.equal(decryptToken(saved[0].tokenCipher, tokenKey), 'tok-permanent');
  const url = new URL(out.url);
  assert.equal(url.searchParams.get('code'), 'tmp-code');
  assert.equal(url.searchParams.get('state'), 'state-1');
  assert.equal(url.searchParams.get('client_secret'), null);
  assert.equal(out.url.includes('tok-permanent'), false);
  assert.equal(out.url.includes('client-secret-test'), false);
});

test('un jeton temporaire est refusé, et la sandbox sans secret ne crée pas d’utilisateur permanent', async () => {
  const env = prodEnv();
  const { http } = mockHttp([
    { method: 'POST', url: 'https://prelevo.biapi.pro/2.0/auth/init', body: { auth_token: 'court', type: 'temporary', expires_in: 1800 } }
  ]);
  await assert.rejects(() => createPermanentUser(http, env), /temporaire/);
  const sandbox = resolveServerEnv({ POWENS_DOMAIN: 'prelevo-sandbox.biapi.pro' });
  await assert.rejects(() => openWebview({ http, env: sandbox, state: 's', db: {}, userId: 'u' }), /client_secret/);
});

test('la synchro lit connexions, comptes et opérations', async () => {
  const env = prodEnv();
  const now = new Date('2026-10-14T12:00:00Z');
  const { http, calls } = mockHttp([
    { method: 'GET', url: 'https://prelevo.biapi.pro/2.0/users/me/connections', body: { connections: [{ id: 7, expire: '2026-10-01T00:00:00Z', connector: { name: 'Banque' } }] } },
    { method: 'GET', url: 'https://prelevo.biapi.pro/2.0/users/me/accounts', body: { accounts: [{ id: 1, name: 'Courant' }] } },
    { method: 'GET', url: 'https://prelevo.biapi.pro/2.0/users/me/transactions', body: { transactions: [{ id: 9, value: -12 }] } }
  ]);
  const data = await syncBank(http, env, 'tok-permanent', now);
  assert.equal(calls.every((c) => c.token === 'tok-permanent'), true);
  assert.equal(data.connections[0].status, 'sca');
  assert.equal(data.accounts[0].name, 'Courant');
  assert.equal(data.transactions[0].id, 9);
});

test('suppression RGPD : Powens d’abord, la base seulement si Powens a répondu', async () => {
  const env = prodEnv();
  const cipher = encryptToken('tok-permanent', tokenKey);
  const stored = { userId: 'supa-user', tokenCipher: cipher };
  let dbDeleted = false;
  const fail = mockHttp([]);
  await assert.rejects(() => deleteAccount(fail.http, env, stored, { deleteUser: async () => { dbDeleted = true; } }));
  assert.equal(dbDeleted, false);

  const ok = mockHttp([
    { method: 'DELETE', url: 'https://prelevo.biapi.pro/2.0/users/me', body: {} }
  ]);
  await deleteAccount(ok.http, env, stored, { deleteUser: async (id) => { dbDeleted = id; } });
  assert.equal(ok.calls[0].token, 'tok-permanent');
  assert.equal(ok.calls[0].method, 'DELETE');
  assert.equal(dbDeleted, 'supa-user');
});
