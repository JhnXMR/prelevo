/* Prelevo – connexion à la banque de TEST Powens (sandbox), 100 % côté navigateur.
   - Aucun secret ici : client_id public uniquement. Le jeton temporaire Powens (30 min) reste en sessionStorage.
   - Données : faux comptes de la sandbox Powens (Demo Institution / Connecteur de test). */
'use strict';
(function(){
  const PW_CFG = Object.assign({
    domain: 'prelevo-sandbox.biapi.pro',
    clientId: '80438676',
    webview: 'https://webview.powens.com/fr/connect',
    canonicalRedirect: 'https://jhnxmr.github.io/prelevo/app/'
  }, window.POWENS_CONFIG || {});
  const API = `https://${PW_CFG.domain}/2.0`;
  const K_TOKEN = 'prelevo-pw-token', K_RESULT = 'prelevo-pw-result';
  const TOKEN_TTL = 1800 * 1000;

  const ss = {
    get(k){ try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch(e){ return null; } },
    set(k, v){ sessionStorage.setItem(k, JSON.stringify(v)); },
    del(k){ sessionStorage.removeItem(k); }
  };
  // Le redirect_uri doit être déclaré dans la console Powens : on n'utilise que l'URL publiée.
  const redirectUri = () => /(^|\.)jhnxmr\.github\.io$/.test(location.hostname)
    ? location.origin + location.pathname.replace(/index\.html$/, '')
    : PW_CFG.canonicalRedirect;

  class PwError extends Error { constructor(msg, status, code){ super(msg); this.status = status; this.code = code; } }
  async function api(path, opts = {}){
    const tok = opts.token || (ss.get(K_TOKEN) || {}).token;
    const res = await fetch(API + path, { method: opts.method || 'GET', cache: 'no-store',
      headers: Object.assign({ 'Accept': 'application/json' }, tok ? { 'Authorization': 'Bearer ' + tok } : {}, opts.body ? { 'Content-Type': 'application/json' } : {}),
      body: opts.body ? JSON.stringify(opts.body) : undefined });
    let data = null; try { data = await res.json(); } catch(e){}
    if (!res.ok) throw new PwError((data && (data.description || data.message)) || ('HTTP ' + res.status), res.status, data && data.code);
    return data;
  }

  // 1) jeton temporaire (sans secret) -> 2) code à usage unique -> 3) webview Powens
  async function start(){
    const init = await api('/auth/init', { method: 'POST', token: null });
    if (!init || !init.auth_token) throw new PwError('Jeton Powens non reçu');
    ss.set(K_TOKEN, { token: init.auth_token, exp: Date.now() + (init.expires_in || 1800) * 1000 });
    ss.del(K_RESULT);
    const code = await api('/auth/token/code?type=singleAccess', { token: init.auth_token });
    const u = new URL(PW_CFG.webview);
    u.searchParams.set('domain', PW_CFG.domain);
    u.searchParams.set('client_id', PW_CFG.clientId);
    u.searchParams.set('redirect_uri', redirectUri());
    u.searchParams.set('code', code.code);
    location.assign(u.toString());
  }

  const tokenInfo = () => { const t = ss.get(K_TOKEN); if (!t) return null; return Object.assign({}, t, { expired: Date.now() >= t.exp }); };
  const isReturn = () => { const q = new URLSearchParams(location.search); return q.has('connection_id') || (q.has('error') && !!ss.get(K_TOKEN)); };
  const returnError = () => { const q = new URLSearchParams(location.search); return q.get('error') ? (q.get('error_description') || q.get('error')) : null; };

  // ---------- détection des prélèvements récurrents (notre algo, pas celui de Powens) ----------
  const STOP = /\b(PRLV|PRELEVEMENT|PRELEVT|SEPA|SDD|ECH|CB|CARTE|PAIEMENT|PAIEMT|FACT|DU|LE|LA|LES|DE|DES|REF|MANDAT|ICS|EUR|FR)\b/g;
  const norm = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
    .replace(/\d{2}[\/.]\d{2}([\/.]\d{2,4})?/g, ' ')      // dates
    .replace(/X{2,}\d*|\b\w*\d{3,}\w*\b|N°\S*/g, ' ')       // références, n° de carte
    .replace(/[^A-Z ]+/g, ' ').replace(STOP, ' ').replace(/\s+/g, ' ').trim()
    .split(' ').filter(w => w.length > 1).slice(0, 5).join(' ');
  const SUB_KW = /\b(ABO|ABONNEMENT|FACTURE|FORFAIT|MENSUEL|MOBILE|BOX|INTERNET|FIBRE|TV|SPOTIFY|DEEZER|NETFLIX|DISNEY|CANAL|PRIME|YOUTUBE|APPLE|ICLOUD|GOOGLE|NAVIGO|ASSURANCE|MUTUELLE|ELECTRICITE|EDF|ENGIE|GAZ|EAU|SALLE|SPORT|GYM|FITNESS|PRESSE|JOURNAL|STREAMING|CLOUD|ADOBE|MICROSOFT)\b/;
  const EXCLUDE_KW = /\b(FRAIS|COMMISSION|AGIOS|COTISATION CARTE|AMERICAN EXPRESS|AMEX|RETRAIT|VIREMENT|VIR)\b/;
  const EXCLUDE_TYPES = ['transfer', 'withdrawal', 'check', 'summary_card', 'loan_repayment', 'deposit', 'payback'];
  const CATS = [
    [/ELECTRICITE|EDF|ENGIE|GAZ|EAU/, 'Énergie', '#F59E0B'], [/BOX|INTERNET|FIBRE|TV/, 'Box internet', '#F16E00'],
    [/MOBILE|FORFAIT|SFR|ORANGE|BOUYGUES|FREE/, 'Téléphonie', '#0AA5A5'], [/SPOTIFY|DEEZER|MUSIQUE/, 'Musique', '#1DB954'],
    [/NETFLIX|DISNEY|CANAL|YOUTUBE|STREAMING/, 'Streaming vidéo', '#E50914'], [/NAVIGO|TRANSPORT|SNCF|RATP/, 'Transport', '#2F5BEA'],
    [/ASSURANCE|MUTUELLE/, 'Assurance', '#5B6B8C'], [/SALLE|SPORT|GYM|FITNESS/, 'Sport', '#7B3FE4'],
    [/CLOUD|ICLOUD|GOOGLE|APPLE|ADOBE|MICROSOFT/, 'Appli / cloud', '#3B82F6']
  ];
  const MOIS = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
  const dOf = t => new Date((t.rdate || t.date) + 'T12:00:00');
  const days = (a, b) => Math.round((b - a) / 864e5);
  const title = s => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  function detect(accounts, txs, today = new Date()){
    const eurAcc = new Set(accounts.filter(a => !a.currency || (a.currency.id || a.currency) === 'EUR').map(a => a.id));
    const seen = new Set();
    const debits = txs.filter(t => !t.deleted && t.value < 0 && eurAcc.has(t.id_account) && !EXCLUDE_TYPES.includes(t.type))
      .map(t => Object.assign({}, t, { _n: norm(t.simplified_wording || t.wording || t.original_wording), _d: dOf(t), _a: -t.value }))
      .filter(t => t._n && !EXCLUDE_KW.test(t._n))
      .filter(t => { const k = t._n + '|' + t._a + '|' + (t.rdate || t.date); if (seen.has(k)) return false; seen.add(k); return true; });
    const groups = {};
    debits.forEach(t => (groups[t._n] = groups[t._n] || []).push(t));
    const months = []; for (let i = 5; i >= 0; i--){ const d = new Date(today.getFullYear(), today.getMonth() - i, 1); months.push(d); }
    const out = [];
    Object.entries(groups).forEach(([n, list]) => {
      list.sort((a, b) => a._d - b._d);
      // chaîne chronologique : chaque montant à ±10 % du précédent, ou hausse de prix (jusqu'à +35 %)
      let best = [];
      list.forEach((seed, i) => {
        if (best.length && best.includes(seed)) return;
        const chain = [seed];
        list.slice(i + 1).forEach(t => { const p = chain[chain.length - 1]._a;
          if (Math.abs(t._a - p) <= p * 0.10 + 0.01 || (t._a > p && t._a <= p * 1.35)) chain.push(t); });
        if (chain.length > best.length) best = chain;
      });
      const occ = best;
      const gaps = occ.slice(1).map((t, i) => days(occ[i]._d, t._d)).filter(g => g >= 3);
      const monthly = occ.length >= 2 && gaps.length >= 1 && gaps.every(g => g >= 25 && g <= 35);
      const kw = SUB_KW.test(n);
      if (!monthly && !kw) return;
      const last = occ[occ.length - 1];
      const price = +last._a.toFixed(2);
      // hausse : dernier montant > ancien tarif (+2 %) ; l'ancien tarif = dernier montant différent avant la hausse
      const prevT = occ.slice(0, -1).reverse().find(t => Math.abs(t._a - price) > price * 0.02);
      const prev = prevT && price > prevT._a * 1.02 ? +prevT._a.toFixed(2) : undefined;
      const cat = CATS.find(c => c[0].test(n)) || [null, 'Prélèvement', '#3A4458'];
      const words = title(n).split(' ');
      const hist = months.map(m => +occ.filter(t => t._d.getFullYear() === m.getFullYear() && t._d.getMonth() === m.getMonth()).reduce((a, t) => a + t._a, 0).toFixed(2));
      const first = occ[0]._d;
      out.push({
        id: 'pw-' + n.toLowerCase().replace(/[^a-z]+/g, '-'), name: title(n), cat: cat[1], color: cat[2],
        ini: (words[0][0] + (words[1] ? words[1][0] : (words[0][1] || ''))).toUpperCase(),
        price, prev, day: last._d.getDate(), since: MOIS[first.getMonth()] + ' ' + first.getFullYear(),
        hist, small: price < 10, live: true, count: occ.length, confirmed: monthly,
        lastDate: last.rdate || last.date, label: last.original_wording || last.wording,
        note: monthly ? null : 'Probable · 1 seul prélèvement vu',
        cancel: { online: false, where: 'Voir l’espace client du fournisseur', notice: 'Conditions à vérifier (données de test)' }
      });
    });
    out.sort((a, b) => (b.confirmed - a.confirmed) || (b.price - a.price));
    // chiffres du mois pour le tableau de bord (30 derniers jours, comptes en euros)
    const recent = txs.filter(t => !t.deleted && eurAcc.has(t.id_account) && days(dOf(t), today) <= 30 && days(dOf(t), today) >= 0);
    const credits = recent.filter(t => t.value > 0 && t.type !== 'summary_card');
    const income = credits.reduce((a, t) => a + t.value, 0);
    const subNames = new Set(out.map(s => norm(s.label)));
    const SPEND_TYPES = ['card', 'deferred_card', 'withdrawal', 'check', 'order', 'unknown', 'bank'];
    const spent = recent.filter(t => t.value < 0 && SPEND_TYPES.includes(t.type) && !t.coming && !subNames.has(norm(t.simplified_wording || t.wording || t.original_wording)))
      .reduce((a, t) => a - t.value, 0);
    const big = credits.slice().sort((a, b) => b.value - a.value)[0];
    const payIn = big ? Math.max(1, 30 - days(dOf(big), today)) : 30;
    return { subs: out, months: months.map(m => MOIS[m.getMonth()]), income: +income.toFixed(2), spent: +spent.toFixed(2), payIn,
      loans: txs.filter(t => t.type === 'loan_repayment' && eurAcc.has(t.id_account)).length };
  }

  async function fetchAll(){
    const acc = await api('/users/me/accounts');
    const accounts = (acc && acc.accounts) || [];
    if (!accounts.length) throw new PwError('Aucun compte sélectionné dans la banque de test', 400, 'noAccount');
    let txs = [];
    // la synchro Powens peut prendre quelques secondes après la redirection
    // on attend que le nombre d'opérations se stabilise (2 lectures identiques), 30 s max
    let prevN = -1;
    for (let i = 0; i < 12; i++){
      const r = await api('/users/me/transactions?limit=1000');
      txs = (r && r.transactions) || [];
      if (txs.length && txs.length === prevN) break;
      prevN = txs.length;
      await new Promise(ok => setTimeout(ok, 2500));
    }
    let bank = 'Banque de test';
    try { const c = await api('/users/me/connections?expand=connector'); const k = c.connections && c.connections[0]; if (k && k.connector) bank = k.connector.name; } catch(e){}
    const det = detect(accounts, txs);
    const result = Object.assign(det, {
      bank, at: Date.now(), txCount: txs.length,
      accounts: accounts.map(a => ({ name: a.name, type: a.type, balance: a.balance, currency: (a.currency && a.currency.id) || a.currency }))
    });
    ss.set(K_RESULT, result);
    return result;
  }

  function clear(){ ss.del(K_TOKEN); ss.del(K_RESULT); }

  window.PW = { start, fetchAll, detect, norm, clear, tokenInfo, isReturn, returnError,
    result: () => ss.get(K_RESULT), config: PW_CFG, PwError,
    testCreds: [
      { bank: 'Demo Institution', fields: 'Cherche « demo » · Usecase : bank · Mot de passe : n’importe lequel (ex. 1234) · puis « Tout sélectionner » et « Connecter »' }
    ] };
})();
