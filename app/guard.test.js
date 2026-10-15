'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = {
  console: console,
  crypto: globalThis.crypto,
  TextEncoder: TextEncoder,
  Uint8Array: Uint8Array,
  btoa: btoa,
  atob: atob,
  Date: Date,
  Number: Number,
  String: String
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'guard.js'), 'utf8'), context);
const G = context.PrelevoGuard;

test('le code fait 4 à 6 chiffres', function () {
  assert.equal(G.pinOk('123'), false);
  assert.equal(G.pinOk('1234'), true);
  assert.equal(G.pinOk('123456'), true);
  assert.equal(G.pinOk('1234567'), false);
  assert.equal(G.pinOk('12a4'), false);
});

test('le code est haché et le texte n’est pas conservé', async function () {
  const rec = await G.hashPin('2468');
  assert.equal(rec.iterations, 100000);
  assert.equal(JSON.stringify(rec).includes('2468'), false);
  assert.equal(await G.verifyPin('2468', rec), true);
  assert.equal(await G.verifyPin('2469', rec), false);
  assert.equal(await G.verifyPin('1357', { salt: rec.salt, hash: rec.hash }), false);
});

test('le prochain prélèvement et le rappel J-3', function () {
  const now = new Date(2026, 9, 9, 20, 0, 0);
  const debit = G.nextDebitDate(12, now);
  assert.equal(G.dayKey(debit), '2026-10-12');
  assert.equal(G.dayKey(G.reminderDate(debit, 3)), '2026-10-09');
  assert.equal(G.normalizeLead(undefined), 3);
  assert.equal(G.normalizeLead(9), 3);
  assert.equal(G.normalizeLead(1), 1);
  const later = new Date(2026, 9, 15, 8, 0, 0);
  assert.equal(G.dayKey(G.nextDebitDate(12, later)), '2026-11-12');
});

test('une alerte est due le jour du rappel, une seule fois', function () {
  const now = new Date(2026, 9, 9, 8, 0, 0);
  const subs = [
    { id: 'fibrebox', name: 'FibreBox Internet', day: 12, price: 39.99 },
    { id: 'flixo', name: 'Flixo', day: 18, price: 13.49 },
    { id: 'gone', name: 'Parti', day: 12, price: 1, resiliated: true }
  ];
  const due = G.dueReminders(subs, { fibrebox: 3, flixo: 1 }, now, {});
  assert.equal(due.map(function (d) { return d.id; }).join(','), 'fibrebox');
  assert.equal(due[0].lead, 3);
  const again = G.dueReminders(subs, { fibrebox: 3 }, now, { [due[0].key]: 1 });
  assert.equal(again.length, 0);
});
