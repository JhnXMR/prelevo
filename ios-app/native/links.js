/* Traduit un lien entrant (universal link ou schéma prelevo://) vers l'app locale.
   Aucune dépendance : utilisé par native.js et par node --test. */
(function (global) {
  'use strict';

  var SITE = 'jhnxmr.github.io';

  function tokenFrom(url) {
    var q = url.searchParams.get('token');
    if (q) return q;
    var hash = url.hash || '';
    var i = hash.indexOf('?');
    if (i === -1) return '';
    return new URLSearchParams(hash.slice(i + 1)).get('token') || '';
  }

  function powensSearch(url) {
    var keep = ['connection_id', 'connection_ids', 'state', 'error', 'error_description'];
    var out = new URLSearchParams();
    keep.forEach(function (k) {
      var v = url.searchParams.get(k);
      if (v) out.set(k, v);
    });
    var s = out.toString();
    return s ? '?' + s : '';
  }

  function hasPowens(url) {
    return url.searchParams.has('connection_id') || url.searchParams.has('connection_ids') || url.searchParams.has('error');
  }

  function routeIncomingUrl(raw) {
    var url;
    try { url = new URL(String(raw)); }
    catch (e) { return null; }
    var proto = url.protocol;
    var isHttp = proto === 'https:' || proto === 'http:';
    var isScheme = proto === 'prelevo:';
    if (!isHttp && !isScheme) return null;
    if (isHttp && !(url.hostname === SITE && url.pathname.indexOf('/prelevo') === 0)) return null;

    var host = (url.hostname || '').toLowerCase();
    var token = tokenFrom(url);
    var magic = !!token || host === 'connexion' || url.pathname.indexOf('connexion') !== -1 || (url.hash || '').indexOf('connexion') !== -1;
    if (magic && token) {
      return { search: '', hash: '#/connexion?token=' + encodeURIComponent(token) };
    }
    if (hasPowens(url) || host === 'powens') {
      var search = powensSearch(url);
      if (!search) return null;
      return { search: search, hash: '' };
    }
    return null;
  }

  global.PrelevoLinks = { routeIncomingUrl: routeIncomingUrl };
})(typeof globalThis !== 'undefined' ? globalThis : this);
