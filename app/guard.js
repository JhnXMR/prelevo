/* Code local et dates de rappel. Aucun code en clair n’est conservé. */
(function (root) {
  'use strict';
  var ITERATIONS = 100000;

  function pinOk(pin) {
    return typeof pin === 'string' && /^\d{4,6}$/.test(pin);
  }

  function bytesToB64(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }

  function b64ToBytes(b64) {
    var s = atob(String(b64 || ''));
    var out = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }

  function same(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
    var n = 0;
    for (var i = 0; i < a.length; i++) n |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return n === 0;
  }

  async function hashPin(pin, saltB64) {
    if (!pinOk(pin)) throw new Error('code');
    var salt = saltB64 ? b64ToBytes(saltB64) : crypto.getRandomValues(new Uint8Array(16));
    var key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
    var bits = await crypto.subtle.deriveBits({
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256'
    }, key, 256);
    return { salt: bytesToB64(salt), hash: bytesToB64(new Uint8Array(bits)), iterations: ITERATIONS };
  }

  async function verifyPin(pin, record) {
    if (!pinOk(pin) || !record || !record.salt || !record.hash) return false;
    var next = await hashPin(pin, record.salt);
    return same(next.hash, record.hash);
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function nextDebitDate(day, now) {
    var n = Number(day);
    if (!n || n < 1 || n > 31) return null;
    var cursor = startOfDay(now);
    var d = new Date(cursor.getFullYear(), cursor.getMonth(), n, 8, 0, 0, 0);
    if (d < cursor) d = new Date(cursor.getFullYear(), cursor.getMonth() + 1, n, 8, 0, 0, 0);
    return d;
  }

  function normalizeLead(n) {
    n = Number(n);
    return n === 1 || n === 7 ? n : 3;
  }

  function reminderDate(debit, lead) {
    var d = startOfDay(debit);
    d.setDate(d.getDate() - normalizeLead(lead));
    return d;
  }

  function dayKey(d) {
    var x = startOfDay(d);
    var m = String(x.getMonth() + 1).padStart(2, '0');
    var day = String(x.getDate()).padStart(2, '0');
    return x.getFullYear() + '-' + m + '-' + day;
  }

  function dueReminders(subs, leads, now, sent) {
    var today = startOfDay(now).getTime();
    var out = [];
    (subs || []).forEach(function (s) {
      if (!s || s.resiliated) return;
      var debit = nextDebitDate(s.day, now);
      if (!debit) return;
      var lead = normalizeLead(leads && leads[s.id]);
      if (reminderDate(debit, lead).getTime() !== today) return;
      var key = s.id + ':' + dayKey(debit);
      if (sent && sent[key]) return;
      out.push({
        id: s.id,
        name: s.name,
        amount: s.price != null ? s.price : s.amount,
        lead: lead,
        debit: debit,
        key: key
      });
    });
    return out;
  }

  root.PrelevoGuard = {
    iterations: ITERATIONS,
    pinOk: pinOk,
    hashPin: hashPin,
    verifyPin: verifyPin,
    nextDebitDate: nextDebitDate,
    normalizeLead: normalizeLead,
    reminderDate: reminderDate,
    dayKey: dayKey,
    dueReminders: dueReminders
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
