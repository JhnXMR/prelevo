/* Prelevo – client de l'API Prelevo (backend). Inactif tant que APP_CONFIG.apiBase est vide :
   la maquette publiée garde alors exactement son comportement actuel. */
'use strict';
(function(){
  const base = ((window.APP_CONFIG || {}).apiBase || '').replace(/\/+$/, '');
  const K_SESSION = 'prelevo-session', K_STATE = 'prelevo-bank-state';
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
    async connectBank(){
      const r = await call('POST', '/bank/connect');
      // le state voyage aussi dans l'URL ; on le garde pour vérifier qu'on revient bien de NOTRE demande
      try { sessionStorage.setItem(K_STATE, new URL(r.url).searchParams.get('state') || ''); } catch(e){}
      location.assign(r.url);
    },
    /** Retour banque : Powens (?connection_id=) ou Enable Banking (?code=), toujours avec ?state=. */
    returnParams(){
      const q = new URLSearchParams(location.search);
      const back = q.has('connection_id') || q.has('connection_ids') || q.has('code') || q.has('error');
      if (!q.has('state') || !back) return null;
      return {
        state: q.get('state'),
        connection_id: q.get('connection_id') || undefined,
        code: q.get('code') || undefined,
        error: q.get('error') || undefined
      };
    },
    async finishConnect(p){ sessionStorage.removeItem(K_STATE); return call('POST', '/bank/callback', p); },
    sync: () => call('POST', '/bank/sync'),
    checkout: interval => call('POST', '/billing/checkout', { interval }),
    portal: () => call('POST', '/billing/portal'),
    pushSubscribe: body => call('POST', '/push/subscribe', body),
    pushUnsubscribe: () => call('DELETE', '/push/subscribe'),
    async deleteAccount(){ const r = await call('DELETE', '/me'); session.clear(); return r; }
  };
})();
