import { createVerify, generateKeyPairSync } from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createBank, readEnv } from '../src/bank.js';
import { createEnableBanking } from '../src/enablebanking.js';
import { signAppJwt } from '../src/jwt.js';
import { mapAccount, mapTransaction } from '../src/map.js';
import { normalizePem } from '../src/pem.js';
import { memoryStore } from '../src/store.js';
import { handleBankRequest } from '../src/http.js';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const pem = privateKey.export({ type: 'pkcs8', format: 'pem' });
const APP = '44da9167-d944-40a8-ad58-6c35ce849ff7';

function verify(token) {
  const [h, p, s] = token.split('.');
  const v = createVerify('RSA-SHA256');
  v.update(h + '.' + p);
  v.end();
  assert.equal(v.verify(publicKey, Buffer.from(s, 'base64url')), true);
  return {
    header: JSON.parse(Buffer.from(h, 'base64url').toString()),
    payload: JSON.parse(Buffer.from(p, 'base64url').toString())
  };
}

test('la clé PEM accepte les \\n échappés', () => {
  const escaped = pem.replace(/\n/g, '\\n');
  assert.equal(normalizePem('"' + escaped + '"'), pem.trim());
  const token = signAppJwt({ appId: APP, privateKey: escaped });
  const { header, payload } = verify(token);
  assert.equal(header.kid, APP);
  assert.equal(header.alg, 'RS256');
  assert.equal(payload.iss, 'enablebanking.com');
  assert.equal(payload.aud, 'api.enablebanking.com');
  assert.ok(payload.exp - payload.iat <= 86400);
  assert.equal(token.includes('PRIVATE KEY'), false);
});

test('POST /auth est en lecture seule vers Société Générale', async () => {
  let seen;
  const client = createEnableBanking({
    appId: APP,
    privateKey: pem,
    fetchImpl: async (url, opts) => {
      seen = { url, opts };
      return { ok: true, status: 200, text: async () => JSON.stringify({ url: 'https://auth.enablebanking.com/ais/start?sessionid=1', authorization_id: '1' }) };
    }
  });
  const res = await client.startAuth({
    state: '11111111-1111-4111-8111-111111111111',
    redirectUrl: 'https://jhndlt.github.io/prelevo/app/',
    aspspName: 'Société Générale',
    aspspCountry: 'FR',
    psuType: 'personal'
  });
  assert.equal(res.url.includes('enablebanking.com'), true);
  assert.equal(seen.url, 'https://api.enablebanking.com/auth');
  assert.equal(seen.opts.method, 'POST');
  const body = JSON.parse(seen.opts.body);
  assert.deepEqual(body.aspsp, { name: 'Société Générale', country: 'FR' });
  assert.equal(body.psu_type, 'personal');
  assert.equal(body.redirect_url, 'https://jhndlt.github.io/prelevo/app/');
  assert.equal(body.access.balances, true);
  assert.equal(body.access.transactions, true);
  assert.equal(Object.hasOwn(body, 'credentials'), false);
  assert.equal(JSON.stringify(body).toLowerCase().includes('payment'), false);
  verify(seen.opts.headers.Authorization.replace(/^Bearer /, ''));
  assert.equal(seen.opts.body.includes(pem.slice(30, 60)), false);
});

test('les comptes et opérations n’emportent pas l’IBAN', () => {
  const account = mapAccount({
    uid: 'abc',
    identification_hash: 'h1',
    name: '',
    cash_account_type: 'CACC',
    currency: 'EUR',
    account_id: { iban: 'FR7630006000011234567890189' }
  }, { balances: [{ balance_type: 'CLBD', balance_amount: { currency: 'EUR', amount: '10.5' } }] });
  assert.equal(account.name, 'Compte courant');
  assert.equal(account.balance, 10.5);
  assert.equal(JSON.stringify(account).includes('FR76'), false);
  const tx = mapTransaction({
    credit_debit_indicator: 'DBIT',
    status: 'BOOK',
    booking_date: '2026-10-01',
    transaction_amount: { amount: '4.00', currency: 'EUR' },
    remittance_information: ['Netflix FR7630006000011234567890189']
  }, account.id);
  assert.equal(tx.value, -4);
  assert.equal(tx.wording.includes('FR76'), false);
});

test('le retour de code remplit le format de l’app', async () => {
  const store = memoryStore();
  const env = readEnv({ BANK_PROVIDER: 'enablebanking', ENABLEBANKING_APP_ID: APP, ENABLEBANKING_PRIVATE_KEY: pem });
  const calls = [];
  const client = {
    async startAuth() {
      return { url: 'https://auth.example/start' };
    },
    async createSession(code) {
      calls.push(code);
      return {
        session_id: 'sess-1',
        aspsp: { name: 'Société Générale', country: 'FR' },
        accounts: [
          { uid: 'u-courant', identification_hash: 'courant', name: 'Compte courant', cash_account_type: 'CACC', currency: 'EUR' },
          { uid: 'u-carte', identification_hash: 'carte', name: 'Carte', cash_account_type: 'CARD', currency: 'EUR' }
        ]
      };
    },
    async balances(uid) {
      return { balances: [{ balance_type: 'CLBD', balance_amount: { currency: 'EUR', amount: uid === 'u-carte' ? '12.00' : '1842.37' } }] };
    },
    async transactions(uid) {
      if (uid === 'u-carte') return [];
      return [
        { transaction_id: 'a', credit_debit_indicator: 'DBIT', status: 'BOOK', booking_date: '2026-08-12', transaction_amount: { amount: '13.49' }, remittance_information: ['Netflix'] },
        { transaction_id: 'b', credit_debit_indicator: 'DBIT', status: 'BOOK', booking_date: '2026-09-12', transaction_amount: { amount: '13.49' }, remittance_information: ['Netflix'] }
      ];
    }
  };
  const bank = createBank({ env, store, client, now: () => new Date('2026-10-21T12:00:00Z') });
  await store.putSession('secret-session', 'user-1');
  const started = await bank.connect('user-1');
  assert.equal(started.url, 'https://auth.example/start');
  const state = 'from-store';
  await store.saveState({ state, userId: 'user-1', expiresAt: '2026-10-21T12:10:00Z' });
  const done = await bank.callback('user-1', { code: 'auth-code', state });
  assert.equal(calls[0], 'auth-code');
  assert.equal(done.subscriptions >= 1, true);
  const me = await bank.me('user-1');
  assert.equal(me.bankConnected, true);
  assert.equal(me.bank.name, 'Société Générale');
  assert.equal(me.accounts.length, 2);
  assert.equal(me.accounts.some((a) => a.name === 'Carte' && a.type === 'card'), true);
  const raw = JSON.stringify(me);
  assert.equal(raw.includes('sess-1'), false);
  assert.equal(raw.includes('PRIVATE'), false);
  assert.equal(raw.includes(pem.slice(40, 80)), false);
});

test('un state inconnu est refusé, Powens n’appelle pas Enable Banking', async () => {
  const store = memoryStore();
  const env = readEnv({ BANK_PROVIDER: 'enablebanking', ENABLEBANKING_APP_ID: APP, ENABLEBANKING_PRIVATE_KEY: pem });
  let hit = 0;
  const bank = createBank({
    env, store,
    client: { startAuth() { hit++; return { url: 'https://auth.example/start' }; } },
    now: () => new Date('2026-10-21T12:00:00Z')
  });
  await assert.rejects(() => bank.callback('user-1', { code: 'x', state: 'nope' }), (e) => e.status === 400);
  const powens = createBank({ env: readEnv({ BANK_PROVIDER: 'powens' }), store, client: { startAuth() { hit++; } } });
  await assert.rejects(() => powens.connect('user-1'), (e) => e.status === 501);
  assert.equal(hit, 0);
});

test('la route connect exige une session et ne renvoie pas la clé', async () => {
  const store = memoryStore();
  const env = readEnv({
    BANK_PROVIDER: 'enablebanking',
    ENABLEBANKING_FIXTURE: '1',
    NODE_ENV: 'development',
    ENABLEBANKING_REDIRECT_URL: 'http://127.0.0.1:8090/app/'
  });
  assert.equal(env.fixture, true);
  assert.equal(readEnv({ BANK_PROVIDER: 'enablebanking', ENABLEBANKING_FIXTURE: '1', NODE_ENV: 'production' }).fixture, false);
  assert.equal(readEnv({ BANK_PROVIDER: 'enablebanking', ENABLEBANKING_FIXTURE: '1', ENABLEBANKING_PRIVATE_KEY: pem }).fixture, false);
  const bank = createBank({ env, store, now: () => new Date('2026-10-21T12:00:00Z') });
  const res = fakeRes();
  await handleBankRequest(fakeReq('POST', '/bank/connect'), res, { bank, store, fixtureUser: 'fixture-user' });
  assert.equal(res.status, 401);
  const ok = fakeRes();
  await handleBankRequest(fakeReq('POST', '/bank/connect', { authorization: 'Bearer fixture' }), ok, { bank, store, fixtureUser: 'fixture-user' });
  assert.equal(ok.status, 200);
  const body = JSON.parse(ok.body);
  assert.equal(body.url.includes('code=fixture'), true);
  assert.equal(body.url.includes('PRIVATE'), false);
});

function fakeReq(method, url, headers = {}) {
  return { method, url, headers, on() {} };
}
function fakeRes() {
  return {
    status: 0, body: '', headersSent: false,
    writeHead(status) { this.status = status; this.headersSent = true; },
    end(payload) { this.body = payload || ''; }
  };
}
