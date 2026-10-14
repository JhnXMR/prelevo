/* Prelevo – logique Powens publique (webview, retour, SCA).
   Aucun secret : client_secret, secret webhook et clé de jeton restent sur l'API. */
'use strict';
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.PowensFlow = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const SCA_PERIOD_DAYS = 180;
  const SCA_WARN_DAYS = 14;
  const WEBVIEW_BASE = 'https://webview.powens.com/fr';
  const CANCEL = { access_denied: true, tos_declined: true };

  function clean(v) { return String(v == null ? '' : v).trim(); }

  function resolvePublicConfig(appConfig, override) {
    const fromApp = (appConfig && appConfig.powens) || {};
    const src = Object.assign({}, fromApp, override || {});
    const env = src.env === 'production' ? 'production' : 'sandbox';
    const cfg = {
      env: env,
      domain: clean(src.domain),
      clientId: clean(src.clientId || src.client_id),
      redirectUri: clean(src.redirectUri || src.redirect_uri),
      webviewBase: clean(src.webviewBase || WEBVIEW_BASE).replace(/\/$/, '')
    };
    cfg.ready = !!(cfg.domain && cfg.clientId && cfg.redirectUri);
    return cfg;
  }

  function isProduction(appConfig, override) {
    return resolvePublicConfig(appConfig, override).env === 'production';
  }

  function redirectFor(cfg, loc) {
    const canonical = cfg.redirectUri;
    if (!loc || !canonical) return canonical;
    let expected;
    try { expected = new URL(canonical); } catch (e) { return canonical; }
    if (loc.hostname !== expected.hostname || !loc.origin) return canonical;
    const path = String(loc.pathname || '/').replace(/index\.html$/, '');
    return loc.origin + path;
  }

  function randomState() {
    const cryptoObj = globalThis.crypto;
    if (!cryptoObj || !cryptoObj.getRandomValues) throw new Error('crypto');
    const bytes = new Uint8Array(16);
    cryptoObj.getRandomValues(bytes);
    let out = '';
    for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, '0');
    return out;
  }

  function buildWebviewUrl(opts) {
    if (!opts || opts.clientSecret || opts.client_secret) throw new Error('secret interdit dans l’URL');
    const flow = opts.flow === 'reconnect' ? 'reconnect' : 'connect';
    const base = clean(opts.webviewBase || WEBVIEW_BASE).replace(/\/$/, '');
    const u = new URL(base + '/' + flow);
    u.searchParams.set('domain', opts.domain);
    u.searchParams.set('client_id', opts.clientId);
    u.searchParams.set('redirect_uri', opts.redirectUri);
    if (opts.code) u.searchParams.set('code', opts.code);
    if (opts.state) u.searchParams.set('state', opts.state);
    if (flow === 'reconnect') {
      if (!opts.connectionId) throw new Error('connection_id manquant');
      u.searchParams.set('connection_id', String(opts.connectionId));
    }
    if (/client_secret|clientSecret/.test(u.search)) throw new Error('secret interdit dans l’URL');
    return u.toString();
  }

  function callbackOutcome(search, expectedState, flow) {
    const raw = String(search || '').replace(/^\?/, '');
    const q = new URLSearchParams(raw);
    const state = q.get('state');
    const flowName = flow === 'reconnect' ? 'reconnect' : 'connect';
    const error = q.get('error');
    const connectionId = q.get('connection_id');
    const connectionIds = (q.get('connection_ids') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    const hasSignal = !!(error || connectionId || connectionIds.length || (flowName === 'reconnect' && state));
    if (!hasSignal && !expectedState) return null;
    if (expectedState && state !== expectedState) {
      if (!hasSignal) return null;
      return { ok: false, reason: 'state', title: 'Retour de connexion refusé', text: 'Ce retour ne correspond pas à la demande ouverte dans cet onglet. Relancez la connexion.' };
    }
    if (error) {
      if (CANCEL[error] && error === 'tos_declined') {
        return { ok: false, cancelled: true, error: error, title: 'Conditions non acceptées', text: 'Vous n’avez pas accepté les conditions de l’agrégateur. Vous pouvez réessayer quand vous le souhaitez.' };
      }
      if (CANCEL[error]) {
        return { ok: false, cancelled: true, error: error, title: 'Connexion annulée', text: 'Vous avez annulé la connexion. Vous pouvez réessayer quand vous le souhaitez.' };
      }
      return { ok: false, error: error, title: 'Connexion impossible', text: 'La connexion n’a pas abouti. Réessayez dans un instant.' };
    }
    if (flowName === 'reconnect' && state) {
      return { ok: true, flow: 'reconnect', state: state, connectionId: connectionId || null };
    }
    const id = connectionId || connectionIds[0] || null;
    if (!id) {
      return { ok: false, reason: 'incomplete', title: 'Retour de connexion incomplet', text: 'Relancez la connexion de votre banque.' };
    }
    return { ok: true, flow: 'connect', state: state, connectionId: id, connectionIds: connectionIds.length ? connectionIds : [id] };
  }

  function scaStatus(expiresAt, now) {
    const base = { daysLeft: null, renew: false, expired: false, periodDays: SCA_PERIOD_DAYS };
    if (!expiresAt) return base;
    const end = new Date(expiresAt).getTime();
    if (!Number.isFinite(end)) return base;
    const from = now ? new Date(now).getTime() : Date.now();
    const daysLeft = Math.ceil((end - from) / 86400000);
    return { daysLeft: daysLeft, renew: daysLeft <= SCA_WARN_DAYS, expired: daysLeft <= 0, periodDays: SCA_PERIOD_DAYS };
  }

  return {
    SCA_PERIOD_DAYS: SCA_PERIOD_DAYS,
    SCA_WARN_DAYS: SCA_WARN_DAYS,
    resolvePublicConfig: resolvePublicConfig,
    isProduction: isProduction,
    redirectFor: redirectFor,
    randomState: randomState,
    buildWebviewUrl: buildWebviewUrl,
    callbackOutcome: callbackOutcome,
    scaStatus: scaStatus
  };
});
