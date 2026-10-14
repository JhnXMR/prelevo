import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const flow = require('../app/powens-flow.js');

const sandboxApp = {
  powens: {
    env: 'sandbox',
    domain: 'prelevo-sandbox.biapi.pro',
    clientId: '80438676',
    redirectUri: 'https://jhnxmr.github.io/prelevo/app/',
    webviewBase: 'https://webview.powens.com/fr'
  }
};

test('le défaut est la sandbox, sans recopier un secret', () => {
  const cfg = flow.resolvePublicConfig(sandboxApp);
  assert.equal(cfg.env, 'sandbox');
  assert.equal(cfg.ready, true);
  assert.equal(cfg.domain, 'prelevo-sandbox.biapi.pro');
  assert.equal('clientSecret' in cfg, false);
  assert.equal('client_secret' in cfg, false);
});

test('un secret passé par erreur est ignoré', () => {
  const cfg = flow.resolvePublicConfig(sandboxApp, { client_secret: 'ne-doit-pas-rester', clientSecret: 'non-plus' });
  assert.equal('clientSecret' in cfg, false);
  assert.equal(cfg.clientId, '80438676');
});

test('la production incomplète n’est pas prête', () => {
  const cfg = flow.resolvePublicConfig({ powens: { env: 'production' } });
  assert.equal(cfg.env, 'production');
  assert.equal(cfg.ready, false);
  assert.equal(flow.isProduction({ powens: { env: 'production' } }), true);
  assert.equal(flow.isProduction(sandboxApp), false);
});

test('la webview de connexion porte le redirect et jamais le secret', () => {
  const url = new URL(flow.buildWebviewUrl({
    domain: 'prelevo-sandbox.biapi.pro',
    clientId: '80438676',
    redirectUri: 'https://jhnxmr.github.io/prelevo/app/',
    code: 'code-test',
    state: 'abc',
    flow: 'connect'
  }));
  assert.equal(url.origin + url.pathname, 'https://webview.powens.com/fr/connect');
  assert.equal(url.searchParams.get('domain'), 'prelevo-sandbox.biapi.pro');
  assert.equal(url.searchParams.get('client_id'), '80438676');
  assert.equal(url.searchParams.get('redirect_uri'), 'https://jhnxmr.github.io/prelevo/app/');
  assert.equal(url.searchParams.get('code'), 'code-test');
  assert.equal(url.searchParams.get('state'), 'abc');
  assert.equal(url.searchParams.get('client_secret'), null);
  assert.throws(() => flow.buildWebviewUrl({ client_secret: 'x', domain: 'd', clientId: '1', redirectUri: 'https://ex.fr/' }));
});

test('la webview de reconnexion exige le connection_id', () => {
  const url = new URL(flow.buildWebviewUrl({
    domain: 'prelevo.biapi.pro',
    clientId: '99',
    redirectUri: 'https://jhnxmr.github.io/prelevo/app/',
    code: 'c',
    state: 's',
    flow: 'reconnect',
    connectionId: 42
  }));
  assert.equal(url.pathname, '/fr/reconnect');
  assert.equal(url.searchParams.get('connection_id'), '42');
  assert.throws(() => flow.buildWebviewUrl({
    domain: 'prelevo.biapi.pro', clientId: '99', redirectUri: 'https://jhnxmr.github.io/prelevo/app/', flow: 'reconnect'
  }));
});

test('hors du domaine publié, le redirect reste celui de la console', () => {
  const cfg = flow.resolvePublicConfig(sandboxApp);
  assert.equal(flow.redirectFor(cfg, { hostname: 'localhost', origin: 'http://localhost:8090', pathname: '/app/' }), cfg.redirectUri);
  assert.equal(flow.redirectFor(cfg, { hostname: 'jhnxmr.github.io', origin: 'https://jhnxmr.github.io', pathname: '/prelevo/app/index.html' }), 'https://jhnxmr.github.io/prelevo/app/');
});

test('annulation, refus des conditions et erreur technique', () => {
  const cancel = flow.callbackOutcome('?state=s1&error=access_denied&error_description=User+cancelled', 's1', 'connect');
  assert.equal(cancel.cancelled, true);
  assert.match(cancel.text, /Vous avez annulé/);
  assert.equal(cancel.text.includes('User cancelled'), false);

  const tos = flow.callbackOutcome('?state=s1&error=tos_declined', 's1', 'connect');
  assert.equal(tos.cancelled, true);
  assert.match(tos.text, /Vous n’avez pas accepté/);

  const bug = flow.callbackOutcome('?state=s1&error=server_error', 's1', 'connect');
  assert.equal(bug.ok, false);
  assert.equal(bug.cancelled, undefined);
  assert.match(bug.text, /Réessayez/);
});

test('succès, state incorrect, reconnexion sans connection_id', () => {
  const ok = flow.callbackOutcome('?state=s1&connection_id=7', 's1', 'connect');
  assert.equal(ok.ok, true);
  assert.equal(ok.connectionId, '7');

  const many = flow.callbackOutcome('?state=s1&connection_ids=3,4', 's1', 'connect');
  assert.deepEqual(many.connectionIds, ['3', '4']);
  assert.equal(many.connectionId, '3');

  const mismatch = flow.callbackOutcome('?state=autre&connection_id=7', 's1', 'connect');
  assert.equal(mismatch.reason, 'state');
  assert.match(mismatch.text, /cet onglet/);

  const reconnect = flow.callbackOutcome('?state=s1', 's1', 'reconnect');
  assert.equal(reconnect.ok, true);
  assert.equal(reconnect.flow, 'reconnect');
  assert.equal(reconnect.connectionId, null);

  assert.equal(flow.callbackOutcome('', null, 'connect'), null);
});

test('SCA : 180 jours, avertissement à 14 jours, expiré à 0', () => {
  const now = new Date('2026-10-14T12:00:00Z');
  const far = flow.scaStatus('2027-04-12T12:00:00Z', now);
  assert.equal(far.periodDays, 180);
  assert.equal(far.expired, false);
  assert.equal(far.renew, false);
  assert.ok(far.daysLeft > 14);

  const soon = flow.scaStatus('2026-10-24T12:00:00Z', now);
  assert.equal(soon.daysLeft, 10);
  assert.equal(soon.renew, true);
  assert.equal(soon.expired, false);

  const dead = flow.scaStatus('2026-10-14T00:00:00Z', now);
  assert.equal(dead.expired, true);
  assert.equal(flow.scaStatus(null, now).daysLeft, null);
});

test('le front publié ne contient pas de secret Powens', () => {
  const files = [
    'app/config.js', 'app/powens-flow.js', 'app/powens.js', 'app/api.js', 'app/app.js', 'app/index.html', 'app/sw.js'
  ];
  const secretAssign = /client_secret\s*[:=]\s*['"][^'"]+['"]|POWENS_CLIENT_SECRET\s*=\s*['"][^'"]+|POWENS_WEBHOOK_SECRET\s*=\s*['"][^'"]+|POWENS_TOKEN_KEY\s*=\s*['"][^'"]+/;
  for (const f of files) {
    const src = readFileSync(new URL('../' + f, import.meta.url), 'utf8');
    assert.equal(secretAssign.test(src), false, f);
  }
  const cfg = readFileSync(new URL('../app/config.js', import.meta.url), 'utf8');
  assert.match(cfg, /env:\s*'sandbox'/);
});
