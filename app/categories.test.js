'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = { console: console };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'categories.js'), 'utf8'), context);
const C = context.PrelevoCategories;

function cat(name, extra) {
  return C.classify(Object.assign({ name: name, amount: -12 }, extra || {}));
}

test('les onze catégories officielles, dans cet ordre', function () {
  assert.equal(C.LIST.map(function (c) { return c.l; }).join('|'),
    'Logement|Courses|Transport|Énergie|Télécom|Abonnements|Loisirs|Restos|Santé|Revenus|Autre');
});

test('classe par libellé, marchand et mots-clés', function () {
  assert.equal(cat('Loyer · Agence Fictive'), 'logement');
  assert.equal(cat('Supérette du Canal'), 'courses');
  assert.equal(cat('Marché Saint-Louis'), 'courses');
  assert.equal(cat('Primeur Bio'), 'courses');
  assert.equal(cat('Boulangerie Martin'), 'courses');
  assert.equal(cat('Carrefour Market'), 'courses');
  assert.equal(cat('Carburant · Station du Canal'), 'transport');
  assert.equal(cat('Passe Navigo', { hint: 'sub' }), 'transport');
  assert.equal(cat('Lumière Électricité'), 'energie');
  assert.equal(cat('FibreBox Internet', { hint: 'sub' }), 'telecom');
  assert.equal(cat('Mobi Forfait 100 Go', { hint: 'sub' }), 'telecom');
  assert.equal(cat('Flixo', { hint: 'sub' }), 'abo');
  assert.equal(cat('Sonora Musique'), 'abo');
  assert.equal(cat('Inconnu Mensuel', { hint: 'sub' }), 'abo');
  assert.equal(cat('Ciné Rex'), 'loisirs');
  assert.equal(cat('Librairie du Parc'), 'loisirs');
  assert.equal(cat('Café Lumière'), 'resto');
  assert.equal(cat('Cantine Sato'), 'resto');
  assert.equal(cat('Bistrot Les Amis'), 'resto');
  assert.equal(cat('Pharmacie des Lilas'), 'sante');
  assert.equal(cat('Salaire · Exemple SAS', { amount: 2200 }), 'revenu');
  assert.equal(cat('Kiosque Presse'), 'autre');
  assert.equal(cat('Bricolage Dupont'), 'autre');
  assert.equal(cat('Kiosque Presse', { hint: 'shopping' }), 'autre');
});

test('uber eats est un resto, uber un transport', function () {
  assert.equal(cat('Uber Eats Paris'), 'resto');
  assert.equal(cat('UBEREATS'), 'resto');
  assert.equal(cat('Uber'), 'transport');
  assert.equal(cat('UBER * TRIP'), 'transport');
});

test('les accents ne changent pas le marchand ni la catégorie', function () {
  assert.equal(C.merchantKey('Café Lumière'), C.merchantKey('CAFE LUMIERE'));
  assert.equal(C.merchantKey('Café Lumière'), C.merchantKey('Café   Lumière'));
  assert.equal(cat('Électricité de Paris'), 'energie');
  assert.equal(cat('ELECTRICITE DE PARIS'), 'energie');
});

test('une correction manuelle l’emporte et se réapplique au même marchand', function () {
  var key = C.merchantKey('Café Lumière');
  var rules = {};
  rules[key] = 'sante';
  assert.equal(C.classify({ name: 'Café Lumière', amount: -4.5 }, rules), 'sante');
  assert.equal(C.classify({ name: 'CAFE  LUMIERE', amount: -9 }, rules), 'sante');
  assert.equal(C.classify({ name: 'Café Lumière', amount: -4.5 }, { 'cafe lumiere': 'nope' }), 'resto');
});

test('un montant positif sans mot-clé est un revenu, le reste est Autre', function () {
  assert.equal(C.classify({ name: 'Remboursement inconnu', amount: 15 }), 'revenu');
  assert.equal(C.classify({ name: '', amount: 0 }), 'autre');
  assert.equal(C.classify({ name: 'Opération', amount: -3 }), 'autre');
  assert.equal(C.fold('shopping'), 'autre');
  assert.equal(C.fold('voyage'), 'autre');
  assert.equal(C.classify({ wording: 'VIR EPARGNE', name: 'Virement épargne', type: 'transfer', amount: -200 }), 'virement');
});
