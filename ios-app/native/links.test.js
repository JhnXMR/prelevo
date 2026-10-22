'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = { console: console, URL: URL, URLSearchParams: URLSearchParams };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'links.js'), 'utf8'), context);
const route = context.PrelevoLinks.routeIncomingUrl;

test('retour Powens en universal link', function () {
  const r = route('https://jhnxmr.github.io/prelevo/app/?connection_id=42&state=abc');
  assert.equal(r.search, '?connection_id=42&state=abc');
  assert.equal(r.hash, '');
});

test('erreur Powens conservée', function () {
  const r = route('https://jhnxmr.github.io/prelevo/app/?error=access_denied&error_description=annule');
  assert.equal(r.search, '?error=access_denied&error_description=annule');
  assert.equal(r.hash, '');
});

test('lien magique dans le fragment', function () {
  const r = route('https://jhnxmr.github.io/prelevo/app/#/connexion?token=abc%2B1');
  assert.equal(r.hash, '#/connexion?token=abc%2B1');
  assert.equal(r.search, '');
});

test('lien magique en paramètre et en schéma', function () {
  assert.equal(route('https://jhnxmr.github.io/prelevo/app/?token=xyz').hash, '#/connexion?token=xyz');
  assert.equal(route('prelevo://connexion?token=xyz').hash, '#/connexion?token=xyz');
});

test('schéma prelevo pour Powens', function () {
  const r = route('prelevo://powens?connection_id=7&state=s');
  assert.equal(r.search, '?connection_id=7&state=s');
  assert.equal(r.hash, '');
});

test('les autres adresses sont ignorées', function () {
  assert.equal(route('https://example.com/?connection_id=1'), null);
  assert.equal(route('https://jhnxmr.github.io/prelevo/'), null);
  assert.equal(route('prelevo://connexion'), null);
});
