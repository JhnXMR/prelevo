/* Prelevo – maquette cliquable. TOUTES LES DONNÉES SONT DES EXEMPLES FICTIFS. */
'use strict';
const CFG = window.APP_CONFIG || { name:'Prelevo', tagline:'l’app qui traque vos abonnements', priceMonth:3.99, priceYear:29.99, trial:'1 mois offert pour essayer', supportEmail:'support@exemple.fr' };
const APP_NAME = CFG.name;
document.title = `${APP_NAME} – ${CFG.tagline}`;

const USER = { prenom: 'Camille', nom: 'Exemple', adresse: '12 rue de l’Exemple\n75011 Paris' };
let INCOME = 2200;          // salaire net (exemple), autour de 2 200 €
let RENT = 720;             // loyer (exemple)
let SPENT = 577.47;         // courses, essence, restos déjà passés depuis la paie (exemple)
let PAYDAY_IN = 12;         // jours avant la prochaine paie
let PAST_SAVED = 6.99;      // un abonnement déjà résilié le mois dernier (exemple)

const SUBS = [
  { id:'flixo', name:'Flixo', cat:'Streaming vidéo', color:'#E50914', ini:'F', price:13.49, prev:10.99, day:12, since:'mars 2021', hist:[10.99,10.99,10.99,10.99,13.49,13.49],
    cancel:{ online:true, where:'Compte › Abonnement › Résilier', notice:'Sans préavis, prend effet à la fin du mois payé' } },
  { id:'fibrebox', name:'FibreBox Internet', cat:'Box internet', color:'#F16E00', ini:'FB', price:39.99, prev:34.99, day:5, since:'janv. 2020', hist:[34.99,34.99,34.99,34.99,39.99,39.99],
    cancel:{ online:false, where:'Lettre recommandée ou espace client', notice:'Préavis de 10 jours' }, tip:'Des offres fibre comparables existent souvent moins cher : à comparer avant de résilier.' },
  { id:'sonora', name:'Sonora Musique', cat:'Musique', color:'#1DB954', ini:'S', price:11.99, day:18, since:'juin 2019', hist:[10.99,10.99,11.99,11.99,11.99,11.99], prev:10.99,
    cancel:{ online:true, where:'Paramètres › Gérer l’abonnement', notice:'Sans préavis' } },
  { id:'wavely', name:'Wavely Musique', cat:'Musique', color:'#7B3FE4', ini:'W', price:10.99, day:22, since:'févr. 2024', hist:[10.99,10.99,10.99,10.99,10.99,10.99], duplicate:'sonora',
    cancel:{ online:true, where:'Mon compte › Résilier', notice:'Sans préavis' } },
  { id:'fitclub', name:'FitClub Salle de sport', cat:'Sport', color:'#2F5BEA', ini:'FC', price:29.90, day:1, since:'sept. 2023', hist:[29.90,29.90,29.90,29.90,29.90,29.90],
    cancel:{ online:false, where:'Lettre recommandée', notice:'Engagement 12 mois terminé, préavis 1 mois' } },
  { id:'mobi', name:'Mobi Forfait 100 Go', cat:'Téléphonie', color:'#0AA5A5', ini:'M', price:15.99, day:8, since:'avr. 2022', hist:[12.99,12.99,15.99,15.99,15.99,15.99], prev:12.99,
    doubleCharge:'8 oct.', cancel:{ online:true, where:'Portabilité avec le code RIO (3179)', notice:'Sans préavis' } },
  { id:'navigo', name:'Passe Navigo', cat:'Transport', txCat:'transport', color:'#5C2D91', ini:'NV', price:86.40, day:2, since:'sept. 2019', hist:[86.40,86.40,86.40,86.40,86.40,86.40],
    cancel:{ online:true, where:'Espace personnel › Mon passe › Résilier', notice:'Fin à l’échéance du mois en cours' } },
  { id:'lumiere', name:'Lumière Électricité', cat:'Énergie', txCat:'energie', color:'#C47B12', ini:'L', price:79, day:6, since:'mars 2018', hist:[79,79,79,79,79,79],
    cancel:{ online:true, where:'Espace client › Contrat › Résilier', notice:'Selon le contrat, souvent sous un mois' } },
  { id:'shopprime', name:'ShopPrime', cat:'Livraison', color:'#232F3E', ini:'SP', price:6.99, day:27, since:'nov. 2022', hist:[6.99,6.99,6.99,6.99,6.99,6.99],
    cancel:{ online:true, where:'Compte › Gérer mon abonnement', notice:'Sans préavis' } },
  { id:'assurhab', name:'AssurHabitat', cat:'Assurance', color:'#5B6B8C', ini:'AH', price:18.40, day:10, since:'janv. 2021', hist:[17.20,17.20,17.20,18.40,18.40,18.40], prev:17.20,
    cancel:{ online:false, where:'Lettre (loi Hamon, après 1 an de contrat)', notice:'Effet 1 mois après réception' } },
  // Petits prélèvements oubliés
  { id:'photoedit', name:'PhotoEdit Pro', cat:'Appli photo', color:'#FF2D7A', ini:'PE', price:4.99, day:2, since:'sept. 2026', small:true, trial:true, hist:[0,0,0,0,0,4.99],
    note:'Essai gratuit devenu payant le 2 sept.', cancel:{ online:true, where:'Réglages du téléphone › Abonnements', notice:'Sans préavis' } },
  { id:'cloud', name:'Cloud+ 200 Go', cat:'Stockage', color:'#3B82F6', ini:'C+', price:2.99, day:14, since:'mai 2023', small:true, hist:[2.99,2.99,2.99,2.99,2.99,2.99],
    note:'Seulement 18 Go utilisés', cancel:{ online:true, where:'Réglages › Stockage › Changer d’offre', notice:'Sans préavis' } },
  { id:'meteo', name:'MétéoPlus', cat:'Appli météo', color:'#0EA5E9', ini:'MP', price:1.99, day:20, since:'juil. 2022', small:true, hist:[1.99,1.99,1.99,1.99,1.99,1.99],
    note:'Version gratuite disponible', cancel:{ online:true, where:'Réglages du téléphone › Abonnements', notice:'Sans préavis' } },
  { id:'quiz', name:'QuizMania VIP', cat:'Jeu mobile', color:'#F59E0B', ini:'Q', price:3.49, day:25, since:'déc. 2024', small:true, hist:[3.49,3.49,3.49,3.49,3.49,3.49],
    note:'Prélevé depuis 22 mois', cancel:{ online:true, where:'Réglages du téléphone › Abonnements', notice:'Sans préavis' } },
];
const MONTHS = ['mai','juin','juil.','août','sept.','oct.'];

// Banques réelles, en monogramme couleur de marque (couleurs approximatives) : aucun fichier de logo officiel dans la démo publique.
// En mode réel (API), le logo officiel vient de l'agrégateur (Powens) ; le monogramme sert de secours.
const BANKS = [
  { id:'b1',  name:'Crédit Agricole',     color:'#00877F', ini:'CA' },
  { id:'b7',  name:'Société Générale',    color:'#E60028', ini:'SG' },
  { id:'b8',  name:'Caisse d’Épargne',    color:'#D0021B', ini:'CE' },
  { id:'b9',  name:'BNP Paribas',         color:'#00915A', ini:'BNP' },
  { id:'b10', name:'LCL',                 color:'#0A3D91', ini:'LCL' },
  { id:'b11', name:'La Banque Postale',   color:'#FFCC00', ini:'LBP', fg:'#0A2A6B' },
  { id:'b12', name:'Banque Populaire',    color:'#0055A4', ini:'BP' },
  { id:'b13', name:'Crédit Mutuel',       color:'#0B3F8C', ini:'CM' },
  { id:'b14', name:'CIC',                 color:'#0096D6', ini:'CIC' },
  { id:'b2',  name:'BoursoBank',          color:'#D3006E', ini:'BB' },
  { id:'b15', name:'Fortuneo',            color:'#84BD00', ini:'F' },
  { id:'b16', name:'Hello bank!',         color:'#00A3E0', ini:'hb' },
  { id:'b3',  name:'Revolut',             color:'#191C1F', ini:'R' },
  { id:'b17', name:'N26',                 color:'#36A18B', ini:'N26' },
  { id:'b6',  name:'Autre banque',        color:'#8A94A8', ini:'+' },
];

// Comptes connectés (exemple) : statut de synchro + expiration de l'accès (renouvellement DSP2 tous les 180 jours)
const LINKED = [
  { id:'b1', name:'Crédit Agricole', color:'#00877F', ini:'CA', accounts:'Compte courant · Livret A', status:'ok', sync:'il y a 12 min', expiresIn:6, expires:'15 oct.' },
  { id:'b2', name:'BoursoBank', color:'#D3006E', ini:'BB', accounts:'Compte joint', status:'ok', sync:'il y a 3 h', expiresIn:142, expires:'28 févr.' },
  { id:'b3', name:'Revolut', color:'#191C1F', ini:'R', accounts:'Carte en ligne', status:'error', sync:'échec depuis hier 18:40', expiresIn:63, expires:'11 déc.' },
];

// ---------- état (Store unique) ----------
const KEY = 'prelevo-demo';
const Store = window.PrelevoStore;
const _saved = Store.readJSON(KEY, {});
const state = Object.assign({ connected:false, bank:null, resiliated:[], premium:false, readAlerts:[], hideBalance:false }, (_saved && typeof _saved === 'object' && !Array.isArray(_saved)) ? _saved : {});
function persist() { Store.writeJSON(KEY, state); }
function save() { persist(); if (save.pub) publishSubs(); }
// URL ?demo=1 => démarre directement connecté (pratique pour les captures)
const QS = new URLSearchParams(location.search);
if (QS.has('demo')) { state.connected = true; state.bank = state.bank || 'b1'; save(); }
if (QS.get('plan') === 'premium') { state.premium = true; save(); }
if (QS.get('plan') === 'free') { state.premium = false; save(); }
const isP = () => state.premium;
const linked = () => LIVE ? [liveBank()] : isP() ? LINKED : LINKED.slice(0,1);

// ---------- Banque de TEST Powens (sandbox) : vraies données de test, analysées dans le navigateur ----------
// Avec une API Prelevo configurée (config.js > apiBase), la banque passe par le serveur : le flux « 100 % navigateur » est désactivé.
const API = window.PAPI || null;
const PWX = API ? null : (window.PW || null);
const bankEb = () => ((window.APP_CONFIG || {}).bankProvider || '') === 'enablebanking';
let ME = null;               // réponse de GET /me
if (PWX && QS.has('demo')) PWX.clear();            // ?demo=1 = toujours les données d'exemple
let LIVE = null;
function applyLive(r){
  LIVE = r;
  SUBS.splice(0, SUBS.length, ...r.subs);
  MONTHS.splice(0, MONTHS.length, ...r.months);
  INCOME = r.income; RENT = 0; SPENT = r.spent; PAYDAY_IN = r.payIn; PAST_SAVED = 0;
  Object.assign(USER, { prenom:'', nom:'[Prénom Nom]', adresse:'[Votre adresse]' });
  state.resiliated = state.resiliated.filter(id => SUBS.some(s => s.id === id));
  demoTag = '<span class="demo live">Banque de test Powens</span>';
  _ledger = null;
  _subsSig = '';
  if (save.pub) publishSubs();
}
function liveBank(){
  if (API){ const n = LIVE.accounts.length;
    return { id:'pw', name:LIVE.bank, color:LIVE.bankColor || '#0066FF', logo:LIVE.bankLogo || null, ini:'', live:true, accounts:`${n} compte${n>1?'s':''} · ${LIVE.txCount} opérations`,
      status:'ok', sync: LIVE.at ? 'il y a ' + ago(LIVE.at) : '—', expiresIn: 999, expires:'180 jours (règle DSP2)', mins: 0 }; }
  const tk = PWX && PWX.tokenInfo(); const expired = !tk || tk.expired;
  const mins = tk ? Math.max(0, Math.round((tk.exp - Date.now())/60000)) : 0;
  const n = LIVE.accounts.length;
  return { id:'pw', name:LIVE.bank, color:LIVE.bankColor || '#0066FF', logo:LIVE.bankLogo || null, ini:'', live:true,
    accounts:`${n} compte${n>1?'s':''} de test · ${LIVE.txCount} opérations`,
    status: expired ? 'expired' : 'ok', sync: 'il y a ' + Math.max(0, Math.round((Date.now()-LIVE.at)/60000)) + ' min',
    expiresIn: 999, expires: expired ? 'expirée' : `encore ${mins} min`, mins };
}
const ago = t => { const m = Math.max(0, Math.round((Date.now()-t)/60000)); return m < 60 ? m + ' min' : m < 1440 ? Math.round(m/60) + ' h' : Math.round(m/1440) + ' j'; };
const esc = v => String(v == null ? '' : v).replace(/[&<>"'⟦⟧]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','⟦':'&#10214;','⟧':'&#10215;'}[c]));
function applyServer(me){
  ME = me;
  if (me.billing){ state.premium = me.billing.plan === 'premium'; save(); }
  if (!me.bankConnected || !me.stats) return;
  const st = me.stats || {};
  applyLive({ subs: me.subscriptions, months: st.months && st.months.length ? st.months : MONTHS.slice(), income: st.income || 0, spent: st.spent || 0,
    payIn: st.payIn || 30, accounts: me.accounts || [], recent: me.transactions || [], txCount: me.txCount || 0, bank: (me.bank && me.bank.name) || st.bank || 'Ma banque',
    bankLogo: (me.bank && me.bank.logo) || st.bankLogo || null, bankColor: (me.bank && me.bank.color) || st.bankColor || null,
    at: me.lastSyncAt ? Date.parse(me.lastSyncAt) : null, history: { days: st.days, debits: st.debits, total: st.total, limited: st.limited }, savings: st.savings });
  state.connected = true; save();
  demoTag = bankEb()
    ? '<span class="demo live">Lecture seule</span>'
    : '<span class="demo live">Banque de test</span>';
}
function humanError(e, fallback){
  const msg = String((e && e.message) || '');
  const status = e && e.status;
  if (status === 401) return 'Votre session a expiré. Reconnectez-vous.';
  if (status === 403) return 'Cette action n’est pas autorisée.';
  if (status === 404) return 'Nous n’avons pas trouvé cet élément.';
  if (status === 429) return 'Trop de tentatives. Patientez un instant, puis réessayez.';
  if (status >= 500) return 'Le service est momentanément indisponible. Réessayez dans un instant.';
  if (/failed to fetch|networkerror|network request|load failed|injoignable/i.test(msg)) return 'Serveur injoignable. Vérifiez votre connexion, puis réessayez.';
  if (/timeout|timed out/i.test(msg)) return 'Le service met trop de temps à répondre. Réessayez.';
  if (msg && /[àâäéèêëïîôùûüç]/i.test(msg) && msg.length < 180 && !/https?:|token|stack|exception/i.test(msg)) return msg;
  return fallback || 'Une erreur est survenue. Réessayez dans un instant.';
}
function apiFail(e){
  if (e && e.status === 401){ ME = null; LIVE = null; toast('Votre session a expiré. Reconnectez-vous.'); location.hash = '#/connexion'; return; }
  toast(humanError(e));
}
async function apiLoadMe(){ try { applyServer(await API.me()); } catch(e){ apiFail(e); } }
const sandboxNote = () => window.PW && API && !bankEb() ? `<div class="pw-note"><b>Banque de test (sandbox Powens)</b>
  ${window.PW.testCreds.map(c=>`<div><span>${c.bank}</span>${c.fields}</div>`).join('')}
  <p>Pendant la bêta privée, seules les fausses banques de test sont proposées.</p></div>` : '';
const notBank = (extra='') => `<p class="notbank ${extra}">⟦shield⟧<span><b>${APP_NAME} n’est pas une banque.</b> C’est une télécommande élégante pour celles que vous avez déjà : on s’y branche en lecture seule, via un agrégateur agréé par l’ACPR.</span></p>`;
const pwNote = () => `<div class="pw-note"><b>Identifiants de test Powens</b>
  ${(PWX ? PWX.testCreds : []).map(c=>`<div><span>${c.bank}</span>${c.fields}</div>`).join('')}
  <p>Fausses banques, faux comptes : aucune vraie donnée. Session de test valable 30 min, gardée seulement dans cet onglet.</p></div>`;
function pwConnect(){
  if (!PWX) return toast('Module Powens indisponible');
  toast('Ouverture de la banque de test Powens…');
  PWX.start().catch(err => toast(humanError(err, 'La banque de test est injoignable. Réessayez.')));
}


const SVG = d => `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICONS = {
  refresh:'<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 4v5h-5"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  trend:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  alert:'<path d="M12 3.5l9 16H3z"/><path d="M12 10v4"/><path d="M12 17v.01"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  coin:'<circle cx="12" cy="12" r="9"/><path d="M15 9.2a3.3 3.3 0 1 0 0 5.6"/><path d="M8 11h5M8 13h5"/>',
  ban:'<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  scissors:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.1 8.1L20 20M8.1 15.9L20 4"/>',
  gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8c-2 0-4.5-1-4.5-2.5S9.5 3 12 8zm0 0c2 0 4.5-1 4.5-2.5S14.5 3 12 8z"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8v.01"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  auto:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/>',
  settings:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  download:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  spark:'<path d="M12 3.5l1.9 5.2a2 2 0 0 0 1.2 1.2l5.2 1.9-5.2 1.9a2 2 0 0 0-1.2 1.2L12 20.1l-1.9-5.2a2 2 0 0 0-1.2-1.2L3.7 11.8l5.2-1.9a2 2 0 0 0 1.2-1.2z"/>',
  chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  bank:'<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  send:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  heart:'<path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z"/>',
  star:'<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  back:'<path d="M15 5l-7 7 7 7"/>',
  chev:'<path d="M9 6l6 6-6 6"/>',
  eye:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.6 2.6 0 1 1 3.6 2.4c-.8.4-1.2 1-1.2 1.8"/><path d="M12 17v.01"/>',
  close:'<path d="M6 6l12 12M18 6L6 18"/>',
  receipt:'<path d="M7 3.5h10a1 1 0 0 1 1 1V21l-3-1.8-3 1.8-3-1.8L6 21V4.5a1 1 0 0 1 1-1z"/><path d="M9.5 8.5h5M9.5 12h5"/>',
  bot:'<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 8V5M10 4h4"/><path d="M9.5 13v.01M14.5 13v.01"/><path d="M9.5 16.2c1.4.8 3.6.8 5 0"/>',
  pie:'<path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5H12z"/><path d="M15 3.8A8.5 8.5 0 0 1 20.2 9H15z"/>',
  doc:'<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20z"/><path d="M14 3.5v4h4"/><path d="M9.5 12h5M9.5 15.5h5"/>',
  userplus:'<circle cx="10" cy="8" r="4"/><path d="M2.8 20.5a7.2 7.2 0 0 1 12.6-4.6"/><path d="M19 14v6M16 17h6"/>',
  usercircle:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.2 18.2a6.4 6.4 0 0 1 11.6 0"/>',
  card:'<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h3"/>',
  ext:'<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
  logout:'<path d="M9 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h3"/><path d="M16 8l4 4-4 4M20 12H9"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 12.5a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9L18 7"/><path d="M9 7V4.5h6V7"/>',
  eyeoff:'<path d="M3 3l18 18"/><path d="M10.6 6.2A10 10 0 0 1 12 6c6.5 0 10 6 10 6a18 18 0 0 1-3.2 3.8"/><path d="M6.1 6.7C3.6 8.4 2 12 2 12s3.5 6 10 6c1.5 0 2.8-.3 4-.8"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
};
const icons = html => html.replace(/⟦(\w+)⟧/g, (_, n) => ICONS[n] ? SVG(ICONS[n]) : '').replace(/<a class="back"(?![^>]*aria-label)/g, '<a class="back" aria-label="Retour"');
const emptyState = (ic, title, text, cls = '') => `<div class="empty ${cls}" role="status"><span class="empty-ic">⟦${ic}⟧</span><b>${title}</b><p>${text}</p></div>`;
const skel = () => `<div class="sk" aria-hidden="true"><i class="lg"></i><i></i><i></i><i class="short"></i></div>`;

// ---------- utilitaires ----------
function toCents(n) {
  const x = Number(n);
  return Number.isFinite(x) ? Math.round(x * 100) : 0;
}
function fromCents(c) { return c / 100; }
function sumEuros(list, pick) {
  let c = 0;
  for (const item of list) c += toCents(pick(item));
  return fromCents(c);
}
function annual(n) { return fromCents(toCents(n) * 12); }
const eur = n => fromCents(toCents(n)).toLocaleString('fr-FR', { minimumFractionDigits:2, maximumFractionDigits:2 }) + ' €';
const prix = n => n.toLocaleString('fr-FR', { minimumFractionDigits:2, maximumFractionDigits:2 }) + ' €';
// Économie de l'annuel face à 12 mois, en centimes (évite les flottants 3,99 × 12).
function yearSave(monthEuros, yearEuros){
  const month = Math.round(Number(monthEuros) * 100);
  const year = Math.round(Number(yearEuros) * 100);
  const full = month * 12;
  if (!(month > 0 && year > 0 && full > year)) return null;
  const save = full - year;
  return { save, pct: Math.round(save * 100 / full) };
}
const eur0 = n => Math.round(n).toLocaleString('fr-FR') + ' €';
const $ = s => document.querySelector(s);
const active = () => SUBS.filter(s => !state.resiliated.includes(s.id));
const byId = id => SUBS.find(s => s.id === id);
// Pages officielles de résiliation des services connus (reconnus par leur libellé bancaire).
const CANCEL_DB = [
  [/netflix/i, 'Netflix', 'https://www.netflix.com/cancelplan', 'Compte › Abonnement › Annuler l’abonnement', 'Sans préavis, fin à la date de renouvellement'],
  [/spotify/i, 'Spotify', 'https://www.spotify.com/fr/account/subscription/', 'Compte › Votre abonnement › Changer d’offre › Annuler Premium', 'Sans préavis, fin à la date de renouvellement'],
  [/disney/i, 'Disney+', 'https://www.disneyplus.com/account/subscription', 'Profil › Compte › Abonnement › Résilier', 'Sans préavis, fin à la date de renouvellement'],
  [/amazon|prime ?video|amzn/i, 'Amazon Prime', 'https://www.amazon.fr/gp/primecentral', 'Votre compte › Prime › Gérer › Mettre fin à l’abonnement', 'Sans préavis'],
  [/canal ?\+|canalplus|canal plus/i, 'Canal+', 'https://www.canalplus.com/espace-client/', 'Espace client › Mon abonnement › Résilier', 'Selon engagement, préavis jusqu’à 1 mois'],
  [/deezer/i, 'Deezer', 'https://www.deezer.com/account/subscription', 'Paramètres › Gérer mon abonnement › Résilier', 'Sans préavis'],
  [/youtube/i, 'YouTube Premium', 'https://www.youtube.com/paid_memberships', 'Abonnements souscrits › Désactiver', 'Sans préavis'],
  [/apple|itunes/i, 'Apple', 'https://support.apple.com/fr-fr/118428', 'Réglages › votre nom › Abonnements › Annuler', 'Sans préavis'],
  [/\bsfr\b|red by sfr/i, 'SFR', 'https://www.sfr.fr/mon-espace-client/', 'Espace client › Mon offre › Résilier (ou 1023)', 'Préavis 10 jours'],
  [/orange|sosh/i, 'Orange', 'https://espace-client.orange.fr/', 'Espace client › Contrats › Résilier (ou 3900)', 'Préavis 10 jours'],
  [/free ?mobile/i, 'Free Mobile', 'https://mobile.free.fr/account/', 'Espace abonné › Mon forfait › Résilier', 'Préavis 10 jours'],
  [/\bfree\b|freebox/i, 'Free', 'https://subscribe.free.fr/login/', 'Espace abonné › Ma Freebox › Résilier', 'Préavis 10 jours'],
  [/bouygues|b ?& ?you/i, 'Bouygues Telecom', 'https://www.bouyguestelecom.fr/mon-compte', 'Espace client › Mes offres › Résilier (ou 614)', 'Préavis 10 jours'],
  [/basic.?fit/i, 'Basic-Fit', 'https://www.basic-fit.com/fr-fr/faq', 'Espace membre › Résilier mon abonnement', 'Préavis 4 semaines selon contrat'],
  [/fitness park/i, 'Fitness Park', 'https://www.fitnesspark.fr/', 'Lettre ou e-mail au club', 'Selon contrat, souvent 1 mois'],
  [/keep ?cool/i, 'Keep Cool', 'https://www.keepcool.fr/', 'Lettre ou e-mail au club', 'Selon contrat, souvent 1 mois'],
  [/l.?orange bleue/i, 'L’Orange Bleue', 'https://www.lorangebleue.fr/', 'Lettre ou e-mail au club', 'Selon contrat, souvent 1 mois'],
];
const GYM = /sport|gym|fit|club|salle/i;
function cancelInfo(s){
  const k = CANCEL_DB.find(([re]) => re.test(s.name || ''));
  if (k) return { online:true, brand:k[1], url:k[2], where:k[3], notice:k[4], known:true };
  if (s.cancel) return s.cancel;
  return GYM.test((s.name || '') + ' ' + (s.cat || '')) ? { online:false, where:'Lettre recommandée au club (ou en ligne si souscrit en ligne)', notice:'Selon contrat, souvent 1 mois' }
    : { online:false, where:'Lettre recommandée ou espace client du service', notice:'Selon les conditions générales' };
}
const FREQ = { week:'hebdo', month:'mensuel', quarter:'trimestriel', year:'annuel' };
function nextDebit(s){
  if (s.live) return nextLive(s);
  const n = nowRef(); let d = new Date(n.getFullYear(), n.getMonth(), s.day || 1);
  if (d < day0(n)) d = new Date(n.getFullYear(), n.getMonth() + 1, s.day || 1);
  return d;
}
const subBank = s => { if (LIVE){ const b = liveLedger().banks[0]; return b; } return LINKED[0]; };
// Tuile banque : logo officiel de l'agrégateur si fourni (mode réel), sinon monogramme à la couleur de la marque.
function contrastHex(fg, bg){
  const L = h => { const n = parseInt(String(h).replace('#',''), 16); const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
  const a = L(fg), b = L(bg); return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}
function shadeHex(hex, t){
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v + ((t < 0 ? 0 : 255) - v) * Math.abs(t)))));
  return '#' + ch.map(v => v.toString(16).padStart(2, '0')).join('');
}
/** Garde la teinte, ajuste juste assez pour que le monogramme atteigne 4,5:1. */
function tuneColor(hex){
  let bg = /^#[0-9a-f]{6}$/i.test(hex || '') ? hex : '#0066FF';
  let fg = contrastHex('#FFFFFF', bg) >= contrastHex('#0A0B0D', bg) ? '#FFFFFF' : '#0A0B0D';
  for (let i = 0; i < 6 && contrastHex(fg, bg) < 4.5; i++) bg = shadeHex(bg, fg === '#FFFFFF' ? -.08 : .1);
  return { bg, fg };
}
const bankTile = (b, cls = '', extra = '') => {
  const tuned = tuneColor(b.color);
  const bg = tuned.bg, fg = (b.fg && contrastHex(b.fg, tuned.bg) >= 4.5) ? b.fg : tuned.fg;
  const ini = esc(b.ini || String(b.name || 'B').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase());
  const img = b.logo && /^https:\/\//.test(b.logo) ? `<img src="${esc(b.logo)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.remove('has-logo');this.remove()">` : '';
  return `<span class="bk-tile ${img ? 'has-logo' : ''} ${String(ini).length > 2 ? 'x3' : ''} ${cls}" style="--bk:${bg};--bkf:${fg}" title="${esc(b.name)}">${img}<b>${ini}</b>${extra}</span>`;
};
const logo = (s, cls='logo') => {
  const color = /^#[0-9a-f]{6}$/i.test(s.color || '') ? s.color : '#0066FF';
  return `<div class="${cls}" style="background:${color}">${esc(s.ini)}</div>`;
};
const increase = s => {
  if (s.prev == null) return 0;
  const d = toCents(s.price) - toCents(s.prev);
  return d > 0 ? fromCents(d) : 0;
};
const pct = s => Math.round(increase(s) / s.prev * 100);
let demoTag = '<span class="demo">Données d’exemple</span>';
const lockBadge = (t='Premium') => `<span class="badge b-lock">⟦lock⟧ ${t}</span>`;
const neutral = `<div class="neutral"><span class="nic">⟦ban⟧</span><div><b>Zéro pub en Premium · conseils toujours neutres</b>La version gratuite affiche quelques pubs, toujours signalées « Sponsorisé ». Les sponsors n’influencent jamais vos alertes, vos résultats ni nos conseils, et on ne touche aucune commission sur vos résiliations.</div></div>`;
// Pubs de la version gratuite (annonceurs FICTIFS, publicité contextuelle, sans ciblage)
const ADS = {
  dash: { ini:'VC', color:'#0A0B0D', brand:'Vélo Clair', tag:'Marque fictive', title:'Le vélo électrique en location, sans engagement', text:'Premier mois à 19 € au lieu de 39 €. Livraison en 48 h.', cta:'Découvrir' },
  subs: { ini:'PM', color:'#0066FF', brand:'Papeterie Mirabelle', tag:'Marque fictive', title:'Carnets et agendas 2027', text:'−15 % sur la collection d’automne, livraison offerte dès 25 €.', cta:'Voir l’offre' }
};
const adSlot = k => { if (isP()) return ''; const a = ADS[k]; const color = /^#[0-9a-f]{6}$/i.test(a.color || '') ? a.color : '#0066FF'; return `<div class="ad" role="complementary" aria-label="Publicité">
  <div class="ad-h"><span class="ad-tag">Sponsorisé</span><a href="#/premium">Retirer les pubs · Premium ${prix(CFG.priceMonth)}/mois</a></div>
  <a class="ad-body" href="#/${k==='dash'?'dashboard':'abonnements'}" data-toast="Publicité d’exemple : ${esc(a.brand)} est une marque fictive">
    <span class="ad-logo" style="background:${color}">${esc(a.ini)}</span>
    <div class="ad-txt"><span class="ad-brand">${esc(a.brand)} <i>${esc(a.tag)}</i></span><b>${esc(a.title)}</b><span>${esc(a.text)}</span></div>
    <span class="ad-cta">${esc(a.cta)}</span></a></div>`; };
const teaser = (title, text) => `<a class="teaser" href="#/premium"><div class="tl">⟦lock⟧</div><div><b>${title}</b><span>${text}</span></div><div class="tc">Débloquer</div></a>`;
const Toasts = (() => {
  let timer = 0;
  return {
    show(msg) {
      const t = document.getElementById('toast');
      if (!t) return;
      clearTimeout(timer);
      t.textContent = String(msg == null ? '' : msg).replace(/⟦\w+⟧\s?/g, '');
      t.classList.add('show');
      timer = setTimeout(() => { t.classList.remove('show'); timer = 0; }, 2200);
    }
  };
})();
function toast(msg) { Toasts.show(msg); }

function totals(){
  const list = active();
  const monthly = sumEuros(list, s => s.price);
  const ups = list.filter(increase);
  const upsAmt = sumEuros(ups, increase);
  const smalls = list.filter(s=>s.small);
  const dups = list.filter(s=>s.duplicate && !state.resiliated.includes(s.duplicate));
  const found = fromCents(toCents(upsAmt) + toCents(sumEuros(smalls, s => s.price)) + toCents(sumEuros(dups, s => s.price)));
  const achieved = fromCents(toCents(PAST_SAVED) + toCents(sumEuros(SUBS.filter(s=>state.resiliated.includes(s.id)), s => s.price)));
  const fixed = fromCents(toCents(RENT) + toCents(monthly));
  const reste = fromCents(toCents(INCOME) - toCents(fixed) - toCents(SPENT));
  return { list, monthly, ups, upsAmt, smalls, dups, found, achieved, fixed, reste };
}

function alertOn(set){
  const p = state.alertSets || {};
  return p[set] !== false;
}
const keptQuiet = id => (state.kept || []).includes(id);
function alerts(){
  const t = totals(); const out = [];
  const grp = w => /Aujourd|matin|Maintenant|2 h/.test(w) ? 'Aujourd’hui' : /Hier|5 j/.test(w) ? 'Cette semaine' : 'Plus tôt';
  const add = a => { a.group = grp(a.when); out.push(a); };
  t.ups.filter(s => !keptQuiet(s.id)).forEach(s => add({ id:'up-'+s.id, kind:'up', set:'up', ic:'⟦trend⟧', amt:'+'+eur(increase(s)), title:s.name,
    text:`Prix passé de ${eur(s.prev)} à ${eur(s.price)}`, when: s.id==='flixo'?'Il y a 2 h':'Détecté lors du scan', link:'#/abo/'+s.id }));
  t.list.filter(s=>s.trial && !keptQuiet(s.id)).forEach(s => add({ id:'trial-'+s.id, kind:'trial', set:'trial', ic:'⟦clock⟧', amt:'−'+eur(s.price), title:s.name,
    text:'Essai gratuit devenu payant', when:'Il y a 5 j', link:'#/abo/'+s.id }));
  t.dups.filter(s => !keptQuiet(s.id)).forEach(s => add({ id:'dup-'+s.id, kind:'dup', set:'dbl', ic:'⟦copy⟧', amt:'−'+eur(s.price), title:s.name,
    text:`Doublon avec ${byId(s.duplicate).name}`, when:'Hier', link:'#/abo/'+s.id }));
  t.list.filter(s=>s.doubleCharge && !keptQuiet(s.id)).forEach(s => add({ id:'dbl-'+s.id, kind:'dbl', set:'dbl', ic:'⟦alert⟧', amt:'−'+eur(s.price), title:s.name,
    text:`Prélevé deux fois le ${s.doubleCharge}`, when:'Ce matin', link:'#/abo/'+s.id }));
  const next = t.list.filter(s=>s.day>=9 && s.day<=12).sort((a,b)=>a.day-b.day);
  next.filter(s => !keptQuiet(s.id)).forEach(s => add({ id:'next-'+s.id, kind:'next', set:'next', ic:'⟦calendar⟧', amt:'−'+eur(s.price), title:s.name,
    text:`Prélèvement le ${s.day} oct.`, when:'Aujourd’hui', link:'#/abo/'+s.id }));
  if (t.reste < 700) add({ id:'low', kind:'low', set:'next', ic:'⟦alert⟧', title:'Reste à vivre',
    text:`${eur(t.reste)} pour ${PAYDAY_IN} jours`, when:'Aujourd’hui', link:'#/dashboard' });
  out.forEach(a => a.premium = true);
  linked().forEach(b => {
    if (b.expiresIn <= 7) out.unshift({ id:'exp-'+b.id, kind:'bank', set:'bank', ic:'⟦key⟧', title:b.name,
      text:`Accès expire dans ${b.expiresIn} jours`, when:'Aujourd’hui', link:'#/banques', group:'Aujourd’hui' });
    if (b.status==='expired') out.unshift({ id:'pwexp', kind:'bank', set:'bank', ic:'⟦key⟧', title:b.name,
      text:'Session de test expirée', when:'Maintenant', link:'#/banques', group:'Aujourd’hui' });
    if (b.status==='error') out.unshift({ id:'err-'+b.id, kind:'bank', set:'bank', ic:'⟦link⟧', title:b.name,
      text:'Ne se synchronise plus', when:'Hier', link:'#/banques', group:'Cette semaine' });
  });
  budgetAlertRows().forEach(a => out.push(a));
  const kept = out.filter(a => alertOn(a.set || 'bank'));
  const first = kept.filter(a=>!a.premium).concat(kept.filter(a=>a.id==='dbl-mobi'||a.id==='up-flixo'));
  const rest = kept.filter(a=>!first.includes(a));
  return [...first, ...rest.filter(a=>a.kind!=='up'), ...rest.filter(a=>a.kind==='up')];
}

let homeKpi = null;
let _subsSig = '';
function subsSig() {
  const rows = SUBS.map(s => [s.id, s.price, s.prev, s.small ? 1 : 0, s.trial ? 1 : 0, s.doubleCharge || '', s.duplicate || ''].join(':'));
  return (state.resiliated || []).join(',') + '|' + (state.kept || []).join(',') + '|' + rows.join(';');
}
function paintAlertBadge() {
  const unreadN = alerts().filter(a => !state.readAlerts.includes(a.id)).length;
  const alertTab = document.querySelector('#tabbar a[data-tab="alertes"]');
  if (alertTab) alertTab.setAttribute('aria-label', unreadN ? `Alertes, ${unreadN} non lue${unreadN > 1 ? 's' : ''}` : 'Alertes');
  const dot = document.getElementById('alert-dot');
  if (dot) dot.classList.toggle('show', unreadN > 0);
}
function publishSubs() {
  const sig = subsSig();
  if (sig === _subsSig) return;
  _subsSig = sig;
  _ledger = null;
  Store.emit('subs');
}
function onSubsChange() {
  homeKpi = totals();
  publishBudget();
}
Store.on('subs', onSubsChange);
Store.on('budget', function () { paintAlertBadge(); });

// ---------- écrans ----------
const screens = {};
const brandBar = (right=demoTag) => `<div class="topbar"><div class="brand"><i class="brand-mark" aria-hidden="true"></i>${APP_NAME}</div>${right}</div>`;
function logoMark(size){
  const id = appIcon();
  const tone = id === 'noir' ? 't-noir' : id === 'defaut' ? 't-defaut' : 't-bleu';
  const inner = id === 'bleu' ? '<img src="icons/logo-mark.svg" alt="">' : '<i class="glyph"></i>';
  return `<span class="logo-chip ${size || ''} ${tone}">${inner}</span>`;
}
screens.onboarding = () => `
<div class="onb">
  ${logoMark('xl')}
  <h1>Arrêtez de payer pour des abonnements <em>que vous avez oubliés.</em></h1>
  <p class="lead">${APP_NAME} analyse vos comptes, repère tous vos prélèvements récurrents et vous prévient quand un prix augmente.</p>
  <ul>
    <li><span>⟦search⟧</span>Tous vos abonnements détectés en 30 secondes</li>
    <li><span>⟦trend⟧</span>Alerte dès qu’un prix augmente en douce</li>
    <li><span>⟦scissors⟧</span>Résiliation guidée, lettre prête à envoyer</li>
    <li><span class="nic">⟦ban⟧</span>Des conseils neutres : les sponsors n’influencent jamais vos résultats</li>
    <li><span>⟦user⟧</span>Un support humain qui répond vraiment</li>
  </ul>
  ${notBank('onb-nb')}
  <div class="spacer"></div>
  ${API ? (API.loggedIn() ? `${bankEb() ? `<p class="muted small" style="margin:0 2px 12px;line-height:1.45">Vous autorisez la lecture de vos comptes Société Générale, pour 180 jours. Vous pouvez révoquer cet accès à tout moment. Aucun virement n’est possible.</p>` : ''}
  <button class="btn" id="api-connect">⟦bank⟧ Connecter ma banque</button>
  <button class="btn ghost" id="api-logout" style="margin-top:8px">Se déconnecter</button>`
    : `<a class="btn" href="#/connexion">⟦mail⟧ Se connecter avec mon e-mail</a>
  <a class="btn ghost" href="?demo=1#/dashboard" style="margin-top:8px">Voir la démo (données d’exemple)</a>`) : `<a class="btn" href="#/connect">Connecter ma banque</a>
  ${PWX ? `<button class="btn ghost" id="pw-connect" style="margin-top:8px">⟦bank⟧ Connecter une banque de test</button>` : ''}`}
  <p class="fine">⟦lock⟧ Gratuit pour commencer, Premium à ${prix(CFG.priceMonth)}/mois.<br>Accès en lecture seule via un agrégateur bancaire agréé. ${APP_NAME} ne peut jamais déplacer votre argent.<br>${API ? (bankEb() ? 'Bêta fermée – lecture seule, aucun paiement' : 'Bêta privée – banques de test uniquement') : 'Maquette – données d’exemple'}</p>
</div>`;

screens.connect = () => `
<div class="screen">
  <div class="topbar"><a class="back" href="#/onboarding">⟦back⟧</a>${demoTag}</div>
  <h1 style="font-size:24px;letter-spacing:-.02em">Choisissez votre banque</h1>
  <p class="muted small" style="margin-top:6px">Connexion sécurisée, en lecture seule (simulation).</p>
  ${notBank()}
  <label class="search" style="margin-top:16px">⟦search⟧<input id="bank-q" type="search" placeholder="Rechercher une banque" aria-label="Rechercher une banque" autocomplete="off" enterkeyhint="search"></label>
  <div class="banks">${BANKS.map(b=>`<button class="bank ${state.bank===b.id?'on':''}" data-bank="${esc(b.id)}">${bankTile(b)}<span>${esc(b.name)}</span></button>`).join('')}</div>
  <p class="fine" style="margin:-4px 2px 14px">Noms de banques cités à titre d’exemple dans cette démo : ${APP_NAME} n’est affilié à aucune d’elles. Monogrammes aux couleurs approximatives des marques.</p>
  <div class="banner blue"><span class="ic">⟦lock⟧</span><div><b>Vos identifiants restent chez votre banque</b>${APP_NAME} passe par un agrégateur agréé (DSP2). L’accès dure 180 jours : on vous prévient avant qu’il expire, et vous pouvez le retirer à tout moment.</div></div>
  <button class="btn mint" id="go-scan" ${state.bank?'':'disabled style="opacity:.5"'}>Continuer</button>
  ${PWX ? `<div class="section-h"><h2>Ou essayez une vraie connexion… de test</h2></div>
  <p class="muted small" style="margin:-4px 2px 10px">Passez par l’agrégateur Powens avec ses fausses banques : ${APP_NAME} analyse alors de vraies opérations de test.</p>
  <button class="btn ghost" id="pw-connect">⟦bank⟧ Connecter une banque de test</button>
  ${pwNote()}` : ''}
</div>`;

screens.scan = () => `
<div class="screen"><div class="loader" role="status">
  <div class="spin"></div>
  <h2 style="font-size:20px">Analyse de vos 12 derniers mois…</h2>
  <p class="muted small" style="margin-top:6px">Simulation – aucune vraie banque n’est contactée</p>
  <div class="scanlist" id="scanlist">
    <div>⟦check⟧ Connexion à ${esc((BANKS.find(b=>b.id===state.bank)||BANKS[0]).name)}</div>
    <div>⟦check⟧ 1 248 opérations lues</div>
    <div>⟦check⟧ ${SUBS.length} prélèvements récurrents trouvés</div>
    <div>⟦check⟧ ${SUBS.filter(increase).length} hausses de prix repérées</div>
    <div>⟦check⟧ ${SUBS.filter(s=>s.small).length} petits prélèvements oubliés</div>
  </div>
</div></div>`;

function bankStrip(){
  const L = linked();
  if (LIVE){ const b = L[0]; return `<a class="bankstrip" href="#/banques">
    <div class="bs-logos">${bankTile(b, 'bs-l', `<i class="st ${b.status==='expired'?'warn':'ok'}"></i>`)}</div>
    <div class="bs-txt">${b.status==='expired' ? '<b class="t-amber">Session de test expirée · reconnecter</b>' : `<b>${esc(b.name)} · ${API ? 'synchro il y a ' + (LIVE.at ? ago(LIVE.at) : '—') : 'banque de test'}</b>`}<span>${esc(b.accounts)}</span></div>
    <span class="chev">⟦chev⟧</span></a>`; }
  const warn = L.find(b=>b.status==='error') || L.find(b=>b.expiresIn<=7);
  return `<a class="bankstrip" href="#/banques">
    <div class="bs-logos">${L.map(b=>bankTile(b, 'bs-l', `<i class="st ${b.status==='error'?'err':b.expiresIn<=7?'warn':'ok'}"></i>`)).join('')}</div>
    <div class="bs-txt">${warn ? (warn.status==='error' ? `<b class="t-red">${esc(warn.name)} : synchro en échec</b>` : `<b class="t-amber">Accès ${esc(warn.name)} : expire dans ${warn.expiresIn} j</b>`) : '<b>Comptes à jour</b>'}<span>${L.length} banque${L.length>1?'s':''} · synchro ${esc(L[0].sync)}</span></div>
    <span class="chev">⟦chev⟧</span></a>`;
}

// ---------- Accueil « au quotidien » : tous les comptes, les opérations du jour, ce qui part cette semaine ----------
// Inspiration Tricount (simplicité, gros chiffres lisibles, pastilles de catégorie, listes par jour, ton amical), DA Prelevo.
Object.assign(ICONS, {
  cart:'<path d="M3 4h2l2.2 10.5a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6"/><circle cx="9.5" cy="19.5" r="1.2"/><circle cx="17" cy="19.5" r="1.2"/>',
  cup:'<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M9 3.5v2.5M12.5 3.5v2.5"/>',
  train:'<rect x="6" y="3" width="12" height="13" rx="3"/><path d="M6 10h12M9 19.5l-2 2M15 19.5l2 2"/><circle cx="9.5" cy="13" r=".6"/><circle cx="14.5" cy="13" r=".6"/>',
  bag:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  home:'<path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
  bolt:'<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>',
  wifi:'<path d="M3 9a13 13 0 0 1 18 0M6 12.5a8.5 8.5 0 0 1 12 0M9 16a4 4 0 0 1 6 0"/><circle cx="12" cy="19" r=".8"/>',
  repeat:'<path d="M17 3l3 3-3 3"/><path d="M4 12V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3"/><path d="M20 12v3a3 3 0 0 1-3 3H4"/>',
  swap:'<path d="M7 4L3 8l4 4M3 8h14M17 12l4 4-4 4M21 16H7"/>',
  income:'<path d="M17 7L7 17M7 9v8h8"/>',
  cash:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
  ticket:'<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path d="M14 7.5v9" stroke-dasharray="1.5 2"/>',
  plane:'<path d="M10.5 13.5L4 11.5l1.2-1.8 7 .3 4.3-4.6a1.5 1.5 0 0 1 2.1 2.1L14 11.8l.3 7-1.8 1.2-2-6.5z"/>',
  dot:'<circle cx="12" cy="12" r="2.5"/>',
});
const Cats = window.PrelevoCategories;
const CATS = {};
Cats.LIST.forEach(c => { CATS[c.id] = { ic: c.ic, l: c.l }; });
CATS.virement = { ic: 'swap', l: 'Virement' };
CATS.shopping = CATS.autre;
CATS.retrait = CATS.autre;
CATS.voyage = CATS.autre;
CATS.pret = CATS.autre;
const CAT_KEY = 'prelevo-cat-rules';
function catOverrides() {
  const raw = Store.readJSON(CAT_KEY, {});
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out = {};
  Object.keys(raw).forEach(k => {
    const v = raw[k];
    if (v === 'virement' || Cats.BY[v]) out[k] = v;
  });
  return out;
}
function catOf(w, type, amt) {
  return Cats.classify({ wording: w, name: cleanName(w), type: type, amount: amt }, catOverrides());
}
function stampCat(row) {
  row.cat = Cats.classify({
    name: row.name,
    wording: row.wording || row.name,
    type: row.type,
    amount: row.amt,
    hint: row.cat,
  }, catOverrides());
  return row;
}
let catSheetName = '';
function closeCatSheet() {
  const n = document.querySelector('.cat-sheet');
  if (n) n.remove();
}
function openCatSheet(name, current) {
  closeCatSheet();
  catSheetName = name || '';
  const root = document.createElement('div');
  root.className = 'cat-sheet';
  const bg = document.createElement('button');
  bg.type = 'button';
  bg.className = 'cat-sheet-bg';
  bg.dataset.catClose = '1';
  bg.setAttribute('aria-label', 'Fermer');
  const panel = document.createElement('div');
  panel.className = 'cat-sheet-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'cat-sheet-title');
  const head = document.createElement('div');
  head.className = 'cat-sheet-h';
  const h2 = document.createElement('h2');
  h2.id = 'cat-sheet-title';
  h2.textContent = name || 'Catégorie';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'cat-sheet-x';
  close.dataset.catClose = '1';
  close.setAttribute('aria-label', 'Fermer');
  close.textContent = 'Fermer';
  head.append(h2, close);
  const note = document.createElement('p');
  note.className = 'cat-sheet-note';
  note.textContent = 'Cette catégorie sera réappliquée à ce marchand.';
  const list = document.createElement('div');
  list.className = 'cat-sheet-list';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', 'Catégories');
  Cats.LIST.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cat-pick' + (c.id === current ? ' on' : '');
    b.dataset.catPick = c.id;
    b.setAttribute('role', 'option');
    b.setAttribute('aria-selected', c.id === current ? 'true' : 'false');
    b.style.setProperty('--cat-ink', c.color);
    const chip = document.createElement('span');
    chip.className = 'cat';
    chip.setAttribute('aria-hidden', 'true');
    if (ICONS[c.ic]) chip.innerHTML = SVG(ICONS[c.ic]);
    const lab = document.createElement('span');
    lab.textContent = c.l;
    b.append(chip, lab);
    list.appendChild(b);
  });
  panel.append(head, note, list);
  root.append(bg, panel);
  document.body.appendChild(root);
  const focus = list.querySelector('.on') || list.querySelector('button');
  if (focus) focus.focus();
}
function rememberCategory(name, cat) {
  if (!Cats.BY[cat]) return;
  const all = catOverrides();
  all[Cats.merchantKey(name)] = cat;
  Store.writeJSON(CAT_KEY, all);
  _ledger = null;
  closeCatSheet();
  toast('Catégorie mémorisée. Elle sera réappliquée à ce marchand.');
  render();
}
/** « CB DEBIT IMMEDIAT RESTAURANT PARIS 09/10 » → « Restaurant Paris » */
function cleanName(w){
  let s = String(w || '').toUpperCase();
  s = s.replace(/\bN°\s*\S+/g, ' ').replace(/\b\d{4}X+\d+\b|X{3,}\d*/g, ' ').replace(/\b\d{2}[\/.]\d{2}([\/.]\d{2,4})?\b/g, ' ');
  for (let i = 0; i < 4; i++) s = s.replace(/^\s*(CB|CARTE|PRLV|PR[EÉ]L[EÈ]VEMENT|SEPA|VIR(EMENT)?|INST(ANTAN[EÉ])?|RE[CÇ]U|D[EÉ]BIT|IMM[EÉ]DIAT|RETRAIT|DAB|PAIEMENT)\b\.?\s*/, '');
  s = s.replace(/\s+/g, ' ').trim();
  if (!s) return 'Opération';
  const KEEP = /^(CAF|APL|SNCF|RATP|EDF|SFR|SAS|TV|BNP|LCL|CROUS|USA)$/, SMALL = /^(DE|DU|DES|LA|LE|LES|ET|EN|AU|AUX|SUR|OF|D'|L')$/;
  return s.split(' ').map((x, i) => KEEP.test(x) ? x : (i && SMALL.test(x)) ? x.toLowerCase() : x.charAt(0) + x.slice(1).toLowerCase()).join(' ');
}

const DAY_MS = 864e5;
const JOURS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const nowRef = () => LIVE ? new Date() : new Date(NOW);
const day0 = d => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
function dayLabel(d){
  const n = Math.round((day0(d) - day0(nowRef())) / DAY_MS);
  if (n === 0) return 'Aujourd’hui'; if (n === -1) return 'Hier'; if (n === 1) return 'Demain';
  return cap(JOURS[d.getDay()]) + ' ' + d.getDate() + ' ' + MOIS[d.getMonth()];
}
const money = n => { const v = fromCents(toCents(n)); const s = Math.abs(v).toLocaleString('fr-FR', { minimumFractionDigits:2, maximumFractionDigits:2 }); const k = s.lastIndexOf(',');
  return `${v < 0 ? '−' : ''}<span class="m-int">${s.slice(0, k)}</span><span class="m-dec">${s.slice(k)} €</span>`; };
const signed = n => (n > 0 ? '+' : n < 0 ? '−' : '') + eur(Math.abs(n));

// Comptes de démo par banque (montants fictifs) ; le compte courant suit la courbe de solde de la démo
const DEMO_ACC = { b1:[['Compte courant', null], ['Livret A', 4250]], b2:[['Compte joint', 612.08]], b3:[['Carte en ligne', 138.9]] };
const MERCH = { s:[['Boulangerie Martin','courses'],['Café Lumière','resto'],['Transports urbains','transport'],['Kiosque Presse','shopping']],
  m:[['Pharmacie des Lilas','sante'],['Cantine Sato','resto'],['Librairie du Parc','shopping'],['Ciné Rex','loisirs'],['Primeur Bio','courses']],
  l:[['Supérette du Canal','courses'],['Marché Saint-Louis','courses'],['Bricolage Dupont','shopping'],['Bistrot Les Amis','resto']] };
let _ledger = null;
function ledgerKey() {
  const ov = catOverrides();
  const sig = Object.keys(ov).sort().map(k => k + '=' + ov[k]).join('|');
  return (LIVE ? 'live' + LIVE.at : 'demo' + isP() + state.resiliated.join()) + '#' + sig;
}
function ledger(){
  const key = ledgerKey();
  if (_ledger && _ledger.key === key) return _ledger;
  const L = LIVE ? liveLedger() : demoLedger();
  L.key = key;
  return (_ledger = L);
}
function demoLedger(){
  const T = timeline();
  const banks = linked().map(b => ({ ...b, accs: (DEMO_ACC[b.id] || []).map(([n, v]) => ({ name:n, balance: v == null ? T.end : v })) }));
  banks.forEach(b => b.total = sumEuros(b.accs, x => x.balance));
  const total = sumEuros(banks, b => b.total), others = fromCents(toCents(total) - toCents(T.end));
  const from = NOW.getTime() - 100 * DAY_MS;
  const tx = T.ev.filter(e => e.k !== 'xfer' && e.t.getTime() >= from).map(e => {
    if (e.k === 'spend'){
      const bk = banks[(Math.floor(e.t.getTime() / 864e5) % 3) % banks.length] || banks[0];
      return stampCat({ t:e.t, name:e.name || 'Carte', cat:e.cat || 'autre', amt:e.amt, where:bk.name, bank:bk }); }
    if (e.k === 'in') return stampCat({ t:e.t, name: e.prime ? 'Salaire et prime · Exemple SAS' : 'Salaire · Exemple SAS', cat:'revenu', amt:e.amt, where:LINKED[0].name, bank:banks[0] });
    if (e.k === 'rent') return stampCat({ t:e.t, name:'Loyer · Agence Fictive', cat:'logement', amt:e.amt, where:LINKED[0].name, bank:banks[0] });
    const s = SUBS.find(x => x.name === e.name); return stampCat({ t:e.t, name:e.name, cat:e.cat || 'abo', amt:e.amt, sub:s && s.id, where:'Prélèvement · ' + banks[0].name, bank:banks[0] });
  }).reverse();
  const curve = samples('1M').map(p => ({ t:p.t, v:p.bal + others }));
  const t0 = day0(NOW), up = [];
  active().forEach(s => { for (const mo of [0, 1]){ const d = new Date(NOW.getFullYear(), NOW.getMonth() + mo, s.day, 7); if (d > NOW && d - t0 < 8 * DAY_MS) up.push(stampCat({ t:d, name:s.name, cat:s.txCat || 'abo', amt:-s.price, sub:s.id, where:'Abonnement détecté' })); } });
  up.sort((a, b) => a.t - b.t);
  return { banks, total, tx, curve, up, nAcc: banks.reduce((a, b) => a + b.accs.length, 0) };
}
function liveLedger(){
  const accs = LIVE.accounts || [];
  const isEur = a => !a.currency || a.currency === 'EUR';
  const counted = a => isEur(a) && !/card|loan|credit/.test(String(a.type || ''));
  const b = liveBank();
  const ini = String(LIVE.bank || 'B').split(/\s+/).filter(w => /^[\wÀ-ÿ]/.test(w)).map(w => w[0]).join('').slice(0, 3).toUpperCase();
  const bank = { ...b, ini, accs: accs.map(a => ({ id:a.id, name:a.name, balance:Number(a.balance) || 0, currency:a.currency, counted:counted(a), type:a.type })) };
  bank.total = sumEuros(bank.accs.filter(a => a.counted), a => a.balance);
  const accName = id => { const a = accs.find(x => x.id === id); return a ? a.name.replace(/\s*-\s*Mr.*$/i, '') : LIVE.bank; };
  const t0 = day0(new Date()), dt = t => new Date(t.date + 'T12:00');
  const raw = (LIVE.recent || []).filter(t => t.type !== 'summary_card');
  const map = t => stampCat({ t:dt(t), name:cleanName(t.wording), wording:t.wording, type:t.type, amt:t.value, acc:t.account, where:accName(t.account), bank });
  const tx = raw.filter(t => !t.coming && dt(t) < new Date(t0.getTime() + DAY_MS)).map(map).sort((a, b) => b.t - a.t);
  const up = raw.filter(t => t.coming && t.value < 0 && dt(t) >= t0 && dt(t) - t0 < 8 * DAY_MS).map(map);
  (LIVE.subs || []).forEach(s => { const d = nextLive(s); if (d >= t0 && d - t0 < 8 * DAY_MS) up.push(stampCat({ t:d, name:s.name, cat:'abo', amt:-(s.amount || s.price), sub:s.id, where:'Abonnement détecté' })); });
  up.sort((a, b) => a.t - b.t);
  // courbe 30 j : solde des comptes courants/épargne aujourd'hui, en remontant leurs opérations
  const ids = new Set(bank.accs.filter(a => a.counted && a.id != null).map(a => a.id));
  const flows = tx.filter(x => ids.has(x.acc));
  const oldest = flows.length ? flows.reduce((m, f) => Math.min(m, +f.t), +t0) : +t0;
  const span = Math.min(400, Math.max(30, Math.ceil((+t0 - oldest) / DAY_MS)));
  const curve = [];
  for (let d = span; d >= 0; d--){ const end = new Date(t0.getTime() - (d - 1) * DAY_MS); curve.push({ t:new Date(end - DAY_MS / 2), v: fromCents(toCents(bank.total) - toCents(sumEuros(flows.filter(f => f.t >= end), f => f.amt))) }); }
  return { banks:[bank], total:bank.total, tx, curve, up, nAcc:bank.accs.filter(a => a.counted).length, live:true };
}

let SPARK = null;
let CURVES = [];
function homeCurve(){
  const L = ledger();
  if (L.live) {
    const days = { '24H':1, '7J':7, '1M':30, '3M':90, '1A':365, 'TOUT':1e5 }[homeTf] || 30;
    const from = day0(nowRef()).getTime() - (days - 1) * DAY_MS;
    const c = L.curve.filter(p => +p.t >= from);
    return c.length > 1 ? c : L.curve.slice(-2);
  }
  return samples(homeTf).map((p, i, all) => ({ t:p.t, v: i === all.length - 1 ? L.total : p.bal + (L.total - timeline().end) }));
}
function chartTicks(lo, hi){
  if (!(hi > lo)) return [lo];
  return [hi, (hi + lo) / 2, lo];
}
function chartTick(v){
  const n = Math.abs(v) >= 100 ? Math.round(v) : Math.round(v * 10) / 10;
  return n.toLocaleString('fr-FR');
}
function chartY(W, H, yOf, lo, hi){
  const ticks = chartTicks(lo, hi);
  const lines = `<g class="sp-grid">${ticks.map(v => `<line x1="0" y1="${yOf(v).toFixed(1)}" x2="${W}" y2="${yOf(v).toFixed(1)}" stroke="currentColor" stroke-opacity=".07" vector-effect="non-scaling-stroke"/>`).join('')}</g>`;
  const labels = `<div class="sp-y" aria-hidden="true">${ticks.map(v => `<span style="top:${(yOf(v) / H * 100).toFixed(2)}%">${chartTick(v)}</span>`).join('')}</div>`;
  return { lines, labels };
}
function spark(curve){
  if (!curve || curve.length < 2) return '';
  const tf = homeTfMeta();
  const W = 340, H = 118, PADL = 2, PADR = 46, PADT = 16, PADB = 10;
  const vs = curve.map(p => p.v), lo = Math.min(...vs), hi = Math.max(...vs), r = hi - lo || 1;
  const x = i => PADL + (i / (curve.length - 1)) * (W - PADL - PADR);
  const y = v => PADT + (hi - v) / r * (H - PADT - PADB);
  const pts = curve.map((p, i) => [x(i), y(p.v)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const last = pts[pts.length - 1], first = pts[0];
  const track = curve.map((p, i) => ({ x: pts[i][0] / W * 100, y: pts[i][1] / H * 100, v: p.v, t: p.t }));
  const line = d, area = `${d} L${last[0].toFixed(1)},${H} L${first[0].toFixed(1)},${H} Z`;
  const grid = chartY(W, H, y, lo, hi);
  const fmt = homeTf === '24H' ? 'hour' : (homeTf === '3M' || homeTf === '1A' || homeTf === 'TOUT') ? 'month' : 'day';
  SPARK = { pts: track, poly: pts, H, line, area, first: curve[0].v, tf: homeTf, fmt, home: true };
  const nLab = homeTf === '24H' || homeTf === '7J' ? 4 : 5;
  const seen = new Set(), idxs = [];
  for (let k = 0; k < nLab; k++){ const i = Math.round(k * (curve.length - 1) / (nLab - 1)); if (!seen.has(i)) { seen.add(i); idxs.push(i); } }
  const lab = d => homeTf === '24H' ? String(d.getHours()).padStart(2, '0') + ' h' : (homeTf === '3M' || homeTf === '1A' || homeTf === 'TOUT') ? MOIS[d.getMonth()] + ' ' + String(d.getFullYear()).slice(2) : d.getDate() + ' ' + MOIS[d.getMonth()];
  const axis = idxs.map((i, k) => `<span class="${k === 0 ? 'a0' : k === idxs.length - 1 ? 'a1' : ''}" style="left:${track[i].x.toFixed(2)}%">${lab(curve[i].t)}</span>`).join('');
  return `<div class="spark home-spark" role="img" aria-label="Évolution du solde sur ${tf[2]}. Glissez pour voir le détail."><div class="spark-plot"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="spk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0066FF" stop-opacity=".25"/><stop offset="1" stop-color="#0066FF" stop-opacity="0"/></linearGradient></defs>
    ${grid.lines}
    <path class="sp-area" d="${area}" fill="url(#spk)"/>
    <path class="sp-dim" d="" fill="none" stroke="var(--accent)" stroke-width="1.35" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>
    <path class="sp-line" d="${line}" fill="none" stroke="var(--accent)" stroke-width="1.35" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>${grid.labels}<i class="sp-vline" hidden></i><i class="sp-dot" style="left:${(last[0] / W * 100).toFixed(2)}%;top:${(last[1] / H * 100).toFixed(2)}%"></i>
  <div class="sp-tip" hidden><b></b><span></span></div>
  <div class="sp-hit" aria-hidden="true"></div></div>
  <div class="sp-axis">${axis}</div></div>`;
}
function bankCurve(b, tx){
  const days = 30, t0 = day0(nowRef());
  const mine = tx.filter(x => x.bank && x.bank.id === b.id);
  const pts = [];
  for (let d = days; d >= 0; d--){
    const end = new Date(t0.getTime() - (d - 1) * DAY_MS);
    const v = fromCents(toCents(b.total) - toCents(sumEuros(mine.filter(f => +f.t >= +end), f => f.amt)));
    pts.push({ t: new Date(+end - DAY_MS / 2), v });
  }
  return pts;
}
function curveChart(curve, opt = {}){
  if (!curve || curve.length < 2) return '';
  const color = opt.color || '#0066FF';
  const H = opt.h || 92;
  const W = 340, PADL = 2, PADR = opt.padR || 46, PADT = 12, PADB = 8;
  let lo = Math.min(...curve.map(p => p.v)), hi = Math.max(...curve.map(p => p.v));
  if (opt.lo != null) lo = opt.lo;
  if (opt.hi != null) hi = opt.hi;
  if (opt.zero){ lo = Math.min(lo, 0); hi = Math.max(hi, 0); }
  if (hi === lo) {
    if (hi === 0) hi = 1;
    else if (hi > 0) lo = 0;
    else hi = 0;
  }
  const span = hi - lo || 1;
  const x = i => PADL + (i / (curve.length - 1)) * (W - PADL - PADR);
  const y = v => PADT + (hi - v) / span * (H - PADT - PADB);
  const pts = curve.map((p, i) => [x(i), y(p.v)]);
  const seg = arr => arr.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const partial = curve.length >= 2 && !!curve[curve.length - 1].partial;
  const d = seg(pts);
  const solid = partial ? seg(pts.slice(0, -1)) : d;
  const dash = partial ? seg(pts.slice(-2)) : '';
  const last = pts[pts.length - 1], first = pts[0];
  const area = `${d} L${last[0].toFixed(1)},${H} L${first[0].toFixed(1)},${H} Z`;
  const idx = CURVES.length;
  const gid = 'spk' + idx;
  CURVES.push({
    pts: curve.map((p, i) => ({ x: pts[i][0] / W * 100, y: pts[i][1] / H * 100, v: p.v, t: p.t, partial: !!p.partial })),
    poly: pts, H, line: solid, area, fmt: opt.fmt || 'day', signed: !!opt.signed, idx: !!opt.idx, home: false, link: opt.link || '', slot: opt.slot || ''
  });
  const n = curve.length, idxs = [];
  const fmt = opt.fmt || 'day';
  if (fmt === 'month') {
    const step = n <= 7 ? 1 : n <= 14 ? 2 : 3;
    for (let i = 0; i < n; i++) if (i === 0 || i === n - 1 || i % step === 0) idxs.push(i);
  } else {
    const seen = new Set();
    for (let k = 0; k < 4; k++){ const i = Math.round(k * (n - 1) / 3); if (!seen.has(i)){ seen.add(i); idxs.push(i); } }
  }
  const axis = idxs.map((i, k) => {
    const t = curve[i].t;
    const txt = fmt === 'hour' ? String(t.getHours()).padStart(2, '0') + ' h' : fmt === 'month' ? MOIS[t.getMonth()] : t.getDate() + ' ' + MOIS[t.getMonth()];
    const style = k === 0 ? 'left:0' : k === idxs.length - 1 ? 'left:100%' : `left:${(pts[i][0] / W * 100).toFixed(2)}%`;
    return `<span class="${k === 0 ? 'a0' : k === idxs.length - 1 ? 'a1' : ''}" style="${style}">${txt}</span>`;
  }).join('');
  const total = opt.total != null ? opt.total : curve[curve.length - 1].v;
  const head = opt.header != null ? opt.header : (opt.signed ? sgnEUR(total) : (fmt === 'month' ? kEUR(total) : total.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'));
  const grid = opt.ticks ? (() => {
    const lines = `<g class="sp-grid">${opt.ticks.map(v => `<line x1="0" y1="${y(v).toFixed(1)}" x2="${W}" y2="${y(v).toFixed(1)}" stroke="currentColor" stroke-opacity=".07" vector-effect="non-scaling-stroke"/>`).join('')}</g>`;
    const labels = `<div class="sp-y" aria-hidden="true">${opt.ticks.map(v => `<span style="top:${(y(v) / H * 100).toFixed(2)}%">${chartTick(v)}</span>`).join('')}</div>`;
    return { lines, labels };
  })() : chartY(W, H, y, lo, hi);
  const ref = opt.ref != null ? `<line class="sp-ref" x1="0" y1="${y(opt.ref).toFixed(1)}" x2="${W}" y2="${y(opt.ref).toFixed(1)}" stroke="${color}" stroke-opacity=".55" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>` : '';
  const zoneBands = opt.zones ? opt.zones.map(z => `<rect x="0" y="${y(z.hi).toFixed(1)}" width="${W}" height="${(y(z.lo) - y(z.hi)).toFixed(1)}" fill="${z.c}" fill-opacity=".07"/>`).join('') + opt.zones.slice(1).map(z => `<line x1="0" y1="${y(z.lo).toFixed(1)}" x2="${W}" y2="${y(z.lo).toFixed(1)}" stroke="currentColor" stroke-opacity=".12" stroke-dasharray="2 3" vector-effect="non-scaling-stroke"/>`).join('') : '';
  const zoneLabels = opt.zones ? `<div class="sp-y sp-zones" aria-hidden="true">${opt.zones.map(z => `<span style="top:${(y((z.lo + z.hi) / 2) / H * 100).toFixed(2)}%;color:${z.c}">${z.l}</span>`).join('')}</div>` : '';
  const sgid = 'sg' + idx;
  const strokeDef = opt.strokeGrad ? `<linearGradient id="${sgid}" gradientUnits="userSpaceOnUse" x1="0" y1="${y(lo).toFixed(1)}" x2="0" y2="${y(hi).toFixed(1)}">${opt.strokeGrad.map((c, i) => `<stop offset="${(i / (opt.strokeGrad.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>` : '';
  const stroke = opt.strokeGrad ? `url(#${sgid})` : color;
  const bands = opt.bands ? (() => {
    const yh = y(70), yl = y(30);
    return `<rect x="0" y="0" width="${W}" height="${yh.toFixed(1)}" fill="#089981" fill-opacity=".10"/>`
      + `<rect x="0" y="${yh.toFixed(1)}" width="${W}" height="${(yl - yh).toFixed(1)}" fill="#7E57C2" fill-opacity=".10"/>`
      + `<rect x="0" y="${yl.toFixed(1)}" width="${W}" height="${(H - yl).toFixed(1)}" fill="#F23645" fill-opacity=".10"/>`
      + [70, 30].map(v => `<line x1="0" y1="${y(v).toFixed(1)}" x2="${W}" y2="${y(v).toFixed(1)}" stroke="currentColor" stroke-opacity=".35" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>`).join('');
  })() : '';
  const g0 = opt.grad ? opt.grad[0] : .25, g1 = opt.grad ? opt.grad[1] : 0;
  const zero = opt.zero && lo < 0 && hi > 0 ? `<line class="sp-zero" x1="0" y1="${y(0).toFixed(1)}" x2="${W}" y2="${y(0).toFixed(1)}" stroke="currentColor" stroke-opacity=".16" stroke-dasharray="2 3" vector-effect="non-scaling-stroke"/>` : '';
  const dotCls = (partial ? 'sp-dot is-partial' : 'sp-dot') + (opt.glow ? ' glow' : '');
  return `<div class="spark lite${opt.tv ? ' tv' : ''}" data-curve="${idx}" ${opt.link ? `data-link="${opt.link}"` : ''} style="--spk:${opt.spk || color}" role="img" aria-label="${opt.label || 'Courbe. Glissez pour le détail.'}"><div class="sp-read"><span>${opt.caption || ''}</span><b>${head}</b></div><div class="spark-plot" style="height:${H}px"><svg viewBox="0 0 ${W} ${H}" style="height:${H}px" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity="${g0}"/><stop offset=".6" stop-color="${color}" stop-opacity="${(g0 * .35).toFixed(3)}"/><stop offset="1" stop-color="${color}" stop-opacity="${g1}"/></linearGradient>${strokeDef}</defs>
    ${zoneBands}${bands}${grid.lines}${zero}${ref}${opt.noArea ? '' : `<path class="sp-area" d="${area}" fill="url(#${gid})"/>`}
    <path class="sp-dim" d="" fill="none" stroke="${stroke}" stroke-opacity="${opt.strokeGrad ? .35 : 1}" stroke-width="1.35" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>
    <path class="sp-line" d="${solid}" fill="none" stroke="${stroke}" stroke-width="${opt.sw || 1.35}" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>
    ${dash ? `<path class="sp-dash" d="${dash}" fill="none" stroke="${color}" stroke-width="1.35" stroke-dasharray="2.5 2.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>` : ''}
  </svg>${opt.zones ? zoneLabels : grid.labels}<i class="${dotCls}" style="left:${(last[0] / W * 100).toFixed(2)}%;top:${(last[1] / H * 100).toFixed(2)}%"></i>
  <div class="sp-tip" hidden><b></b><span></span></div>
  <div class="sp-hit" aria-hidden="true"></div></div><div class="sp-axis">${axis}</div></div>`;
}
function sparkLite(curve, color){
  if (!curve || curve.length < 2) return '';
  const delta = curve[curve.length - 1].v - curve[0].v;
  const fmt = Math.abs(delta).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  return curveChart(curve, { color, h: 86, fmt: 'day', caption: '30 jours', header: (delta >= 0 ? '+' : '−') + fmt, label: 'Solde sur 30 jours' });
}
function spendOf(tx){
  const from = day0(nowRef()).getTime() - 29 * DAY_MS;
  return tx.filter(x => x.amt < 0 && x.cat !== 'virement' && x.cat !== 'revenu' && +x.t >= from);
}
function flowBars(rows, color, word){
  const days = 30, t0 = day0(nowRef());
  const curve = [];
  for (let d = days - 1; d >= 0; d--){
    const start = t0.getTime() - d * DAY_MS;
    const v = sumEuros(rows.filter(x => +x.t >= start && +x.t < start + DAY_MS), x => Math.abs(x.amt));
    curve.push({ t: new Date(start + 12 * 3600000), v });
  }
  const total = sumEuros(curve, p => p.v);
  if (!total) return emptyState('search', word === 'Revenus' ? 'Aucun revenu' : 'Aucune dépense', 'Rien sur les 30 derniers jours.');
  const by = {};
  rows.forEach(x => { const k = x.cat || 'autre'; by[k] = (by[k] || 0) + Math.abs(x.amt); });
  const cats = Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `<span>${esc((CATS[k] || CATS.autre).l)} · ${v.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</span>`).join('');
  return curveChart(curve, { color, fmt: 'day', total, caption: '30 jours', label: word + ' sur 30 jours' }) + (cats ? `<div class="spend-cats">${cats}</div>` : '');
}
function spendBars(tx, color){ return flowBars(spendOf(tx), color, 'Dépenses'); }
function incomeOf(tx){
  const from = day0(nowRef()).getTime() - 29 * DAY_MS;
  return tx.filter(x => x.amt > 0 && x.cat === 'revenu' && +x.t >= from);
}
function incomeBars(tx){ return flowBars(incomeOf(tx), 'var(--up)', 'Revenus'); }
const DESK = {
  '24h': { label: '24 h', grain: 'hour', n: 24 },
  '1w': { label: '1 sem.', grain: 'day', n: 7 },
  '1m': { label: '1 mois', grain: 'day', n: 30 },
  '6m': { label: '6 mois', grain: 'month', n: 6 },
  '1y': { label: '1 an', grain: 'month', n: 12 },
  'all': { label: 'Tout', grain: 'month', n: 0 },
};
let deskRange = '1y';
const deskSpec = () => DESK[deskRange] || DESK['1y'];
const kEUR = n => Math.abs(Math.round(n)).toLocaleString('fr-FR') + ' €';
const sgnEUR = n => (n > 0 ? '+' : n < 0 ? '−' : '') + kEUR(n);
function deskWhen(fmt, t, partial){
  const s = fmt === 'hour' ? String(t.getHours()).padStart(2, '0') + ' h' : fmt === 'month' ? MOIS[t.getMonth()] + ' ' + t.getFullYear() : t.getDate() + ' ' + MOIS[t.getMonth()];
  return partial ? s + ' · estimation' : s;
}
function spendCat(e){
  return Cats.classify({
    name: e.name,
    amount: e.amt,
    hint: e.cat || (e.k === 'rent' ? 'logement' : e.k === 'sub' ? 'abo' : e.k === 'in' ? 'revenu' : ''),
  }, catOverrides());
}
function deskEvents(){
  if (LIVE) return ledger().tx.filter(x => x.cat !== 'virement').map(x => ({
    t: x.t, amt: x.amt, inc: x.cat === 'revenu' || x.amt > 0,
    k: x.cat === 'revenu' ? 'in' : x.cat === 'logement' ? 'rent' : x.cat === 'abo' ? 'sub' : 'spend',
    variable: x.amt < 0 && x.cat !== 'logement' && x.cat !== 'abo',
    cat: x.cat || 'autre'
  }));
  return timeline().ev.filter(e => e.k !== 'xfer').map(e => ({
    t: e.t, amt: e.amt, inc: e.k === 'in', k: e.k, variable: e.k === 'spend', cat: spendCat(e)
  }));
}
function deskBounds(now, ev){
  const spec = deskSpec();
  if (spec.grain === 'hour') {
    const endH = new Date(now); endH.setMinutes(0, 0, 0);
    return { from: new Date(endH.getTime() - 23 * 36e5), to: new Date(endH.getTime() + 36e5) };
  }
  if (spec.grain === 'day') {
    const endD = day0(now);
    return { from: new Date(endD.getTime() - (spec.n - 1) * DAY_MS), to: new Date(endD.getTime() + DAY_MS) };
  }
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  let n = spec.n;
  if (!n) {
    const oldest = (ev || deskEvents()).reduce((m, e) => Math.min(m, +e.t), +now);
    const o = new Date(oldest);
    n = Math.max(1, (end.getFullYear() - o.getFullYear()) * 12 + end.getMonth() - o.getMonth() + 1);
  }
  return { from: new Date(end.getFullYear(), end.getMonth() - (n - 1), 1), to: new Date(end.getFullYear(), end.getMonth() + 1, 1), months: n };
}
function rollup(ev, start, stop, now){
  let inc = 0, spend = 0, variable = 0, salary = false;
  for (const e of ev) {
    if (e.t < start || e.t >= stop || e.t > now) continue;
    if (e.inc) { inc += toCents(Math.abs(e.amt)); if (e.k === 'in') salary = true; }
    else if (e.amt < 0) { const c = toCents(-e.amt); spend += c; if (e.variable) variable += c; }
  }
  return { income: fromCents(inc), spend: fromCents(spend), variable: fromCents(variable), net: fromCents(inc - spend), salary };
}
function projectPartial(row, start, now){
  const dim = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
  const elapsed = Math.max(1, Math.min(dim, now.getDate()));
  if (LIVE) {
    const plotIncome = fromCents(Math.round(toCents(row.income) * dim / elapsed));
    const plotSpend = fromCents(Math.round(toCents(row.spend) * dim / elapsed));
    return { plotIncome, plotSpend, plotNet: fromCents(toCents(plotIncome) - toCents(plotSpend)) };
  }
  const extraInc = row.salary ? 0 : toCents(payOf(start.getFullYear(), start.getMonth()).euros);
  let extraSpend = now.getDate() < 5 ? toCents(RENT) : 0;
  active().forEach(s => { if ((s.day || 1) > now.getDate()) extraSpend += toCents(s.price); });
  const variablePace = Math.round(toCents(row.variable) * dim / elapsed);
  const plotSpend = fromCents(toCents(row.spend) - toCents(row.variable) + variablePace + extraSpend);
  const plotIncome = fromCents(toCents(row.income) + extraInc);
  return { plotIncome, plotSpend, plotNet: fromCents(toCents(plotIncome) - toCents(plotSpend)) };
}
function deskSeries(){
  const ev = deskEvents();
  const now = nowRef();
  const spec = deskSpec();
  const rows = [];
  const push = (start, stop, partial) => {
    const row = rollup(ev, start, stop, now);
    const plot = partial ? projectPartial(row, start, now) : { plotIncome: row.income, plotSpend: row.spend, plotNet: row.net };
    rows.push({ t: start, ...row, ...plot, partial });
  };
  if (spec.grain === 'hour') {
    const endH = new Date(now); endH.setMinutes(0, 0, 0);
    for (let i = 23; i >= 0; i--) { const start = new Date(endH.getTime() - i * 36e5); push(start, new Date(+start + 36e5), false); }
    return rows;
  }
  if (spec.grain === 'day') {
    const endD = day0(now);
    for (let i = spec.n - 1; i >= 0; i--) { const start = new Date(endD.getTime() - i * DAY_MS); push(start, new Date(+start + DAY_MS), false); }
    return rows;
  }
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  const n = deskBounds(now, ev).months;
  for (let i = n - 1; i >= 0; i--) {
    const start = new Date(end.getFullYear(), end.getMonth() - i, 1);
    const stop = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    push(start, stop, start.getFullYear() === now.getFullYear() && start.getMonth() === now.getMonth() && now < stop);
  }
  return rows;
}
function deskTitles(){
  const g = deskSpec().grain;
  if (g === 'hour') return { spend: 'Dépenses par heure', income: 'Rentrées par heure', net: 'Net par heure', fmt: 'hour' };
  if (g === 'day') return { spend: 'Dépenses par jour', income: 'Rentrées par jour', net: 'Net par jour', fmt: 'day' };
  return { spend: 'Dépenses mensuelles', income: 'Rentrées d’argent', net: 'Net', fmt: 'month' };
}
function monthBars(series, key, color){
  const plotKey = key === 'income' ? 'plotIncome' : 'plotSpend';
  const titles = deskTitles();
  const curve = series.map(s => ({ t: s.t, v: s[plotKey], partial: s.partial }));
  if (curve.length < 2) return '';
  const total = sumEuros(series, s => s[key]);
  const label = (key === 'income' ? titles.income : titles.spend) + (curve[curve.length - 1].partial ? '. Le dernier point est une estimation.' : '');
  return curveChart(curve, { color, h: 108, fmt: titles.fmt, total, header: kEUR(total), link: 'desk', slot: key, label });
}
function spendTV(series){
  const curve = series.map(s => ({ t: s.t, v: s.plotSpend, partial: s.partial }));
  if (curve.length < 2) return '';
  const total = sumEuros(series, s => s.spend);
  const avg = sumEuros(curve, p => p.v) / curve.length;
  return curveChart(curve, { color: '#F23645', h: 120, fmt: deskTitles().fmt, total, header: kEUR(total), link: 'desk', slot: 'spend', grad: [.42, 0], ref: avg, glow: true, tv: true, sw: 1.8, caption: 'Moyenne en pointillés', label: 'Dépenses. Glissez pour le détail.' });
}
function resteLine(series){
  if (series.length < 2) return '';
  const ev = deskEvents(), now = nowRef();
  const hourly = deskSpec().grain === 'hour';
  const step = hourly ? 36e5 : DAY_MS;
  const start = hourly ? +series[0].t : +day0(series[0].t);
  const stop = hourly ? +series[series.length - 1].t + 36e5 : +day0(now) + DAY_MS;
  const n = Math.max(2, Math.round((stop - start) / step));
  const delta = new Array(n).fill(0);
  for (const e of ev) {
    if (e.t > now || +e.t < start || +e.t >= stop) continue;
    const k = Math.floor((+e.t - start) / step);
    if (e.inc) delta[k] += toCents(Math.abs(e.amt)); else if (e.amt < 0) delta[k] -= toCents(-e.amt);
  }
  let acc = 0;
  const curve = [{ t: new Date(start), v: 0 }];
  for (let k = 0; k < n; k++) { acc += delta[k]; curve.push({ t: new Date(start + (k + 1) * step - 1), v: fromCents(acc) }); }
  const end = curve[curve.length - 1].v;
  return curveChart(curve, { color: '#089981', h: 120, fmt: hourly ? 'hour' : 'day', signed: true, zero: true, header: sgnEUR(end), grad: [.40, 0], glow: true, tv: true, sw: 1.6, caption: 'Depuis le début de la période', link: 'desk', slot: 'income', label: 'Reste disponible : vos rentrées moins vos dépenses, cumulées. Glissez pour le détail.' });
}
function prelevoIndex(){
  const ev = deskEvents(), now = nowRef();
  const b = deskBounds(now, ev);
  const end = day0(now);
  let start = day0(b.from);
  if ((+end - +start) / DAY_MS < 29) start = new Date(+end - 29 * DAY_MS);
  const nDays = Math.round((+end - +start) / DAY_MS) + 1;
  const base = +start - 29 * DAY_MS, tot = nDays + 29;
  const inc = new Array(tot).fill(0), out = new Array(tot).fill(0);
  for (const e of ev) {
    if (e.t > now) continue;
    const k = Math.floor((+day0(e.t) - base) / DAY_MS + .5);
    if (k < 0 || k >= tot) continue;
    if (e.inc) inc[k] += Math.abs(e.amt); else if (e.amt < 0) out[k] += -e.amt;
  }
  const curve = [];
  for (let d = 0; d < nDays; d++) {
    let a = 0, o = 0;
    for (let j = d; j < d + 30; j++) { a += inc[j]; o += out[j]; }
    curve.push({ t: new Date(+start + d * DAY_MS + 12 * 36e5), v: a + o > 0 ? Math.round(1000 * a / (a + o)) / 10 : 50 });
  }
  return curve;
}
const IDX_BLUES = ['#1E3A8A', '#2563EB', '#60A5FA', '#DBEAFE', '#FFFFFF'];
const IDX_ZONES = [
  { lo: 0, hi: 20, l: 'Très tendu', c: '#1E3A8A' },
  { lo: 20, hi: 40, l: 'Tendu', c: '#2563EB' },
  { lo: 40, hi: 60, l: 'Équilibré', c: '#60A5FA' },
  { lo: 60, hi: 80, l: 'Confortable', c: '#DBEAFE' },
  { lo: 80, hi: 100.01, l: 'Très confortable', c: '#FFFFFF' },
];
const idxZone = v => IDX_ZONES.find(z => v >= z.lo && v < z.hi) || IDX_ZONES[4];
function idxGauge(v){
  const cx = 120, cy = 112, r = 92;
  const pt = (val, rr) => { const a = Math.PI * (1 - val / 100); return [cx + rr * Math.cos(a), cy - rr * Math.sin(a)]; };
  const [kx, ky] = pt(v, r), z = idxZone(v);
  const ticks = [20, 40, 60, 80].map(t => { const [x1, y1] = pt(t, r - 12), [x2, y2] = pt(t, r + 12); return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#0B0E14" stroke-width="2.5"/>`; }).join('');
  return `<div class="pidx-gauge"><svg viewBox="0 0 240 130" aria-hidden="true">
    <defs><linearGradient id="idxarc" x1="${cx - r}" y1="0" x2="${cx + r}" y2="0" gradientUnits="userSpaceOnUse">${IDX_BLUES.map((c, i) => `<stop offset="${i / 4}" stop-color="${c}"/>`).join('')}</linearGradient>
    <filter id="idxglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs>
    <path d="M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}" fill="none" stroke="#1E222D" stroke-width="20" stroke-linecap="round"/>
    <path d="M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}" fill="none" stroke="url(#idxarc)" stroke-width="14" stroke-linecap="round"/>
    ${ticks}
    <circle cx="${kx.toFixed(1)}" cy="${ky.toFixed(1)}" r="11" fill="${z.c}" opacity=".55" filter="url(#idxglow)"/>
    <circle cx="${kx.toFixed(1)}" cy="${ky.toFixed(1)}" r="9" fill="#0B0E14" stroke="#FFFFFF" stroke-width="3"/>
    <circle cx="${kx.toFixed(1)}" cy="${ky.toFixed(1)}" r="4" fill="${z.c}"/>
  </svg><div class="pidx-center"><b>${Math.round(v)}</b><span>${z.l}</span></div></div>`;
}
function indexCard(){
  const curve = prelevoIndex();
  if (curve.length < 2) return '';
  const v = curve[curve.length - 1].v, z = idxZone(v);
  const dark = v < 40;
  return `${idxGauge(v)}
  <div class="pidx-row"><span class="pidx-pill" style="background:${z.c};color:${dark ? '#FFFFFF' : '#0B1A3A'}">${z.l}</span><b>${Math.round(v)} <small>/100</small></b></div>
`
    + curveChart(curve, { color: '#60A5FA', spk: z.c, strokeGrad: IDX_BLUES, padR: 84, zones: IDX_ZONES.map(x => ({ ...x, hi: Math.min(100, x.hi) })), h: 130, fmt: 'day', lo: 0, hi: 100, noArea: true, idx: true, glow: true, tv: true, sw: 1.8, header: '', caption: 'Sur 30 jours glissants', label: 'Indice Prelevo de 0 à 100. Glissez pour le détail.' })
    + `<div class="pidx-legend">${IDX_ZONES.map(x => `<span><i style="background:${x.c}"></i>${x.l}</span>`).join('')}</div>`;
}
function netLine(series){
  const titles = deskTitles();
  const curve = series.map(s => ({ t: s.t, v: s.plotNet, partial: s.partial }));
  if (curve.length < 2) return '';
  const net = sumEuros(series, s => s.net);
  const label = titles.net + (curve[curve.length - 1].partial ? '. Le dernier point est une estimation.' : '');
  return curveChart(curve, { color: net >= 0 ? 'var(--up)' : 'var(--down)', h: 108, fmt: titles.fmt, signed: true, zero: true, total: net, header: sgnEUR(net), link: 'desk', slot: 'net', label });
}
function posteRows(){
  const now = nowRef();
  const ev = deskEvents();
  const b = deskBounds(now, ev);
  const rows = ev.filter(e => !e.inc && e.amt < 0 && e.t >= b.from && e.t < b.to && e.t <= now);
  const by = {};
  rows.forEach(e => {
    if (e.cat === 'virement') return;
    const k = Cats.fold(e.cat || 'autre');
    if (k === 'revenu' || k === 'virement') return;
    by[k] = (by[k] || 0) + -e.amt;
  });
  const tops = Object.entries(by).sort((a, b) => b[1] - a[1]);
  if (!tops.length) return emptyState('search', 'Aucune dépense', 'Rien sur cette période.');
  return tops.map(([k, v]) => {
    const c = Cats.BY[k] || Cats.BY.autre;
    return `<div class="poste"><span><i class="poste-dot" style="background:${c.color}" aria-hidden="true"></i>${esc(c.l)}</span><b>${kEUR(v)}</b></div>`;
  }).join('');
}
screens.graphiques = () => {
  const hid = state.hideBalance;
  const series = deskSeries();
  const inc = sumEuros(series, s => s.income);
  const out = sumEuros(series, s => s.spend);
  const net = inc - out;
  const titles = deskTitles();
  const partial = series.length && series[series.length - 1].partial;
  const mo = MOIS_LONG[nowRef().getMonth()].toLowerCase();
  const ranges = Object.entries(DESK);
  return `
<div class="screen desk">
  <div class="topbar"><h1>Graphiques</h1>${demoTag}</div>
  <div class="tape">
    <div><span>Revenus</span><b class="up">${hid ? '••••' : kEUR(inc)}</b></div>
    <div><span>Dépenses</span><b class="down">${hid ? '••••' : kEUR(out)}</b></div>
    <div><span>Net</span><b class="${net >= 0 ? 'up' : 'down'}">${hid ? '••••' : sgnEUR(net)}</b></div>
  </div>
  <div class="tf desk-tf" role="tablist" aria-label="Période">${ranges.map(([k, s]) => `<button type="button" role="tab" data-desk="${k}" aria-selected="${deskRange === k}" class="${deskRange === k ? 'on' : ''}">${s.label}</button>`).join('')}</div>
  ${partial && !hid ? `<p class="desk-note">Le dernier point est une estimation : ${mo} n’est pas terminé.</p>` : ''}
  ${hid ? '<p class="insight">Graphiques masqués avec le solde.</p>' : `
  <p class="acct-k">${titles.spend}</p>
  <div class="panel spend-card tv-card">${spendTV(series)}</div>
  <p class="acct-k">Reste disponible</p>
  <div class="panel spend-card tv-card">${resteLine(series)}</div>
  <p class="acct-k pidx-title">Indice Prelevo <button type="button" class="pidx-i" data-pidx-info aria-expanded="false" aria-controls="pidx-info" aria-label="Qu’est-ce que l’Indice Prelevo ?">i</button></p>
  <div class="pidx-info" id="pidx-info" role="region" aria-label="Qu’est-ce que l’Indice Prelevo ?" hidden>
    <button type="button" class="pidx-x" data-pidx-info aria-label="Fermer">×</button>
    <b>Qu’est-ce que l’Indice Prelevo ?</b>
    <p>L’Indice Prelevo mesure l’équilibre de votre budget sur les 30 derniers jours. Il compare l’argent qui entre (salaire, remboursements…) à l’argent qui sort (dépenses, prélèvements).</p>
    <p><strong>Près de 100 :</strong> vous dépensez bien moins que ce qui rentre, votre budget respire.<br><strong>Autour de 50 :</strong> vos dépenses et vos rentrées s’équilibrent.<br><strong>Près de 0 :</strong> vos dépenses vont plus vite que vos rentrées, il est temps de lever le pied.</p>
    <p class="pidx-disc">C’est un repère, pas un conseil financier.</p>
  </div>
  <div class="panel spend-card tv-card">${indexCard()}</div>
  <p class="acct-k">${titles.net}</p>
  <div class="panel spend-card">${netLine(series)}</div>
  <p class="acct-k">Répartition · ${deskSpec().label}</p>
  <div class="panel postes">${posteRows()}</div>`}
</div>`;
};
const catChip = c => `<span class="cat cat-${c}" aria-hidden="true">⟦${(CATS[c] || CATS.autre).ic}⟧</span>`;
const MOIS_LONG = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
function txKind(x){
  if (x.cat === 'revenu' || x.amt > 0 && x.cat !== 'virement') return 'Reçu';
  if (x.cat === 'virement') return x.amt > 0 ? 'Virement reçu' : 'Virement';
  if (x.cat === 'abo' || x.sub) return 'Prélèvement';
  if (x.cat === 'retrait') return 'Retrait';
  return 'Paiement';
}
function catChipEl(c) {
  const span = document.createElement('span');
  const known = CATS[c] || CATS.autre;
  span.className = 'cat cat-' + (c || 'autre');
  span.setAttribute('aria-hidden', 'true');
  if (ICONS[known.ic]) span.innerHTML = SVG(ICONS[known.ic]);
  return span;
}
function txRowEl(x, pp) {
  const displayCat = x.cat === 'virement' ? 'virement' : Cats.fold(x.cat || 'autre');
  const mid = document.createElement('div');
  mid.className = 'mid';
  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = x.name || '';
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = pp ? (x.t.getDate() + ' ' + MOIS[x.t.getMonth()] + ' • ' + txKind(x)) : ((CATS[displayCat] || CATS.autre).l + (x.where ? ' · ' + x.where : ''));
  mid.append(name, meta);
  const amt = document.createElement('div');
  amt.className = 'amt' + (x.amt > 0 ? ' pos' : '');
  if (pp) amt.textContent = (x.amt > 0 ? '+' : '−') + eur(Math.abs(x.amt));
  else {
    amt.textContent = signed(x.amt);
    if (x.bank) amt.insertAdjacentHTML('beforeend', bankTile(x.bank, 'tx-bk'));
  }
  if (!pp) {
    const a = document.createElement('a');
    a.className = 'tx';
    a.href = x.sub ? '#/abo/' + x.sub : '#/operations';
    a.append(catChipEl(displayCat), mid, amt);
    return a;
  }
  const row = document.createElement('div');
  row.className = 'tx pp';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'cat cat-' + displayCat + ' cat-edit';
  btn.dataset.catEdit = '1';
  btn.dataset.catName = x.name || '';
  const current = Cats.BY[x.cat] ? x.cat : 'autre';
  btn.dataset.catCurrent = current;
  btn.style.setProperty('--cat-ink', Cats.color(displayCat === 'virement' ? 'autre' : displayCat));
  btn.setAttribute('aria-label', 'Catégorie : ' + (CATS[displayCat] || CATS.autre).l + '. Modifier');
  btn.setAttribute('aria-haspopup', 'dialog');
  if (ICONS[(CATS[displayCat] || CATS.autre).ic]) btn.innerHTML = SVG(ICONS[(CATS[displayCat] || CATS.autre).ic]);
  const a = document.createElement('a');
  a.className = 'tx-main';
  a.href = x.sub ? '#/abo/' + x.sub : '#/operations';
  a.append(mid, amt);
  row.append(btn, a);
  return row;
}
function groupTx(list, maxDays, maxRows, byMonth) {
  const groups = []; let rows = 0;
  for (const x of list) {
    const k = byMonth ? x.t.getFullYear() * 12 + x.t.getMonth() : day0(x.t).getTime();
    let g = groups[groups.length - 1];
    if (!g || g.k !== k) { if (groups.length >= maxDays || rows >= maxRows) break; g = { k, d: x.t, items: [] }; groups.push(g); }
    if (rows >= maxRows) break;
    g.items.push(x); rows++;
  }
  return groups;
}
function appendTxGroups(frag, list, maxDays, maxRows, byMonth) {
  for (const g of groupTx(list, maxDays, maxRows, byMonth)) {
    if (byMonth) {
      const sec = document.createElement('section');
      sec.className = 'mo';
      const h2 = document.createElement('h2');
      h2.textContent = MOIS_LONG[g.d.getMonth()];
      sec.appendChild(h2);
      g.items.forEach(x => sec.appendChild(txRowEl(x, true)));
      frag.appendChild(sec);
    } else {
      const day = document.createElement('div');
      day.className = 'day';
      const head = document.createElement('div');
      head.className = 'day-h';
      const left = document.createElement('span');
      left.textContent = dayLabel(g.d);
      const right = document.createElement('span');
      right.textContent = signed(sumEuros(g.items, x => x.amt));
      head.append(left, right);
      day.appendChild(head);
      g.items.forEach(x => day.appendChild(txRowEl(x, false)));
      frag.appendChild(day);
    }
  }
}
const _mounts = [];
let _mountN = 0;
function listSlot(className, builder, style) {
  const id = 'L' + (++_mountN);
  _mounts.push({ id, builder });
  return `<div class="${className}" data-list data-mount="${id}"${style ? ` style="${style}"` : ''}></div>`;
}
function onListClick(e) {
  const row = e.target.closest('[data-alert]');
  if (!row || !e.currentTarget.contains(row)) return;
  const id = row.getAttribute('data-alert');
  if (id && !state.readAlerts.includes(id)) { state.readAlerts.push(id); save(); }
}
function flushMounts() {
  const jobs = _mounts.splice(0);
  for (const job of jobs) {
    const host = document.querySelector('[data-mount="' + job.id + '"]');
    if (!host) continue;
    const frag = document.createDocumentFragment();
    job.builder(frag);
    host.appendChild(frag);
    if (host.classList.contains('cascade')) {
      host.querySelectorAll('.tx').forEach((el, i) => {
        if (i > 14) return;
        el.classList.add('cascade-item');
        el.style.setProperty('--i', String(i));
      });
    }
    host.addEventListener('click', onListClick);
  }
}
let _homeAnimated = QS.has('static');  // ?static=1 : sans animation (captures)
let _homeRaf = 0;
function animateHome(){
  const el = document.querySelector('[data-count]'); if (!el || state.hideBalance) return;
  if (_homeAnimated || matchMedia('(prefers-reduced-motion: reduce)').matches){ document.querySelector('.home')?.classList.add('static'); return; }
  _homeAnimated = true;
  const target = +el.dataset.count, t0 = performance.now(), dur = 750;
  const step = now => {
    if (!el.isConnected || el.dataset.scrub === '1') { _homeRaf = 0; return; }
    const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    el.innerHTML = money(target * (0.92 + 0.08 * e));
    if (p < 1) _homeRaf = requestAnimationFrame(step);
    else { _homeRaf = 0; el.innerHTML = money(target); }
  };
  _homeRaf = requestAnimationFrame(step);
  onLeave(() => { if (_homeRaf) cancelAnimationFrame(_homeRaf); _homeRaf = 0; });
}

screens.dashboard = () => {
  const t = (homeKpi = totals()), P = isP(), L = ledger(), al = alerts();
  const unread = al.filter(a => !state.readAlerts.includes(a.id)).length;
  const curve = homeCurve();
  const first = curve.length ? curve[0].v : L.total, delta = L.total - first;
  const pp = (delta / (Math.abs(first) || 1)) * 100;
  const ppTxt = (pp > 0 ? '+' : pp < 0 ? '−' : '') + Math.abs(pp).toLocaleString('fr-FR', { minimumFractionDigits:1, maximumFractionDigits:1 }) + ' %';
  const tf = homeTfMeta();
  const upSum = sumEuros(L.up, x => x.amt);
  const nextSub = L.up.find(x => x.sub);
  const banksN = L.banks.length;
  const prenom = USER.prenom ? ' ' + USER.prenom : '';
  return `
<div class="screen home ${_homeAnimated ? 'static' : ''}">
  ${brandBar(`<div class="top-acts"><a class="gear ai-entry" href="#/assistant" aria-label="Assistant Prelevo">⟦spark⟧</a><a class="gear" href="#/compte" aria-label="Mon compte">⟦user⟧</a></div>`)}
  <div class="home-body">
  <div class="greet rise" style="--d:0"><div class="g-row"><p class="g-day">${cap(JOURS[nowRef().getDay()])} ${nowRef().getDate()} ${MOIS[nowRef().getMonth()]}</p>
    <div class="g-tags"><span class="plan-pill ${P ? 'p' : ''}">${P ? 'Premium' : 'Gratuit'}</span>${demoTag}</div></div><h1>Bonjour${esc(prenom)}</h1></div>

  <section class="total rise" style="--d:1">
    <button type="button" class="sync-btn" id="home-sync" aria-label="Synchroniser vos comptes">⟦refresh⟧<span>Synchroniser</span></button>
    <div class="lbl">Solde total · ${L.nAcc} compte${L.nAcc > 1 ? 's' : ''}${banksN > 1 ? ' dans ' + banksN + ' banques' : ''}</div>
    <div class="amount-row">
      <div class="amount" data-count="${L.total.toFixed(2)}" ${state.hideBalance ? 'data-hidden="1"' : ''}>${state.hideBalance ? '<span class="masked">••••</span>' : money(L.total)}</div>
      <button type="button" class="eye" id="toggle-balance" role="switch" aria-checked="${state.hideBalance ? 'true' : 'false'}" aria-label="${state.hideBalance ? 'Afficher le solde' : 'Masquer le solde'}">⟦${state.hideBalance ? 'eyeoff' : 'eye'}⟧</button>
    </div>
    <div class="delta" id="sp-delta">${state.hideBalance ? 'Solde masqué' : `${delta >= 0 ? '⟦trend⟧' : ''}<b class="${delta >= 0 ? 'pos' : ''}">${signed(delta)}</b>${Math.abs(pp) >= 0.5 ? ` <i class="delta-pct ${delta >= 0 ? 'up' : 'down'}">${ppTxt}</i>` : ''} ${homeTf === 'TOUT' ? 'depuis le début' : 'sur ' + tf[2]}`}</div>
    <div class="tf" role="tablist" aria-label="Période du graphique" style="--tf-i:${Math.max(0, HOME_TF.findIndex(([k]) => k === homeTf))}"><i class="tf-pill" aria-hidden="true"></i>${HOME_TF.map(([k, lab]) => `<button type="button" role="tab" data-tf="${k}" aria-selected="${k === homeTf ? 'true' : 'false'}" class="${k === homeTf ? 'on' : ''}">${lab}</button>`).join('')}</div>
    ${spark(curve)}
    ${P ? `<a class="rav" href="#/abonnements"><span>Reste à vivre jusqu’à la paie</span><b>${state.hideBalance ? '<span class="masked">••••</span>' : eur(t.reste)}</b></a>`
        : `<a class="rav locked" href="#/premium"><span>⟦lock⟧ Reste à vivre jusqu’à la paie</span><b>Premium</b></a>`}
  </section>

  <div class="section-h rise" style="--d:2"><h2>Mes banques</h2><a href="#/banques">Gérer</a></div>
  <div class="bk-cards rise" style="--d:2">
    ${L.banks.map(b => `<a class="bk-card" href="#/banque/${b.id}" style="--bk:${/^#[0-9a-f]{6}$/i.test(b.color || '') ? b.color : '#0066FF'}">
      <div class="bc-top">${bankTile(b, 'bk-ini', b.status === 'error' ? '<i class="st err"></i>' : b.status === 'expired' ? '<i class="st warn"></i>' : '')}<span class="bc-n">${b.accs.length} compte${b.accs.length > 1 ? 's' : ''}</span></div>
      <div class="bc-name">${esc(b.name)}</div><div class="bc-bal">${state.hideBalance ? '<span class="masked">••••</span>' : eur(b.total)}</div>
      <div class="bc-meta ${b.status === 'error' ? 't-red' : ''}">${b.status === 'error' ? 'Synchro en échec' : b.status === 'expired' ? 'Session expirée' : 'À jour · ' + b.sync}</div></a>`).join('')}
    ${!LIVE && !P ? `<a class="bk-card add" href="#/premium">⟦plus⟧<span>Ajouter une banque</span><b>Premium</b></a>` : ''}
  </div>

  <div class="section-h rise" style="--d:2"><h2>Dépenses</h2><a href="#/graphiques">Mensuel</a></div>
  <div class="panel spend-card rise" style="--d:2">${state.hideBalance ? '<p class="insight">Graphique masqué avec le solde.</p>' : spendBars(L.tx, 'var(--accent)')}</div>
  <div class="section-h rise" style="--d:2"><h2>Revenus</h2><a href="#/graphiques">Mensuel</a></div>
  <div class="panel spend-card rise" style="--d:2">${state.hideBalance ? '<p class="insight">Graphique masqué avec le solde.</p>' : incomeBars(L.tx)}</div>

  <div class="section-h rise" style="--d:3"><h2>Dernières opérations</h2><a href="#/operations">Tout voir</a></div>
  ${L.tx.length ? listSlot('panel rise', frag => appendTxGroups(frag, L.tx, 3, 8, false), '--d:3') : `<div class="panel rise" style="--d:3">${emptyState('search', 'Aucune opération', 'Rien ces derniers jours. Synchronisez vos comptes pour mettre la liste à jour.')}</div>`}

  <div class="section-h rise" style="--d:2"><h2>À venir cette semaine</h2>${L.up.length ? `<span class="sec-sum">${signed(upSum)}</span>` : ''}</div>
  <div class="panel rise" style="--d:2">
    ${L.up.length ? `<p class="insight">${L.up.length} prélèvement${L.up.length > 1 ? 's' : ''} ${L.up.length > 1 ? 'vont' : 'va'} partir d’ici 7 jours${nextSub ? `, dont <b>${esc(nextSub.name)}</b> ${dayLabel(nextSub.t).toLowerCase()}` : ''}. Rien d’autre de prévu.</p>
      ${L.up.map(x => `<a class="tx up" href="${x.sub ? '#/abo/' + x.sub : '#/operations'}">${catChip(x.cat)}<div class="mid"><div class="name">${esc(x.name)}</div><div class="meta">${dayLabel(x.t)} · ${esc(x.where)}</div></div><div class="amt">${signed(x.amt)}</div></a>`).join('')}`
      : `<p class="insight">Aucun prélèvement prévu dans les 7 prochains jours. Profitez-en.</p>`}
  </div>

  <div class="section-h rise" style="--d:3"><h2>Mes comptes</h2><a href="#/banques">Gérer</a></div>
  <div class="panel accts rise" style="--d:3">
    ${L.banks.map(b => `<div class="bank-g">
      <a class="bank-h" href="#/banque/${b.id}">${bankTile(b, 'bk-ini', b.status === 'error' ? '<i class="st err"></i>' : b.status === 'expired' ? '<i class="st warn"></i>' : '')}
        <div class="mid"><div class="name">${esc(b.name)}</div><div class="meta ${b.status === 'error' ? 't-red' : ''}">${b.status === 'error' ? 'Synchro en échec · reconnecter' : b.status === 'expired' ? 'Session expirée' : 'À jour · ' + b.sync}</div></div>
        <div class="amt">${eur(b.total)}</div></a>
      ${b.accs.map(a => `<div class="acc ${a.counted === false ? 'off' : ''}"><span>${esc(a.name)}</span><span>${state.hideBalance ? '<span class="masked">••••</span>' : (a.currency && a.currency !== 'EUR' ? (a.balance || 0).toLocaleString('fr-FR', { minimumFractionDigits:2, maximumFractionDigits:2 }) + ' ' + esc(a.currency) : eur(a.balance))}</span></div>`).join('')}
    </div>`).join('')}
    ${!LIVE && !P ? `<a class="bank-add" href="#/premium">⟦plus⟧<span>Ajouter une banque</span><b>Premium</b></a>` : ''}
  </div>

  <a class="subs-card rise" style="--d:4" href="#/abonnements">
    <div class="sc-top">${catChip('abo')}<div class="mid"><div class="name">Transactions</div><div class="meta">${t.list.length} actif${t.list.length > 1 ? 's' : ''}${nextSub ? ' · prochain : ' + esc(nextSub.name) + ', ' + dayLabel(nextSub.t).toLowerCase() : ''}</div></div>
      <div class="amt">${eur(t.monthly)}<small>/mois</small></div></div>
    <div class="hchips">
      ${t.ups.length ? `<span class="hchip">⟦trend⟧ ${t.ups.length} hausse${t.ups.length > 1 ? 's' : ''}</span>` : ''}
      ${t.smalls.length ? `<span class="hchip">⟦search⟧ ${t.smalls.length} oublié${t.smalls.length > 1 ? 's' : ''}</span>` : ''}
      ${t.dups.length ? `<span class="hchip">⟦copy⟧ ${t.dups.length} doublon${t.dups.length > 1 ? 's' : ''}</span>` : ''}
      ${unread ? `<span class="hchip dark">⟦bell⟧ ${unread} alerte${unread > 1 ? 's' : ''}</span>` : ''}
      ${t.found ? (P ? `<span class="hchip blue">${eur(t.found)}/mois à économiser</span>` : `<span class="hchip blue">⟦lock⟧ ${eur(t.found)}/mois d’économies repérées</span>`) : ''}
    </div>
  </a>

  ${adSlot('dash')}

  ${neutral}
  </div>
</div>`;
};

let opsFilter = 'all';
let opsQuery = '';
function txActivity(){
  const L = ledger();
  const q = opsQuery.trim().toLowerCase();
  const list = L.tx.filter(x => {
    if (opsFilter === 'out' && x.amt >= 0) return false;
    if (opsFilter === 'in' && x.amt <= 0) return false;
    if (opsFilter === 'abo' && x.cat !== 'abo') return false;
    if (q && !x.name.toLowerCase().includes(q)) return false;
    return true;
  });
  const t = totals();
  return `
<div class="screen act">
  <div class="topbar"><h1>Transactions</h1><span class="tx-tools"><button type="button" class="tx-export" id="open-export" aria-label="Exporter les transactions en CSV">⟦download⟧</button>${demoTag}</span></div>
  <a class="tx-subs" href="#/abonnements?vue=recurrents"><span><b>Abonnements détectés</b><i>${t.list.length} actifs</i></span><strong>${eur(t.monthly)}<small>/mois</small></strong></a>
  <label class="tx-search">⟦search⟧<input id="tx-q" type="search" placeholder="Rechercher" aria-label="Rechercher une opération" value="${esc(opsQuery)}" autocomplete="off" enterkeyhint="search"></label>
  <div class="seg ops-seg four" role="tablist" aria-label="Filtrer les transactions">${[['all','Tout'],['out','Dépenses'],['in','Reçus'],['abo','Abos']].map(([k, l]) => `<button type="button" role="tab" aria-selected="${opsFilter === k}" class="${opsFilter === k ? 'on' : ''}" data-ops="${k}">${l}</button>`).join('')}</div>
  ${list.length ? listSlot('act-list cascade', frag => appendTxGroups(frag, list, 8, 240, true)) : `<div class="act-list">${emptyState('search', 'Aucune opération', q ? 'Aucun résultat pour cette recherche. Essayez un autre mot.' : 'Rien sur cette période.')}</div>`}
</div>`;
}
screens.operations = () => txActivity();
const PERIOD_DAYS = { week:7, month:30.4, quarter:91, year:365 };
const nextLive = s => { if (s.nextDate) return new Date(s.nextDate+'T12:00'); const d = new Date(s.lastDate+'T12:00'); const step = PERIOD_DAYS[s.cadence||'month']; while (d < new Date()) d.setTime(d.getTime() + step*864e5); return d; };
screens.abonnements = (q) => {
  if ((q.get('vue') || '') !== 'recurrents' && !q.get('f')) return txActivity();
  const t = totals(); const P = isP(); let f = q.get('f') || 'all';
  if (!P && f!=='all') f = 'all';
  let list = P ? t.list.filter(s=>!s.small) : t.list;
  if (f==='up') list = t.ups;
  if (f==='eco') list = t.list.filter(s=>increase(s)||s.small||t.dups.includes(s));
  const showSmall = P && (f==='all' || f==='small');
  if (f==='small') list = [];
  const subRowEl = s => {
    const d = nextDebit(s); const tone = tuneColor(s.color);
    const a = document.createElement('a');
    a.className = 'tx pp';
    a.href = '#/abo/' + s.id + '?vue=recurrents';
    const mark = document.createElement('span');
    mark.className = 'cat mark';
    mark.style.background = tone.bg;
    mark.style.color = tone.fg;
    mark.textContent = s.ini || '';
    const mid = document.createElement('div');
    mid.className = 'mid';
    const name = document.createElement('div');
    name.className = 'name';
    name.appendChild(document.createTextNode(s.name || ''));
    const badge = (cls, text, icon) => {
      const b = document.createElement('span');
      b.className = 'badge ' + cls;
      if (icon) b.appendChild(document.createRange().createContextualFragment(SVG(ICONS[icon])));
      b.appendChild(document.createTextNode(text));
      return b;
    };
    if (P) {
      if (increase(s)) name.appendChild(badge('b-red', '+' + pct(s) + ' %'));
      if (s.doubleCharge) name.appendChild(badge('b-red', '2×'));
      if (t.dups.includes(s)) name.appendChild(badge('b-blue', 'Doublon'));
      if (s.trial) name.appendChild(badge('b-amber', 'Essai'));
    } else if (increase(s) || s.small || s.doubleCharge || t.dups.includes(s)) name.appendChild(badge('b-lock', ' Alerte', 'lock'));
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = d.getDate() + ' ' + MOIS[d.getMonth()] + ' • ' + cap(FREQ[s.cadence || 'month'] || 'mensuel');
    mid.append(name, meta);
    const amt = document.createElement('div');
    amt.className = 'amt';
    amt.textContent = '−' + eur(s.price);
    a.append(mark, mid, amt);
    return a;
  };
  const chip = (k,l) => { const on = P ? f===k : k==='all'; const href = P ? `#/abonnements?vue=recurrents${k==='all'?'':'&f='+k}` : (k==='all'?'#/abonnements?vue=recurrents':'#/premium'); return `<a class="chip ${on?'on':''}" role="tab" aria-selected="${on}" href="${href}">${k==='all'||P?l:'⟦lock⟧ '+l.replace(/^\S+ /,'')}</a>`; };
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/abonnements">⟦back⟧</a><h1>Abonnements</h1>${demoTag}</div>
  <div class="card" style="display:flex;justify-content:space-between;align-items:center">
    <div><div class="muted small">Total mensuel</div><div style="font-size:26px;font-weight:650;letter-spacing:-.02em">${eur(t.monthly)}</div></div>
    <div style="text-align:right"><div class="muted small">Sur un an</div><div style="font-weight:700">${eur0(annual(t.monthly))}</div></div>
  </div>
  <div class="chips" role="tablist" aria-label="Filtrer les abonnements">${chip('all','Tous ('+t.list.length+')')}${chip('up','⟦trend⟧ Hausses ('+t.ups.length+')')}${chip('small','⟦search⟧ Oubliés ('+t.smalls.length+')')}${chip('eco','⟦coin⟧ À économiser')}</div>
  ${P?'':teaser(`${eur(t.found)}/mois d’économies repérées`, LIVE ? `${t.ups.length} hausse${t.ups.length>1?'s':''}, ${t.smalls.length} petit${t.smalls.length>1?'s':''} prélèvement${t.smalls.length>1?'s':''} sous 10 €` : `${t.ups.length} hausses, 1 doublon, 1 double prélèvement, ${t.smalls.length} oubliés`)}
  ${LIVE && LIVE.history && LIVE.history.limited ? `<div class="banner amber"><span class="ic">⟦info⟧</span><div><b>Historique court : détection partielle</b>La banque de test ne fournit que ${LIVE.history.days} jours d’opérations (${LIVE.history.debits} débits). Il faut au moins 2 prélèvements pour confirmer un abonnement : ceux vus une seule fois sont marqués « probable ».</div></div>` : ''}
  ${LIVE && !t.list.length ? emptyState('search', 'Aucun prélèvement récurrent', 'Rien de régulier pour le moment. Avec deux mois d’historique ou plus, la détection sera plus complète. Vos comptes restent en lecture seule.') : ''}
  ${P && t.ups.length && f==='all' ? `<div class="banner red"><span class="ic">⟦trend⟧</span><div><b>${t.ups.length} hausse${t.ups.length>1?'s':''} de prix détectée${t.ups.length>1?'s':''}</b>${t.ups.map(s=>`${esc(s.name)} : ${eur(s.prev)} → ${eur(s.price)}`).join(' · ')}. Soit ${eur(fromCents(toCents(sumEuros(t.ups, increase)) * 12))} de plus par an.</div></div>` : ''}
  ${list.length ? listSlot('act-list cascade', frag => { list.forEach(s => frag.appendChild(subRowEl(s))); }) : ((LIVE && !t.list.length) || (showSmall && t.smalls.length) ? '' : `<div class="act-list">${emptyState('search', f==='all' ? 'Aucun abonnement' : 'Rien dans ce filtre', f==='all' ? 'Dès qu’un prélèvement se répète, il apparaîtra ici.' : 'Essayez un autre filtre, ou revenez à Tous.')}</div>`)}
  ${adSlot('subs')}
  ${showSmall && t.smalls.length?`
  <div class="section-h"><h2>⟦search⟧ Petits prélèvements oubliés</h2><span class="muted small">${eur(sumEuros(t.smalls, s => s.price))}/mois</span></div>
  <p class="muted small" style="margin:-4px 2px 10px">Moins de ${LIVE?10:5} € chacun, mais ${eur0(fromCents(toCents(sumEuros(t.smalls, s => s.price)) * 12))} par an au total.</p>
  ${listSlot('act-list cascade', frag => { t.smalls.forEach(s => frag.appendChild(subRowEl(s))); })}`:''}
  ${state.resiliated.length?`<div class="section-h"><h2>⟦check⟧ Résiliés</h2></div><div class="card" style="padding:4px 16px">${SUBS.filter(s=>state.resiliated.includes(s.id)).map(s=>`<div class="row">${logo(s)}<div class="mid"><div class="name">${esc(s.name)}</div><div class="meta">Résiliation envoyée</div></div><div class="amt" style="color:var(--mint)">−${eur(s.price)}</div></div>`).join('')}</div>`:''}
</div>`;
};

screens.abo = (q, id) => {
  const s = byId(id); if (!s) return screens.abonnements(q);
  const backTo = q.get('vue') === 'recurrents' ? '#/abonnements?vue=recurrents' : '#/abonnements';
  const t = totals(); const P = isP(); const max = Math.max(...s.hist, 1); const done = state.resiliated.includes(s.id);
  const flagged = increase(s) || s.small || s.doubleCharge || t.dups.includes(s);
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="${backTo}">⟦back⟧</a>${demoTag}</div>
  <div class="detail-head">${logo(s)}
    <div class="muted small">${esc(s.cat)}</div>
    <div class="price">${eur(s.price)}<span class="muted" style="font-size:15px;font-weight:600"> /mois</span></div>
    <div style="margin-top:6px">${P ? `${increase(s)?`<span class="badge b-red">+${eur(increase(s))} (+${pct(s)} %)</span>`:''}${t.dups.includes(s)?'<span class="badge b-blue">Doublon avec '+esc(byId(s.duplicate).name)+'</span>':''}${s.small?'<span class="badge b-amber">Petit prélèvement oublié</span>':''}` : (flagged?lockBadge('1 alerte sur cet abonnement'):'')}${done?'<span class="badge b-green">Résiliation envoyée</span>':''}</div>
  </div>
  ${P ? `
  ${s.doubleCharge?`<div class="banner red"><span class="ic">⟦alert⟧</span><div><b>Prélevé deux fois le ${esc(s.doubleCharge)}</b>${eur(s.price)} en trop. On vous prépare la demande de remboursement.<br><a href="#" data-toast="Demande de remboursement prête (simulation)" style="font-weight:700;text-decoration:underline">Demander le remboursement</a></div></div>`:''}
  ${increase(s)?`<div class="banner red"><span class="ic">⟦trend⟧</span><div><b>Hausse de prix détectée</b>Vous payiez ${eur(s.prev)}. Cette hausse vous coûte ${eur(annual(increase(s)))} de plus par an.</div></div>`:''}
  ${s.note?`<div class="banner amber"><span class="ic">⟦info⟧</span><div><b>${esc(s.note)}</b>${eur(annual(s.price))} par an pour un service que vous avez peut-être oublié.</div></div>`:''}
  ${s.tip?`<div class="banner blue"><span class="ic">⟦info⟧</span><div>${esc(s.tip)} <i>(Conseil neutre : aucun sponsor derrière ce conseil.)</i></div></div>`:''}` : (flagged ? teaser('Une alerte attend sur cet abonnement', 'Hausse, doublon ou oubli : découvrez-la en Premium') : '')}
  <div class="card">
    <div style="font-weight:700;margin-bottom:4px">Historique des prélèvements</div>
    <div class="chart">${s.hist.map((v,i)=>`<div class="col ${P&&i>0&&v>s.hist[i-1]?'up':''}"><span>${v?v.toFixed(2).replace('.',','):'–'}</span><i style="height:${Math.max(4,v/max*70)}px"></i>${MONTHS[i]}</div>`).join('')}</div>
  </div>
  <div class="card" style="padding:4px 16px">
    <div class="kv"><span>Prochain prélèvement</span><span>${s.live ? (s.confirmed||s.nextDate ? '' : '≈ ') + (d => d.toLocaleDateString('fr-FR', d.getFullYear() === new Date().getFullYear() ? {day:'numeric',month:'short'} : {day:'numeric',month:'short',year:'numeric'}))(nextLive(s)) : `${s.day} ${s.day>=9?'oct.':'nov.'}`}</span></div>
    <div class="kv"><span>Rappel avant prélèvement</span><span>${P?'la veille ⟦bell⟧':'⟦lock⟧ Premium'}</span></div>
    <div class="kv"><span>Coût sur un an</span><span>${eur(annual(s.price))}</span></div>
    <div class="kv"><span>Client depuis</span><span>${esc(s.since || '—')}</span></div>
    ${s.live ? `<div class="kv"><span>Libellé bancaire</span><span class="small">${esc(s.label)}</span></div>
    <div class="kv"><span>Dernier prélèvement</span><span>${new Date(s.lastDate+'T12:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}</span></div>
    <div class="kv"><span>Fréquence</span><span>${eur(s.amount)} ${esc(s.cadenceLabel)}${s.variable?' (variable)':''}</span></div>
    <div class="kv"><span>Détection</span><span>${s.confirmed ? `Récurrent confirmé (${s.count}×)` : 'Probable (1×)'}</span></div>
    ${s.duplicate?`<div class="kv"><span>Doublon possible</span><span>même usage que ${esc(s.dupOf)}</span></div>`:''}` : ''}
  </div>
  ${done?`<a class="btn ghost" href="${backTo}">Retour</a>` : P ? `
  <a class="btn danger" href="#/resilier/${s.id}/1">⟦scissors⟧ Résilier cet abonnement</a>
  ${(state.kept || []).includes(s.id) ? `<p class="muted small center" style="margin-top:12px">Vous ne recevez plus d’alerte pour celui-ci.</p>` : `<button type="button" class="btn ghost" id="keep" data-id="${s.id}">Je le garde, ne plus m’alerter</button>`}` : `
  <a class="btn danger locked-btn" href="#/premium">⟦lock⟧ Résiliation guidée · Premium</a>
  <p class="muted small center" style="margin-top:10px">Lettre prête, démarches pas à pas et suivi jusqu’à l’arrêt du prélèvement. Premium ${prix(CFG.priceMonth)}/mois · ${CFG.trial}.</p>`}
</div>`;
};

const resil = { method:'lettre' };
screens.resilier = (q, id, step) => {
  const s = byId(id); if (!s) return screens.abonnements(q);
  if (!isP()) return screens.premium(q);
  step = +step || 1;
  const steps = `<div class="steps">${[1,2,3].map(i=>`<i class="${i<=step?'on':''}"></i>`).join('')}</div>`;
  const head = `<div class="topbar"><a class="back" href="${step===1?'#/abo/'+s.id:'#/resilier/'+s.id+'/'+(step-1)}">⟦back⟧</a><span class="muted small">Étape ${Math.min(step,3)} sur 3</span>${demoTag}</div>`;
  if (step===1) return `
<div class="screen">${head}${steps}
  <h1 style="font-size:23px;letter-spacing:-.02em">Résilier ${esc(s.name)}</h1>
  <p class="muted small" style="margin:6px 0 16px">Choisissez comment vous voulez résilier. On prépare tout pour vous.</p>
  ${[
    ['lettre','⟦mail⟧','Lettre de résiliation','Lettre prête à imprimer ou à envoyer en recommandé'],
    ['email','⟦mail⟧','E-mail au service client','Texte prêt à copier-coller'],
    ['enligne','⟦globe⟧','En ligne en 3 clics', cancelInfo(s).online ? cancelInfo(s).where : 'Non proposé par ce service'],
  ].map(([k,ic,b,sp])=>`<button class="option ${resil.method===k?'on':''}" data-method="${k}" ${k==='enligne'&&!cancelInfo(s).online?'disabled style="opacity:.5"':''}><span class="ic">${ic}</span><div><b>${b}</b><span>${esc(sp)}</span></div></button>`).join('')}
  <div class="card" style="padding:4px 16px"><div class="kv"><span>Comment résilier</span><span style="text-align:right;max-width:58%">${esc(cancelInfo(s).where)}</span></div><div class="kv"><span>Préavis</span><span style="text-align:right;max-width:58%">${esc(cancelInfo(s).notice)}</span></div></div>
  ${cancelInfo(s).url ? `<a class="btn ghost" href="${esc(cancelInfo(s).url)}" target="_blank" rel="noopener">⟦globe⟧ Page officielle de résiliation ${esc(cancelInfo(s).brand)}</a>` : `<p class="muted small" style="margin:0 2px 12px">Pas de page de résiliation en ligne connue pour ce service : la lettre préremplie est la voie la plus sûre.</p>`}
  <details class="fold">
    <summary>Les étapes</summary>
    <div class="fold-body"><div class="fold-clip"><ol class="cancel-steps">${(cancelInfo(s).url ? [`Ouvrez la page officielle ${esc(cancelInfo(s).brand)} et connectez-vous.`, `Suivez : ${esc(cancelInfo(s).where)}.`, 'Gardez l’e-mail de confirmation, puis revenez confirmer ici.'] : ['Choisissez la lettre (ou l’e-mail) : tout est prérempli.', 'Envoyez-la en recommandé avec accusé de réception.', 'Revenez confirmer ici : on surveille que le prélèvement s’arrête.']).map(x=>`<li>${x}</li>`).join('')}</ol></div></div>
  </details>
  <div class="banner blue"><span class="ic">⟦info⟧</span><div>Pour un contrat souscrit en ligne, la loi impose au service de proposer une résiliation en ligne simple (« résiliation en 3 clics »).</div></div>
  <a class="btn" href="#/resilier/${s.id}/2">Continuer</a>
</div>`;
  if (step===2) {
    const today = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
    const letter = resil.method==='email'
? `Objet : Demande de résiliation – ${s.name}

Bonjour,

Je vous demande par la présente de résilier mon abonnement ${s.name} (identifiant client : ${LIVE ? '[votre numéro client]' : 'EX-' + s.id.toUpperCase() + '-0042'}), à compter de la prochaine échéance, conformément aux conditions générales.

Merci de me confirmer la prise en compte de cette demande et la date effective de fin de contrat, et de cesser tout prélèvement à compter de cette date.

Cordialement,
${USER.prenom} ${USER.nom}`
: `${USER.prenom} ${USER.nom}
${USER.adresse}

Service clients ${s.name}
Adresse du service résiliation

Paris, le ${today}

Objet : Résiliation de mon abonnement
Réf. client : ${LIVE ? '[votre numéro client]' : 'EX-' + s.id.toUpperCase() + '-0042'}
Lettre recommandée avec accusé de réception

Madame, Monsieur,

Par la présente, je vous informe de ma volonté de résilier mon abonnement ${s.name}${s.since ? ', souscrit en ' + s.since + ',' : ''} à compter de la prochaine échéance (${cancelInfo(s).notice.toLowerCase()}).

Je vous remercie de bien vouloir me confirmer la date effective de résiliation et de cesser tout prélèvement à compter de cette date.

Veuillez agréer, Madame, Monsieur, l’expression de mes salutations distinguées.

${USER.prenom} ${USER.nom}`;
    return `
<div class="screen">${head}${steps}
  <h1 style="font-size:23px;letter-spacing:-.02em">Votre ${resil.method==='email'?'demande':'lettre'} est prête</h1>
  <p class="muted small" style="margin:6px 0 14px">Vérifiez les informations, tout est prérempli.</p>
  ${resil.method==='enligne'
    ? `<div class="card"><b>Résiliez directement chez ${esc(s.name)}</b><p class="muted small" style="margin-top:6px">Chemin : ${esc(cancelInfo(s).where)}</p><p class="muted small" style="margin-top:6px">On vous guide écran par écran, puis vous revenez confirmer ici.</p>${cancelInfo(s).url ? `<a class="btn" style="margin-top:12px" href="${esc(cancelInfo(s).url)}" target="_blank" rel="noopener">⟦globe⟧ Ouvrir la page officielle</a>` : ''}</div>`
    : `<div class="letter">${esc(letter)}</div>`}
  <div class="btn-pair">
    <button class="btn ghost" id="copy-letter">⟦copy⟧ Copier</button>
    <button class="btn ghost" id="print-letter">⟦download⟧ Imprimer / PDF</button>
  </div>
  <a class="btn" href="#/resilier/${s.id}/3">C’est envoyé</a>
  <a class="help-link" href="#/chat">⟦user⟧ Un doute ? Un humain vous aide à rédiger</a>
</div>`;
  }
  if (step===3) return `
<div class="screen">${head}${steps}
  <h1 style="font-size:23px;letter-spacing:-.02em">Dernière vérification</h1>
  <p class="muted small" style="margin:6px 0 16px">On surveille votre compte pour vous.</p>
  <div class="card" style="padding:4px 16px">
    <div class="kv"><span>⟦check⟧ Demande envoyée</span><span>${new Date().toLocaleDateString('fr-FR')}</span></div>
    <div class="kv"><span>⟦clock⟧ Confirmation attendue</span><span>sous 10 jours</span></div>
    <div class="kv"><span>⟦bell⟧ On vous alerte si</span><span style="text-align:right;max-width:55%">un nouveau prélèvement ${esc(s.name)} passe malgré tout</span></div>
  </div>
  <div class="banner green"><span class="ic">⟦coin⟧</span><div><b>${eur(s.price)} économisés par mois</b>soit ${eur(annual(s.price))} sur un an.</div></div>
  <button class="btn mint" id="confirm-resil" data-id="${s.id}">Confirmer la résiliation</button>
</div>`;
  return `
<div class="screen"><div class="success">
  <div class="ok">⟦check⟧</div>
  <h1 style="font-size:24px">Bien joué ${esc(USER.prenom)} !</h1>
  <p class="muted" style="margin:8px 0 6px">${esc(s.name)} est en cours de résiliation.</p>
  <p style="font-size:30px;font-weight:650;color:var(--mint);margin:14px 0 2px">+${eur(annual(s.price))}</p>
  <p class="muted small">économisés sur un an</p>
</div>
<a class="btn" href="#/dashboard">Voir mes économies</a>
<a class="btn ghost" href="#/abonnements?vue=recurrents&f=eco">Continuer à faire le ménage</a>
</div>`;
};

// ---------- Export CSV et budget mensuel (centimes entiers, bus Store) ----------
const BUDGET_KEY = 'prelevo-budget';
const BUDGET_CATS = Cats.SPEND;
let exportPeriod = 'month';

function centsOf(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}
function parseEuroToCents(raw) {
  let s = String(raw == null ? '' : raw).trim().replace(/[\s\u00A0\u202F]/g, '');
  if (!s) return 0;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  const cents = toCents(s);
  if (cents > 1000000000) return null;
  return cents;
}
function centsToField(c) {
  if (!c) return '';
  const euros = Math.floor(c / 100);
  const dec = c % 100;
  return dec ? euros + ',' + String(dec).padStart(2, '0') : String(euros);
}
function readBudget() {
  const raw = Store.readJSON(BUDGET_KEY, null);
  const cats = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { global: 0, cats };
  if (raw.cats && typeof raw.cats === 'object') {
    Object.keys(raw.cats).forEach(k => {
      const id = Cats.fold(k);
      if (!BUDGET_CATS.includes(id)) return;
      const c = centsOf(raw.cats[k]);
      if (c) cats[id] = (cats[id] || 0) + c;
    });
  }
  return { global: centsOf(raw.global), cats };
}
function monthWindow(ref) {
  const start = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 1);
  return { start, end };
}
function spendCents(list) {
  let total = 0;
  for (const x of list) total += Math.abs(toCents(x.amt));
  return total;
}
function monthMoves(ref) {
  const win = monthWindow(ref || nowRef());
  return ledger().tx.filter(x => x.amt < 0 && x.cat !== 'virement' && x.t >= win.start && x.t < win.end);
}
function budgetStatus() {
  const budget = readBudget();
  const ref = nowRef();
  const moves = monthMoves(ref);
  const byCat = {};
  moves.forEach(x => {
    const k = Cats.fold(x.cat);
    if (k === 'revenu' || k === 'virement' || !BUDGET_CATS.includes(k)) return;
    byCat[k] = (byCat[k] || 0) + Math.abs(toCents(x.amt));
  });
  const ym = ref.getFullYear() + '-' + String(ref.getMonth() + 1).padStart(2, '0');
  return { global: budget.global, cats: budget.cats, spent: spendCents(moves), byCat, ref, ym, monthLabel: MOIS_LONG[ref.getMonth()] + ' ' + ref.getFullYear() };
}
function publishBudget() { Store.emit('budget', budgetStatus()); }
function budgetLevel(spent, budget) {
  if (!(budget > 0)) return 0;
  if (spent >= budget) return 100;
  if (spent * 5 >= budget * 4) return 80;
  return 0;
}
function pctOf(spent, budget) { return budget > 0 ? Math.floor(spent * 100 / budget) : 0; }
function budgetAlertRows() {
  let st;
  try { st = budgetStatus(); } catch (e) { return []; }
  const rows = [];
  const push = (id, title, text, pct) => rows.push({
    id, kind:'budget', set:'budget', ic:'⟦coin⟧', amt: pct + ' %',
    title, text, when:'Aujourd’hui', link:'#/budget', premium:false, group:'Aujourd’hui'
  });
  const g = budgetLevel(st.spent, st.global);
  if (g) push('bud-' + st.ym + '-g-' + g, 'Budget du mois',
    g === 100 ? 'Vous avez atteint 100 % de votre budget mensuel.' : 'Vous avez atteint 80 % de votre budget mensuel.',
    pctOf(st.spent, st.global));
  BUDGET_CATS.forEach(k => {
    const cap = st.cats[k];
    const spent = st.byCat[k] || 0;
    const lv = budgetLevel(spent, cap);
    if (!lv) return;
    const name = (CATS[k] || CATS.autre).l;
    push('bud-' + st.ym + '-' + k + '-' + lv, 'Budget ' + name,
      lv === 100 ? 'Vous avez atteint 100 % du budget ' + name + '.' : 'Vous avez atteint 80 % du budget ' + name + '.',
      pctOf(spent, cap));
  });
  return rows;
}
function budgetTrack(label, spent, budget) {
  const pct = pctOf(spent, budget);
  const lv = budgetLevel(spent, budget);
  const cls = lv === 100 ? ' over' : lv === 80 ? ' warn' : '';
  const left = budget - spent;
  const rest = left >= 0 ? 'Reste ' + eur(fromCents(left)) : 'Dépassé de ' + eur(fromCents(-left));
  return `<div class="bh"><span>${esc(label)}</span><b>${eur(fromCents(spent))} / ${eur(fromCents(budget))}</b></div>
    <div class="budget-track${cls}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.min(100, pct)}" aria-label="${esc(label)}, ${pct} pour cent"><i style="width:${Math.min(100, pct)}%"></i></div>
    <div class="budget-legend"><span>${pct} % dépensé</span><span>${rest}</span></div>`;
}
function budgetCard() {
  let st;
  try { st = budgetStatus(); } catch (e) { return ''; }
  const cats = Object.keys(st.cats);
  if (!st.global && !cats.length) return `<a class="budget-card budget-empty" href="#/budget"><b>Budget mensuel</b><span>Fixez un plafond global et, si vous le souhaitez, un plafond par catégorie. Une alerte vous prévient à 80 % et à 100 %.</span></a>`;
  if (st.global) return `<a class="budget-card" href="#/budget">${budgetTrack('Budget · ' + st.monthLabel, st.spent, st.global)}</a>`;
  let worst = cats[0];
  cats.forEach(k => { if (pctOf(st.byCat[k] || 0, st.cats[k]) > pctOf(st.byCat[worst] || 0, st.cats[worst])) worst = k; });
  return `<a class="budget-card" href="#/budget">${budgetTrack((CATS[worst] || CATS.autre).l, st.byCat[worst] || 0, st.cats[worst])}</a>`;
}
function budRow(k, st) {
  const name = (CATS[k] || CATS.autre).l;
  const spent = st.byCat[k] || 0;
  return `<label class="bud-row"><span class="bud-lab">${esc(name)}<small>${spent ? 'Dépensé : ' + eur(fromCents(spent)) : 'Rien ce mois-ci'}</small></span><input name="cat-${k}" inputmode="decimal" enterkeyhint="done" autocomplete="off" placeholder="—" aria-label="Budget ${esc(name)} en euros" value="${esc(centsToField(st.cats[k] || 0))}"><span class="bud-eur">€</span></label>`;
}
screens.budget = () => {
  const st = budgetStatus();
  const active = BUDGET_CATS.filter(k => (st.byCat[k] || 0) > 0 || st.cats[k]);
  const shown = active.length ? active : BUDGET_CATS.slice(0, 4);
  const rest = BUDGET_CATS.filter(k => !shown.includes(k));
  const bars = [
    st.global ? `<div class="budget-card">${budgetTrack('Budget · ' + st.monthLabel, st.spent, st.global)}</div>` : '',
    ...Object.keys(st.cats).map(k => `<div class="budget-card">${budgetTrack((CATS[k] || CATS.autre).l, st.byCat[k] || 0, st.cats[k])}</div>`)
  ].filter(Boolean).join('');
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/alertes">⟦back⟧</a><h1>Budget</h1>${demoTag}</div>
  <p class="bud-lead">Fixez le plafond du mois. Les dépenses déjà passées en ${esc(st.monthLabel.toLowerCase())} sont comparées à ce plafond. Une alerte apparaît à 80 % et à 100 %.</p>
  ${bars}
  <form id="budget-form">
    <label class="bud-global"><span>Budget global</span><span class="bud-field"><input id="bud-global" name="global" inputmode="decimal" enterkeyhint="done" autocomplete="off" placeholder="0,00" aria-label="Budget global en euros" value="${esc(centsToField(st.global))}"><i>€</i></span></label>
    <p class="acct-k">Par catégorie <i class="bud-opt">facultatif</i></p>
    <div class="menu-card bud-card">${shown.map(k => budRow(k, st)).join('')}</div>
    ${rest.length ? `<details class="bud-more fold"><summary>Autres catégories</summary><div class="fold-body"><div class="fold-clip"><div class="menu-card bud-card">${rest.map(k => budRow(k, st)).join('')}</div></div></div></details>` : ''}
    <button class="btn" type="submit">Enregistrer le budget</button>
  </form>
</div>`;
};
function saveBudgetFromForm(form) {
  const globalEl = form.elements.namedItem('global');
  const global = parseEuroToCents(globalEl && globalEl.value);
  if (global == null) return toast('Indiquez un budget global valide, par exemple 1 200 ou 1 200,50.');
  const cats = {};
  for (const k of BUDGET_CATS) {
    const input = form.elements['cat-' + k];
    if (!input) continue;
    const cents = parseEuroToCents(input.value);
    if (cents == null) return toast('Le budget ' + (CATS[k] || CATS.autre).l + ' n’est pas un montant valide.');
    if (cents > 0) cats[k] = cents;
  }
  Store.writeJSON(BUDGET_KEY, { global, cats });
  publishBudget();
  toast(global || Object.keys(cats).length ? 'Budget enregistré.' : 'Budget mensuel retiré.');
  render();
}

function pad2(n) { return String(n).padStart(2, '0'); }
function frDate(d) { return pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear(); }
function frAmountCsv(n) {
  const c = toCents(n);
  const sign = c < 0 ? '-' : '';
  const abs = Math.abs(c);
  return sign + Math.floor(abs / 100) + ',' + pad2(abs % 100);
}
function csvCell(v) {
  const s = String(v == null ? '' : v);
  return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function exportRange(key) {
  const now = nowRef();
  const endToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  if (key === 'prev') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { start, end, label: 'Mois dernier' };
  }
  if (key === '30' || key === '90') {
    const days = key === '30' ? 29 : 89;
    const start = new Date(endToday);
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);
    return { start, end: endToday, label: key === '30' ? '30 derniers jours' : '90 derniers jours' };
  }
  if (key === 'all') return { start: new Date(2000, 0, 1), end: endToday, label: 'Tout l’historique' };
  return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: endToday, label: 'Ce mois-ci' };
}
function txInRange(range) {
  return ledger().tx.filter(x => x.t >= range.start && x.t <= range.end).slice().sort((a, b) => a.t - b.t);
}
function csvFor(rows) {
  const head = ['Date', 'Libellé', 'Catégorie', 'Montant (€)', 'Compte'];
  const lines = [head.join(';')];
  rows.forEach(x => {
    const cat = (CATS[x.cat] || CATS.autre).l;
    const account = x.where || (x.bank && x.bank.name) || '';
    lines.push([frDate(x.t), x.name || '', cat, frAmountCsv(x.amt), account].map(csvCell).join(';'));
  });
  return lines.join('\r\n');
}
function exportFileName(range) {
  const d = range.end;
  return 'prelevo-transactions-' + pad2(d.getDate()) + '-' + pad2(d.getMonth() + 1) + '-' + d.getFullYear() + '.csv';
}
function isIosSafari() {
  const ua = navigator.userAgent || '';
  const iOS = /iP(hone|ad|od)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return iOS && /WebKit/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
}
function canShareFile(file) {
  try { return !!(navigator.canShare && navigator.canShare({ files: [file] })); }
  catch (e) { return false; }
}
function openCsvBlob(blob) {
  const url = URL.createObjectURL(blob);
  const opened = window.open(url, '_blank');
  if (!opened) location.assign(url);
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
function deliverCsv(filename, body, count) {
  const blob = new Blob(['\uFEFF' + body], { type: 'text/csv;charset=utf-8' });
  const file = new File([blob], filename, { type: 'text/csv' });
  const n = count || 0;
  const nToast = () => n + ' opération' + (n > 1 ? 's' : '') + ' exportée' + (n > 1 ? 's' : '') + '.';
  if (isIosSafari() && navigator.share) {
    const shareFile = canShareFile(file) ? file : new File([blob], filename, { type: 'text/plain' });
    const can = canShareFile(shareFile);
    if (can) {
      navigator.share({ files: [shareFile], title: 'Transactions ' + APP_NAME }).then(() => toast(nToast())).catch(err => {
        if (err && err.name === 'AbortError') return;
        openCsvBlob(blob);
        toast('Export ouvert. Vous pouvez l’enregistrer ou le partager.');
      });
      return;
    }
    openCsvBlob(blob);
    toast('Export ouvert. Vous pouvez l’enregistrer ou le partager.');
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  toast(nToast());
}
function runExport() {
  const range = exportRange(exportPeriod);
  const rows = txInRange(range);
  if (!rows.length) return toast('Aucune opération sur cette période.');
  deliverCsv(exportFileName(range), csvFor(rows), rows.length);
}
screens.export = () => {
  const opts = [['month','Ce mois-ci'],['prev','Mois dernier'],['30','30 derniers jours'],['90','90 derniers jours'],['all','Tout l’historique']];
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/abonnements">⟦back⟧</a><h1>Exporter</h1>${demoTag}</div>
  <p class="bud-lead">Choisissez la période. Le fichier est en CSV, séparateur point-virgule, dates au format JJ/MM/AAAA et montants avec une virgule. Il s’ouvre dans Excel.</p>
  ${opts.map(([k, lab]) => {
    const n = txInRange(exportRange(k)).length;
    const detail = n ? n + ' opération' + (n > 1 ? 's' : '') : 'Aucune opération';
    return `<button type="button" class="option ${exportPeriod === k ? 'on' : ''}" data-export-period="${k}"><span class="ic">⟦calendar⟧</span><div><b>${lab}</b><span>${detail}</span></div></button>`;
  }).join('')}
  <button type="button" class="btn" id="do-export">⟦download⟧ Exporter en CSV</button>
</div>`;
};

screens.alertes = (q) => {
  const al = alerts(); const P = isP();
  const f = (q && q.get('f')) || 'all';
  const match = a => f === 'all' || a.kind === f || (f === 'dup' && a.kind === 'dbl') || (f === 'next' && (a.kind === 'trial' || a.kind === 'low'));
  const shown = al.filter(match);
  const free = shown.filter(a => !a.premium), prem = shown.filter(a => a.premium);
  const visible = P ? shown : free;
  const unread = al.filter(a => !state.readAlerts.includes(a.id)).length;
  const alertRowEl = a => {
    const row = document.createElement('a');
    row.className = 'tx pp al-row' + (state.readAlerts.includes(a.id) ? '' : ' unread');
    row.href = a.link || '#/alertes';
    if (a.id) row.dataset.alert = a.id;
    const cat = document.createElement('span');
    cat.className = 'cat';
    cat.innerHTML = icons(a.ic || '');
    const mid = document.createElement('div');
    mid.className = 'mid';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = a.title || '';
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = a.text || '';
    mid.append(name, meta);
    row.append(cat, mid);
    if (a.amt) { const amt = document.createElement('div'); amt.className = 'amt'; amt.textContent = a.amt; row.appendChild(amt); }
    return row;
  };
  const appendAlertGroups = (frag, rows) => {
    const order = ['Aujourd’hui', 'Cette semaine', 'Plus tôt'];
    order.forEach(g => {
      const items = rows.filter(a => a.group === g);
      if (!items.length) return;
      const sec = document.createElement('section');
      sec.className = 'mo';
      const h2 = document.createElement('h2');
      h2.textContent = g;
      sec.appendChild(h2);
      items.forEach(a => sec.appendChild(alertRowEl(a)));
      frag.appendChild(sec);
    });
  };
  const chip = (k, l) => `<button type="button" role="tab" aria-selected="${f === k}" class="${f === k ? 'on' : ''}" data-af="${k}">${l}</button>`;
  const tog = (k, lab, open) => { const locked = !open && !P; const on = alertOn(k); return `<button type="button" class="acct-row" data-alert-set="${k}" ${locked ? `aria-label="${lab}, réservé à Premium"` : `role="switch" aria-checked="${on}"`}><span class="acct-lab">${lab}</span>${locked ? '<span class="acct-aside">Premium</span><span class="acct-go">⟦lock⟧</span>' : `<span class="sw ${on ? 'on' : ''}"></span>`}</button>`; };
  return `
<div class="screen act">
  <div class="topbar"><h1>Alertes</h1>${demoTag}</div>
  ${budgetCard()}
  <p class="al-lead">${unread ? unread + ' non lue' + (unread > 1 ? 's' : '') : 'Tout est lu'} · hausses, doublons, budget, rappels</p>
  <div class="seg ops-seg four" role="tablist" aria-label="Filtrer les alertes">${chip('all','Toutes')}${chip('up','Hausses')}${chip('dup','Doublons')}${chip('next','Rappels')}</div>
  ${unread ? '<div class="al-tools"><button type="button" id="read-all">Tout marquer comme lu</button></div>' : ''}
  ${visible.length ? listSlot('act-list', frag => appendAlertGroups(frag, visible)) : (!prem.length ? `<div class="act-list">${emptyState('bell', 'Tout est calme', 'Rien dans ce filtre. On vous prévient ici dès qu’un prix bouge ou qu’une banque demande votre attention.')}</div>` : '')}
  ${P || !prem.length ? '' : `<a class="one-card" href="#/premium"><div><b>${prem.length} alertes d’économies</b><span>Hausses, doublons et rappels. ${CFG.trial}.</span></div>${logoMark()}</a>`}
  <p class="acct-k">Réglages</p>
  <div class="menu-card">
    ${tog('bank','Accès bancaire bientôt expiré', true)}
    ${tog('up','Hausse de prix', false)}
    ${tog('dbl','Doublon et double prélèvement', false)}
    ${tog('next','Rappel avant prélèvement', false)}
    ${tog('trial','Fin d’essai gratuit', false)}
    <a class="acct-row" href="#/prelevements"><span class="acct-lab">Prochains prélèvements</span><span class="acct-go">⟦chev⟧</span></a>
  </div>
</div>`;
};

screens.banques = () => {
  const L = linked(); const P = isP();
  if (LIVE){ const b = L[0]; return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/dashboard">⟦back⟧</a><h1>Mes banques</h1>${demoTag}</div>
  <div class="card bankcard">
    <div style="display:flex;gap:12px;align-items:center">${bankTile(b, 'lg')}
      <div style="flex:1"><div style="font-weight:700">${esc(b.name)}</div><div class="muted small">${esc(b.accounts)}</div></div>
      <span class="status ${b.status==='expired'?'err':'ok'}">${b.status==='expired'?'Expirée':'Connectée'}</span></div>
    <div class="kv"><span>Données lues</span><span>${b.sync}</span></div>
    <div class="kv"><span>${API ? 'Accès bancaire' : 'Session de test'}</span><span class="${b.status==='expired'?'t-amber':''}">${b.expires}</span></div>
    ${LIVE.accounts.map(a=>`<div class="kv"><span class="small">${esc(a.name)}</span><span class="nw">${(a.balance||0).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})} ${a.currency==='EUR'||!a.currency?'€':esc(a.currency)}</span></div>`).join('')}
    ${b.status==='expired' ? `<div class="banner amber" style="margin:10px 0 0"><span class="ic">⟦key⟧</span><div><b>Session de test expirée</b>Le jeton Powens de test ne dure que 30 minutes. Les résultats restent affichés ; reconnectez-vous pour relire les comptes.</div></div>` : ''}
    <button class="btn small-btn" id="${API ? 'api-sync' : b.status==='expired'?'pw-connect':'pw-refresh'}" style="margin-top:12px">${b.status==='expired'?'Reconnecter la banque de test':'Relire les opérations'}</button>
  </div>
  <p class="muted small" style="margin:2px 2px 12px">Comptes en euros uniquement. ${LIVE.subs.length} prélèvement${LIVE.subs.length>1?'s':''} retenu${LIVE.subs.length>1?'s':''} sur ${LIVE.txCount} opérations : « confirmé » = au moins 2 prélèvements à ~1 mois d’écart et montant à ±10 % ; « probable » = 1 seul prélèvement au libellé typique d’un abonnement.</p>
  ${API ? sandboxNote() : `<button class="btn ghost" id="pw-quit">Revenir aux données d’exemple</button>
  ${pwNote()}`}
</div>`; }
  const banks = ledger().banks;
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/dashboard">⟦back⟧</a><h1>Mes banques</h1>${demoTag}</div>
  <div class="bk-list">
  ${banks.map(b => {
    const color = /^#[0-9a-f]{6}$/i.test(b.color || '') ? b.color : '#0066FF';
    const st = b.status === 'error' ? 'Synchro en échec' : b.status === 'expired' ? 'Session expirée' : 'À jour · ' + b.sync;
    return `<a class="bk-row" href="#/banque/${b.id}" style="--bk:${color}">${bankTile(b, 'bk-ini', b.status === 'error' ? '<i class="st err"></i>' : b.status === 'expired' ? '<i class="st warn"></i>' : '')}
      <div class="mid"><div class="name">${esc(b.name)}</div><div class="meta ${b.status === 'error' ? 't-red' : ''}">${esc(st)}</div></div>
      <div class="amt">${state.hideBalance ? '<span class="masked">••••</span>' : eur(b.total)}</div><span class="chev">⟦chev⟧</span></a>
      ${b.status === 'error' ? `<div class="banner err"><span class="ic">⟦link⟧</span><div><b>${esc(b.name)} refuse la connexion</b>Souvent après un changement de mot de passe.</div></div><button class="btn small-btn" data-toast="Reconnexion lancée (simulation)">Reconnecter</button>`
        : b.expiresIn <= 7 ? `<div class="banner amber"><span class="ic">⟦key⟧</span><div><b>Renouvelez ${esc(b.name)} avant le ${esc(b.expires)}</b>Votre banque redemande une validation tous les 180 jours.</div></div><button class="btn mint small-btn" data-toast="Accès renouvelé pour 180 jours (simulation)">Renouveler l’accès</button>` : ''}`;
  }).join('')}
  </div>
  ${P ? `<button class="btn ghost" data-toast="Ajout d’une banque (simulation)">⟦plus⟧ Ajouter une banque</button>`
      : `<a class="btn ghost" href="#/premium">⟦lock⟧ Ajouter une autre banque · Premium</a><p class="muted small center" style="margin-top:8px">La version gratuite inclut 1 banque.</p>`}
  <div class="banner blue" style="margin-top:14px"><span class="ic">⟦lock⟧</span><div><b>Lecture seule</b>${APP_NAME} ne voit jamais vos identifiants et ne peut faire aucun virement. Vous pouvez couper l’accès ici à tout moment.</div></div>
  ${PWX ? `<button class="btn ghost" id="pw-connect" style="margin-top:4px">⟦bank⟧ Connecter une banque de test (Powens)</button>${pwNote()}` : ''}
</div>`;
};

screens.banque = (q, id) => {
  const L = ledger();
  const b = (L.banks || []).find(x => x.id === id);
  if (!b) return screens.banques();
  const hid = state.hideBalance;
  const moneyOr = n => hid ? '<span class="masked">••••</span>' : eur(n);
  const tx = L.tx.filter(x => x.bank && x.bank.id === b.id);
  const up = (L.banks[0] && L.banks[0].id === b.id ? L.up : []).slice(0, 4);
  const st = b.status === 'error' ? 'Synchro en échec' : b.status === 'expired' ? 'Session expirée' : 'À jour · ' + b.sync;
  const color = /^#[0-9a-f]{6}$/i.test(b.color || '') ? b.color : '#0066FF';
  return `
<div class="screen bank-page">
  <div class="topbar"><a class="back" href="#/banques" aria-label="Retour">⟦back⟧</a><h1>${esc(b.name)}</h1>${demoTag}</div>
  <section class="bank-hero" style="--bk:${color}">
    <div class="bh-top">${bankTile(b, 'lg', b.status === 'error' ? '<i class="st err"></i>' : b.status === 'expired' ? '<i class="st warn"></i>' : '')}
      <div><div class="bh-name">${esc(b.name)}</div><div class="bh-sub ${b.status === 'error' ? 't-red' : ''}">${esc(st)}</div></div></div>
    <div class="amount">${moneyOr(b.total)}</div>
    <div class="bh-meta">${b.accs.length} compte${b.accs.length > 1 ? 's' : ''}${b.accounts ? ' · ' + esc(b.accounts) : ''}</div>
    ${hid ? '<p class="bh-meta">Graphique masqué avec le solde.</p>' : sparkLite(bankCurve(b, L.tx), color)}
  </section>
  ${hid ? '' : `<p class="acct-k">Dépenses</p><div class="panel spend-card">${spendBars(tx, color)}</div>`}
  ${hid ? '' : `<p class="acct-k">Revenus</p><div class="panel spend-card">${incomeBars(tx)}</div>`}
  <p class="acct-k">Comptes</p>
  <div class="panel bank-accs">
    ${b.accs.map(a => `<div class="acc-row ${a.counted === false ? 'off' : ''}"><span>${esc(a.name)}</span><b>${hid ? '<span class="masked">••••</span>' : (a.currency && a.currency !== 'EUR' ? (a.balance || 0).toLocaleString('fr-FR', { minimumFractionDigits:2, maximumFractionDigits:2 }) + ' ' + esc(a.currency) : eur(a.balance))}</b></div>`).join('')}
  </div>
  ${up.length ? `<p class="acct-k">À venir</p><div class="panel">${up.map(x => `<a class="tx up" href="${x.sub ? '#/abo/' + x.sub : '#/operations'}">${catChip(x.cat)}<div class="mid"><div class="name">${esc(x.name)}</div><div class="meta">${dayLabel(x.t)}</div></div><div class="amt">${signed(x.amt)}</div></a>`).join('')}</div>` : ''}
  <p class="acct-k">Dernières opérations</p>
  ${tx.length ? listSlot('panel', frag => appendTxGroups(frag, tx, 4, 8, false)) : '<div class="panel"><p class="insight">Aucune opération récente sur cette banque.</p></div>'}
  ${b.status === 'error' ? `<button class="btn" data-toast="Reconnexion lancée (simulation)">Reconnecter ${esc(b.name)}</button>` : `<a class="btn ghost" href="#/operations">Toutes les transactions</a>`}
  <div class="banner blue"><span class="ic">⟦lock⟧</span><div><b>Lecture seule</b>Prelevo ne peut rien virer depuis ${esc(b.name)}. Vous pouvez couper l’accès à tout moment.</div></div>
</div>`;
};

const themePref = () => (window.PrelevoTheme ? PrelevoTheme.get() : 'auto');
const themeLabel = () => ({ light:'Clair', dark:'Sombre', auto:'Automatique' }[themePref()] || 'Automatique');
function appIcon(){ const v = Store.readRaw('prelevo-icon'); if (v === 'noir' || v === 'defaut' || v === 'bleu') return v; return 'bleu'; }
function setAppIcon(v){ if (v === 'noir' || v === 'defaut') Store.writeRaw('prelevo-icon', v); else Store.remove('prelevo-icon'); document.documentElement.setAttribute('data-icon', appIcon()); }
setAppIcon(appIcon());
function pickTheme(v){
  if (window.PrelevoTheme) PrelevoTheme.set(v);
  render();
  toast(v === 'auto' ? 'Thème automatique' : v === 'dark' ? 'Thème sombre' : 'Thème clair');
}
function pickIcon(v){
  setAppIcon(v);
  render();
  toast(v === 'noir' ? 'Icône noire' : v === 'defaut' ? 'Icône blanche' : 'Icône par défaut');
}
const PUSH_KEY = 'prelevo-push';
const PUSH_KINDS = [
  ['calendar', 'Prélèvement à venir', 'J-1, J-3 ou J-7, selon le délai choisi pour chaque prélèvement.'],
  ['trend', 'Hausse de prix', 'Quand le montant d’un abonnement augmente.'],
  ['coin', 'Budget à 80 % et à 100 %', 'Quand vos dépenses du mois atteignent ces seuils.'],
];
let pushDemo = null;
function readPushPref() {
  const raw = Store.readJSON(PUSH_KEY, {});
  return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
}
function pushSupported() {
  return typeof Notification !== 'undefined' && 'serviceWorker' in navigator;
}
function vapidKey() {
  return String((CFG && CFG.vapidPublicKey) || '').trim();
}
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
async function enablePush() {
  if (!pushSupported()) { toast('Les notifications ne sont pas disponibles sur cet appareil.'); return; }
  let permission;
  try { permission = await Notification.requestPermission(); }
  catch (e) { toast('L’autorisation n’a pas abouti.'); return; }
  const rec = { opted: permission === 'granted', permission: permission, at: Date.now() };
  if (permission !== 'granted') {
    Store.writeJSON(PUSH_KEY, rec);
    render();
    toast(permission === 'denied' ? 'Les notifications sont bloquées dans les réglages de cet appareil.' : 'Vous pourrez les activer plus tard, depuis cet écran.');
    return;
  }
  const key = vapidKey();
  if (key) {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) });
      rec.subscription = sub.toJSON();
    } catch (e) { rec.subscribeError = true; }
  }
  Store.writeJSON(PUSH_KEY, rec);
  render();
  toast(key ? 'Notifications activées.' : 'Notifications activées sur cet appareil.');
  syncPushPlan();
}
async function demoPush() {
  if (!pushSupported()) { toast('Les notifications ne sont pas disponibles sur cet appareil.'); return; }
  if (Notification.permission !== 'granted') {
    await enablePush();
    if (Notification.permission !== 'granted') return;
  }
  const title = 'Prélèvement demain';
  const body = 'FibreBox Internet · 39,99 €';
  const opts = { body: body, tag: 'prelevo-demo-prelevement', icon: 'icons/icon-192.png', data: { url: '#/alertes', kind: 'prelevement' } };
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(title, opts);
  } catch (e) {
    try { new Notification(title, opts); }
    catch (err) { toast('L’exemple n’a pas pu s’afficher.'); return; }
  }
  pushDemo = { title: title, body: body };
  toast('Exemple envoyé : prélèvement demain.');
  render();
}
const LOCK_KEY = 'prelevo-lock';
const LEAD_KEY = 'prelevo-debit-leads';
const SENT_KEY = 'prelevo-debit-sent';
const LOCK_IDLE_MS = 5 * 60 * 1000;
let lockPhase = '';
let setupBuf = '';
let setupA = '';
let lockBuf = '';
let lockHiddenAt = 0;
function readLock() {
  const raw = Store.readJSON(LOCK_KEY, null);
  return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : null;
}
function lockEnabled() {
  const rec = readLock();
  return !!(rec && rec.enabled && rec.hash && rec.salt);
}
function readLeads() {
  const raw = Store.readJSON(LEAD_KEY, {});
  return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
}
function euroPlain(n) {
  return Number(n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}
function reminderSubs() {
  return active().map(s => ({ id: s.id, name: s.name, day: s.day, price: s.price }));
}
async function showLocalNotice(title, body, tag) {
  const opts = { body: body, tag: tag, icon: 'icons/icon-192.png', data: { url: '#/prelevements', kind: 'prelevement' } };
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(title, opts);
    return true;
  } catch (e) {
    try { new Notification(title, opts); return true; }
    catch (err) { return false; }
  }
}
async function notifyDue() {
  if (!window.PrelevoGuard || !pushSupported() || Notification.permission !== 'granted') return;
  const sent = Store.readJSON(SENT_KEY, {}) || {};
  const due = PrelevoGuard.dueReminders(reminderSubs(), readLeads(), nowRef(), sent);
  for (const item of due) {
    const title = item.lead === 1 ? 'Prélèvement demain' : 'Prélèvement dans ' + item.lead + ' jours';
    const ok = await showLocalNotice(title, item.name + ' · ' + euroPlain(item.amount), 'prelevement-' + item.id);
    if (ok) sent[item.key] = 1;
  }
  if (due.length) Store.writeJSON(SENT_KEY, sent);
}
async function syncPushPlan() {
  if (!API || !API.pushSubscribe || !API.loggedIn()) return;
  const pref = readPushPref();
  if (!pref.subscription || !window.PrelevoGuard) return;
  const alerts = reminderSubs().map(s => {
    const debit = PrelevoGuard.nextDebitDate(s.day, nowRef());
    return {
      id: s.id,
      name: s.name,
      amount: s.price,
      day: s.day,
      leadDays: PrelevoGuard.normalizeLead(readLeads()[s.id]),
      debitOn: debit ? PrelevoGuard.dayKey(debit) : null
    };
  });
  try { await API.pushSubscribe({ subscription: pref.subscription, alerts: alerts }); } catch (e) {}
}
function bytesToB64(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}
function b64ToBytes(b64) {
  const s = atob(String(b64 || ''));
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}
async function platformBio() {
  if (!window.PublicKeyCredential || !navigator.credentials) return false;
  try { return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(); }
  catch (e) { return false; }
}
async function nativeBio() {
  const cap = window.Capacitor;
  if (!cap || typeof cap.isNativePlatform !== 'function' || !cap.isNativePlatform()) return null;
  const plugins = cap.Plugins || {};
  const Bio = plugins.BiometricAuthNative || plugins.BiometricAuth;
  if (!Bio || !Bio.authenticate) return null;
  try {
    await Bio.authenticate({
      reason: 'Déverrouillez Prelevo',
      cancelTitle: 'Annuler',
      allowDeviceCredential: false,
      iosFallbackTitle: 'Utiliser le code'
    });
    return true;
  } catch (e) { return false; }
}
async function enrollWebAuthn() {
  const cred = await navigator.credentials.create({ publicKey: {
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    rp: { name: 'Prelevo' },
    user: { id: crypto.getRandomValues(new Uint8Array(16)), name: 'vous', displayName: 'Prelevo' },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
    authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
    timeout: 60000
  }});
  if (!cred) throw new Error('bio');
  return bytesToB64(new Uint8Array(cred.rawId));
}
async function getWebAuthn(idB64) {
  const cred = await navigator.credentials.get({ publicKey: {
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    allowCredentials: [{ type: 'public-key', id: b64ToBytes(idB64) }],
    userVerification: 'required',
    timeout: 60000
  }});
  return !!cred;
}
function pinDots(buf) {
  return `<div class="pin-dots" aria-hidden="true">${[0, 1, 2, 3, 4, 5].map(i => `<i class="${i < buf.length ? 'on' : ''}"></i>`).join('')}</div>`;
}
function pinPad() {
  const keys = ['1','2','3','4','5','6','7','8','9','del','0','ok'];
  return `<div class="pin-pad">${keys.map(k => {
    const lab = k === 'del' ? 'Effacer' : k === 'ok' ? 'Valider' : k;
    const text = k === 'del' ? '⌫' : k === 'ok' ? 'OK' : k;
    return `<button type="button" data-pin="${k}" aria-label="${lab}">${text}</button>`;
  }).join('')}</div>`;
}
function paintLockDots() {
  const host = document.querySelector('.app-lock .pin-dots');
  if (host) host.outerHTML = pinDots(lockBuf);
}
function setLockError(msg) {
  const el = document.querySelector('.app-lock .lock-err');
  if (el) el.textContent = msg || '';
}
function unlockApp() {
  lockBuf = '';
  document.documentElement.classList.remove('app-locked');
  const el = document.querySelector('.app-lock');
  if (el) el.hidden = true;
}
function openLock(auto) {
  if (!lockEnabled()) return;
  document.documentElement.classList.add('app-locked');
  let el = document.querySelector('.app-lock');
  if (!el) {
    el = document.createElement('div');
    el.className = 'app-lock';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'lock-title');
    document.body.appendChild(el);
  }
  el.hidden = false;
  el.innerHTML = `<h1 id="lock-title">Prelevo est verrouillé</h1><p>Saisissez votre code, ou déverrouillez avec Face ID ou Touch ID.</p><button type="button" class="btn" id="lock-bio">Déverrouiller</button>${pinDots(lockBuf)}<p class="lock-err" role="alert"></p>${pinPad()}`;
  if (auto) tryUnlockBio(false);
}
async function tryUnlockBio(fromTap) {
  const rec = readLock();
  if (!rec) return;
  if (rec.nativeBio) {
    const native = await nativeBio();
    if (native === true) { unlockApp(); return; }
    if (fromTap && native === false) setLockError('Utilisez votre code.');
    return;
  }
  if (rec.credentialId) {
    try {
      if (await getWebAuthn(rec.credentialId)) { unlockApp(); return; }
    } catch (e) {
      if (fromTap) setLockError('Utilisez votre code.');
    }
  } else if (fromTap) setLockError('Aucun déverrouillage biométrique n’est enregistré sur cet appareil.');
}
async function submitLockPin() {
  const rec = readLock();
  let ok = false;
  try { ok = await PrelevoGuard.verifyPin(lockBuf, rec); } catch (e) { ok = false; }
  lockBuf = '';
  paintLockDots();
  if (!ok) { setLockError('Ce code ne correspond pas.'); return; }
  unlockApp();
}
function pressPin(key, overlay) {
  const buf = overlay ? lockBuf : setupBuf;
  let next = buf;
  if (key === 'del') next = buf.slice(0, -1);
  else if (key === 'ok') { if (overlay) submitLockPin(); else submitSetupPin(); return; }
  else if (buf.length < 6) next = buf + key;
  if (overlay) { lockBuf = next; paintLockDots(); setLockError(''); }
  else { setupBuf = next; render(); }
}
async function submitSetupPin() {
  if (!PrelevoGuard.pinOk(setupBuf)) { toast('Choisissez 4 à 6 chiffres.'); return; }
  if (lockPhase === 'current') {
    const ok = await PrelevoGuard.verifyPin(setupBuf, readLock());
    setupBuf = '';
    if (!ok) { toast('Ce code ne correspond pas.'); render(); return; }
    if (lockPhaseAfterCurrent === 'off') {
      Store.remove(LOCK_KEY);
      lockPhase = '';
      unlockApp();
      toast('Verrouillage retiré de cet appareil.');
      render();
      return;
    }
    lockPhase = lockPhaseAfterCurrent;
    render();
    return;
  }
  if (lockPhase === 'choose') {
    setupA = setupBuf;
    setupBuf = '';
    lockPhase = 'confirm';
    render();
    return;
  }
  if (lockPhase === 'confirm') {
    if (setupBuf !== setupA) { setupBuf = ''; setupA = ''; lockPhase = 'choose'; toast('Les deux codes sont différents. Recommencez.'); render(); return; }
    const hashed = await PrelevoGuard.hashPin(setupBuf);
    const prev = readLock() || {};
    Store.writeJSON(LOCK_KEY, Object.assign({}, prev, hashed, { enabled: true }));
    setupBuf = '';
    setupA = '';
    const bio = await platformBio();
    const cap = window.Capacitor;
    const native = cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();
    lockPhase = (bio || native) ? 'bio' : '';
    toast('Prelevo se verrouillera à la prochaine ouverture.');
    render();
  }
}
let lockPhaseAfterCurrent = 'choose';
async function enrollBio() {
  const rec = readLock() || {};
  const cap = window.Capacitor;
  if (cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform()) {
    const native = await nativeBio();
    if (native !== true) { toast('Le déverrouillage biométrique n’a pas été activé.'); return; }
    Store.writeJSON(LOCK_KEY, Object.assign({}, rec, { nativeBio: true, credentialId: '' }));
    lockPhase = '';
    toast('Face ID ou Touch ID est prêt sur cet iPhone.');
    render();
    return;
  }
  try {
    const id = await enrollWebAuthn();
    Store.writeJSON(LOCK_KEY, Object.assign({}, rec, { credentialId: id, nativeBio: false }));
    lockPhase = '';
    toast('Vous pourrez déverrouiller avec Face ID ou Touch ID.');
    render();
  } catch (e) {
    toast('Le déverrouillage biométrique n’a pas été activé. Le code reste en place.');
  }
}
/* ---------- Menu façon « fiche plein écran » : ✕ / ? en haut, profil, carte Premium, liste épurée ---------- */
const sheetBar = (href, right = '') => `<div class="sheet-bar"><a class="rbtn" href="${href}" aria-label="Retour">⟦back⟧</a>${right}</div>`;
const sheetHead = (title, href, right = '') => `${sheetBar(href, right)}<h1 class="sheet-title">${title}</h1>`;
const acctName = () => USER.prenom || (ME && ME.email ? String(ME.email).split('@')[0] : '') || 'Mon compte';
const acctInitial = () => { const n = (USER.prenom || (ME && ME.email) || '').trim(); return n ? n[0].toUpperCase() : ''; };
const cbRow = (href, ic, lab, aside, tone) => `<a class="cb-row" href="${href}"><span class="cb-ic">⟦${ic}⟧</span><span class="cb-lab">${lab}</span>${aside ? `<span class="cb-aside ${tone || ''}">${aside}</span>` : ''}<span class="cb-go">⟦chev⟧</span></a>`;
const cbStatic = (ic, lab, aside) => `<div class="cb-row static"><span class="cb-ic">⟦${ic}⟧</span><span class="cb-lab">${lab}</span><span class="cb-aside">${aside}</span><span class="cb-go"></span></div>`;
const cbExt = (href, ic, lab) => `<a class="cb-row" href="${href}" target="_blank" rel="noopener"><span class="cb-ic">⟦${ic}⟧</span><span class="cb-lab">${lab}</span><span class="cb-go ext">⟦ext⟧</span></a>`;
const PROMO_ART = `<svg class="cb-art" viewBox="0 0 132 120" aria-hidden="true" focusable="false"><circle cx="86" cy="60" r="60" fill="#4D94FF"/><circle cx="86" cy="60" r="46" fill="#0066FF"/><circle cx="86" cy="60" r="31" fill="#fff"/><image href="icons/logo-mark.svg" x="67" y="40" width="38" height="47"/></svg>`;
screens.compte = () => {
  const P = isP(), unread = alerts().filter(a => !state.readAlerts.includes(a.id)).length;
  const ini = acctInitial();
  return `
<div class="screen cb">
  ${`<div class="sheet-bar"><a class="rbtn" href="#/dashboard" aria-label="Fermer">⟦close⟧</a><a class="rbtn" href="#/aide" aria-label="Aide">⟦help⟧</a></div>`}
  <a class="cb-id" href="#/reglages" aria-label="Compte et paramètres">
    <span class="cb-avatar" aria-hidden="true">${ini ? esc(ini) : '<img src="icons/logo-mark-white.svg" alt="">'}</span>
    <span class="cb-who"><h1>${esc(acctName())}</h1><span>Compte et paramètres</span></span>
    <span class="cb-go">⟦chev⟧</span>
  </a>
  <a class="cb-promo" href="#/premium">
    <div><b>${APP_NAME} Premium</b><span>${P ? 'Actif. Merci !' : '1 mois offert. Zéro pub, alertes et banques illimitées.'}</span></div>
    ${PROMO_ART}
  </a>
  <p class="cb-k">Encore plus d’options</p>
  <div class="cb-list">
    <button type="button" class="cb-row" id="toggle-balance" role="switch" aria-checked="${state.hideBalance ? 'true' : 'false'}" aria-label="Masquer le solde"><span class="cb-ic">⟦${state.hideBalance ? 'eyeoff' : 'eye'}⟧</span><span class="cb-lab">Masquer le solde</span><span class="sw ${state.hideBalance ? 'on' : ''}" aria-hidden="true"></span></button>
    ${cbRow('#/banques','bank','Mes banques')}
    ${cbRow('#/abonnements','receipt','Transactions')}
    ${cbRow('#/alertes','bell','Alertes', unread ? `<span class="cb-pill">${unread}</span>` : '')}
    ${cbRow('#/assistant','bot','Assistant ' + APP_NAME)}
    ${cbRow('#/prelevements','calendar','Prochains prélèvements')}
    ${cbRow('#/budget','pie','Budget')}
    ${cbRow('#/export','download','Export CSV')}
    ${cbRow('#/premium','star',APP_NAME + ' Premium', P ? 'Actif' : '1 mois offert', P ? '' : 'up')}
    ${cbRow('#/parrainage','userplus','Parrainage','Gagnez 1 mois','up')}
    ${cbRow('#/soutiens','heart','Soutiens')}
    ${cbRow('#/apropos','info','À propos')}
    ${cbRow('#/aide','help','Aide')}
  </div>
  <p class="cb-legal"><i class="brand-mark" aria-hidden="true"></i>${APP_NAME} n’est pas une banque. Lecture seule, aucun virement.<br>${demoTag}</p>
</div>`;
};
screens.reglages = () => {
  const P = isP();
  const push = pushSupported() && Notification.permission === 'granted' && readPushPref().opted;
  return `
<div class="screen cb">
  ${sheetHead('Compte et paramètres', '#/compte')}
  <div class="cb-list big">
    ${cbRow('#/infos','usercircle','Informations personnelles')}
    ${cbRow('#/verrouillage','shield','Sécurité', lockEnabled() ? 'Verrouillé' : '')}
    ${cbRow('#/premium','card','Abonnement et facturation', P ? 'Premium' : 'Gratuit')}
    ${cbRow('#/notifications','bell','Notifications', push ? 'Activées' : 'Désactivées')}
    ${cbRow('#/export','doc','Relevés')}
    ${cbStatic('globe','Langue','Français')}
    ${cbStatic('coin','Devise','Euro (EUR)')}
    ${cbRow('#/apparence','sun','Apparence', themeLabel())}
    ${cbRow('#/confidentialite','lock','Confidentialité')}
  </div>
</div>`;
};
screens.infos = () => {
  const kv = (k, v) => `<div class="cb-kv"><span>${k}</span><b>${v}</b></div>`;
  const live = !!(API && API.loggedIn() && ME);
  return `
<div class="screen cb">
  ${sheetHead('Informations personnelles', '#/reglages')}
  <div class="cb-list kvs">
    ${kv('Prénom', USER.prenom ? esc(USER.prenom) : '<em>Non renseigné</em>')}
    ${kv('E-mail du compte', live && ME.email ? `<span class="brk">${esc(ME.email)}</span>` : '<em>Aucun compte connecté (démonstration)</em>')}
    ${kv('Formule', isP() ? 'Premium' : 'Gratuit')}
    ${kv('Banque connectée', LIVE ? esc(LIVE.bank) : '<em>Aucune</em>')}
    ${kv('Accès à vos comptes', 'Lecture seule')}
  </div>
  <p class="cb-note">Ces informations sont en lecture seule. ${APP_NAME} ne demande ni votre identifiant bancaire ni votre mot de passe, et ne peut jamais déplacer votre argent.</p>
  ${live ? '<button class="btn ghost" id="api-logout" type="button">Se déconnecter</button>' : ''}
</div>`;
};
screens.confidentialite = () => {
  const live = !!(API && API.loggedIn());
  return `
<div class="screen cb">
  ${sheetHead('Confidentialité', '#/reglages')}
  <p class="cb-note lead">${APP_NAME} lit vos comptes en lecture seule : aucun virement, aucune carte. Vos données ne sont jamais revendues, et vous pouvez retirer l’accès à votre banque à tout moment.</p>
  <div class="cb-list big">
    ${cbExt('../confidentialite.html','shield','Politique de confidentialité')}
    ${cbExt('../conditions.html','doc','Conditions d’utilisation')}
    ${live ? `<a class="cb-row danger" href="#/supprimer"><span class="cb-ic">⟦trash⟧</span><span class="cb-lab">Supprimer mon compte</span><span class="cb-go">⟦chev⟧</span></a>` : ''}
    <button type="button" class="cb-row danger" id="reset"><span class="cb-ic">⟦refresh⟧</span><span class="cb-lab">Réinitialiser les données</span></button>
  </div>
  <p class="cb-note">Réinitialiser efface les données enregistrées sur cet appareil seulement. Le thème et l’icône restent.</p>
</div>`;
};
screens.apropos = () => `
<div class="screen">
  ${sheetHead('À propos', '#/compte')}
  <div style="display:flex;justify-content:center;margin:8px 0 18px">${logoMark('l')}</div>
  <div class="card about">
    <p>${APP_NAME} n’est pas une banque. C’est une lecture de vos comptes : prélèvements, hausses de prix, reste à vivre. Aucun virement, aucune carte, aucun conseil sponsorisé.</p>
    <p>Les chiffres de Camille sont un exemple. Rien n’est envoyé tant qu’une banque n’est pas connectée.</p>
  </div>
  <div class="card" style="padding:4px 16px">
    <div class="kv"><span>Version</span><span class="muted">Bêta privée</span></div>
    <div class="kv"><span>Formule</span><span class="muted">${isP() ? 'Premium' : 'Gratuit'}</span></div>
  </div>
</div>`;
screens.notifications = () => {
  const pref = readPushPref();
  const perm = pushSupported() ? Notification.permission : 'unsupported';
  const on = perm === 'granted' && pref.opted;
  const key = vapidKey();
  const kinds = PUSH_KINDS.map(([ic, title, text]) => `<div class="push-kind"><span class="acct-ic">⟦${ic}⟧</span><span><b>${title}</b><small>${text}</small></span></div>`).join('');
  return `
<div class="screen">
  ${sheetHead('Notifications', '#/reglages')}
  <p class="push-lead">Vous activez les alertes ici, sur cet appareil. Quatre cas : un prélèvement prévu pour le lendemain, une hausse de prix, le budget à 80 % et le budget à 100 %.</p>
  <div class="menu-card">${kinds}</div>
  <p class="push-ios">Sur iPhone, ajoutez Prelevo à l’écran d’accueil. Les alertes arrivent à partir d’iOS 16.4, une fois l’app installée.</p>
  ${perm === 'denied' ? '<p class="push-status">Les notifications sont bloquées dans les réglages de cet appareil. Autorisez-les pour Prelevo, puis revenez ici.</p>' : ''}
  ${perm === 'unsupported' ? '<p class="push-status">Cet appareil ne propose pas les notifications.</p>' : ''}
  ${on ? `<p class="push-status">Notifications activées sur cet appareil.${key ? '' : ' La clé publique du serveur est vide : l’exemple reste local.'}</p>` : ''}
  ${on || perm === 'unsupported' ? '' : '<button class="btn" type="button" id="enable-push">Activer les notifications</button>'}
  ${perm === 'unsupported' ? '' : `<button class="btn ${on ? '' : 'ghost'}" type="button" id="demo-push">Voir un exemple</button>`}
  ${pushDemo ? `<p class="push-note" role="status"><b>${esc(pushDemo.title)}</b><span>${esc(pushDemo.body)}</span></p>` : ''}
</div>`;
};
screens.verrouillage = () => {
  const rec = readLock();
  const on = lockEnabled();
  const back = sheetHead('Sécurité', '#/reglages');
  const out = API && API.loggedIn() ? '<button class="btn ghost" type="button" id="api-logout">Se déconnecter</button>' : '';
  if (lockPhase === 'choose' || lockPhase === 'confirm' || lockPhase === 'current') {
    const title = lockPhase === 'current' ? 'Saisissez le code actuel' : lockPhase === 'confirm' ? 'Confirmez ce code' : 'Choisissez un code de 4 à 6 chiffres';
    return `<div class="screen lock-setup">${back}<p class="push-lead">${title}.</p>${pinDots(setupBuf)}${pinPad()}</div>`;
  }
  if (lockPhase === 'bio') {
    return `<div class="screen lock-setup">${back}<p class="push-lead">Vous pouvez aussi déverrouiller avec Face ID ou Touch ID. Si ce n’est pas possible, le code reste le repli.</p><button class="btn" type="button" id="lock-enroll">Utiliser Face ID ou Touch ID</button><button class="btn ghost" type="button" id="lock-skip">Plus tard</button></div>`;
  }
  if (!on) {
    return `<div class="screen lock-setup">${back}<p class="push-lead">Un code de 4 à 6 chiffres reste sur cet appareil, sous forme d’empreinte. Face ID ou Touch ID s’ajoute quand l’appareil le propose. Prelevo se verrouille à l’ouverture, et après 5 minutes en arrière-plan.</p><button class="btn" type="button" id="lock-start">Activer le verrouillage</button>${out}</div>`;
  }
  const bio = rec && (rec.credentialId || rec.nativeBio) ? '<p class="push-status">Déverrouillage biométrique activé. Le code sert si vous annulez.</p>' : '<button class="btn ghost" type="button" id="lock-enroll">Ajouter Face ID ou Touch ID</button>';
  return `<div class="screen lock-setup">${back}<p class="push-status">Verrouillage activé sur cet appareil.</p>${bio}<button class="btn ghost" type="button" id="lock-change">Changer le code</button><button class="btn ghost" type="button" id="lock-off">Retirer le verrouillage</button>${out}</div>`;
};
screens.prelevements = () => {
  const leads = readLeads();
  const rows = active().map(s => {
    const debit = PrelevoGuard.nextDebitDate(s.day, nowRef());
    return { s: s, debit: debit, lead: PrelevoGuard.normalizeLead(leads[s.id]) };
  }).filter(r => r.debit).sort((a, b) => a.debit - b.debit);
  const seg = (s, lead) => [1, 3, 7].map(n => `<button type="button" class="${lead === n ? 'on' : ''}" data-lead="${n}" data-sub="${esc(s.id)}" role="radio" aria-checked="${lead === n}">J-${n}</button>`).join('');
  return `
<div class="screen">
  ${sheetHead('Prochains prélèvements', '#/alertes')}
  <p class="push-lead">Pour chaque abonnement détecté, choisissez d’être prévenu 1, 3 ou 7 jours avant. Le délai par défaut est de 3 jours.</p>
  ${rows.length ? rows.map(r => `<div class="debit-row"><div class="debit-h"><b>${esc(r.s.name)}</b><span>${esc(dayLabel(r.debit))} · ${euroPlain(r.s.price)}</span></div><div class="seg debit-seg" role="radiogroup" aria-label="Délai pour ${esc(r.s.name)}">${seg(r.s, r.lead)}</div></div>`).join('') : '<p class="push-lead">Aucun prélèvement détecté pour l’instant.</p>'}
  <p class="push-ios">Le rappel s’affiche sur cet appareil si vous avez activé les notifications. Avec la clé du serveur, le même rappel part aussi en notification push.</p>
  <a class="btn ghost" href="#/notifications">Notifications</a>
</div>`;
};
function ululeHref() {
  const raw = String((CFG && CFG.ululeUrl) || '').trim();
  try {
    const url = new URL(raw);
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.href;
  } catch (e) {}
  return '';
}
screens.soutiens = () => {
  const href = ululeHref();
  const action = href
    ? `<a class="btn" href="${esc(href)}" target="_blank" rel="noopener">Voir la campagne Ulule</a>`
    : '<button class="btn" type="button" disabled>La campagne Ulule n’est pas encore ouverte</button>';
  return `
<div class="screen">
  ${sheetHead('Soutiens', '#/compte')}
  <p class="push-lead">Merci à celles et ceux qui portent Prelevo. Les noms des contributeurs Ulule apparaîtront ici.</p>
  <div id="soutien-list" class="menu-card"><p class="soutien-empty">La liste est vide pour l’instant.</p></div>
  ${action}
</div>`;
};
function loadSupporters() {
  const gen = _viewGen;
  fetch('supporters.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : []).then(list => {
    if (gen !== _viewGen) return;
    const host = document.getElementById('soutien-list');
    if (!host) return;
    if (!Array.isArray(list) || !list.length) {
      host.innerHTML = '<p class="soutien-empty">La liste est vide pour l’instant.</p>';
      return;
    }
    host.innerHTML = list.map(p => {
      const badge = p && p.founder ? '<em class="founder-badge">Soutien fondateur</em>' : '';
      return `<div class="acct-row soutien-row"><span class="acct-lab">${esc(p && p.name || '')}</span>${badge}</div>`;
    }).join('');
  }).catch(() => {});
}
function refCode(){
  const saved = Store.readRaw('prelevo-ref');
  if (saved) return saved;
  const base = (USER.prenom || 'PRELEVO').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/gi, '').toUpperCase().slice(0, 8) || 'PRELEVO';
  const n = [...base].reduce((a, ch) => (a * 33 + ch.charCodeAt(0)) % 90, 11);
  const code = base + String(10 + n);
  if (!Store.writeRaw('prelevo-ref', code)) return 'CAMILLE21';
  return code;
}
function refShareText(){
  return `${USER.prenom} vous invite sur ${APP_NAME}. Code ${refCode()} : 1 mois de Premium offert pour vous deux, dès qu’une banque est connectée. https://jhndlt.github.io/prelevo/app/?demo=1`;
}
const REF_SEED = [
  { name:'Léa M.', date:'12 sept.', status:'offert', detail:'1 mois Premium crédité' },
  { name:'Noah B.', date:'2 oct.', status:'inscrit', detail:'Compte créé, banque pas encore connectée' },
  { name:'Inès K.', date:'8 oct.', status:'envoye', detail:'Invitation envoyée' },
];
function myRefs(){
  const extra = Store.readJSON('prelevo-refs', []);
  return (Array.isArray(extra) ? extra : []).concat(REF_SEED);
}
const REF_LABEL = { offert:'Offert', inscrit:'Inscrit', envoye:'Envoyé' };
screens.parrainage = (qs, sub) => {
  const back = sheetHead(sub === 'inviter' ? 'Parrainer' : sub === 'suivi' ? 'Vos parrainages' : sub === 'comment' ? 'Le parrainage' : 'Parrainage', sub ? '#/parrainage' : '#/compte');
  if (sub === 'inviter') return `
<div class="screen parrain">
  ${back}
  <div class="ref-box">
    <p class="muted">Votre code</p>
    <p class="ref-code">${esc(refCode())}</p>
    <p>1 mois de Premium pour vous, 1 mois pour votre proche, dès qu’il connecte une banque.</p>
  </div>
  <div class="btn-pair">
    <button class="btn mint" id="share-ref" type="button">⟦send⟧ Partager</button>
    <button class="btn ghost" id="copy-ref" type="button">⟦copy⟧ Copier</button>
  </div>
  <form class="ref-note" id="ref-form">
    <label for="ref-who">Noter une invitation</label>
    <div class="ref-line"><input id="ref-who" maxlength="40" placeholder="Prénom" autocomplete="off"><button class="btn" id="ref-add" type="button">Ajouter</button></div>
  </form>
</div>`;
  if (sub === 'suivi') {
    const list = myRefs();
    const won = list.filter(r => r.status === 'offert').length;
    return `
<div class="screen parrain">
  ${back}
  <div class="ref-sum"><b>${won} mois</b><span>de Premium gagné${won > 1 ? 's' : ''} · ${list.length} proche${list.length > 1 ? 's' : ''}</span></div>
  <div class="menu-card">${list.map(r => `<div class="ref-person"><div><b>${esc(r.name)}</b><span>${esc(r.date)} · ${esc(r.detail)}</span></div><em class="ref-status ${r.status}">${REF_LABEL[r.status] || ''}</em></div>`).join('')}</div>
  <p class="acct-foot">Les mois offerts s’ajoutent à votre essai. Ils ne sont pas convertibles en argent. ${demoTag}</p>
</div>`;
  }
  if (sub === 'comment') return `
<div class="screen parrain">
  ${back}
  <ol class="ref-steps">
    <li><b>Vous envoyez votre code</b><span>À un proche qui n’a pas encore de compte ${APP_NAME}.</span></li>
    <li><b>Il crée son compte</b><span>Et connecte au moins une banque, en lecture seule.</span></li>
    <li><b>Vous êtes deux à gagner</b><span>1 mois de Premium chacun, dans la limite de 12 parrainages par an.</span></li>
  </ol>
  <div class="card about">
    <p>Le parrainage ne déplace jamais d’argent : ${APP_NAME} n’est pas une banque. Aucune commission, aucun avantage caché sur vos prélèvements.</p>
    <p>Un même proche ne peut être parrainé qu’une fois. Le mois offert se cumule avec l’essai, il ne se transforme pas en remboursement.</p>
  </div>
</div>`;
  return `
<div class="screen parrain">
  ${back}
  <div class="menu-card parrain-card">
    <a class="acct-row" href="#/parrainage/inviter"><span class="acct-lab">Parrainer vos proches</span><span class="acct-go">⟦chev⟧</span></a>
    <a class="acct-row" href="#/parrainage/suivi"><span class="acct-lab">Suivre vos parrainages</span><span class="acct-go">⟦chev⟧</span></a>
    <a class="acct-row" href="#/parrainage/comment"><span class="acct-lab">Comprendre le parrainage</span><span class="acct-go">⟦chev⟧</span></a>
  </div>
</div>`;
};
screens.apparence = () => {
  const t = themePref(), icon = appIcon();
  const radio = (v, lab) => `<button type="button" class="th-radio" data-theme-set="${v}" role="radio" aria-checked="${t===v}"><span class="rdot"></span>${lab}</button>`;
  const tiles = [['bleu','Défaut'],['noir','Noir'],['defaut','Blanc']];
  return `
<div class="screen look-page">
  ${sheetHead('Apparence', '#/reglages')}
  <p class="acct-k">Thème</p>
  <div class="menu-card th-card">
    <div role="radiogroup" aria-label="Thème">
    ${radio('light','Clair')}
    ${radio('dark','Sombre')}
    </div>
    <button type="button" class="th-auto" role="switch" data-theme-auto aria-checked="${t==='auto'}">
      <span><b>Automatique</b><small>Le thème utilisera la valeur par défaut de votre appareil</small></span>
      <span class="sw ${t==='auto'?'on':''}"></span>
    </button>
  </div>
  <p class="acct-k">Icône de l’app</p>
  <div class="menu-card icon-card">
    <div class="icon-grid">${tiles.map(([id,lab])=>`<button type="button" class="icon-opt ${icon===id?'on':''}" data-app-icon="${id}" aria-pressed="${icon===id}"><span class="tile t-${id}">${id==='bleu'?'<img src="icons/logo-mark.svg" alt="">':'<i class="glyph"></i>'}</span>${icon===id?'<i class="ibadge">⟦check⟧</i>':''}<span class="ilab">${lab}</span></button>`).join('')}</div>
    <p class="icon-note">Le logo bleu est le logo officiel de Prelevo, partout dans l’app. Noir et Blanc restent des variantes. L’icône déjà posée sur l’écran d’accueil de l’iPhone ne change pas toute seule.</p>
  </div>
</div>`;
};
screens.aide = () => `
<div class="screen">
  ${sheetHead('Aide', '#/compte')}
  <div class="card support">
    <div class="sup-head"><div class="avatars"><span class="avc a">S</span><span class="avc b">K</span><span class="avc c">M</span></div>
      <div><b>Support humain</b><div class="muted small">De vraies personnes vous répondent, pas un robot.</div></div></div>
    <p class="small" style="color:var(--ink2);margin:10px 0 12px;line-height:1.45">Sarah, Karim et Marie (exemple) répondent du lundi au samedi, de 9 h à 19 h. Réponse moyenne : moins de 2 h${isP()?' · prioritaire pour vous':''}.</p>
    <div class="btn-pair" style="margin:0">
      <a class="btn mint" href="#/chat">⟦chat⟧ Chat</a>
      <button class="btn ghost" data-toast="E-mail à ${esc(CFG.supportEmail)} (simulation)">⟦mail⟧ E-mail</button>
    </div>
  </div>
  <div class="card" style="padding:4px 16px">
    <button type="button" class="kv lnk" id="toggle-balance" role="switch" aria-checked="${state.hideBalance ? 'true' : 'false'}"><span>⟦${state.hideBalance ? 'eyeoff' : 'eye'}⟧ ${state.hideBalance ? 'Afficher le solde' : 'Masquer le solde'}</span><span>${state.hideBalance ? 'Masqué' : 'Visible'} ›</span></button>
    <a class="kv lnk" href="#/alertes"><span>⟦bell⟧ Alertes</span><span>›</span></a>
    <a class="kv lnk" href="#/premium"><span>⟦star⟧ Mon abonnement</span><span>${isP()?'Premium':'Gratuit'} ›</span></a>
    <div class="kv"><span>⟦shield⟧ Mes données</span><span class="muted">Jamais revendues</span></div>
  </div>
  <div class="card theme-card">
    <div style="font-weight:700">Apparence</div>
    <div class="muted small">Automatique suit le réglage de votre téléphone.</div>
    <div class="seg" role="radiogroup" aria-label="Thème">${[['light','sun','Clair'],['dark','moon','Sombre'],['auto','auto','Automatique']].map(([v,ic,l])=>`<button type="button" role="radio" aria-checked="${themePref()===v}" class="${themePref()===v?'on':''}" data-theme-set="${v}">⟦${ic}⟧${l}</button>`).join('')}</div>
  </div>
  ${API && API.loggedIn() ? `<div class="card account-card">
    <div style="font-weight:700">Mon compte</div>
    <div class="muted small brk">${ME ? esc(ME.email) : ''}</div>
    <button class="btn ghost" id="api-logout" style="margin-top:12px">Se déconnecter</button>
    <a class="btn danger-ghost" href="#/supprimer">Supprimer mon compte</a>
  </div>` : ''}
  <div class="card about">
    <div style="font-weight:700">À propos de ${APP_NAME}</div>
    <p>${APP_NAME} n’est pas une banque : c’est une belle interface qui se branche sur vos banques actuelles, comme une télécommande. Vous gardez vos comptes, vos cartes et votre conseiller.</p>
    <p>L’accès est en lecture seule, via un agrégateur agréé par l’ACPR (norme européenne DSP2) : ${APP_NAME} voit vos opérations, mais ne peut jamais déplacer votre argent.</p>
  </div>
  ${neutral}
  <div class="card">
    <div style="font-weight:700;margin-bottom:8px">Mode démo</div>
    <div class="toggle"><button class="${isP()?'':'on'}" data-plan="free">Gratuit</button><button class="${isP()?'on':''}" data-plan="premium">Premium</button></div>
    <button class="btn ghost" id="reset" style="margin-top:8px">Réinitialiser les données</button>
  </div>
</div>`;

const CHAT = [
  { me:false, t:'Bonjour Camille, je suis Sarah, de l’équipe support. Comment puis-je vous aider ?', h:'14:02' },
  { me:true,  t:'FibreBox me dit que je dois envoyer un recommandé, c’est obligatoire ?', h:'14:03' },
  { me:false, t:'Pas forcément ! Si vous avez souscrit en ligne, ils doivent vous proposer la résiliation en ligne. Sinon, la lettre préparée dans l’app suffit : je peux la relire avec vous.', h:'14:05' },
];
/* ---------- Assistant Prelevo (IA, lecture seule) ---------- */
const AI = { msgs: [], busy: false };
const AI_SUGG = ['Combien je dépense en abonnements par mois ?', 'Quelles sont mes plus grosses dépenses récentes ?', 'Ai-je des prélèvements à venir cette semaine ?'];
const aiFmt = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').split('\n').map(l => /^[-•] /.test(l) ? '<span class="ai-li">' + l.slice(2) + '</span>' : l + '<br>').join('').replace(/(<br>)+$/, '');
const aiDemoReply = q => /abonnement/i.test(q)
  ? 'Vous payez actuellement **6 abonnements**, pour un total de **64,93 € par mois** :\n- Flixo Streaming : 13,49 €\n- Musico : 11,12 €\n- Forme+ : 29,90 €\n- 3 autres : 10,42 €\n\nFlixo a augmenté de 2,50 € ce mois-ci. Voulez-vous que je vous montre comment le résilier ?'
  : 'Voici ce que je vois sur vos comptes. Pour rappel, je suis en lecture seule : je ne peux faire ni paiement ni virement.';
screens.assistant = () => `
<div class="screen ai-screen">
  <div class="topbar ai-top"><a class="back" href="#/dashboard">⟦back⟧</a><div class="ai-who"><span class="ai-orb">⟦spark⟧</span><div><h1>Assistant</h1><div class="muted small">Lecture seule · aucun paiement</div></div></div><span style="width:40px"></span></div>
  <div class="ai-thread" id="ai-thread">
    <div class="ai-msg bot"><div class="ai-bubble">Bonjour, je suis l’assistant de ${APP_NAME}. Posez-moi vos questions sur vos comptes, vos dépenses et vos abonnements. Je ne fais ni paiement ni virement : je vous aide à y voir clair.</div></div>
    ${AI.msgs.length ? '' : `<div class="ai-sugg">${AI_SUGG.map(q => `<button type="button" class="ai-chip" data-ai-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>`}
    ${AI.msgs.map(m => `<div class="ai-msg ${m.role === 'user' ? 'me' : 'bot'}${m.err ? ' err' : ''}"><div class="ai-bubble">${aiFmt(m.content)}</div></div>`).join('')}
    ${AI.busy ? '<div class="ai-msg bot"><div class="ai-bubble ai-typing" aria-label="L’assistant écrit"><i></i><i></i><i></i></div></div>' : ''}
  </div>
  <form class="ai-input" id="ai-form"><input id="ai-text" placeholder="Posez votre question…" aria-label="Votre question" autocomplete="off" maxlength="1000" ${AI.busy ? 'disabled' : ''}><button class="ai-send" aria-label="Envoyer" ${AI.busy ? 'disabled' : ''}>⟦send⟧</button></form>
  <p class="ai-foot">Les réponses peuvent contenir des erreurs. Vérifiez auprès de votre banque.</p>
</div>`;
function aiAsk(q){
  q = String(q || '').trim(); if (!q || AI.busy) return;
  AI.msgs.push({ role: 'user', content: q }); AI.busy = true; render(); aiScroll();
  const hist = AI.msgs.filter(m => !m.err).slice(-10).map(m => ({ role: m.role, content: m.content }));
  const done = (content, err) => { AI.busy = false; AI.msgs.push({ role: 'assistant', content, err }); if (location.hash.startsWith('#/assistant')) { render(); aiScroll(); } };
  if (API && API.chat) API.chat(hist).then(r => done(r.reply)).catch(e => done(e.message || 'Assistant indisponible, réessayez dans un moment', true));
  else setTimeout(() => done(aiDemoReply(q)), 1400);
}
function aiScroll(){ requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })); }
document.addEventListener('click', e => { const c = e.target.closest('[data-ai-q]'); if (c) aiAsk(c.dataset.aiQ); });
document.addEventListener('submit', e => { if (e.target.id !== 'ai-form') return; e.preventDefault(); const v = $('#ai-text').value; $('#ai-text').value = ''; aiAsk(v); });

screens.chat = () => `
<div class="screen chat-screen">
  <div class="topbar"><a class="back" href="#/aide">⟦back⟧</a><div class="chat-who"><span class="av avc a">S</span><div><h1>Sarah</h1><div class="muted small">Support humain · en ligne</div></div></div>${demoTag}</div>
  <div class="chat">${CHAT.map(m=>`<div class="msg ${m.me?'me':''}"><div class="bubble">${esc(m.t)}</div><div class="h">${esc(m.h)}</div></div>`).join('')}</div>
  <form class="chat-input" id="chat-form"><input id="chat-text" placeholder="Écrivez votre message…" aria-label="Votre message" autocomplete="off"><button class="send" aria-label="Envoyer">⟦send⟧</button></form>
  <p class="muted small center" style="margin-top:8px">Conversation simulée – aucun message n’est envoyé.</p>
</div>`;

let billing = 'year';
screens.premium = () => {
  const B = API && ME ? ME.billing : null, P = isP();
  const interval = B ? (B.interval === 'year' ? 'year' : 'month') : (P ? (billing === 'month' ? 'month' : 'year') : 'free');
  const fd = d => d ? new Date(d).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }) : '';
  const manage = B
    ? (B.manageable ? '<button type="button" class="btn ghost" id="billing-portal">Gérer mon abonnement</button>' : '')
    : '<button type="button" class="btn ghost" data-toast="Portail de paiement (simulation)">Gérer mon abonnement</button>';
  const statusLine = B
    ? (B.status === 'trialing' ? `Période d’essai gratuite jusqu’au ${fd(B.periodEnd)}.` : B.cancelAtPeriodEnd ? `Résilié : Premium reste actif jusqu’au ${fd(B.periodEnd)}.` : B.status === 'past_due' ? '<span class="t-red">Paiement en échec : mettez à jour votre carte.</span>' : `Prochain renouvellement le ${fd(B.periodEnd)}.`)
    : `Essai gratuit jusqu’au ${fd(new Date(nowRef().getTime() + 30 * DAY_MS))}.`;
  const status = !P
    ? `<div class="card plan-status"><div class="ps-h"><span class="plan-pill">Gratuit</span><b>Formule actuelle</b></div></div>`
    : `<div class="card plan-status"><div class="ps-h"><span class="plan-pill p">Premium</span><b>${interval === 'year' ? 'Premium annuel' : 'Premium mensuel'}${B ? '' : ' (exemple)'}</b></div><p class="muted small">${statusLine}</p>${manage}</div>`;
  const portalBtn = (label, primary) => B && B.manageable
    ? `<button type="button" class="btn ${primary ? '' : 'ghost'}" data-portal="1">${label}</button>`
    : (B ? '' : `<button type="button" class="btn ghost" data-toast="Portail de paiement (simulation)">${label}</button>`);
  const action = kind => {
    const current = interval === kind;
    if (kind === 'free') {
      if (current) return '<button type="button" class="btn ghost" disabled>Formule actuelle</button>';
      if (B) return portalBtn('Revenir au gratuit', false);
      return '<button type="button" class="btn ghost" id="go-free">Revenir au gratuit</button>';
    }
    if (current) return B ? portalBtn('Gérer mon abonnement', false) : '<button type="button" class="btn ghost" data-toast="Portail de paiement (simulation)">Gérer mon abonnement</button>';
    if (P && B) return portalBtn('Changer de formule', true);
    return `<button type="button" class="btn" data-checkout="${kind}">S’abonner</button>`;
  };
  const acc = (id, name, price, items, save) => `<section class="pacc${interval === id ? ' is-current' : ''}${id === 'free' ? ' is-free' : ''}">
    <h2><button type="button" id="pacc-${id}-btn" data-acc="${id}" aria-expanded="false" aria-controls="pacc-${id}"><span class="pacc-name">${name}${interval === id ? '<em>Formule actuelle</em>' : ''}</span><span class="pacc-side">${save ? `<span class="pacc-off">−${save.pct} %</span>` : ''}<span class="pacc-price">${price}</span></span></button></h2>
    <div class="pacc-panel" id="pacc-${id}" role="region" aria-labelledby="pacc-${id}-btn" inert><div class="pacc-clip">${save ? `<p class="pacc-save">Vous économisez ${prix(save.save / 100)} par an</p>` : ''}<ul>${items.map(t => `<li>${t}</li>`).join('')}</ul>${action(id)}</div></div>
  </section>`;
  const premiumPerks = ['Sans publicité', 'Alertes de hausse de prix', 'Rappel avant chaque prélèvement', 'Résiliation guidée', 'Reste à vivre', 'Banques illimitées'];
  const yearOff = yearSave(CFG.priceMonth, CFG.priceYear);
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/dashboard">⟦back⟧</a>${demoTag}</div>
  <h1 class="prem-title">${APP_NAME} Premium</h1>
  ${status}
  <div class="paccs">
    ${acc('free', 'Gratuit', '0 €', ['Scan de vos comptes', 'Liste de vos abonnements', 'Une banque', 'Publicités signalées'])}
    ${acc('month', 'Premium mensuel', prix(CFG.priceMonth), premiumPerks)}
    ${acc('year', 'Premium annuel', prix(CFG.priceYear), premiumPerks.concat(['Facturé ' + prix(CFG.priceYear) + ' une fois par an']), yearOff)}
  </div>
</div>`;
};


// ---------- Courbe « Solde » (données d'exemple cohérentes avec le reste à vivre) ----------
// Paie le 21 de chaque mois, loyer le 5, abonnements à leur date, dépenses carte réparties dans la journée.
// Solde d'aujourd'hui = reste à vivre + prélèvements encore à venir avant la paie + reliquat du mois précédent.
const LEFTOVER = 57.20;
const NOW = new Date(2026, 9, 9, 20, 0);                 // 9 oct. 2026, 20 h (date fictive de la démo)
const MOIS = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const PERIODS = {
  '24H': { days:1,   stepH:1,  dots:true,  fmt:'hour' },
  '7J':  { days:7,   stepH:24, dots:true,  fmt:'day' },
  '1M':  { days:30,  stepH:24, dots:true,  fmt:'day' },
  '3M':  { days:91,  stepH:24, dots:false, fmt:'month' },
  '1A':  { days:365, stepH:24, dots:false, fmt:'month' },
  'TOUT':{ days:556, stepH:24, dots:false, fmt:'month' },   // depuis le 1er avr. 2025
};
let balPeriod = '1M';
const HOME_TF = [
  ['24H', '24 h', '24 heures', 'il y a 24 h'],
  ['7J', '7 j', '7 jours', 'il y a 7 jours'],
  ['1M', '30 j', '30 jours', 'il y a 30 jours'],
  ['3M', '90 j', '90 jours', 'il y a 90 jours'],
  ['1A', '1 an', '1 an', 'il y a 1 an'],
  ['TOUT', 'Tout', 'tout', 'au début'],
];
let homeTf = '1M';
const homeTfMeta = () => HOME_TF.find(x => x[0] === homeTf) || HOME_TF[2];
let _timeline = null;
function rng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// Salaire autour de 2 200 €, petite variation, prime de fin d’année modeste (revenu annuel ~27 k€).
function payOf(year, month){
  const r = rng(year * 80 + month * 3 + 17);
  const wobble = Math.round((r() - 0.5) * 50);
  const prime = month === 11 ? 250 : 0;
  return { euros: 2200 + wobble + prime, prime: prime > 0 };
}
function allotCents(total, weights){
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const out = weights.map(w => Math.round(total * w / sum));
  out[out.length - 1] += total - out.reduce((a, b) => a + b, 0);
  return out;
}
// Courses, resto, loisirs : budget mensuel réaliste, un peu plus haut l’été et à Noël.
function monthPlan(year, month){
  if (!monthPlan.cache) monthPlan.cache = {};
  const key = year + '-' + month;
  if (monthPlan.cache[key]) return monthPlan.cache[key];
  const r = rng(year * 400 + (month + 1) * 32 + 7);
  const disc = [0.96, 0.94, 0.99, 1.02, 1.03, 1.05, 1.12, 1.16, 1.04, 1.00, 1.06, 1.50][month];
  const groc = [1.02, 0.96, 1.00, 1.02, 1.04, 1.05, 1.07, 1.10, 1.04, 1.02, 1.06, 1.12][month];
  const dim = new Date(year, month + 1, 0).getDate();
  const groups = [
    ['courses', Math.round(35000 * groc), [['Boulangerie Martin', 3], ['Supérette du Canal', 28], ['Boulangerie Martin', 2], ['Marché Saint-Louis', 16], ['Primeur Bio', 8], ['Boulangerie Martin', 2], ['Supérette du Canal', 42]]],
    ['transport', 4800 + Math.round(r() * 1400), [['Carburant · Station du Canal', 1]]],
    ['resto', Math.round(18500 * disc), [['Café Lumière', 4], ['Café Lumière', 3], ['Cantine Sato', 6], ['Cantine Sato', 5], ['Bistrot Les Amis', 8]]],
    ['loisirs', Math.round(10500 * disc), [['Librairie du Parc', 4], ['Ciné Rex', 6]]],
    ['shopping', Math.round(7500 * disc), [['Kiosque Presse', 2], ['Bricolage Dupont', 5]]],
    ['sante', 2400 + Math.round(r() * 1600), [['Pharmacie des Lilas', 1]]],
  ];
  const events = [];
  groups.forEach(([cat, cents, parts]) => {
    const amounts = allotCents(cents, parts.map(p => p[1]));
    parts.forEach(([name], i) => {
      const day = 1 + Math.min(dim - 1, Math.floor((i + 0.5) * dim / parts.length));
      const hour = 8 + Math.floor(r() * 12), min = Math.floor(r() * 60);
      events.push({ t:new Date(year, month, day, hour, min), amt:-fromCents(amounts[i]), name, k:'spend', cat });
    });
  });
  monthPlan.cache[key] = events;
  return events;
}
function cardSpends(d){
  return monthPlan(d.getFullYear(), d.getMonth()).filter(e => e.t.getDate() === d.getDate());
}
function timeline(){
  if (_timeline) return _timeline;
  const t = totals();
  const start = new Date(2025, 3, 1);
  const days = []; for (let d = new Date(start); d <= NOW; d.setDate(d.getDate()+1)) days.push(new Date(d));
  const ev = [];   // {t: Date, amt, name, k}
  // cycles de paie : on fixe l'épargne nette de chaque cycle passé (souvent négative : fins de mois de plus en plus tendues)
  const cycleKey = d => { const m = d.getDate() >= 21 ? d.getMonth() : d.getMonth() - 1; return new Date(d.getFullYear(), m, 21).getTime(); };
  const cycles = {};
  days.forEach(d => { const k = cycleKey(d); (cycles[k] = cycles[k] || []).push(d); });
  Object.entries(cycles).forEach(([, ds]) => {
    const fixed = []; 
    ds.forEach(d => {
      if (d.getDate() === 21) {
        const pay = payOf(d.getFullYear(), d.getMonth());
        fixed.push({ t:new Date(d.getFullYear(), d.getMonth(), 21, 7, 30), amt:pay.euros, name: pay.prime ? 'Salaire et prime' : 'Salaire', k:'in', prime:pay.prime });
      }
      if (d.getDate() === 24) fixed.push({ t:new Date(d.getFullYear(), d.getMonth(), 24, 9, 15), amt:-200, name:'Virement épargne', k:'xfer' });
      if (d.getDate() === 5) fixed.push({ t:new Date(d.getFullYear(), d.getMonth(), 5, 6, 10), amt:-RENT, name:'Loyer', k:'rent' });
      t.list.forEach(s => { if (s.day === d.getDate()) fixed.push({ t:new Date(d.getFullYear(), d.getMonth(), d.getDate(), 5 + (s.price*7 % 4), 0), amt:-s.price, name:s.name, k:'sub', cat:s.txCat || 'abo' }); });
      cardSpends(d).forEach(e => fixed.push(e));
    });
    fixed.forEach(e => { if (e.t <= NOW) ev.push(e); });
  });
  ev.sort((a,b)=>a.t-b.t);
  const remaining = sumEuros(t.list.filter(s => s.day >= 10 && s.day < 21), s => s.price);
  const end = t.reste + remaining + LEFTOVER;
  let bal = end; for (let i = ev.length - 1; i >= 0; i--){ ev[i].after = bal; bal -= ev[i].amt; }
  _timeline = { ev, startBal: bal, end };
  return _timeline;
}
function samples(period){
  const P = PERIODS[period], T = timeline();
  const from = new Date(NOW.getTime() - P.days * 864e5);
  const out = []; let j = 0, cur = T.startBal;
  while (j < T.ev.length && T.ev[j].t <= from){ cur = T.ev[j].after; j++; }
  if (P.fmt === 'month') {
    const marks = [new Date(from)];
    let m = new Date(from.getFullYear(), from.getMonth() + 1, 1);
    while (m < NOW && (m.getFullYear() !== NOW.getFullYear() || m.getMonth() !== NOW.getMonth())) {
      marks.push(new Date(m));
      m = new Date(m.getFullYear(), m.getMonth() + 1, 1);
    }
    marks.push(new Date(NOW));
    marks.forEach(at => {
      const subs = [];
      while (j < T.ev.length && T.ev[j].t <= at) { cur = T.ev[j].after; if (T.ev[j].k === 'sub') subs.push(T.ev[j]); j++; }
      out.push({ t:new Date(at), bal:cur, subs, salary:false });
    });
  } else {
    for (let tt = from.getTime(); tt <= NOW.getTime() + 1; tt += P.stepH * 36e5){
      const subs = [];
      while (j < T.ev.length && T.ev[j].t.getTime() <= tt){ cur = T.ev[j].after; if (T.ev[j].k === 'sub') subs.push(T.ev[j]); j++; }
      out.push({ t:new Date(tt), bal:cur, subs, salary:false });
    }
    if (out[out.length-1].t < NOW) out.push({ t:new Date(NOW), bal:T.end, subs:[] });
  }
  out[out.length-1].bal = T.end;
  out[out.length-1].t = new Date(NOW);
  return out;
}
const fDate = (d, withYear=true) => `${d.getDate()} ${MOIS[d.getMonth()]}${withYear?' '+d.getFullYear():''}`;
const fTick = (d, fmt) => fmt==='month' ? `${MOIS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}` : fmt==='hour' ? `${d.getDate()} ${MOIS[d.getMonth()]}` : `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
const CW = 330, CH = 168, PL = 40, PR = 6, PT = 10, PB = 22;
function niceTicks(min, max, n=4){
  const span = max - min || 1, raw = span / n, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1,2,2.5,5,10].map(m=>m*mag).find(s=>s>=raw);
  const a = Math.floor(min/step)*step, b = Math.ceil(max/step)*step, out = [];
  for (let v = a; v <= b + 1e-6; v += step) out.push(v);
  return out;
}
function chartGeom(S){
  const vals = S.map(p=>p.bal), ticks = niceTicks(Math.min(...vals), Math.max(...vals));
  const lo = ticks[0], hi = ticks[ticks.length-1];
  const x = i => PL + i * (CW - PL - PR) / (S.length - 1);
  const y = v => PT + (hi - v) / (hi - lo || 1) * (CH - PT - PB);
  return { ticks, x, y };
}
function balanceChart(){
  if (LIVE) return `<div class="card" id="balance"><div style="font-weight:700;margin-bottom:2px">${API ? 'Mes comptes' : 'Comptes de test'}</div>
    <div class="muted small" style="margin-bottom:6px">Soldes lus chez ${esc(LIVE.bank)}${API ? '' : ' (sandbox Powens)'}</div>
    ${LIVE.accounts.map(a=>`<div class="kv"><span class="small">${esc(a.name)}</span><span class="nw">${(a.balance||0).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})} ${a.currency==='EUR'||!a.currency?'€':esc(a.currency)}</span></div>`).join('')}</div>`;
  const S = samples(balPeriod), P = PERIODS[balPeriod], { ticks, x, y } = chartGeom(S);
  window.__BAL = S;
  const line = 'M' + S.map((p,i)=>`${x(i).toFixed(1)},${y(p.bal).toFixed(1)}`).join(' L');
  const area = `${line} L${x(S.length-1).toFixed(1)},${CH-PB} L${x(0).toFixed(1)},${CH-PB} Z`;
  const grid = ticks.map(v=>`<line class="g-grid" x1="${PL}" x2="${CW-PR}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/><text class="g-ax" x="${PL-6}" y="${(y(v)+3).toFixed(1)}" text-anchor="end">${Math.round(v).toLocaleString('fr-FR')} €</text>`).join('');
  const nx = 4, xl = Array.from({length:nx}, (_,k)=>Math.round(k*(S.length-1)/(nx-1)))
    .map((i,k)=>`<text class="g-ax" x="${x(i).toFixed(1)}" y="${CH-6}" text-anchor="${k===0?'start':k===nx-1?'end':'middle'}">${fTick(S[i].t, P.fmt)}</text>`).join('');
  const dots = P.dots ? S.map((p,i)=>p.subs.length?`<circle class="g-dot" cx="${x(i).toFixed(1)}" cy="${y(p.bal).toFixed(1)}" r="1.9"/>`:'').join('') : '';
  const hw = (CW-PL-PR)/(S.length-1);
  const hits = S.map((p,i)=>`<rect class="g-hit" data-bi="${i}" x="${(x(i)-hw/2).toFixed(1)}" y="0" width="${hw.toFixed(2)}" height="${CH}"/>`).join('');
  const last = S[S.length-1];
  return `
  <section class="gcard" id="balance">
    <div class="g-top">
      <button class="g-title" data-toast="Choix du compte (simulation)">Solde ${ICON_CHEV_DOWN}</button>
      <div class="g-pills">${Object.keys(PERIODS).map(k=>`<button class="g-pill ${k===balPeriod?'on':''}" data-period="${k}">${k}</button>`).join('')}</div>
    </div>
    <div class="g-date" id="bc-date">${fDate(last.t)}</div>
    <div class="g-big" id="bc-val">${eur(last.bal)}</div>
    <svg class="g-svg" viewBox="0 0 ${CW} ${CH}" role="img" aria-label="Évolution du solde">
      <defs><linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0066FF" stop-opacity=".25"/><stop offset="1" stop-color="#0066FF" stop-opacity="0"/></linearGradient></defs>
      ${grid}
      <path d="${area}" fill="url(#gfill)"/>
      <path class="g-line" d="${line}"/>
      ${dots}
      <line class="g-cur" id="bc-cursor" x1="0" x2="0" y1="${PT}" y2="${CH-PB}" style="display:none"/>
      <circle class="g-sel" id="bc-sel" r="3.4" cx="0" cy="0" style="display:none"/>
      ${xl}
      ${hits}
    </svg>
  </section>`;
}
const ICON_CHEV_DOWN = '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg>';
function balSelect(i){
  const S = window.__BAL; if (!S || !document.getElementById('bc-val')) return;
  const p = S[i], { x, y } = chartGeom(S), isLast = i === S.length - 1;
  const c = document.getElementById('bc-cursor'), s = document.getElementById('bc-sel');
  c.setAttribute('x1', x(i)); c.setAttribute('x2', x(i)); c.style.display = '';
  s.setAttribute('cx', x(i)); s.setAttribute('cy', y(p.bal)); s.style.display = '';
  const h = PERIODS[balPeriod].fmt === 'hour' ? ` · ${String(p.t.getHours()).padStart(2,'0')} h` : '';
  const subs = p.subs.length ? ` · <span class="g-sub">${p.subs.map(e=>`${esc(e.name)} −${eur(-e.amt)}`).join(', ')}</span>` : '';
  document.getElementById('bc-date').innerHTML = (isLast ? 'Aujourd’hui' : fDate(p.t)) + h + subs;
  document.getElementById('bc-val').textContent = eur(p.bal);
}
function balReset(){
  const S = window.__BAL; if (!S || !document.getElementById('bc-val')) return;
  document.getElementById('bc-cursor').style.display = 'none';
  document.getElementById('bc-sel').style.display = 'none';
  const last = S[S.length-1];
  document.getElementById('bc-date').textContent = fDate(last.t);
  document.getElementById('bc-val').textContent = eur(last.bal);
}
document.addEventListener('pointermove', e => { const r = e.target.closest && e.target.closest('.g-hit'); if (r) balSelect(+r.dataset.bi); });
document.addEventListener('pointerdown', e => { const r = e.target.closest && e.target.closest('.g-hit'); if (r) balSelect(+r.dataset.bi); });
document.addEventListener('pointerleave', e => { if (e.target.id === 'balance') balReset(); }, true);
document.addEventListener('click', e => {
  const tf = e.target.closest && e.target.closest('[data-tf]');
  if (tf && tf.dataset.tf !== homeTf) {
    const prev = HOME_TF.findIndex(x => x[0] === homeTf);
    homeTf = tf.dataset.tf;
    const next = HOME_TF.findIndex(x => x[0] === homeTf);
    render();
    const bar = document.querySelector('.tf');
    if (bar && prev >= 0 && next >= 0 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bar.style.setProperty('--tf-i', String(prev));
      bar.classList.add('tf-instant');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!bar.isConnected) return;
        bar.classList.remove('tf-instant');
        bar.style.setProperty('--tf-i', String(next));
      }));
    }
    return;
  }
  const dk = e.target.closest && e.target.closest('[data-desk]');
  if (dk && dk.dataset.desk !== deskRange) { deskRange = dk.dataset.desk; render(); return; }
  const b = e.target.closest && e.target.closest('[data-period]'); if (!b) return;
  balPeriod = b.dataset.period;
  const sec = document.getElementById('balance'); if (sec) sec.outerHTML = balanceChart();
});

screens.pwscan = () => `
<div class="screen"><div class="loader" role="status">
  <div class="spin"></div>
  <h2 style="font-size:20px">Lecture de vos comptes de test…</h2>
  <p class="muted small" style="margin-top:6px">Banque de test Powens. L’analyse se fait dans votre navigateur.</p>
  ${skel()}
  <div class="scanlist" id="pwlist"><div class="done">⟦check⟧ Connexion à la banque de test</div><div id="pw-step">⟦clock⟧ Récupération des opérations…</div></div>
  <div id="pw-err"></div>
</div></div>`;
async function runPwScan(){
  const gen = _viewGen;
  const fail = (title, text) => { if (gen !== _viewGen) return; const e = $('#pw-err'); if (e) e.innerHTML = icons(`<div class="banner err" style="margin-top:18px;text-align:left"><span class="ic">⟦alert⟧</span><div><b>${esc(title)}</b>${esc(text)}</div></div>
    <button class="btn" id="pw-connect">Réessayer</button><a class="btn ghost" href="#/onboarding" id="pw-quit">Revenir à la démo</a>`); };
  const err = PWX.returnError();
  history.replaceState(null, '', location.pathname + '#/pwscan');
  if (err) return fail('Connexion annulée', 'La connexion a été annulée. Vous pouvez réessayer quand vous voulez.');
  const tk = PWX.tokenInfo();
  if (!tk || tk.expired) return fail('Session de test expirée', 'La session de test ne dure que 30 minutes. Relancez la connexion.');
  try {
    const r = await PWX.fetchAll();
    if (gen !== _viewGen) return;
    applyLive(r); state.connected = true; save();
    location.hash = '#/dashboard';
    toast(`${r.subs.length} prélèvement${r.subs.length>1?'s':''} récurrent${r.subs.length>1?'s':''} détecté${r.subs.length>1?'s':''} sur ${r.txCount} opérations${r.history && r.history.limited ? ' (historique court)' : ''}`);
  } catch(e){
    if (gen !== _viewGen) return;
    if (e.status === 401 || e.status === 403) fail('Session de test expirée', 'La session de test n’est plus valable. Relancez la connexion.');
    else fail('Lecture impossible', humanError(e, 'Nous n’avons pas pu lire les comptes de test. Vérifiez votre connexion, puis réessayez.'));
  }
}
async function pwRefresh(){
  const tk = PWX.tokenInfo(); if (!tk || tk.expired) { render(); return toast('Session de test expirée : reconnectez la banque de test'); }
  toast('Relecture des opérations…');
  try { applyLive(await PWX.fetchAll()); render(); toast('Opérations relues'); }
  catch(e){ if (e.status===401||e.status===403){ const t = PWX.tokenInfo(); if (t) sessionStorage.setItem('prelevo-pw-token', JSON.stringify({...t, exp:0})); render(); toast('La session de test a expiré. Reconnectez la banque de test.'); } else toast(humanError(e, 'La relecture a échoué. Réessayez.')); }
}

// ---------- compte Prelevo (API) ----------
let loginSent = null;
screens.connexion = (q) => {
  if (q.get('token')) return `<div class="screen"><div class="loader" role="status"><div class="spin"></div><h2 style="font-size:20px">Connexion…</h2><p class="muted small" style="margin-top:6px">Vérification de votre lien. Cela ne prend qu’un instant.</p>${skel()}</div></div>`;
  if (!API) return screens.onboarding();
  return `
<div class="screen login">
  <div class="topbar"><a class="back" href="#/onboarding">⟦back⟧</a></div>
  ${logoMark('l')}
  <h1 style="font-size:26px;letter-spacing:-.02em;margin-top:18px">${loginSent ? 'Regardez vos e-mails' : 'Connexion'}</h1>
  ${loginSent ? `<p class="muted" style="margin-top:8px;line-height:1.5">Si l’adresse <b>${esc(loginSent)}</b> est la bonne, un lien vient de partir. Il est valable 15 minutes et ne sert qu’une fois. Pensez aussi aux courriers indésirables.</p>
  <button class="btn ghost" id="login-again" style="margin-top:22px">Utiliser une autre adresse</button>`
  : `<p class="muted" style="margin-top:8px;line-height:1.5">Pas de mot de passe. Nous vous envoyons un lien de connexion par e-mail.</p>
  <form id="login-form" class="login-form" novalidate>
    <label for="login-email" class="small" style="font-weight:600">Adresse e-mail</label>
    <input id="login-email" type="email" inputmode="email" autocomplete="email" required placeholder="nom@exemple.fr" enterkeyhint="send">
    <button class="btn" type="submit" id="login-submit">Recevoir mon lien</button>
  </form>
  <p class="fine" style="margin-top:14px">⟦lock⟧ Votre e-mail sert uniquement à vous connecter et à vous envoyer vos alertes. Aucune publicité par e-mail.</p>`}
</div>`;
};
screens.apiwait = () => `
<div class="screen"><div class="loader" role="status">
  <div class="spin"></div>
  <h2 style="font-size:20px">Lecture de vos comptes…</h2>
  <p class="muted small" style="margin-top:6px">La banque transmet vos opérations. Cela peut prendre jusqu’à 30 secondes : vous pouvez laisser cette page ouverte.</p>
  ${skel()}
  <div id="api-err"></div>
</div></div>`;
screens.supprimer = () => !API || !API.loggedIn() ? screens.onboarding() : `
<div class="screen">
  <div class="topbar"><a class="back" href="#/aide">⟦back⟧</a><h1>Supprimer mon compte</h1></div>
  <div class="card">
    <div style="font-weight:700;margin-bottom:6px">Ce qui sera effacé, définitivement :</div>
    <ul class="del-list">
      <li>⟦check⟧<span>votre compte${ME ? ` <b class="brk">${esc(ME.email)}</b>` : ''} et vos sessions</span></li>
      <li>⟦check⟧<span>l’accès à votre banque, aussi chez notre agrégateur (${bankEb() ? 'Enable Banking' : 'Powens'})</span></li>
      <li>⟦check⟧<span>vos opérations, abonnements détectés et alertes</span></li>
    </ul>
    <p class="muted small" style="margin-top:8px">Rien n’est conservé chez ${APP_NAME}. Vous pourrez recréer un compte plus tard, en repartant de zéro.</p>
  </div>
  <label class="del-confirm"><input type="checkbox" id="del-check"> Je comprends que c’est irréversible</label>
  <button class="btn danger" id="api-delete" disabled>Supprimer définitivement</button>
  <a class="btn ghost" href="#/aide">Annuler</a>
</div>`;
async function apiVerify(token){
  history.replaceState(null, '', location.pathname + '#/connexion');
  try { await API.verify(token); toast('Connecté'); await apiLoadMe(); location.hash = ME && ME.bankConnected ? '#/dashboard' : '#/onboarding'; render(); }
  catch(e){ toast(e.message || 'Lien invalide'); location.hash = '#/connexion'; render(); }
}
async function apiFinish(){
  const p = API.returnParams();
  history.replaceState(null, '', location.pathname + '#/apiwait');
  const fail = (t, x) => { const e = $('#api-err'); if (e) e.innerHTML = icons(`<div class="banner err" style="margin-top:18px;text-align:left"><span class="ic">⟦alert⟧</span><div><b>${esc(t)}</b>${esc(x)}</div></div><button class="btn" id="api-connect">Réessayer</button><a class="btn ghost" href="#/onboarding">Plus tard</a>`); };
  if (!p) return fail('Retour de connexion incomplet', 'Relancez la connexion de votre banque.');
  try {
    const r = await API.finishConnect(p);
    await apiLoadMe();
    location.hash = '#/dashboard';
    toast(`${r.subscriptions} prélèvement${r.subscriptions>1?'s':''} récurrent${r.subscriptions>1?'s':''} détecté${r.subscriptions>1?'s':''}${r.history && r.history.limited ? ' (historique court)' : ''}`);
  } catch(e){
    if (e.status === 401) return apiFail(e);
    if (p.error) return fail('Connexion annulée', 'La connexion a été annulée. Vous pouvez réessayer quand vous voulez.');
    // la banque met parfois quelques secondes à transmettre les comptes : on retente via une synchro (le retour n'est valable qu'une fois)
    for (const wait of [4000, 8000, 15000]) {
      await new Promise(ok => setTimeout(ok, wait));
      try { const r = await API.sync(); await apiLoadMe(); if (ME && ME.accounts && ME.accounts.length) { location.hash = '#/dashboard'; toast(`${r.subscriptions} prélèvement${r.subscriptions>1?'s':''} récurrent${r.subscriptions>1?'s':''} détecté${r.subscriptions>1?'s':''}`); return; } }
      catch(e2){ if (e2.status === 401) return apiFail(e2); }
    }
    fail('Lecture impossible', humanError(e, 'Nous n’avons pas pu lire vos comptes. Vérifiez votre connexion, puis réessayez.'));
  }
}

// ---------- routeur ----------
let _viewGen = 0;
const _leave = [];
function onLeave(fn) { _leave.push(fn); }
function leaveView() {
  _viewGen++;
  const fns = _leave.splice(0);
  for (const fn of fns) { try { fn(); } catch (e) {} }
  if (typeof window.__chartEnd === 'function') window.__chartEnd();
  CURVES = [];
  SPARK = null;
  _timeline = null;
  _mounts.length = 0;
  document.querySelectorAll('body > .sub-bar').forEach(n => n.remove());
}
function resetScroll() {
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}
function syncNav(name) {
  const tabbed = ['dashboard','graphiques','operations','abonnements','alertes','premium','abo','banques','banque','budget','export'].includes(name) || (!screens[name]);
  const bar = $('#tabbar');
  const tabName = name==='abo' || name==='operations' || name==='export' ? 'abonnements' : name==='budget' ? 'alertes' : !screens[name] ? 'dashboard' : name;
  if (tabbed) { bar.hidden = false; bar.removeAttribute('aria-hidden'); }
  else { bar.hidden = true; bar.setAttribute('aria-hidden', 'true'); }
  document.querySelectorAll('#tabbar a').forEach(a => {
    const on = a.dataset.tab === tabName;
    a.classList.toggle('on', on);
    if (tabbed && on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  paintAlertBadge();
}
function render(){
  closeCatSheet();
  leaveView();
  const raw = location.hash.replace(/^#\/?/, '') || (API ? (API.loggedIn() && LIVE ? 'dashboard' : 'onboarding') : state.connected ? 'dashboard' : 'onboarding');
  const [path, qs] = raw.split('?');
  const [name, ...args] = path.split('/');
  const fn = screens[name] || screens.dashboard;
  $('#app').innerHTML = icons(fn(new URLSearchParams(qs||''), ...args));
  flushMounts();
  const sub = $('#app .sub-bar'); if (sub) document.body.appendChild(sub);
  if (API && ['onboarding','connexion','dashboard','connect','banques'].includes(name)){ const sc = $('#app').firstElementChild; if (sc && !sc.querySelector('.alpha-note')) sc.insertAdjacentHTML('afterbegin', bankEb() ? '<div class="alpha-note" role="note"><b>Bêta fermée</b> — lecture seule, aucun paiement</div>' : '<div class="alpha-note" role="note"><b>Bêta privée</b> — banques de test uniquement pour l’instant</div>'); }
  syncNav(name);
  resetScroll();
  if (name === 'graphiques') {
    const on = document.querySelector('.desk-tf .on');
    if (on && on.parentElement.scrollWidth > on.parentElement.clientWidth + 1) {
      on.parentElement.scrollLeft = Math.max(0, on.offsetLeft - (on.parentElement.clientWidth - on.offsetWidth) / 2);
    }
  }
  if (name !== 'verrouillage') { lockPhase = ''; setupBuf = ''; setupA = ''; }
  if (name === 'soutiens') loadSupporters();
  if (name==='dashboard') animateHome();
  if (name==='scan') runScan();
  if (name==='pwscan' && PWX && !LIVE) runPwScan();
  if (name==='connexion' && API){ const tk = new URLSearchParams(qs||'').get('token'); if (tk) apiVerify(tk); }
  if (API && !API.loggedIn() && ['dashboard','abonnements','alertes','banques','abo','supprimer','budget','export'].includes(name)){ location.replace('#/onboarding'); }
  if (name==='resilier' && !isP()) toast('La résiliation guidée fait partie de Premium');
}

function runScan(){
  const gen = _viewGen;
  const items = [...document.querySelectorAll('#scanlist div')];
  const timers = [];
  items.forEach((el,i)=> timers.push(setTimeout(()=>{ if (gen !== _viewGen) return; el.classList.add('done'); }, 400 + i*450)));
  timers.push(setTimeout(()=>{
    if (gen !== _viewGen) return;
    state.connected = true; save(); location.hash = '#/dashboard'; toast(SUBS.length + ' abonnements détectés');
  }, 400 + items.length*450 + 500));
  onLeave(() => timers.forEach(clearTimeout));
}

function txEmptyNode(show, query){
  const host = document.querySelector('.act-list');
  if (!host) return;
  let box = host.querySelector('.tx-empty');
  if (!show){ if (box) box.remove(); return; }
  if (box) return;
  host.insertAdjacentHTML('beforeend', icons(emptyState('search', 'Aucune opération', query ? 'Aucun résultat pour cette recherche. Essayez un autre mot.' : 'Rien sur cette période.', 'tx-empty')));
}
function filterBanks(q){
  const s = q.trim().toLowerCase();
  const banks = document.querySelector('.banks');
  if (!banks) return;
  let n = 0;
  banks.querySelectorAll('.bank').forEach(b => {
    const show = !s || (b.textContent || '').toLowerCase().includes(s);
    b.hidden = !show;
    if (show) n++;
  });
  let box = document.querySelector('.banks-empty');
  if (n){ if (box) box.remove(); return; }
  if (!box) banks.insertAdjacentHTML('afterend', icons(emptyState('search', 'Aucune banque', 'Aucune banque ne correspond. Essayez un autre nom.', 'banks-empty')));
}
document.addEventListener('input', e => {
  if (e.target.id === 'bank-q'){ filterBanks(e.target.value); return; }
  if (e.target.id !== 'tx-q') return;
  opsQuery = e.target.value;
  const s = opsQuery.trim().toLowerCase();
  let n = 0;
  document.querySelectorAll('.act-list .mo').forEach(mo => {
    let shown = 0;
    mo.querySelectorAll('.tx').forEach(row => {
      const show = !s || (row.querySelector('.name').textContent || '').toLowerCase().includes(s);
      row.hidden = !show;
      if (show) shown++;
    });
    mo.hidden = !shown;
    n += shown;
  });
  if (document.querySelector('.act-list .mo')) txEmptyNode(!n, s);
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', ev => {
    const data = ev.data || {};
    if (data.type === 'prelevo-open' && typeof data.url === 'string' && data.url.charAt(0) === '#') location.hash = data.url;
  });
}
document.addEventListener('keydown', e => {
  if (document.documentElement.classList.contains('app-locked')) {
    if (/^[0-9]$/.test(e.key)) pressPin(e.key, true);
    else if (e.key === 'Backspace') pressPin('del', true);
    else if (e.key === 'Enter') pressPin('ok', true);
    e.preventDefault();
    return;
  }
  if (e.key === 'Escape' && document.querySelector('.cat-sheet')) { closeCatSheet(); e.preventDefault(); }
});
document.addEventListener('click', e => {
  const pinKey = e.target.closest && e.target.closest('[data-pin]');
  if (pinKey) {
    e.preventDefault();
    pressPin(pinKey.dataset.pin, !!pinKey.closest('.app-lock'));
    return;
  }
  if (e.target.closest('#lock-bio')) { tryUnlockBio(true); return; }
  if (e.target.closest('#lock-start')) { lockPhase = 'choose'; setupBuf = ''; render(); return; }
  if (e.target.closest('#lock-skip')) { lockPhase = ''; render(); return; }
  if (e.target.closest('#lock-enroll')) { enrollBio(); return; }
  if (e.target.closest('#lock-change')) { lockPhase = 'current'; lockPhaseAfterCurrent = 'choose'; setupBuf = ''; render(); return; }
  if (e.target.closest('#lock-off')) { lockPhase = 'current'; lockPhaseAfterCurrent = 'off'; setupBuf = ''; render(); return; }
  const leadBtn = e.target.closest && e.target.closest('[data-lead]');
  if (leadBtn) {
    const all = readLeads();
    all[leadBtn.dataset.sub] = PrelevoGuard.normalizeLead(leadBtn.dataset.lead);
    Store.writeJSON(LEAD_KEY, all);
    render();
    syncPushPlan();
    notifyDue();
    return;
  }
  if (e.target.closest('#enable-push')) { enablePush(); return; }
  if (e.target.closest('#demo-push')) { demoPush(); return; }
  const catBtn = e.target.closest('[data-cat-edit]');
  if (catBtn) { e.preventDefault(); openCatSheet(catBtn.dataset.catName || '', catBtn.dataset.catCurrent || 'autre'); return; }
  if (e.target.closest('[data-cat-close]')) { closeCatSheet(); return; }
  const catPick = e.target.closest('[data-cat-pick]');
  if (catPick) { rememberCategory(catSheetName, catPick.dataset.catPick); return; }
  const ops = e.target.closest('[data-ops]'); if (ops){ opsFilter = ops.dataset.ops; const q = document.getElementById('tx-q'); if (q) opsQuery = q.value; render(); return; }
  const expP = e.target.closest('[data-export-period]'); if (expP){ exportPeriod = expP.dataset.exportPeriod; render(); return; }
  if (e.target.closest('#open-export')){ location.hash = '#/export'; return; }
  if (e.target.closest('#do-export')){ runExport(); return; }
  const th = e.target.closest('[data-theme-set]');
  if (th){ pickTheme(th.dataset.themeSet); return; }
  const thAuto = e.target.closest('[data-theme-auto]');
  if (thAuto && window.PrelevoTheme){
    pickTheme(PrelevoTheme.get() === 'auto' ? (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light') : 'auto');
    return;
  }
  const appIco = e.target.closest('[data-app-icon]');
  if (appIco){ pickIcon(appIco.dataset.appIcon); return; }
  const accBtn = e.target.closest('[data-acc]');
  if (accBtn){
    const open = accBtn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('[data-acc]').forEach(b => {
      const panel = document.getElementById(b.getAttribute('aria-controls'));
      const on = b === accBtn && !open;
      b.setAttribute('aria-expanded', on ? 'true' : 'false');
      if (!panel) return;
      panel.classList.toggle('is-open', on);
      if (on) panel.removeAttribute('inert');
      else panel.setAttribute('inert', '');
    });
    return;
  }
  const el = e.target.closest('[data-bank],[data-method],[data-toast],[data-billing],[data-checkout],[data-portal],[data-alert],[data-af],[data-alert-set],[data-plan],#go-scan,#keep,#confirm-resil,#go-premium,#go-free,#reset,#read-all,#pw-connect,#pw-quit,#pw-refresh,#api-connect,#api-sync,#api-logout,#api-delete,#login-again,#del-check,#copy-letter,#print-letter,#billing-portal,#toggle-balance');
  if (!el) return;
  if (el.dataset.toast){ e.preventDefault(); toast(el.dataset.toast); }
  else if (el.dataset.bank){ state.bank = el.dataset.bank; save(); render(); }
  else if (el.dataset.method){ resil.method = el.dataset.method; render(); }
  else if (el.dataset.billing){ billing = el.dataset.billing; render(); }
  else if (el.dataset.plan){ state.premium = el.dataset.plan==='premium'; save(); toast('Mode démo : ' + (state.premium?'Premium':'Gratuit')); render(); }
  else if (el.dataset.alert){ if(!state.readAlerts.includes(el.dataset.alert)){ state.readAlerts.push(el.dataset.alert); save(); } }
  else if (el.dataset.af){ location.hash = '#/alertes' + (el.dataset.af === 'all' ? '' : '?f=' + el.dataset.af); }
  else if (el.id === 'read-all'){ alerts().forEach(a => { if (!state.readAlerts.includes(a.id)) state.readAlerts.push(a.id); }); save(); toast('Alertes marquées comme lues'); render(); }
  else if (el.dataset.alertSet){
    const k = el.dataset.alertSet;
    if (!isP() && k !== 'bank'){ location.hash = '#/premium'; return; }
    state.alertSets = Object.assign({}, state.alertSets);
    state.alertSets[k] = !alertOn(k);
    save(); render();
  }
  else if (el.id==='api-connect'){ e.preventDefault(); toast('Ouverture de la connexion bancaire…'); API.connectBank().catch(apiFail); }
  else if (el.id==='toggle-balance'){
    state.hideBalance = !state.hideBalance; save();
    const sw = el.querySelector('.cb-ic') && el.querySelector('.sw');
    if (sw) { el.setAttribute('aria-checked', state.hideBalance ? 'true' : 'false'); sw.classList.toggle('on', state.hideBalance); el.querySelector('.cb-ic').innerHTML = icons(state.hideBalance ? '⟦eyeoff⟧' : '⟦eye⟧'); }
    else render();
  }
  else if (el.id==='copy-letter'){ const l = $('.letter'); navigator.clipboard && l ? navigator.clipboard.writeText(l.innerText).then(()=>toast('Lettre copiée'), ()=>toast('Copie impossible')) : toast('Copie impossible'); }
  else if (el.id==='copy-ref'){ const t = refShareText(); navigator.clipboard ? navigator.clipboard.writeText(t).then(()=>toast('Code copié'), ()=>toast(refCode())) : toast(refCode()); }
  else if (el.id==='share-ref'){
    const t = refShareText();
    if (navigator.share) navigator.share({ title: APP_NAME, text: t }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(t).then(()=>toast('Lien copié'), ()=>toast(refCode()));
    else toast(refCode());
  }
  else if (el.id==='ref-add'){
    const input = $('#ref-who');
    const name = (input && input.value || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    if (name.length < 2) return toast('Indiquez un prénom');
    let extra = Store.readJSON('prelevo-refs', []);
    if (!Array.isArray(extra)) extra = [];
    extra.unshift({ name, date: new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'short' }).replace(/\.$/, ''), status:'envoye', detail:'Invitation envoyée' });
    Store.writeJSON('prelevo-refs', extra.slice(0, 20));
    location.hash = '#/parrainage/suivi';
    toast('Invitation notée');
    render();
  }
  else if (el.id==='print-letter'){ const l = $('.letter'); if (!l) return; const w = open('', '_blank'); if (!w) return toast('Autorisez les fenêtres pour imprimer'); w.document.write('<pre style="font:14px/1.5 Georgia,serif;white-space:pre-wrap;max-width:640px;margin:40px auto">' + esc(l.innerText) + '</pre>'); w.document.close(); w.print(); }
  else if (el.id==='api-sync'){ toast('Synchronisation…'); API.sync().then(apiLoadMe).then(()=>{ render(); toast('Comptes à jour'); }).catch(apiFail); }
  else if (el.id==='api-logout'){ API.logout().then(()=>{ ME = null; LIVE = null; state.connected = false; save(); location.replace(location.pathname + '#/onboarding'); location.reload(); }); }
  else if (el.id==='del-check'){ const b = $('#api-delete'); if (b) b.disabled = !el.checked; }
  else if (el.id==='api-delete'){ if (!$('#del-check') || !$('#del-check').checked) return; el.disabled = true; el.textContent = 'Suppression…';
    API.deleteAccount().then(()=>{ Store.remove(KEY); sessionStorage.setItem('prelevo-deleted', '1'); location.replace(location.pathname + '#/onboarding'); location.reload(); })
      .catch(err => { el.disabled = false; el.textContent = 'Supprimer définitivement'; apiFail(err); }); }
  else if (el.id==='login-again'){ loginSent = null; render(); }
  else if (el.id==='pw-connect'){ e.preventDefault(); pwConnect(); }
  else if (el.id==='pw-refresh'){ pwRefresh(); }
  else if (el.id==='pw-quit'){ e.preventDefault(); PWX && PWX.clear(); location.replace(location.pathname + (state.connected ? '#/dashboard' : '#/onboarding')); location.reload(); }
  else if (el.id==='go-scan'){ if(state.bank) location.hash = '#/scan'; }
  else if (el.id==='keep'){ const id = el.dataset.id; state.kept = state.kept || []; if (id && !state.kept.includes(id)) state.kept.push(id); save(); toast('C’est noté : nous ne vous alerterons plus pour cet abonnement.'); render(); }
  else if (el.id==='confirm-resil'){ const id = el.dataset.id; if(!state.resiliated.includes(id)) state.resiliated.push(id); save(); location.hash = '#/resilier/'+id+'/4'; }
  else if (el.id==='go-premium' || el.dataset.checkout){
    if (el.dataset.checkout === 'month' || el.dataset.checkout === 'year') billing = el.dataset.checkout;
    if (API && ME){ el.disabled = true; el.textContent = 'Ouverture du paiement…'; API.checkout(billing).then(r => location.assign(r.url)).catch(e => { el.disabled = false; render(); toast(e.message || 'Paiement indisponible'); }); }
    else { state.premium = true; save(); toast(CFG.trial + ' : Premium activé (simulation)'); render(); } }
  else if (el.id==='go-free'){ state.premium = false; save(); toast('Formule gratuite (simulation)'); render(); }
  else if (el.id==='billing-portal' || el.dataset.portal){ el.disabled = true; API.portal().then(r => location.assign(r.url)).catch(e => { el.disabled = false; toast(e.message || 'Portail indisponible'); }); }
  else if (el.id==='reset'){
    if (!el.dataset.arm) {
      el.dataset.arm = '1';
      const lab = el.querySelector('.acct-lab, .cb-lab');
      if (lab) lab.textContent = 'Touchez encore pour confirmer'; else el.textContent = 'Touchez encore pour confirmer';
      const armTimer = setTimeout(() => { if (!el.isConnected) return; delete el.dataset.arm; if (lab) lab.textContent = 'Réinitialiser les données'; else el.textContent = 'Réinitialiser les données'; }, 4000);
      onLeave(() => clearTimeout(armTimer));
      return;
    }
    Store.remove(KEY);
    Store.remove('prelevo-refs');
    Store.remove(BUDGET_KEY);
    Store.remove(PUSH_KEY);
    Store.remove(CAT_KEY);
    Store.remove(LOCK_KEY);
    Store.remove(LEAD_KEY);
    Store.remove(SENT_KEY);
    if (API && API.pushUnsubscribe && API.loggedIn()) API.pushUnsubscribe().catch(() => {});
    const demo = QS.has('demo') || (!API && !LIVE);
    const q = location.search || (demo ? '?demo=1' : '');
    location.replace(location.pathname + q + (demo ? '#/dashboard' : '#/onboarding'));
    location.reload();
  }
});

document.addEventListener('submit', e => {
  if (e.target.id === 'budget-form'){ e.preventDefault(); saveBudgetFromForm(e.target); return; }
  if (e.target.id === 'login-form'){ e.preventDefault();
    const email = $('#login-email').value.trim(); const btn = $('#login-submit');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return toast('Indiquez une adresse e-mail valide.');
    btn.disabled = true; btn.textContent = 'Envoi…';
    API.requestLink(email).then(()=>{ loginSent = email; render(); }).catch(err => { btn.disabled = false; btn.textContent = 'Recevoir mon lien'; apiFail(err); });
    return; }
  if (e.target.id !== 'chat-form') return;
  e.preventDefault();
  const v = $('#chat-text').value.trim(); if (!v) return;
  const h = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  CHAT.push({ me:true, t:v, h });
  render();
  const reply = setTimeout(()=>{ CHAT.push({ me:false, t:'Merci, je regarde ça et je vous réponds dans quelques minutes (réponse simulée)', h }); if (location.hash.startsWith('#/chat')) render(); }, 1200);
  onLeave(() => clearTimeout(reply));
});

document.addEventListener('visibilitychange', () => {
  if (!lockEnabled()) return;
  if (document.hidden) { lockHiddenAt = Date.now(); return; }
  if (lockHiddenAt && Date.now() - lockHiddenAt >= LOCK_IDLE_MS) openLock(true);
});
if (lockEnabled()) openLock(false);
save.pub = true;
if (PWX && !QS.has('demo')) {
  if (PWX.isReturn()) history.replaceState(null, '', location.pathname + location.search + '#/pwscan');
  else { const r = PWX.result(); if (r) applyLive(r); }
}
publishSubs();
// expiration du jeton de test (30 min) : on rafraîchit l'affichage quand elle survient
setInterval(() => { if (PWX && LIVE && /banques|dashboard|alertes/.test(location.hash)) { const tk = PWX.tokenInfo(); if (tk && tk.expired && !tk._shown) { sessionStorage.setItem('prelevo-pw-token', JSON.stringify({...tk, _shown:1})); render(); toast('Session de test Powens expirée (30 min)'); } } }, 30000);
window.addEventListener('hashchange', render);
function showBootSkeleton(){
  if (QS.has('static') || matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;
  const app = document.getElementById('app');
  if (!app) return 0;
  app.innerHTML = '<div class="screen boot-sk" role="status" aria-live="polite" aria-busy="true"><p class="boot-label">Chargement…</p><div class="sk-home" aria-hidden="true"><i class="sk-line w40"></i><i class="sk-title"></i><i class="sk-hero"></i><i class="sk-line w30"></i><i class="sk-row"></i><i class="sk-row"></i><i class="sk-row"></i></div></div>';
  return 250;
}
setTimeout(() => {
  if (API){
    if (sessionStorage.getItem('prelevo-deleted')){ sessionStorage.removeItem('prelevo-deleted'); setTimeout(()=>toast('Compte supprimé. Toutes vos données ont été effacées.'), 300); }
    if (API.returnParams()){ render(); apiFinish(); }
    else if (API.loggedIn()){ $('#app').innerHTML = icons(screens.apiwait().replace('Lecture de vos comptes…','Chargement…').replace(/<p class="muted small"[^>]*>.*?<\/p>/,'')); apiLoadMe().then(render); }
    else render();
  } else render();
  notifyDue();
  if (lockEnabled()) tryUnlockBio(false);
}, showBootSkeleton());

// ---------- synchro depuis l'accueil (bouton + tirer pour actualiser) ----------
let _syncing = false;
const PTR_GAP = 92;
function placeRadar(open){
  const body = document.querySelector('.screen.home .home-body');
  const bar = document.querySelector('.screen.home .topbar');
  const ptr = document.querySelector('.ptr');
  if (body) {
    body.style.transition = 'transform .32s cubic-bezier(.2,.7,.2,1)';
    body.style.transform = open ? `translateY(${PTR_GAP}px)` : '';
  }
  if (!ptr) return;
  if (open && bar) {
    const h = ptr.offsetHeight || 64;
    ptr.style.top = Math.round(bar.getBoundingClientRect().bottom + Math.max(8, (PTR_GAP - h) / 2)) + 'px';
    ptr.classList.add('on');
    ptr.style.transition = 'opacity .2s ease, transform .2s ease';
    ptr.style.opacity = '1';
    ptr.style.transform = 'translate(-50%, 0) scale(1)';
  } else if (!open) {
    ptr.classList.remove('on');
    ptr.style.transition = 'opacity .25s ease, transform .25s ease';
    ptr.style.opacity = '0';
    ptr.style.transform = 'translate(-50%, 0) scale(.72)';
  }
}
async function homeSync(){
  if (_syncing) return; _syncing = true;
  const syncBtn = document.querySelector('#home-sync');
  syncBtn?.classList.add('on');
  syncBtn?.setAttribute('aria-busy', 'true');
  placeRadar(true);
  const shownAt = Date.now();
  try {
    if (API && ME){ toast('Synchronisation…'); await API.sync(); await apiLoadMe(); _ledger = null; render(); placeRadar(true); toast('Comptes à jour'); }
    else if (PWX && LIVE) await pwRefresh();
    else { await new Promise(r => setTimeout(r, 900)); toast('Comptes à jour (exemple)'); }
  } catch(e){ API ? apiFail(e) : toast('La synchronisation a échoué. Réessayez.'); }
  finally {
    const wait = Math.max(0, 1800 - (Date.now() - shownAt));
    if (wait) await new Promise(r => setTimeout(r, wait));
    _syncing = false;
    const syncDone = document.querySelector('#home-sync');
    syncDone?.classList.remove('on');
    syncDone?.removeAttribute('aria-busy');
    placeRadar(false);
  }
}
(() => {
  let y0 = null, d = 0, pulling = false;
  const ptr = document.createElement('div');
  ptr.className = 'ptr';
  ptr.setAttribute('aria-hidden', 'true');
  ptr.innerHTML = '<i class="ptr-logo"></i>';
  document.body.appendChild(ptr);
  const TRIGGER = 16;
  const onChart = e => !!(e.target && e.target.closest && e.target.closest('.spark'));
  const homePull = () => {
    const h = location.hash;
    const dash = h === '' || h === '#' || h.replace(/^#\/?/, '').startsWith('dashboard');
    return scrollY <= 8 && dash && !!document.querySelector('.home:not(.ops)');
  };
  const place = (dist, animate) => {
    if (ptr.classList.contains('on')) return;
    const body = document.querySelector('.screen.home .home-body');
    if (!body) return;
    const shown = Math.max(0, Math.min(dist, 14));
    body.style.transition = animate ? 'transform .22s ease' : 'none';
    body.style.transform = shown ? `translateY(${shown}px)` : '';
  };
  addEventListener('touchstart', e => {
    if (_syncing || onChart(e) || !e.touches || e.touches.length !== 1) { y0 = null; d = 0; pulling = false; return; }
    y0 = homePull() ? e.touches[0].clientY : null;
    d = 0; pulling = false;
  }, { passive: true });
  addEventListener('touchmove', e => {
    if (y0 == null || onChart(e) || !e.touches) return;
    d = Math.max(0, e.touches[0].clientY - y0);
    if (d > 6) pulling = true;
    if (pulling && e.cancelable) e.preventDefault();
    place(d, false);
  }, { passive: false });
  const finish = () => {
    const go = y0 != null && d >= TRIGGER && !_syncing;
    y0 = null; d = 0; pulling = false;
    if (!go) { place(0, true); return; }
    homeSync();
  };
  addEventListener('touchend', finish);
  addEventListener('touchcancel', () => { y0 = null; d = 0; pulling = false; place(0, true); });
})();

// retour de Stripe Checkout
if (QS.get('billing') === 'success'){ toast('Merci ! Votre Premium s’active…'); history.replaceState(null, '', location.pathname + '#/premium'); if (API && API.loggedIn()) setTimeout(() => apiLoadMe().then(render), 2500); }
else if (QS.get('billing') === 'cancel'){ toast('Paiement annulé : rien n’a été débité'); history.replaceState(null, '', location.pathname + '#/premium'); }

// ---------- scrub du graphique « Solde total » ----------
// iPhone : Safari annule le geste si on appelle setPointerCapture, et les
// pointermove ne suivent pas le doigt. On pilote donc le tactile avec les
// touch events (listener non passif, posé sur le graphique) et une surface
// de toucher pleine (.sp-hit). La souris reste en pointer events.
(() => {
  const JC = ['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'];
  let hapticLabel = null;
  let lastBuzz = 0;
  const buzz = ms => {
    try { if (typeof navigator.vibrate === 'function') { navigator.vibrate(ms); return; } } catch (e) {}
    // iOS 17.4+ : un <input switch> cliqué dans le geste déclenche un tap haptique. Sinon, on ignore.
    try {
      if (!hapticLabel) {
        const label = document.createElement('label');
        label.setAttribute('aria-hidden', 'true');
        label.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.setAttribute('switch', '');
        input.tabIndex = -1;
        input.setAttribute('aria-hidden', 'true');
        label.appendChild(input);
        document.body.appendChild(label);
        hapticLabel = label;
      }
      hapticLabel.click();
    } catch (e) {}
  };
  document.addEventListener('pointerdown', e => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hit = e.target.closest && e.target.closest('a, button, summary, [role="tab"]');
    if (!hit || hit.closest('.spark') || hit.disabled || hit.getAttribute('aria-disabled') === 'true') return;
    const now = Date.now();
    if (now - lastBuzz < 70) return;
    lastBuzz = now;
    buzz(8);
  }, { passive: true });
  let st = null, raf = 0;
  const restoreOne = el => {
    if (!el) return;
    el.classList.remove('scrub');
    const o = el._orig; if (!o) return;
    const amt = el.classList.contains('home-spark') ? document.querySelector('.total [data-count]') : null;
    const dl = el.classList.contains('home-spark') ? document.getElementById('sp-delta') : null;
    if (amt) { delete amt.dataset.scrub; amt.innerHTML = o.a; }
    if (dl) dl.innerHTML = o.d;
    const dot = el.querySelector('.sp-dot'); if (dot) { dot.hidden = false; dot.style.left = o.l; dot.style.top = o.t; dot.classList.toggle('is-partial', !!o.partial); }
    const vl = el.querySelector('.sp-vline'); if (vl) vl.hidden = true;
    const tip = el.querySelector('.sp-tip'); if (tip) tip.hidden = true;
    const read = el.querySelector('.sp-read'); if (read && o.r != null) read.innerHTML = o.r;
    const S = el._data;
    if (S) {
      const line = el.querySelector('.sp-line'), dim = el.querySelector('.sp-dim'), area = el.querySelector('.sp-area');
      if (line) line.setAttribute('d', S.line);
      if (area) area.setAttribute('d', S.area);
      if (dim) dim.setAttribute('d', '');
    }
    delete el._orig;
  };
  const restore = el => {
    if (!el) return;
    const link = el.dataset.link;
    const group = link ? [...document.querySelectorAll(`.spark[data-link="${link}"]`)] : [el];
    group.forEach(restoreOne);
    const tape = document.querySelector('.desk .tape');
    if (tape && tape._orig) {
      const bs = tape.querySelectorAll('b');
      tape._orig.forEach((o, n) => { if (!bs[n]) return; bs[n].textContent = o.t; bs[n].className = o.c; });
      delete tape._orig;
      tape.classList.remove('on');
      delete tape.dataset.mo;
    }
  };
  const segPath = arr => arr.map((p, n) => (n ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const tipWhen = (t, fmt, partial) => {
    const s = fmt === 'hour' ? t.getDate() + ' ' + MOIS[t.getMonth()] + ' · ' + String(t.getHours()).padStart(2, '0') + ' h' : fmt === 'month' ? MOIS[t.getMonth()] + ' ' + t.getFullYear() : t.getDate() + ' ' + MOIS[t.getMonth()] + ' ' + t.getFullYear();
    return partial ? s + ' · estimation' : s;
  };
  const tipEUR = n => { const v = Math.round(n * 100) / 100; const s = Math.abs(v).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); return (v < 0 ? '−' : '') + s + ' €'; };
  const showTip = (el, xPct, value, when) => {
    const tip = el.querySelector('.sp-tip');
    if (!tip) return;
    if (state.hideBalance) { tip.hidden = true; return; }
    tip.hidden = false;
    tip.querySelector('b').textContent = value;
    tip.querySelector('span').textContent = when;
    const x = Math.max(0, Math.min(100, xPct));
    tip.style.left = x + '%';
    tip.classList.toggle('flip', x > 62);
  };
  const snap = (el, S, i, withTip) => {
    const p = S.pts[i], poly = S.poly;
    el.classList.add('scrub');
    const vl = el.querySelector('.sp-vline'), dot = el.querySelector('.sp-dot');
    if (vl) { vl.hidden = false; vl.style.left = p.x + '%'; }
    if (dot) { dot.hidden = false; dot.style.left = p.x + '%'; dot.style.top = p.y + '%'; dot.classList.toggle('is-partial', !!p.partial); }
    const left = poly.slice(0, i + 1), right = poly.slice(i);
    const line = el.querySelector('.sp-line'), dim = el.querySelector('.sp-dim'), area = el.querySelector('.sp-area');
    if (line) line.setAttribute('d', segPath(left));
    if (dim) dim.setAttribute('d', segPath(right));
    const sx = poly[i][0], sy = poly[i][1];
    if (area) area.setAttribute('d', segPath(left) + ` L${sx.toFixed(1)},${S.H} L${poly[0][0].toFixed(1)},${S.H} Z`);
    const read = el.querySelector('.sp-read');
    const when = deskWhen(S.fmt, p.t, p.partial);
    const num = S.idx ? String(Math.round(p.v)) : S.signed ? sgnEUR(p.v) : (S.fmt === 'month' ? kEUR(p.v) : p.v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €');
    if (read && !state.hideBalance) read.innerHTML = `<span>${when}</span><b>${num}</b>`;
    if (withTip) showTip(el, p.x, num, tipWhen(p.t, S.fmt, p.partial));
    else { const tip = el.querySelector('.sp-tip'); if (tip) tip.hidden = true; }
  };
  const paintDesk = () => {
    const i = Math.max(0, st.i);
    const group = [...document.querySelectorAll(`.spark[data-link="${st.data.link}"]`)];
    const bag = {};
    let when = '';
    group.forEach(el => {
      const S = el._data || chartData(el);
      if (!S || !S.pts.length) return;
      const at = Math.min(i, S.pts.length - 1);
      if (!el._orig) {
        const dot = el.querySelector('.sp-dot'), read = el.querySelector('.sp-read');
        el._data = S;
        el._orig = { r: read ? read.innerHTML : null, l: dot ? dot.style.left : '', t: dot ? dot.style.top : '', partial: dot ? dot.classList.contains('is-partial') : false };
      }
      snap(el, S, at, el === st.el);
      bag[S.slot] = S.pts[at].v;
      if (!when) when = deskWhen(S.fmt, S.pts[at].t, S.pts[at].partial);
    });
    const tape = document.querySelector('.desk .tape');
    if (tape && !state.hideBalance) {
      const bs = [...tape.querySelectorAll('b')];
      if (!tape._orig) tape._orig = bs.map(b => ({ t: b.textContent, c: b.className }));
      tape.classList.add('on');
      tape.dataset.mo = when;
      if (bag.income != null && bs[0]) bs[0].textContent = kEUR(bag.income);
      if (bag.spend != null && bs[1]) bs[1].textContent = kEUR(bag.spend);
      if (bag.net != null && bs[2]) { bs[2].textContent = sgnEUR(bag.net); bs[2].className = bag.net >= 0 ? 'up' : 'down'; }
    }
  };
  const paint = () => {
    if (!st || !st.data || st.axis === 'y' || st.f == null) return;
    if (st.data.link) { paintDesk(); return; }
    const S = st.data;
    const P = S.pts;
    const f = Math.min(P[P.length - 1].x, Math.max(P[0].x, st.f));
    let i = 1;
    while (i < P.length - 1 && P[i].x < f) i++;
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i)];
    const span = b.x - a.x, u = span ? Math.min(1, Math.max(0, (f - a.x) / span)) : 0;
    const y = a.y + (b.y - a.y) * u, v = a.v + (b.v - a.v) * u;
    const t = new Date(a.t.getTime() + (b.t.getTime() - a.t.getTime()) * u);
    const amt = st.home ? document.querySelector('.total [data-count]') : null;
    const dl = st.home ? document.getElementById('sp-delta') : null;
    st.el.classList.add('scrub');
    if (st.vl) { st.vl.hidden = false; st.vl.style.left = f + '%'; }
    if (st.dot) { st.dot.hidden = false; st.dot.style.left = f + '%'; st.dot.style.top = y + '%'; }
    const poly = S.poly, ai = Math.max(0, i - 1), bi = Math.min(poly.length - 1, i);
    const pa = poly[ai], pb = poly[bi];
    const sx = pa[0] + (pb[0] - pa[0]) * u, sy = pa[1] + (pb[1] - pa[1]) * u;
    const seg = arr => arr.map((p, n) => (n ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const left = poly.slice(0, ai + 1).concat([[sx, sy]]);
    const right = [[sx, sy]].concat(poly.slice(bi));
    const line = st.el.querySelector('.sp-line'), dim = st.el.querySelector('.sp-dim'), area = st.el.querySelector('.sp-area');
    if (line) line.setAttribute('d', seg(left));
    if (dim) dim.setAttribute('d', seg(right));
    if (area) area.setAttribute('d', seg(left) + ` L${sx.toFixed(1)},${S.H} L${poly[0][0].toFixed(1)},${S.H} Z`);
    if (st.home) {
      if (amt && !state.hideBalance) { amt.dataset.scrub = '1'; amt.innerHTML = money(v); }
      if (dl && !state.hideBalance) {
        const hh = String(t.getHours()).padStart(2, '0'), mm = String(t.getMinutes()).padStart(2, '0');
        dl.innerHTML = `<span class="scrub-when">${JC[t.getDay()]} ${t.getDate()} ${MOIS[t.getMonth()]} à ${hh}:${mm}</span>`;
      }
      showTip(st.el, f, tipEUR(v), tipWhen(t, S.fmt || 'day', false));
    } else {
      const read = st.el.querySelector('.sp-read');
      const when = S.fmt === 'hour' ? String(t.getHours()).padStart(2, '0') + ' h' : S.fmt === 'month' ? MOIS[t.getMonth()] + ' ' + t.getFullYear() : t.getDate() + ' ' + MOIS[t.getMonth()];
      const num = S.idx ? String(Math.round(v)) : S.signed ? sgnEUR(v) : (S.fmt === 'month' ? kEUR(v) : v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €');
      if (read && !state.hideBalance) read.innerHTML = `<span>${when}</span><b>${num}</b>`;
      showTip(st.el, f, num, tipWhen(t, S.fmt || 'day', false));
    }
  };
  const frame = () => { raf = 0; paint(); };
  const sched = () => { if (!raf) raf = requestAnimationFrame(frame); };
  const xOf = clientX => {
    const box = st.el.querySelector('.spark-plot') || st.el;
    const r = box.getBoundingClientRect(), w = r.width || 1;
    return Math.min(100, Math.max(0, (clientX - r.left) / w * 100));
  };
  const syncDay = (clientX, haptic) => {
    if (!st || !st.data) return;
    const f = xOf(clientX), P = st.data.pts;
    let i = 0, best = 1e9;
    for (let k = 0; k < P.length; k++) { const dist = Math.abs(P[k].x - f); if (dist < best) { best = dist; i = k; } }
    if (haptic && st.i >= 0 && i !== st.i) buzz(8);
    st.i = i; st.f = f;
  };
  const chartData = el => el.dataset.curve != null ? CURVES[+el.dataset.curve] : (el.classList.contains('home-spark') ? SPARK : null);
  const arm = (el, clientX, clientY) => {
    const data = chartData(el); if (!data) return false;
    const amt = data.home ? document.querySelector('.total [data-count]') : null;
    const dl = data.home ? document.getElementById('sp-delta') : null;
    const dot = el.querySelector('.sp-dot'), read = el.querySelector('.sp-read');
    st = { el, data, home: !!data.home, i: -1, axis: null, x0: clientX, y0: clientY, lastY: clientY, pointerId: null, vl: el.querySelector('.sp-vline'), dot };
    el._data = data;
    el._orig = {
      a: (state.hideBalance || !amt || !amt.dataset.count) ? (amt ? amt.innerHTML : '') : money(+amt.dataset.count),
      d: dl ? dl.innerHTML : '',
      r: read ? read.innerHTML : null,
      l: dot ? dot.style.left : '',
      t: dot ? dot.style.top : '',
      partial: dot ? dot.classList.contains('is-partial') : false
    };
    syncDay(clientX, false);
    paint();
    return true;
  };
  const end = () => {
    if (!st) return;
    const el = st.el; st = null;
    if (raf) cancelAnimationFrame(raf), raf = 0;
    restore(el);
  };
  // Écouteurs posés tout de suite (pas pendant le touchstart) : sinon iOS
  // considère le touchmove comme passif et le doigt ne fait que faire défiler.
  document.addEventListener('touchstart', e => {
    if (st || !e.touches || e.touches.length !== 1) return;
    const el = e.target.closest && e.target.closest('.sp-hit');
    if (!el) return;
    const spark = el.closest('.spark');
    if (!spark || !chartData(spark)) return;
    const t = e.touches[0];
    arm(spark, t.clientX, t.clientY);
  }, { passive: true, capture: true });
  document.addEventListener('touchmove', e => {
    if (!st) return;
    const t = e.touches && e.touches[0];
    if (!t || e.touches.length > 1) { end(); return; }
    if (!st.axis) {
      const dx = t.clientX - st.x0, dy = t.clientY - st.y0;
      if (dx * dx + dy * dy >= 64) st.axis = Math.abs(dx) >= Math.abs(dy) * 0.85 ? 'x' : 'y';
    }
    if (st.axis === 'y') {
      const dy = t.clientY - st.lastY; st.lastY = t.clientY;
      if (raf) cancelAnimationFrame(raf), raf = 0;
      const el = st.el; st.i = -1; st.f = null; restore(el);
      window.scrollBy(0, -dy);
      return;
    }
    if (e.cancelable) e.preventDefault();
    syncDay(t.clientX, st.axis === 'x');
    sched();
  }, { passive: false, capture: true });
  document.addEventListener('touchend', e => {
    if (!st) return;
    if (e.touches && e.touches.length) return;
    end();
  }, { passive: true, capture: true });
  document.addEventListener('touchcancel', () => { if (st && st.pointerId == null) end(); }, { passive: true, capture: true });

  document.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button > 0) return;
    const hit = e.target.closest && e.target.closest('.sp-hit');
    if (!hit) return;
    const el = hit.closest('.spark');
    if (!el || !chartData(el)) return;
    if (st) end();
    arm(el, e.clientX, e.clientY);
    st.axis = 'x'; st.pointerId = e.pointerId;
    syncDay(e.clientX, true);
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
  });
  document.addEventListener('pointermove', e => {
    if (!st || st.pointerId == null || e.pointerId !== st.pointerId) return;
    syncDay(e.clientX, true); sched();
  });
  const pend = e => { if (!st || st.pointerId == null || e.pointerId !== st.pointerId) return; end(); };
  document.addEventListener('pointerup', pend);
  document.addEventListener('pointercancel', pend);

  window.__chartEnd = end;
  window.__scrubTo = f => {
    const el = document.querySelector('.spark.home-spark') || document.querySelector('.spark');
    if (!el || !chartData(el)) return;
    if (st) end();
    const r = el.getBoundingClientRect();
    arm(el, r.left + r.width * f, r.top + r.height / 2);
    st.axis = 'x';
    syncDay(r.left + r.width * f, false);
    paint();
  };
})();
if (QS.has('demo') && QS.get('scrub')) setTimeout(() => window.__scrubTo(+QS.get('scrub')), 600);  // captures

document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-pidx-info]'); if (!b) return;
  const box = document.getElementById('pidx-info'), btn = document.querySelector('.pidx-i');
  if (!box || !btn) return;
  const open = box.hidden;
  box.hidden = !open; btn.setAttribute('aria-expanded', String(open));
  if (!open) btn.focus();
});
