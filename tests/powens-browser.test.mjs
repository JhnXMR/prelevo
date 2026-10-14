import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function load(powensOverride) {
  const store = {};
  const fetches = [];
  const sandbox = {
    sessionStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    },
    location: {
      hostname: 'jhnxmr.github.io',
      origin: 'https://jhnxmr.github.io',
      pathname: '/prelevo/app/',
      search: '',
      assign(url) { this.assigned = String(url); }
    },
    fetch: async (url, opts) => {
      fetches.push({ url: String(url), opts });
      if (String(url).endsWith('/auth/init')) {
        return { ok: true, status: 200, json: async () => ({ auth_token: 'tmp-token', type: 'temporary', expires_in: 1800 }) };
      }
      if (String(url).includes('/auth/token/code')) {
        return { ok: true, status: 200, json: async () => ({ code: 'once' }) };
      }
      return { ok: false, status: 500, json: async () => ({ description: 'panne' }) };
    },
    console,
    URL,
    URLSearchParams,
    crypto: globalThis.crypto,
    Date,
    JSON,
    Object,
    Array,
    String,
    Number,
    Math,
    Promise,
    setTimeout
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  let src = readFileSync(new URL('../app/config.js', import.meta.url), 'utf8')
    + '\n' + readFileSync(new URL('../app/powens-flow.js', import.meta.url), 'utf8');
  if (powensOverride) src += `\nwindow.APP_CONFIG.powens = ${JSON.stringify(powensOverride)};\n`;
  src += '\n' + readFileSync(new URL('../app/powens.js', import.meta.url), 'utf8');
  vm.runInContext(src, sandbox);
  return { sandbox, fetches, store };
}

test('sandbox navigateur : webview réelle, sans secret, avec state', async () => {
  const { sandbox, fetches, store } = load();
  assert.equal(sandbox.PW.config.env, 'sandbox');
  await sandbox.PW.start();
  assert.equal(fetches[0].opts.method, 'POST');
  assert.equal(fetches[0].opts.body, undefined);
  const url = new URL(sandbox.location.assigned);
  assert.equal(url.pathname, '/fr/connect');
  assert.equal(url.searchParams.get('domain'), 'prelevo-sandbox.biapi.pro');
  assert.equal(url.searchParams.get('client_id'), '80438676');
  assert.equal(url.searchParams.get('redirect_uri'), 'https://jhnxmr.github.io/prelevo/app/');
  assert.equal(url.searchParams.get('code'), 'once');
  assert.equal(url.searchParams.get('state'), JSON.parse(store['prelevo-pw-state']));
  assert.equal(url.searchParams.get('client_secret'), null);
  assert.equal(sandbox.location.assigned.includes('tmp-token'), false);
});

test('production : le navigateur ne crée pas d’utilisateur Powens', async () => {
  const { sandbox, fetches } = load({
    env: 'production',
    domain: 'prelevo.biapi.pro',
    clientId: '999',
    redirectUri: 'https://jhnxmr.github.io/prelevo/app/'
  });
  await assert.rejects(() => sandbox.PW.start(), (err) => err.code === 'serverOnly');
  assert.equal(fetches.length, 0);
  assert.equal(sandbox.PW.testCreds.length, 0);
});

test('retour annulé ou state incorrect', async () => {
  const { sandbox, store } = load();
  store['prelevo-pw-state'] = JSON.stringify('etat');
  sandbox.location.search = '?state=etat&error=access_denied&error_description=nope';
  const back = sandbox.PW.returnError();
  assert.equal(back.cancelled, true);
  assert.equal(back.text.includes('nope'), false);
  sandbox.location.search = '?state=autre&connection_id=1';
  assert.equal(sandbox.PW.returnError().reason, 'state');
});
