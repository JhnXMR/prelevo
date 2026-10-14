/* Prelevo – connexion Powens côté navigateur.
   Sandbox (défaut) : utilisateur temporaire, 30 min, jeton en sessionStorage, aucun secret.
   Production : ce module ne crée pas d'utilisateur. La webview vient de l'API (jeton permanent chiffré côté serveur).
   Domaine, client_id et redirect_uri viennent de config.js (valeurs publiques). */
'use strict';
(function(){
  const Flow = window.PowensFlow;
  const PW_CFG = Flow ? Flow.resolvePublicConfig(window.APP_CONFIG, window.POWENS_CONFIG) : { env: 'sandbox', domain: '', clientId: '', redirectUri: '', webviewBase: '', ready: false };
  const API = PW_CFG.domain ? `https://${PW_CFG.domain}/2.0` : '';
  const K_TOKEN = 'prelevo-pw-token', K_RESULT = 'prelevo-pw-result', K_STATE = 'prelevo-pw-state';

  const ss = {
    get(k){ try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch(e){ return null; } },
    set(k, v){ sessionStorage.setItem(k, JSON.stringify(v)); },
    del(k){ sessionStorage.removeItem(k); }
  };
  // Le redirect_uri doit être déclaré dans la console Powens.
  const redirectUri = () => Flow ? Flow.redirectFor(PW_CFG, location) : PW_CFG.redirectUri;

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

  // Sandbox seulement : 1) jeton temporaire (sans secret) -> 2) code à usage unique -> 3) webview Powens
  async function start(){
    if (PW_CFG.env === 'production') throw new PwError('La connexion à votre banque passe par nos serveurs.', 0, 'serverOnly');
    if (!PW_CFG.ready || !Flow) throw new PwError('La connexion à la banque de test n’est pas configurée.', 0, 'config');
    const init = await api('/auth/init', { method: 'POST', token: null });
    if (!init || !init.auth_token) throw new PwError('Jeton Powens non reçu');
    if (init.type === 'permanent') throw new PwError('Réponse Powens inattendue.', 0, 'permanent');
    ss.set(K_TOKEN, { token: init.auth_token, exp: Date.now() + (init.expires_in || 1800) * 1000 });
    ss.del(K_RESULT);
    const code = await api('/auth/token/code?type=singleAccess', { token: init.auth_token });
    const state = Flow.randomState();
    ss.set(K_STATE, state);
    location.assign(Flow.buildWebviewUrl({
      webviewBase: PW_CFG.webviewBase, domain: PW_CFG.domain, clientId: PW_CFG.clientId,
      redirectUri: redirectUri(), code: code.code, state: state, flow: 'connect'
    }));
  }

  const tokenInfo = () => { const t = ss.get(K_TOKEN); if (!t) return null; return Object.assign({}, t, { expired: Date.now() >= t.exp }); };
  const outcome = () => Flow ? Flow.callbackOutcome(location.search, ss.get(K_STATE), 'connect') : null;
  const isReturn = () => { const o = outcome(); return !!(o && (o.ok || o.cancelled || o.error || o.reason)); };
  const returnError = () => { const o = outcome(); if (!o || o.ok) return null; return o; };

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

  // cadences reconnues : écart médian entre deux prélèvements (jours) -> facteur pour un équivalent mensuel
  const CADENCES = [
    { id:'week',    label:'chaque semaine',   min:5,   max:9,   perMonth:52/12, minOcc:3 },
    { id:'month',   label:'chaque mois',      min:25,  max:35,  perMonth:1,     minOcc:2 },
    { id:'quarter', label:'chaque trimestre', min:84,  max:98,  perMonth:1/3,   minOcc:2 },
    { id:'year',    label:'chaque année',     min:340, max:390, perMonth:1/12,  minOcc:2 }
  ];
  const YEAR_KW = /\b(ANNUEL|ANNUELLE|AN|ANNEE|COTISATION)\b/;
  const DUP_CATS = ['Musique', 'Streaming vidéo', 'Appli / cloud'];
  const median = a => { const b = a.slice().sort((x, y) => x - y); const m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };
  // un écart est « régulier » s'il colle à la cadence, ou à 2-3 fois la cadence (un mois sauté)
  const fits = (g, c) => [1, 2, 3].some(k => g >= c.min * k && g <= c.max * k);
  const round2 = x => Math.round(x * 100) / 100;

  function detect(accounts, txs, today = new Date()){
    const eurAcc = new Set(accounts.filter(a => !a.currency || (a.currency.id || a.currency) === 'EUR').map(a => a.id));
    const seen = new Set();
    const label = t => (t.counterparty && t.counterparty.label) || t.simplified_wording || t.wording || t.original_wording;
    const all = txs.filter(t => !t.deleted && t.value < 0 && eurAcc.has(t.id_account) && !EXCLUDE_TYPES.includes(t.type))
      .map(t => Object.assign({}, t, { _n: norm(label(t)), _d: dOf(t), _a: -t.value }))
      .filter(t => t._n && !EXCLUDE_KW.test(t._n))
      .filter(t => { const k = t._n + '|' + t._a + '|' + (t.rdate || t.date); if (seen.has(k)) return false; seen.add(k); return true; });
    // les opérations « à venir » (coming) servent de prochaine échéance, pas d'historique
    const debits = all.filter(t => !t.coming && t._d <= today);
    const upcoming = all.filter(t => t.coming || t._d > today);
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
          if (days(chain[chain.length - 1]._d, t._d) >= 3 && (Math.abs(t._a - p) <= p * 0.10 + 0.01 || (t._a > p && t._a <= p * 1.35))) chain.push(t); });
        if (chain.length > best.length) best = chain;
      });
      const occ = best;
      const gaps = occ.slice(1).map((t, k) => days(occ[k]._d, t._d));
      let cad = null;
      if (gaps.length){
        const m = median(gaps);
        cad = CADENCES.find(c => m >= c.min && m <= c.max && occ.length >= c.minOcc && gaps.every(g => fits(g, c))) || null;
      }
      const kw = SUB_KW.test(n);
      if (!cad && !kw) return;                         // ni régulier, ni mot-clé d'abonnement : on ignore
      const confirmed = !!cad;
      const c = cad || (YEAR_KW.test(n) ? CADENCES[3] : CADENCES[1]);   // « probable » : mensuel par défaut
      const last = occ[occ.length - 1];
      const amount = round2(last._a);
      // hausse : dernier montant > ancien tarif (+2 %) ; l'ancien tarif = dernier montant différent avant la hausse
      // montants qui bougent tout le temps (énergie, panier…) = montant variable, pas une « hausse »
      const near = (x, y) => Math.abs(x - y) <= y * 0.01 + 0.01;
      const k0 = occ.slice(0, -1).map(t => Math.abs(t._a - amount) > amount * 0.02).lastIndexOf(true);
      const prevT = k0 >= 0 ? occ[k0] : null;
      let run = 0; if (prevT) for (let k = k0; k >= 0 && near(occ[k]._a, prevT._a); k--) run++;
      const after = occ.slice(k0 + 1);
      const changes = occ.slice(1).filter((t, k) => !near(t._a, occ[k]._a)).length;   // nb de changements de montant
      const stable = prevT && changes <= 2 && (occ.length === 2 || (run >= 2 && after.every(t => near(t._a, amount))));
      const prevAmount = stable && amount > prevT._a * 1.02 ? round2(prevT._a) : undefined;
      const variable = occ.length >= 3 && changes > 2;
      const price = round2(amount * c.perMonth);      // l'app raisonne en €/mois
      const prev = prevAmount !== undefined ? round2(prevAmount * c.perMonth) : undefined;
      const cat = CATS.find(x => x[0].test(n)) || [null, 'Prélèvement', '#3A4458'];
      const words = title(n).split(' ');
      const hist = months.map(m => round2(occ.filter(t => t._d.getFullYear() === m.getFullYear() && t._d.getMonth() === m.getMonth()).reduce((a, t) => a + t._a, 0)));
      const first = occ[0]._d;
      const nextT = upcoming.filter(t => t._n === n).sort((a, b) => a._d - b._d)[0];
      out.push({
        id: 'pw-' + n.toLowerCase().replace(/[^a-z]+/g, '-'), name: title(n), cat: cat[1], color: cat[2],
        ini: (words[0][0] + (words[1] ? words[1][0] : (words[0][1] || ''))).toUpperCase(),
        price, prev, amount, prevAmount, cadence: c.id, cadenceLabel: c.label,
        day: last._d.getDate(), since: MOIS[first.getMonth()] + ' ' + first.getFullYear(),
        hist, small: price < 10, variable, live: true, count: occ.length, confirmed,
        lastDate: last.rdate || last.date, nextDate: nextT ? (nextT.rdate || nextT.date) : null, label: last.original_wording || last.wording,
        note: confirmed ? null : 'Probable · 1 seul prélèvement vu',
        cancel: { online: false, where: 'Voir l’espace client du fournisseur', notice: 'Conditions à vérifier (données de test)' }
      });
    });
    // doublons : deux services de la même famille (2 musiques, 2 streamings…) -> le moins cher est signalé
    DUP_CATS.forEach(cn => {
      const same = out.filter(s => s.cat === cn).sort((a, b) => b.price - a.price);
      if (same.length > 1) same.slice(1).forEach(s => { s.duplicate = same[0].id; s.dupOf = same[0].name; });
    });
    out.sort((a, b) => (b.confirmed - a.confirmed) || (b.price - a.price));
    const sum = f => round2(out.reduce((a, s) => a + f(s), 0));
    const savings = {
      increases: sum(s => s.prev ? s.price - s.prev : 0),
      small: sum(s => s.small ? s.price : 0),
      duplicates: sum(s => s.duplicate ? s.price : 0)
    };
    savings.total = round2(savings.increases + savings.small + savings.duplicates);
    // historique disponible : sous ~2 mois, la détection reste partielle (on le dit à l'utilisateur)
    const hd = debits.map(t => t._d).sort((a, b) => a - b);
    const histDays = hd.length ? days(hd[0], hd[hd.length - 1]) : 0;
    const history = { days: histDays, debits: debits.length, total: txs.length, limited: histDays < 60 || debits.length < 20 };
    // chiffres du mois pour le tableau de bord (30 derniers jours, comptes en euros)
    const recent = txs.filter(t => !t.deleted && !t.coming && eurAcc.has(t.id_account) && days(dOf(t), today) <= 30 && days(dOf(t), today) >= 0);
    const credits = recent.filter(t => t.value > 0 && t.type !== 'summary_card');
    const income = credits.reduce((a, t) => a + t.value, 0);
    const subNames = new Set(out.map(s => norm(s.label)));
    const SPEND_TYPES = ['card', 'deferred_card', 'withdrawal', 'check', 'order', 'unknown', 'bank'];
    const spent = recent.filter(t => t.value < 0 && SPEND_TYPES.includes(t.type) && !subNames.has(norm(t.simplified_wording || t.wording || t.original_wording)))
      .reduce((a, t) => a - t.value, 0);
    const big = credits.slice().sort((a, b) => b.value - a.value)[0];
    const payIn = big ? Math.max(1, 30 - days(dOf(big), today)) : 30;
    return { subs: out, months: months.map(m => MOIS[m.getMonth()]), income: round2(income), spent: round2(spent), payIn,
      monthly: sum(s => s.price), savings, history,
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
    let bankLogo = null, bankColor = null;   // logo officiel servi par le CDN de Powens (celui de sa Webview), couleur de marque fournie par l'API
    try { const c = await api('/users/me/connections?expand=connector'); const k = c.connections && c.connections[0];
      if (k && k.connector){ bank = k.connector.name;
        if (/^[0-9a-f-]{36}$/i.test(k.connector.uuid || '')) bankLogo = 'https://assets.powens.com/logos/' + k.connector.uuid.toLowerCase() + '-thumbnail@2x.webp';
        if (/^[0-9a-f]{6}$/i.test(k.connector.color || '')) bankColor = '#' + k.connector.color.toUpperCase(); } } catch(e){}
    const det = detect(accounts, txs);
    const result = Object.assign(det, {
      bank, bankLogo, bankColor, at: Date.now(), txCount: txs.length,
      // opérations des 35 derniers jours (+ à venir) pour l'accueil
      recent: txs.filter(t => !t.deleted && new Date(t.date) >= new Date(Date.now() - 35 * 864e5)).slice(0, 400)
        .map(t => ({ id: t.id, account: t.id_account, date: t.date, value: t.value, wording: t.simplified_wording || t.wording || t.original_wording, type: t.type, coming: !!t.coming })),
      accounts: accounts.map(a => ({ id: a.id, name: a.name, type: a.type, balance: a.balance, currency: (a.currency && a.currency.id) || a.currency }))
    });
    ss.set(K_RESULT, result);
    return result;
  }

  function clear(){ ss.del(K_TOKEN); ss.del(K_RESULT); ss.del(K_STATE); }

  window.PW = { start, fetchAll, detect, norm, clear, tokenInfo, isReturn, returnError, outcome,
    result: () => ss.get(K_RESULT), config: PW_CFG, PwError,
    testCreds: PW_CFG.env === 'production' ? [] : [
      { bank: 'Demo Institution', fields: 'Cherchez « demo » · Usecase : bank · Mot de passe : n’importe lequel (ex. 1234) · puis « Tout sélectionner » et « Connecter »' }
    ] };
})();
