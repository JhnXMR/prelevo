/* Prelevo – client de l'API Prelevo (backend). Inactif tant que APP_CONFIG.apiBase est vide :
   la maquette publiée garde alors exactement son comportement actuel. */
'use strict';
(function(){
  const base = ((window.APP_CONFIG || {}).apiBase || '').replace(/\/+$/, '');
  const K_SESSION = 'prelevo-session', K_STATE = 'prelevo-bank-state', K_FLOW = 'prelevo-bank-flow';
  const demo = new URLSearchParams(location.search).has('demo');
  if (!base || demo) { window.PAPI = null; return; }           // pas d'API configurée, ou mode démo : maquette seule

  class ApiError extends Error { constructor(msg, status){ super(msg); this.status = status; } }
  const session = {
    get(){ try { return localStorage.getItem(K_SESSION) || null; } catch(e){ return null; } },
    set(v){ localStorage.setItem(K_SESSION, v); },
    clear(){ localStorage.removeItem(K_SESSION); }
  };
  async function call(method, path, body){
    const s = session.get();
    let res;
    try {
      res = await fetch(base + path, { method, cache: 'no-store', credentials: 'omit',
        headers: Object.assign({ 'Accept': 'application/json' }, body ? { 'Content-Type': 'application/json' } : {}, s ? { 'Authorization': 'Bearer ' + s } : {}),
        body: body ? JSON.stringify(body) : undefined });
    } catch(e){ throw new ApiError('Serveur Prelevo injoignable. Vérifiez votre connexion.', 0); }
    let data = null; try { data = res.status === 204 ? null : await res.json(); } catch(e){}
    if (res.status === 401 && s) session.clear();
    if (!res.ok) throw new ApiError((data && data.error) || ('Erreur ' + res.status), res.status);
    return data;
  }

  window.PAPI = {
    base, ApiError,
    loggedIn: () => !!session.get(),
    requestLink: email => call('POST', '/auth/magic-link', { email }),
    async verify(token){ const r = await call('POST', '/auth/verify', { token }); session.set(r.session); return r.user; },
    async logout(){ try { await call('POST', '/auth/logout'); } catch(e){} session.clear(); },
    me: () => call('GET', '/me'),
    rememberBank(url, flow){
      try {
        sessionStorage.setItem(K_STATE, new URL(url).searchParams.get('state') || '');
        sessionStorage.setItem(K_FLOW, flow);
      } catch(e){}
    },
    async connectBank(){
      const r = await call('POST', '/bank/connect');
      // le state voyage aussi dans l'URL ; on le garde pour vérifier qu'on revient bien de NOTRE demande
      this.rememberBank(r.url, 'connect');
      location.assign(r.url);
    },
    /** Renouvellement SCA (webview /reconnect). Le succès ne renvoie que le state. */
    async reconnect(connectionId){
      const r = await call('POST', '/bank/reconnect', connectionId ? { connectionId: connectionId } : {});
      this.rememberBank(r.url, 'reconnect');
      location.assign(r.url);
    },
    /** Retour de la Webview Powens : succès, erreur, ou annulation. */
    returnParams(){
      const Flow = window.PowensFlow;
      let expected = null, flow = 'connect';
      try { expected = sessionStorage.getItem(K_STATE); flow = sessionStorage.getItem(K_FLOW) || 'connect'; } catch(e){}
      if (!expected) return null;
      if (!Flow) {
        const q = new URLSearchParams(location.search);
        if (q.get('state') !== expected) return null;
        if (flow === 'reconnect' && !q.get('error')) return { state: expected, flow: 'reconnect', ok: true };
        if (!(q.has('connection_id') || q.has('connection_ids') || q.has('error'))) return null;
        return { state: expected, connection_id: q.get('connection_id') || undefined, error: q.get('error') || undefined, flow: flow };
      }
      const o = Flow.callbackOutcome(location.search, expected, flow);
      if (!o) return null;
      return {
        ok: o.ok, cancelled: !!o.cancelled, reason: o.reason, title: o.title, text: o.text,
        state: o.state || expected, flow: o.flow || flow, error: o.error || undefined,
        connection_id: o.connectionId || undefined,
        connection_ids: o.connectionIds || undefined
      };
    },
    clearBankReturn(){
      try { sessionStorage.removeItem(K_STATE); sessionStorage.removeItem(K_FLOW); } catch(e){}
    },
    async finishConnect(p){
      this.clearBankReturn();
      return call('POST', '/bank/callback', {
        state: p.state,
        connection_id: p.connection_id,
        connection_ids: p.connection_ids,
        error: p.error,
        flow: p.flow
      });
    },
    sync: () => call('POST', '/bank/sync'),
    checkout: interval => call('POST', '/billing/checkout', { interval }),
    portal: () => call('POST', '/billing/portal'),
    async deleteAccount(){ const r = await call('DELETE', '/me'); session.clear(); return r; }
  };
})();
