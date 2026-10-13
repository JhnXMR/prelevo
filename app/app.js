/* Prelevo – maquette cliquable. TOUTES LES DONNÉES SONT DES EXEMPLES FICTIFS. */
'use strict';
const CFG = window.APP_CONFIG || { name:'Prelevo', tagline:'l’app qui traque vos abonnements', priceMonth:1.99, priceYear:14.99, trial:'1 mois offert pour essayer', supportEmail:'support@exemple.fr' };
const APP_NAME = CFG.name;
document.title = `${APP_NAME} – ${CFG.tagline}`;

const USER = { prenom: 'Camille', nom: 'Exemple', adresse: '12 rue de l’Exemple\n75011 Paris' };
let INCOME = 2150;          // salaire net (exemple)
let RENT = 720;             // loyer (exemple)
let SPENT = 832;            // courses, essence, restos déjà passés depuis la paie (exemple)
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

// ---------- état (localStorage) ----------
const KEY = 'prelevo-demo';
const state = Object.assign({ connected:false, bank:null, resiliated:[], premium:false, readAlerts:[], hideBalance:false }, JSON.parse(localStorage.getItem(KEY) || '{}'));
const save = () => localStorage.setItem(KEY, JSON.stringify(state));
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
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
  demoTag = '<span class="demo live">Banque de test</span>';
}
function apiFail(e){
  if (e && e.status === 401){ ME = null; LIVE = null; toast('Session expirée : reconnectez-vous'); location.hash = '#/connexion'; return; }
  toast(e && e.message ? e.message : 'Erreur');
}
async function apiLoadMe(){ try { applyServer(await API.me()); } catch(e){ apiFail(e); } }
const sandboxNote = () => window.PW && API ? `<div class="pw-note"><b>Banque de test (sandbox Powens)</b>
  ${window.PW.testCreds.map(c=>`<div><span>${c.bank}</span>${c.fields}</div>`).join('')}
  <p>Pendant la bêta privée, seules les fausses banques de test sont proposées.</p></div>` : '';
const notBank = (extra='') => `<p class="notbank ${extra}">⟦shield⟧<span><b>${APP_NAME} n’est pas une banque.</b> C’est une télécommande élégante pour celles que vous avez déjà : on s’y branche en lecture seule, via un agrégateur agréé par l’ACPR.</span></p>`;
const pwNote = () => `<div class="pw-note"><b>Identifiants de test Powens</b>
  ${(PWX ? PWX.testCreds : []).map(c=>`<div><span>${c.bank}</span>${c.fields}</div>`).join('')}
  <p>Fausses banques, faux comptes : aucune vraie donnée. Session de test valable 30 min, gardée seulement dans cet onglet.</p></div>`;
function pwConnect(){
  if (!PWX) return toast('Module Powens indisponible');
  toast('Ouverture de la banque de test Powens…');
  PWX.start().catch(err => toast('Powens injoignable : ' + err.message));
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
  chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  bank:'<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  send:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  star:'<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  back:'<path d="M15 5l-7 7 7 7"/>',
  chev:'<path d="M9 6l6 6-6 6"/>',
  eye:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M3 3l18 18"/><path d="M10.6 6.2A10 10 0 0 1 12 6c6.5 0 10 6 10 6a18 18 0 0 1-3.2 3.8"/><path d="M6.1 6.7C3.6 8.4 2 12 2 12s3.5 6 10 6c1.5 0 2.8-.3 4-.8"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
};
const icons = html => html.replace(/⟦(\w+)⟧/g, (_, n) => ICONS[n] ? SVG(ICONS[n]) : '').replace(/<a class="back"(?![^>]*aria-label)/g, '<a class="back" aria-label="Retour"');
const emptyState = (ic, title, text) => `<div class="empty" role="status"><span class="empty-ic">⟦${ic}⟧</span><b>${title}</b><p>${text}</p></div>`;
const skel = () => `<div class="sk" aria-hidden="true"><i class="lg"></i><i></i><i></i><i class="short"></i></div>`;

// ---------- utilitaires ----------
const eur = n => n.toLocaleString('fr-FR', { minimumFractionDigits:2, maximumFractionDigits:2 }) + ' €';
const prix = n => n.toLocaleString('fr-FR', { minimumFractionDigits:2, maximumFractionDigits:2 }) + ' €';
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
const lum = hex => { const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return 0; const n = parseInt(m[1], 16), c = [n >> 16, n >> 8 & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const bankTile = (b, cls = '', extra = '') => {
  const bg = /^#[0-9a-f]{6}$/i.test(b.color || '') ? b.color : '#0066FF', fg = b.fg || (lum(bg) > .45 ? '#0A0B0D' : '#FFFFFF');
  const ini = esc(b.ini || String(b.name || 'B').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase());
  const img = b.logo && /^https:\/\//.test(b.logo) ? `<img src="${esc(b.logo)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.remove('has-logo');this.remove()">` : '';
  return `<span class="bk-tile ${img ? 'has-logo' : ''} ${String(ini).length > 2 ? 'x3' : ''} ${cls}" style="--bk:${bg};--bkf:${fg}" title="${esc(b.name)}">${img}<b>${ini}</b>${extra}</span>`;
};
const logo = (s, cls='logo') => `<div class="${cls}" style="background:${s.color}">${s.ini}</div>`;
const increase = s => s.prev && s.price > s.prev ? s.price - s.prev : 0;
const pct = s => Math.round(increase(s) / s.prev * 100);
let demoTag = '<span class="demo">Données d’exemple</span>';
const lockBadge = (t='Premium') => `<span class="badge b-lock">⟦lock⟧ ${t}</span>`;
const neutral = `<div class="neutral"><span class="nic">⟦ban⟧</span><div><b>Zéro pub en Premium · conseils toujours neutres</b>La version gratuite affiche quelques pubs, toujours signalées « Sponsorisé ». Les sponsors n’influencent jamais vos alertes, vos résultats ni nos conseils, et on ne touche aucune commission sur vos résiliations.</div></div>`;
// Pubs de la version gratuite (annonceurs FICTIFS, publicité contextuelle, sans ciblage)
const ADS = {
  dash: { ini:'VC', color:'#0A0B0D', brand:'Vélo Clair', tag:'Marque fictive', title:'Le vélo électrique en location, sans engagement', text:'Premier mois à 19 € au lieu de 39 €. Livraison en 48 h.', cta:'Découvrir' },
  subs: { ini:'PM', color:'#0066FF', brand:'Papeterie Mirabelle', tag:'Marque fictive', title:'Carnets et agendas 2027', text:'−15 % sur la collection d’automne, livraison offerte dès 25 €.', cta:'Voir l’offre' }
};
const adSlot = k => { if (isP()) return ''; const a = ADS[k]; return `<div class="ad" role="complementary" aria-label="Publicité">
  <div class="ad-h"><span class="ad-tag">Sponsorisé</span><a href="#/premium">Retirer les pubs · Premium ${prix(CFG.priceMonth)}/mois</a></div>
  <a class="ad-body" href="#/${k==='dash'?'dashboard':'abonnements'}" data-toast="Publicité d’exemple : ${a.brand} est une marque fictive">
    <span class="ad-logo" style="background:${a.color}">${a.ini}</span>
    <div class="ad-txt"><span class="ad-brand">${a.brand} <i>${a.tag}</i></span><b>${a.title}</b><span>${a.text}</span></div>
    <span class="ad-cta">${a.cta}</span></a></div>`; };
const teaser = (title, text) => `<a class="teaser" href="#/premium"><div class="tl">⟦lock⟧</div><div><b>${title}</b><span>${text}</span></div><div class="tc">Débloquer</div></a>`;
function toast(msg){ const t=$('#toast'); t.textContent=msg.replace(/⟦\w+⟧\s?/g,''); t.classList.add('show'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'),2200); }

function totals(){
  const list = active();
  const monthly = list.reduce((a,s)=>a+s.price,0);
  const ups = list.filter(increase);
  const upsAmt = ups.reduce((a,s)=>a+increase(s),0);
  const smalls = list.filter(s=>s.small);
  const dups = list.filter(s=>s.duplicate && !state.resiliated.includes(s.duplicate));
  const found = upsAmt + smalls.reduce((a,s)=>a+s.price,0) + dups.reduce((a,s)=>a+s.price,0);
  const achieved = PAST_SAVED + SUBS.filter(s=>state.resiliated.includes(s.id)).reduce((a,s)=>a+s.price,0);
  const fixed = RENT + monthly;
  const reste = INCOME - fixed - SPENT;
  return { list, monthly, ups, upsAmt, smalls, dups, found, achieved, fixed, reste };
}

function alertOn(set){
  const p = state.alertSets || {};
  return p[set] !== false;
}
function alerts(){
  const t = totals(); const out = [];
  const grp = w => /Aujourd|matin|Maintenant|2 h/.test(w) ? 'Aujourd’hui' : /Hier|5 j/.test(w) ? 'Cette semaine' : 'Plus tôt';
  const add = a => { a.group = grp(a.when); out.push(a); };
  t.ups.forEach(s => add({ id:'up-'+s.id, kind:'up', set:'up', ic:'⟦trend⟧', amt:'+'+eur(increase(s)), title:s.name,
    text:`Prix passé de ${eur(s.prev)} à ${eur(s.price)}`, when: s.id==='flixo'?'Il y a 2 h':'Détecté lors du scan', link:'#/abo/'+s.id }));
  t.list.filter(s=>s.trial).forEach(s => add({ id:'trial-'+s.id, kind:'trial', set:'trial', ic:'⟦clock⟧', amt:'−'+eur(s.price), title:s.name,
    text:'Essai gratuit devenu payant', when:'Il y a 5 j', link:'#/abo/'+s.id }));
  t.dups.forEach(s => add({ id:'dup-'+s.id, kind:'dup', set:'dbl', ic:'⟦copy⟧', amt:'−'+eur(s.price), title:s.name,
    text:`Doublon avec ${byId(s.duplicate).name}`, when:'Hier', link:'#/abo/'+s.id }));
  t.list.filter(s=>s.doubleCharge).forEach(s => add({ id:'dbl-'+s.id, kind:'dbl', set:'dbl', ic:'⟦alert⟧', amt:'−'+eur(s.price), title:s.name,
    text:`Prélevé deux fois le ${s.doubleCharge}`, when:'Ce matin', link:'#/abo/'+s.id }));
  const next = t.list.filter(s=>s.day>=9 && s.day<=12).sort((a,b)=>a.day-b.day);
  next.forEach(s => add({ id:'next-'+s.id, kind:'next', set:'next', ic:'⟦calendar⟧', amt:'−'+eur(s.price), title:s.name,
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
  const kept = out.filter(a => alertOn(a.set || 'bank'));
  const first = kept.filter(a=>!a.premium).concat(kept.filter(a=>a.id==='dbl-mobi'||a.id==='up-flixo'));
  const rest = kept.filter(a=>!first.includes(a));
  return [...first, ...rest.filter(a=>a.kind!=='up'), ...rest.filter(a=>a.kind==='up')];
}

// ---------- écrans ----------
const screens = {};
const brandBar = (right=demoTag) => `<div class="topbar"><div class="brand"><i class="brand-mark" aria-hidden="true"></i>${APP_NAME}</div>${right}</div>`;
function logoMark(size){
  const id = appIcon();
  const tone = id === 'noir' ? 't-noir' : id === 'defaut' ? 't-defaut' : 't-bleu';
  const inner = id === 'bleu' ? '<img src="icons/logo-mark.svg" alt="">' : '<i class="glyph"></i>';
  return `<span class="logo-chip ${size || ''} ${tone}">${inner}</span>`;
}
const yearSave = () => Math.round((1 - CFG.priceYear / (CFG.priceMonth*12)) * 100);

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
  ${API ? (API.loggedIn() ? `<button class="btn" id="api-connect">⟦bank⟧ Connecter ma banque</button>
  <button class="btn ghost" id="api-logout" style="margin-top:8px">Se déconnecter</button>`
    : `<a class="btn" href="#/connexion">⟦mail⟧ Se connecter avec mon e-mail</a>
  <a class="btn ghost" href="?demo=1#/dashboard" style="margin-top:8px">Voir la démo (données d’exemple)</a>`) : `<a class="btn" href="#/connect">Connecter ma banque</a>
  ${PWX ? `<button class="btn ghost" id="pw-connect" style="margin-top:8px">⟦bank⟧ Connecter une banque de test</button>` : ''}`}
  <p class="fine">⟦lock⟧ Gratuit pour commencer, Premium à ${prix(CFG.priceMonth)}/mois.<br>Accès en lecture seule via un agrégateur bancaire agréé. ${APP_NAME} ne peut jamais déplacer votre argent.<br>${API ? 'Bêta privée – banques de test uniquement' : 'Maquette – données d’exemple'}</p>
</div>`;

screens.connect = () => `
<div class="screen">
  <div class="topbar"><a class="back" href="#/onboarding">⟦back⟧</a>${demoTag}</div>
  <h1 style="font-size:24px;letter-spacing:-.02em">Choisissez votre banque</h1>
  <p class="muted small" style="margin-top:6px">Connexion sécurisée, en lecture seule (simulation).</p>
  ${notBank()}
  <div class="search" style="margin-top:16px">⟦search⟧ Rechercher une banque</div>
  <div class="banks">${BANKS.map(b=>`<button class="bank ${state.bank===b.id?'on':''}" data-bank="${b.id}">${bankTile(b)}<span>${b.name}</span></button>`).join('')}</div>
  <p class="fine" style="margin:-4px 2px 14px">Noms de banques cités à titre d’exemple dans cette démo : ${APP_NAME} n’est affilié à aucune d’elles. Monogrammes aux couleurs approximatives des marques.</p>
  <div class="banner blue"><span class="ic">⟦lock⟧</span><div><b>Vos identifiants restent chez votre banque</b>${APP_NAME} passe par un agrégateur agréé (DSP2). L’accès dure 180 jours : on vous prévient avant qu’il expire, et vous pouvez le retirer à tout moment.</div></div>
  <button class="btn mint" id="go-scan" ${state.bank?'':'disabled style="opacity:.5"'}>Continuer</button>
  ${PWX ? `<div class="section-h"><h2>Ou essayez une vraie connexion… de test</h2></div>
  <p class="muted small" style="margin:-4px 2px 10px">Passez par l’agrégateur Powens avec ses fausses banques : ${APP_NAME} analyse alors de vraies opérations de test.</p>
  <button class="btn ghost" id="pw-connect">⟦bank⟧ Connecter une banque de test</button>
  ${pwNote()}` : ''}
</div>`;

screens.scan = () => `
<div class="screen"><div class="loader">
  <div class="spin"></div>
  <h2 style="font-size:20px">Analyse de vos 12 derniers mois…</h2>
  <p class="muted small" style="margin-top:6px">Simulation – aucune vraie banque n’est contactée</p>
  <div class="scanlist" id="scanlist">
    <div>⟦check⟧ Connexion à ${(BANKS.find(b=>b.id===state.bank)||BANKS[0]).name}</div>
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
    <div class="bs-txt">${b.status==='expired' ? '<b class="t-amber">Session de test expirée · reconnecter</b>' : `<b>${b.name} · ${API ? 'synchro il y a ' + (LIVE.at ? ago(LIVE.at) : '—') : 'banque de test'}</b>`}<span>${b.accounts}</span></div>
    <span class="chev">⟦chev⟧</span></a>`; }
  const warn = L.find(b=>b.status==='error') || L.find(b=>b.expiresIn<=7);
  return `<a class="bankstrip" href="#/banques">
    <div class="bs-logos">${L.map(b=>bankTile(b, 'bs-l', `<i class="st ${b.status==='error'?'err':b.expiresIn<=7?'warn':'ok'}"></i>`)).join('')}</div>
    <div class="bs-txt">${warn ? (warn.status==='error' ? `<b class="t-red">${warn.name} : synchro en échec</b>` : `<b class="t-amber">Accès ${warn.name} : expire dans ${warn.expiresIn} j</b>`) : '<b>Comptes à jour</b>'}<span>${L.length} banque${L.length>1?'s':''} · synchro ${L[0].sync}</span></div>
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
const CATS = {
  courses:{ ic:'cart', l:'Courses' }, resto:{ ic:'cup', l:'Restos & cafés' }, transport:{ ic:'train', l:'Transports' },
  shopping:{ ic:'bag', l:'Shopping' }, sante:{ ic:'heart', l:'Santé' }, logement:{ ic:'home', l:'Logement' },
  energie:{ ic:'bolt', l:'Énergie' }, telecom:{ ic:'wifi', l:'Téléphone & internet' }, abo:{ ic:'repeat', l:'Abonnement' },
  revenu:{ ic:'income', l:'Revenu' }, virement:{ ic:'swap', l:'Virement' }, retrait:{ ic:'cash', l:'Retrait' },
  loisirs:{ ic:'ticket', l:'Loisirs' }, voyage:{ ic:'plane', l:'Voyage' }, pret:{ ic:'bank', l:'Prêt' }, autre:{ ic:'dot', l:'Autre' },
};
const CAT_RULES = [
  [/LOYER|AGENCE|SYNDIC/, 'logement'],
  [/SUPERMARCH|SUP[EÉ]RETTE|MARCH[EÉ]\b|PRIMEUR|BOULANG|[EÉ]PICERIE|CARREFOUR|MONOPRIX|LIDL|FRANPRIX|AUCHAN|LECLERC|INTERMARCH|PICARD/, 'courses'],
  [/RESTAURANT|CAF[EÉ]\b|BRASSERIE|CANTINE|\bBAR\b|PIZZ|SUSHI|BURGER|DELIVEROO|UBER ?EATS|BOULANGERIE/, 'resto'],
  [/PHARMACIE|M[EÉ]DECIN|DOCTEUR|DENTISTE|MUTUELLE|SANT[EÉ]|OPTIC/, 'sante'],
  [/BILLET|AVION|AIR ?FRANCE|H[OÔ]TEL|AIRBNB|VOYAGE/, 'voyage'],
  [/SNCF|RATP|NAVIGO|M[EÉ]TRO|TRANSPORT|TAXI|UBER|ESSENCE|CARBURANT|P[EÉ]AGE|PARKING|V[EÉ]LO/, 'transport'],
  [/MUS[EÉ]E|MUSEUM|CIN[EÉ]|CONCERT|TH[EÉ][AÂ]TRE|SPECTACLE/, 'loisirs'],
  [/[EÉ]LECTRICIT|EDF|ENGIE|\bGAZ\b|\bEAU\b|[EÉ]NERGIE/, 'energie'],
  [/MOBILE|FORFAIT|\bBOX\b|INTERNET|FIBRE|T[EÉ]L[EÉ]COM/, 'telecom'],
  [/AMAZON|LIBRAIRIE|FNAC|BOUTIQUE|BRICOLAGE|\bSHOP/, 'shopping'],
];
function catOf(w, type, amt){
  const s = String(w || '').toUpperCase();
  if (type === 'withdrawal' || /RETRAIT|\bDAB\b/.test(s)) return 'retrait';
  if (type === 'loan_repayment' || /PR[EÊ]T\b/.test(s) && amt < 0) return 'pret';
  for (const [re, c] of CAT_RULES) if (re.test(s)) return c;
  if (amt > 0) return 'revenu';
  if (type === 'transfer' || /VIR(EMENT)?\b/.test(s)) return 'virement';
  return 'autre';
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
const money = n => { const s = Math.abs(n).toLocaleString('fr-FR', { minimumFractionDigits:2, maximumFractionDigits:2 }); const k = s.lastIndexOf(',');
  return `${n < 0 ? '−' : ''}<span class="m-int">${s.slice(0, k)}</span><span class="m-dec">${s.slice(k)} €</span>`; };
const signed = n => (n > 0 ? '+' : n < 0 ? '−' : '') + eur(Math.abs(n));

// Comptes de démo par banque (montants fictifs) ; le compte courant suit la courbe de solde de la démo
const DEMO_ACC = { b1:[['Compte courant', null], ['Livret A', 4250]], b2:[['Compte joint', 612.08]], b3:[['Carte en ligne', 138.9]] };
const MERCH = { s:[['Boulangerie Martin','courses'],['Café Lumière','resto'],['Transports urbains','transport'],['Kiosque Presse','shopping']],
  m:[['Pharmacie des Lilas','sante'],['Cantine Sato','resto'],['Librairie du Parc','shopping'],['Ciné Rex','loisirs'],['Primeur Bio','courses']],
  l:[['Supérette du Canal','courses'],['Marché Saint-Louis','courses'],['Bricolage Dupont','shopping'],['Bistrot Les Amis','resto']] };
let _ledger = null;
function ledger(){
  if (_ledger && _ledger.key === (LIVE ? 'live' + LIVE.at : 'demo' + isP() + state.resiliated.join())) return _ledger;
  const L = LIVE ? liveLedger() : demoLedger();
  L.key = LIVE ? 'live' + LIVE.at : 'demo' + isP() + state.resiliated.join();
  return (_ledger = L);
}
function demoLedger(){
  const T = timeline();
  const banks = linked().map(b => ({ ...b, accs: (DEMO_ACC[b.id] || []).map(([n, v]) => ({ name:n, balance: v == null ? T.end : v })) }));
  banks.forEach(b => b.total = b.accs.reduce((a, x) => a + x.balance, 0));
  const total = banks.reduce((a, b) => a + b.total, 0), others = total - T.end;
  const from = NOW.getTime() - 100 * DAY_MS;
  const tx = T.ev.filter(e => e.k !== 'xfer' && e.t.getTime() >= from).map(e => {
    if (e.k === 'spend'){ const a = -e.amt, pool = a < 9 ? MERCH.s : a < 40 ? MERCH.m : MERCH.l, m = pool[Math.floor(e.t.getTime() / 6e4) % pool.length];
      const bk = banks[(Math.floor(e.t.getTime() / 864e5) % 3) % banks.length] || banks[0];
      return { t:e.t, name:m[0], cat:m[1], amt:e.amt, where:bk.name, bank:bk }; }
    if (e.k === 'in') return { t:e.t, name:'Salaire · Exemple SAS', cat:'revenu', amt:e.amt, where:LINKED[0].name, bank:banks[0] };
    if (e.k === 'rent') return { t:e.t, name:'Loyer · Agence Fictive', cat:'logement', amt:e.amt, where:LINKED[0].name, bank:banks[0] };
    const s = SUBS.find(x => x.name === e.name); return { t:e.t, name:e.name, cat:'abo', amt:e.amt, sub:s && s.id, where:'Prélèvement · ' + banks[0].name, bank:banks[0] };
  }).reverse();
  const curve = samples('1M').map(p => ({ t:p.t, v:p.bal + others }));
  const t0 = day0(NOW), up = [];
  active().forEach(s => { for (const mo of [0, 1]){ const d = new Date(NOW.getFullYear(), NOW.getMonth() + mo, s.day, 7); if (d > NOW && d - t0 < 8 * DAY_MS) up.push({ t:d, name:s.name, cat:'abo', amt:-s.price, sub:s.id, where:'Abonnement détecté' }); } });
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
  bank.total = bank.accs.filter(a => a.counted).reduce((x, a) => x + a.balance, 0);
  const accName = id => { const a = accs.find(x => x.id === id); return a ? a.name.replace(/\s*-\s*Mr.*$/i, '') : LIVE.bank; };
  const t0 = day0(new Date()), dt = t => new Date(t.date + 'T12:00');
  const raw = (LIVE.recent || []).filter(t => t.type !== 'summary_card');
  const map = t => ({ t:dt(t), name:cleanName(t.wording), cat:catOf(t.wording, t.type, t.value), amt:t.value, acc:t.account, where:accName(t.account), bank });
  const tx = raw.filter(t => !t.coming && dt(t) < new Date(t0.getTime() + DAY_MS)).map(map).sort((a, b) => b.t - a.t);
  const up = raw.filter(t => t.coming && t.value < 0 && dt(t) >= t0 && dt(t) - t0 < 8 * DAY_MS).map(map);
  (LIVE.subs || []).forEach(s => { const d = nextLive(s); if (d >= t0 && d - t0 < 8 * DAY_MS) up.push({ t:d, name:s.name, cat:'abo', amt:-(s.amount || s.price), sub:s.id, where:'Abonnement détecté' }); });
  up.sort((a, b) => a.t - b.t);
  // courbe 30 j : solde des comptes courants/épargne aujourd'hui, en remontant leurs opérations
  const ids = new Set(bank.accs.filter(a => a.counted && a.id != null).map(a => a.id));
  const flows = tx.filter(x => ids.has(x.acc));
  const oldest = flows.length ? flows.reduce((m, f) => Math.min(m, +f.t), +t0) : +t0;
  const span = Math.min(400, Math.max(30, Math.ceil((+t0 - oldest) / DAY_MS)));
  const curve = [];
  for (let d = span; d >= 0; d--){ const end = new Date(t0.getTime() - (d - 1) * DAY_MS); curve.push({ t:new Date(end - DAY_MS / 2), v: bank.total - flows.filter(f => f.t >= end).reduce((a, f) => a + f.amt, 0) }); }
  return { banks:[bank], total:bank.total, tx, curve, up, nAcc:bank.accs.filter(a => a.counted).length, live:true };
}

let SPARK = null;
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
function spark(curve){
  if (!curve || curve.length < 2) return '';
  const tf = homeTfMeta();
  const W = 340, H = 118, PADL = 6, PADR = 16, PADT = 14, PADB = 12;
  const vs = curve.map(p => p.v), lo = Math.min(...vs), hi = Math.max(...vs), r = hi - lo || 1;
  const x = i => PADL + (i / (curve.length - 1)) * (W - PADL - PADR);
  const y = v => PADT + (hi - v) / r * (H - PADT - PADB);
  const pts = curve.map((p, i) => [x(i), y(p.v)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const last = pts[pts.length - 1], first = pts[0];
  const track = curve.map((p, i) => ({ x: pts[i][0] / W * 100, y: pts[i][1] / H * 100, v: p.v, t: p.t }));
  const line = d, area = `${d} L${last[0].toFixed(1)},${H} L${first[0].toFixed(1)},${H} Z`;
  SPARK = { pts: track, poly: pts, H, line, area, first: curve[0].v, tf: homeTf };
  const nLab = homeTf === '24H' || homeTf === '7J' ? 4 : 5;
  const seen = new Set(), idxs = [];
  for (let k = 0; k < nLab; k++){ const i = Math.round(k * (curve.length - 1) / (nLab - 1)); if (!seen.has(i)) { seen.add(i); idxs.push(i); } }
  const lab = d => homeTf === '24H' ? String(d.getHours()).padStart(2, '0') + ' h' : (homeTf === '1A' || homeTf === 'TOUT') ? MOIS[d.getMonth()] + ' ' + String(d.getFullYear()).slice(2) : d.getDate() + ' ' + MOIS[d.getMonth()];
  const axis = idxs.map((i, k) => `<span class="${k === 0 ? 'a0' : k === idxs.length - 1 ? 'a1' : ''}" style="left:${track[i].x.toFixed(2)}%">${lab(curve[i].t)}</span>`).join('');
  return `<div class="spark" role="img" aria-label="Évolution du solde sur ${tf[2]}. Glissez pour voir le détail."><div class="spark-plot"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="spk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".5"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
    <path class="sp-area" d="${area}" fill="url(#spk)"/>
    <path class="sp-dim" d="" fill="none" stroke="var(--accent)" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>
    <path class="sp-line" d="${line}" fill="none" stroke="var(--accent)" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>
  </svg><i class="sp-vline" hidden></i><i class="sp-dot" style="left:${(last[0] / W * 100).toFixed(2)}%;top:${(last[1] / H * 100).toFixed(2)}%"></i>
  <div class="sp-hit" aria-hidden="true"></div></div>
  <div class="sp-axis">${axis}</div></div>`;
}
const catChip = c => `<span class="cat cat-${c}" aria-hidden="true">⟦${(CATS[c] || CATS.autre).ic}⟧</span>`;
const MOIS_LONG = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
function txKind(x){
  if (x.cat === 'revenu' || x.amt > 0 && x.cat !== 'virement') return 'Reçu';
  if (x.cat === 'virement') return x.amt > 0 ? 'Virement reçu' : 'Virement';
  if (x.cat === 'abo') return 'Prélèvement';
  if (x.cat === 'retrait') return 'Retrait';
  return 'Paiement';
}
const txRow = (x, pp) => `<a class="tx${pp ? ' pp' : ''}" href="${x.sub ? '#/abo/' + x.sub : '#/operations'}">${catChip(x.cat)}
  <div class="mid"><div class="name">${esc(x.name)}</div><div class="meta">${pp ? `${x.t.getDate()} ${MOIS[x.t.getMonth()]} • ${txKind(x)}` : (CATS[x.cat] || CATS.autre).l + (x.where ? ' · ' + esc(x.where) : '')}</div></div>
  <div class="amt ${x.amt > 0 ? 'pos' : ''}">${pp ? (x.amt > 0 ? '+' : '−') + eur(Math.abs(x.amt)) : signed(x.amt)}${!pp && x.bank ? bankTile(x.bank, 'tx-bk') : ''}</div></a>`;
function txGroups(list, maxDays = 99, maxRows = 999, byMonth = false){
  const groups = []; let rows = 0;
  for (const x of list){
    const k = byMonth ? x.t.getFullYear() * 12 + x.t.getMonth() : day0(x.t).getTime();
    let g = groups[groups.length - 1];
    if (!g || g.k !== k){ if (groups.length >= maxDays || rows >= maxRows) break; g = { k, d:x.t, items:[] }; groups.push(g); }
    if (rows >= maxRows) break; g.items.push(x); rows++;
  }
  if (byMonth) return groups.map(g => `<section class="mo"><h2>${MOIS_LONG[g.d.getMonth()]}</h2>${g.items.map(x => txRow(x, true)).join('')}</section>`).join('');
  return groups.map(g => { const net = g.items.reduce((a, x) => a + x.amt, 0);
    return `<div class="day"><div class="day-h"><span>${dayLabel(g.d)}</span><span>${signed(net)}</span></div>${g.items.map(x => txRow(x)).join('')}</div>`; }).join('');
}
let _homeAnimated = QS.has('static');  // ?static=1 : sans animation (captures)
function animateHome(){
  const el = document.querySelector('[data-count]'); if (!el || state.hideBalance) return;
  if (_homeAnimated || matchMedia('(prefers-reduced-motion: reduce)').matches){ document.querySelector('.home')?.classList.add('static'); return; }
  _homeAnimated = true;
  const target = +el.dataset.count, t0 = performance.now(), dur = 750;
  const step = now => { if (!el.isConnected || el.dataset.scrub === '1') return; const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.innerHTML = money(target * (0.92 + 0.08 * e)); if (p < 1) requestAnimationFrame(step); else el.innerHTML = money(target); };
  requestAnimationFrame(step);
}

screens.dashboard = () => {
  const t = totals(), P = isP(), L = ledger(), al = alerts();
  const unread = al.filter(a => !state.readAlerts.includes(a.id)).length;
  const curve = homeCurve();
  const first = curve.length ? curve[0].v : L.total, delta = L.total - first;
  const pp = (delta / (Math.abs(first) || 1)) * 100;
  const ppTxt = (pp > 0 ? '+' : pp < 0 ? '−' : '') + Math.abs(pp).toLocaleString('fr-FR', { minimumFractionDigits:1, maximumFractionDigits:1 }) + ' %';
  const tf = homeTfMeta();
  const upSum = L.up.reduce((a, x) => a + x.amt, 0);
  const nextSub = L.up.find(x => x.sub);
  const banksN = L.banks.length;
  const prenom = USER.prenom ? ' ' + USER.prenom : '';
  return `
<div class="screen home ${_homeAnimated ? 'static' : ''}">
  ${brandBar(`<a class="gear" href="#/compte" aria-label="Mon compte">⟦user⟧</a>`)}
  <div class="home-body">
  <div class="greet rise" style="--d:0"><div class="g-row"><p class="g-day">${cap(JOURS[nowRef().getDay()])} ${nowRef().getDate()} ${MOIS[nowRef().getMonth()]}</p>
    <div class="g-tags"><span class="plan-pill ${P ? 'p' : ''}">${P ? 'Premium' : 'Gratuit'}</span>${demoTag}</div></div><h1>Bonjour${prenom}</h1></div>

  <section class="total rise" style="--d:1">
    <button type="button" class="sync-btn" id="home-sync" aria-label="Synchroniser vos comptes">⟦refresh⟧<span>Synchroniser</span></button>
    <div class="lbl">Solde total · ${L.nAcc} compte${L.nAcc > 1 ? 's' : ''}${banksN > 1 ? ' dans ' + banksN + ' banques' : ''}</div>
    <div class="amount-row">
      <div class="amount" data-count="${L.total.toFixed(2)}" ${state.hideBalance ? 'data-hidden="1"' : ''}>${state.hideBalance ? '<span class="masked">••••</span>' : money(L.total)}</div>
      <button type="button" class="eye" id="toggle-balance" aria-pressed="${state.hideBalance ? 'true' : 'false'}" aria-label="${state.hideBalance ? 'Afficher le solde' : 'Masquer le solde'}">⟦${state.hideBalance ? 'eyeoff' : 'eye'}⟧</button>
    </div>
    <div class="delta" id="sp-delta">${state.hideBalance ? 'Solde masqué' : `${delta >= 0 ? '⟦trend⟧' : ''}<b class="${delta >= 0 ? 'pos' : ''}">${signed(delta)}</b>${Math.abs(pp) >= 0.5 ? ` <i class="delta-pct ${delta >= 0 ? 'up' : 'down'}">${ppTxt}</i>` : ''} ${homeTf === 'TOUT' ? 'depuis le début' : 'sur ' + tf[2]}`}</div>
    <div class="tf" role="tablist" aria-label="Période du graphique">${HOME_TF.map(([k, lab]) => `<button type="button" role="tab" data-tf="${k}" aria-selected="${k === homeTf ? 'true' : 'false'}" class="${k === homeTf ? 'on' : ''}">${lab}</button>`).join('')}</div>
    ${spark(curve)}
    ${P ? `<a class="rav" href="#/abonnements"><span>Reste à vivre jusqu’à la paie</span><b>${state.hideBalance ? '<span class="masked">••••</span>' : eur(t.reste)}</b></a>`
        : `<a class="rav locked" href="#/premium"><span>⟦lock⟧ Reste à vivre jusqu’à la paie</span><b>Premium</b></a>`}
  </section>

  <div class="section-h rise" style="--d:2"><h2>Mes banques</h2><a href="#/banques">Gérer</a></div>
  <div class="bk-cards rise" style="--d:2">
    ${L.banks.map(b => `<a class="bk-card" href="#/banques" style="--bk:${/^#[0-9a-f]{6}$/i.test(b.color || '') ? b.color : '#0066FF'}">
      <div class="bc-top">${bankTile(b, 'bk-ini', b.status === 'error' ? '<i class="st err"></i>' : b.status === 'expired' ? '<i class="st warn"></i>' : '')}<span class="bc-n">${b.accs.length} compte${b.accs.length > 1 ? 's' : ''}</span></div>
      <div class="bc-name">${esc(b.name)}</div><div class="bc-bal">${state.hideBalance ? '<span class="masked">••••</span>' : eur(b.total)}</div>
      <div class="bc-meta ${b.status === 'error' ? 't-red' : ''}">${b.status === 'error' ? 'Synchro en échec' : b.status === 'expired' ? 'Session expirée' : 'À jour · ' + b.sync}</div></a>`).join('')}
    ${!LIVE && !P ? `<a class="bk-card add" href="#/premium">⟦plus⟧<span>Ajouter une banque</span><b>Premium</b></a>` : ''}
  </div>

  <div class="section-h rise" style="--d:3"><h2>Dernières opérations</h2><a href="#/operations">Tout voir</a></div>
  <div class="panel rise" style="--d:3">${L.tx.length ? txGroups(L.tx, 3, 8) : '<p class="insight">Aucune opération ces derniers jours.</p>'}</div>

  <div class="section-h rise" style="--d:2"><h2>À venir cette semaine</h2>${L.up.length ? `<span class="sec-sum">${signed(upSum)}</span>` : ''}</div>
  <div class="panel rise" style="--d:2">
    ${L.up.length ? `<p class="insight">${L.up.length} prélèvement${L.up.length > 1 ? 's' : ''} ${L.up.length > 1 ? 'vont' : 'va'} partir d’ici 7 jours${nextSub ? `, dont <b>${esc(nextSub.name)}</b> ${dayLabel(nextSub.t).toLowerCase()}` : ''}. Rien d’autre de prévu.</p>
      ${L.up.map(x => `<a class="tx up" href="${x.sub ? '#/abo/' + x.sub : '#/operations'}">${catChip(x.cat)}<div class="mid"><div class="name">${esc(x.name)}</div><div class="meta">${dayLabel(x.t)} · ${esc(x.where)}</div></div><div class="amt">${signed(x.amt)}</div></a>`).join('')}`
      : `<p class="insight">Aucun prélèvement prévu dans les 7 prochains jours. Profitez-en.</p>`}
  </div>

  <div class="section-h rise" style="--d:3"><h2>Mes comptes</h2><a href="#/banques">Gérer</a></div>
  <div class="panel accts rise" style="--d:3">
    ${L.banks.map(b => `<div class="bank-g">
      <a class="bank-h" href="#/banques">${bankTile(b, 'bk-ini', b.status === 'error' ? '<i class="st err"></i>' : b.status === 'expired' ? '<i class="st warn"></i>' : '')}
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
  <div class="topbar"><h1>Transactions</h1>${demoTag}</div>
  <a class="tx-subs" href="#/abonnements?vue=recurrents"><span><b>Abonnements détectés</b><i>${t.list.length} actifs</i></span><strong>${eur(t.monthly)}<small>/mois</small></strong></a>
  <label class="tx-search">⟦search⟧<input id="tx-q" type="search" placeholder="Rechercher" value="${esc(opsQuery)}" autocomplete="off" enterkeyhint="search"></label>
  <div class="seg ops-seg four" role="tablist">${[['all','Tout'],['out','Dépenses'],['in','Reçus'],['abo','Abos']].map(([k, l]) => `<button type="button" role="tab" class="${opsFilter === k ? 'on' : ''}" data-ops="${k}">${l}</button>`).join('')}</div>
  <div class="act-list">${list.length ? txGroups(list, 8, 240, true) : emptyState('search', 'Aucune opération', q ? 'Aucun résultat pour cette recherche.' : 'Rien sur cette période.')}</div>
</div>`;
}
screens.operations = () => txActivity();
const PERIOD_DAYS = { week:7, month:30.4, quarter:91, year:365 };
const nextLive = s => { if (s.nextDate) return new Date(s.nextDate+'T12:00'); const d = new Date(s.lastDate+'T12:00'); const step = PERIOD_DAYS[s.cadence||'month']; while (d < new Date()) d.setTime(d.getTime() + step*864e5); return d; };
screens.abonnements = (q) => {
  if ((q.get('vue') || '') !== 'recurrents') return txActivity();
  const t = totals(); const P = isP(); let f = q.get('f') || 'all';
  if (!P && f!=='all') f = 'all';
  let list = P ? t.list.filter(s=>!s.small) : t.list;
  if (f==='up') list = t.ups;
  if (f==='eco') list = t.list.filter(s=>increase(s)||s.small||t.dups.includes(s));
  const showSmall = P && (f==='all' || f==='small');
  if (f==='small') list = [];
  const row = s => { const d = nextDebit(s); const fg = lum(s.color) > .45 ? '#0A0B0D' : '#fff'; return `<a class="tx pp" href="#/abo/${s.id}"><span class="cat mark" style="background:${s.color};color:${fg}">${esc(s.ini)}</span>
      <div class="mid"><div class="name">${esc(s.name)}${P ? `${increase(s)?`<span class="badge b-red">+${pct(s)} %</span>`:''}${s.doubleCharge?'<span class="badge b-red">2×</span>':''}${t.dups.includes(s)?'<span class="badge b-blue">Doublon</span>':''}${s.trial?'<span class="badge b-amber">Essai</span>':''}` : ((increase(s)||s.small||s.doubleCharge||t.dups.includes(s)) ? lockBadge('Alerte') : '')}</div>
      <div class="meta">${d.getDate()} ${MOIS[d.getMonth()]} • ${cap(FREQ[s.cadence || 'month'] || 'mensuel')}</div></div>
      <div class="amt">−${eur(s.price)}</div></a>`; };
  const chip = (k,l) => P ? `<a class="chip ${f===k?'on':''}" href="#/abonnements?vue=recurrents${k==='all'?'':'&f='+k}">${l}</a>` : `<a class="chip ${k==='all'?'on':''}" href="${k==='all'?'#/abonnements?vue=recurrents':'#/premium'}">${k==='all'?l:'⟦lock⟧ '+l.replace(/^\S+ /,'')}</a>`;
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/abonnements">⟦back⟧</a><h1>Abonnements</h1>${demoTag}</div>
  <div class="card" style="display:flex;justify-content:space-between;align-items:center">
    <div><div class="muted small">Total mensuel</div><div style="font-size:26px;font-weight:760;letter-spacing:-.02em">${eur(t.monthly)}</div></div>
    <div style="text-align:right"><div class="muted small">Sur un an</div><div style="font-weight:700">${eur0(t.monthly*12)}</div></div>
  </div>
  <div class="hchips">${chip('all','Tous ('+t.list.length+')')}${chip('up','⟦trend⟧ Hausses ('+t.ups.length+')')}${chip('small','⟦search⟧ Oubliés ('+t.smalls.length+')')}${chip('eco','⟦coin⟧ À économiser')}</div>
  ${P?'':teaser(`${eur(t.found)}/mois d’économies repérées`, LIVE ? `${t.ups.length} hausse${t.ups.length>1?'s':''}, ${t.smalls.length} petit${t.smalls.length>1?'s':''} prélèvement${t.smalls.length>1?'s':''} sous 10 €` : `${t.ups.length} hausses, 1 doublon, 1 double prélèvement, ${t.smalls.length} oubliés`)}
  ${LIVE && LIVE.history && LIVE.history.limited ? `<div class="banner amber"><span class="ic">⟦info⟧</span><div><b>Historique court : détection partielle</b>La banque de test ne fournit que ${LIVE.history.days} jours d’opérations (${LIVE.history.debits} débits). Il faut au moins 2 prélèvements pour confirmer un abonnement : ceux vus une seule fois sont marqués « probable ».</div></div>` : ''}
  ${LIVE && !t.list.length ? emptyState('search', 'Aucun prélèvement récurrent', 'Rien de régulier pour le moment. Avec deux mois d’historique ou plus, la détection sera plus complète. Vos comptes restent en lecture seule.') : ''}
  ${P && t.ups.length && f==='all' ? `<div class="banner red"><span class="ic">⟦trend⟧</span><div><b>${t.ups.length} hausse${t.ups.length>1?'s':''} de prix détectée${t.ups.length>1?'s':''}</b>${t.ups.map(s=>`${esc(s.name)} : ${eur(s.prev)} → ${eur(s.price)}`).join(' · ')}. Soit ${eur(t.ups.reduce((a,s)=>a+increase(s),0)*12)} de plus par an.</div></div>` : ''}
  ${list.length?`<div class="act-list">${list.map(row).join('')}</div>`:''}
  ${adSlot('subs')}
  ${showSmall && t.smalls.length?`
  <div class="section-h"><h2>⟦search⟧ Petits prélèvements oubliés</h2><span class="muted small">${eur(t.smalls.reduce((a,s)=>a+s.price,0))}/mois</span></div>
  <p class="muted small" style="margin:-4px 2px 10px">Moins de ${LIVE?10:5} € chacun, mais ${eur0(t.smalls.reduce((a,s)=>a+s.price,0)*12)} par an au total.</p>
  <div class="act-list">${t.smalls.map(row).join('')}</div>`:''}
  ${state.resiliated.length?`<div class="section-h"><h2>⟦check⟧ Résiliés</h2></div><div class="card" style="padding:4px 16px">${SUBS.filter(s=>state.resiliated.includes(s.id)).map(s=>`<div class="row">${logo(s)}<div class="mid"><div class="name">${s.name}</div><div class="meta">Résiliation envoyée</div></div><div class="amt" style="color:var(--mint)">−${eur(s.price)}</div></div>`).join('')}</div>`:''}
</div>`;
};

screens.abo = (q, id) => {
  const s = byId(id); if (!s) return screens.abonnements(q);
  const t = totals(); const P = isP(); const max = Math.max(...s.hist, 1); const done = state.resiliated.includes(s.id);
  const flagged = increase(s) || s.small || s.doubleCharge || t.dups.includes(s);
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/abonnements">⟦back⟧</a>${demoTag}</div>
  <div class="detail-head">${logo(s)}
    <div class="muted small">${s.cat}</div>
    <div class="price">${eur(s.price)}<span class="muted" style="font-size:15px;font-weight:600"> /mois</span></div>
    <div style="margin-top:6px">${P ? `${increase(s)?`<span class="badge b-red">+${eur(increase(s))} (+${pct(s)} %)</span>`:''}${t.dups.includes(s)?'<span class="badge b-blue">Doublon avec '+byId(s.duplicate).name+'</span>':''}${s.small?'<span class="badge b-amber">Petit prélèvement oublié</span>':''}` : (flagged?lockBadge('1 alerte sur cet abonnement'):'')}${done?'<span class="badge b-green">Résiliation envoyée</span>':''}</div>
  </div>
  ${P ? `
  ${s.doubleCharge?`<div class="banner red"><span class="ic">⟦alert⟧</span><div><b>Prélevé deux fois le ${s.doubleCharge}</b>${eur(s.price)} en trop. On vous prépare la demande de remboursement.<br><a href="#" data-toast="Demande de remboursement prête (simulation)" style="font-weight:700;text-decoration:underline">Demander le remboursement</a></div></div>`:''}
  ${increase(s)?`<div class="banner red"><span class="ic">⟦trend⟧</span><div><b>Hausse de prix détectée</b>Vous payiez ${eur(s.prev)}. Cette hausse vous coûte ${eur(increase(s)*12)} de plus par an.</div></div>`:''}
  ${s.note?`<div class="banner amber"><span class="ic">⟦info⟧</span><div><b>${s.note}</b>${eur(s.price*12)} par an pour un service que vous avez peut-être oublié.</div></div>`:''}
  ${s.tip?`<div class="banner blue"><span class="ic">⟦info⟧</span><div>${s.tip} <i>(Conseil neutre : aucun sponsor derrière ce conseil.)</i></div></div>`:''}` : (flagged ? teaser('Une alerte attend sur cet abonnement', 'Hausse, doublon ou oubli : découvrez-la en Premium') : '')}
  <div class="card">
    <div style="font-weight:700;margin-bottom:4px">Historique des prélèvements</div>
    <div class="chart">${s.hist.map((v,i)=>`<div class="col ${P&&i>0&&v>s.hist[i-1]?'up':''}"><span>${v?v.toFixed(2).replace('.',','):'–'}</span><i style="height:${Math.max(4,v/max*70)}px"></i>${MONTHS[i]}</div>`).join('')}</div>
  </div>
  <div class="card" style="padding:4px 16px">
    <div class="kv"><span>Prochain prélèvement</span><span>${s.live ? (s.confirmed||s.nextDate ? '' : '≈ ') + (d => d.toLocaleDateString('fr-FR', d.getFullYear() === new Date().getFullYear() ? {day:'numeric',month:'short'} : {day:'numeric',month:'short',year:'numeric'}))(nextLive(s)) : `${s.day} ${s.day>=9?'oct.':'nov.'}`}</span></div>
    <div class="kv"><span>Rappel avant prélèvement</span><span>${P?'la veille ⟦bell⟧':'⟦lock⟧ Premium'}</span></div>
    <div class="kv"><span>Coût sur un an</span><span>${eur(s.price*12)}</span></div>
    <div class="kv"><span>Client depuis</span><span>${s.since || '—'}</span></div>
    ${s.live ? `<div class="kv"><span>Libellé bancaire</span><span class="small">${s.label}</span></div>
    <div class="kv"><span>Dernier prélèvement</span><span>${new Date(s.lastDate+'T12:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}</span></div>
    <div class="kv"><span>Fréquence</span><span>${eur(s.amount)} ${s.cadenceLabel}${s.variable?' (variable)':''}</span></div>
    <div class="kv"><span>Détection</span><span>${s.confirmed ? `Récurrent confirmé (${s.count}×)` : 'Probable (1×)'}</span></div>
    ${s.duplicate?`<div class="kv"><span>Doublon possible</span><span>même usage que ${s.dupOf}</span></div>`:''}` : ''}
  </div>
  ${done?`<a class="btn ghost" href="#/abonnements">Retour aux transactions</a>` : P ? `
  <a class="btn danger" href="#/resilier/${s.id}/1">⟦scissors⟧ Résilier cet abonnement</a>
  <button class="btn ghost" id="keep">Je le garde, ne plus m’alerter</button>` : `
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
  <h1 style="font-size:23px;letter-spacing:-.02em">Résilier ${s.name}</h1>
  <p class="muted small" style="margin:6px 0 16px">Choisissez comment vous voulez résilier. On prépare tout pour vous.</p>
  ${[
    ['lettre','⟦mail⟧','Lettre de résiliation','Lettre prête à imprimer ou à envoyer en recommandé'],
    ['email','⟦mail⟧','E-mail au service client','Texte prêt à copier-coller'],
    ['enligne','⟦globe⟧','En ligne en 3 clics', cancelInfo(s).online ? cancelInfo(s).where : 'Non proposé par ce service'],
  ].map(([k,ic,b,sp])=>`<button class="option ${resil.method===k?'on':''}" data-method="${k}" ${k==='enligne'&&!cancelInfo(s).online?'disabled style="opacity:.5"':''}><span class="ic">${ic}</span><div><b>${b}</b><span>${sp}</span></div></button>`).join('')}
  <div class="card" style="padding:4px 16px"><div class="kv"><span>Comment résilier</span><span style="text-align:right;max-width:58%">${cancelInfo(s).where}</span></div><div class="kv"><span>Préavis</span><span style="text-align:right;max-width:58%">${cancelInfo(s).notice}</span></div></div>
  ${cancelInfo(s).url ? `<a class="btn ghost" href="${cancelInfo(s).url}" target="_blank" rel="noopener">⟦globe⟧ Page officielle de résiliation ${esc(cancelInfo(s).brand)}</a>` : `<p class="muted small" style="margin:0 2px 12px">Pas de page de résiliation en ligne connue pour ce service : la lettre préremplie est la voie la plus sûre.</p>`}
  <div class="section-h"><h2>Les étapes</h2></div>
  <ol class="cancel-steps">${(cancelInfo(s).url ? [`Ouvrez la page officielle ${esc(cancelInfo(s).brand)} et connectez-vous.`, `Suivez : ${esc(cancelInfo(s).where)}.`, 'Gardez l’e-mail de confirmation, puis revenez confirmer ici.'] : ['Choisissez la lettre (ou l’e-mail) : tout est prérempli.', 'Envoyez-la en recommandé avec accusé de réception.', 'Revenez confirmer ici : on surveille que le prélèvement s’arrête.']).map(x=>`<li>${x}</li>`).join('')}</ol>
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
    ? `<div class="card"><b>Résiliez directement chez ${s.name}</b><p class="muted small" style="margin-top:6px">Chemin : ${cancelInfo(s).where}</p><p class="muted small" style="margin-top:6px">On vous guide écran par écran, puis vous revenez confirmer ici.</p>${cancelInfo(s).url ? `<a class="btn" style="margin-top:12px" href="${cancelInfo(s).url}" target="_blank" rel="noopener">⟦globe⟧ Ouvrir la page officielle</a>` : ''}</div>`
    : `<div class="letter">${letter}</div>`}
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
    <div class="kv"><span>⟦bell⟧ On vous alerte si</span><span style="text-align:right;max-width:55%">un nouveau prélèvement ${s.name} passe malgré tout</span></div>
  </div>
  <div class="banner green"><span class="ic">⟦coin⟧</span><div><b>${eur(s.price)} économisés par mois</b>soit ${eur(s.price*12)} sur un an.</div></div>
  <button class="btn mint" id="confirm-resil" data-id="${s.id}">Confirmer la résiliation</button>
</div>`;
  return `
<div class="screen"><div class="success">
  <div class="ok">⟦check⟧</div>
  <h1 style="font-size:24px">Bien joué ${USER.prenom} !</h1>
  <p class="muted" style="margin:8px 0 6px">${s.name} est en cours de résiliation.</p>
  <p style="font-size:30px;font-weight:760;color:var(--mint);margin:14px 0 2px">+${eur(s.price*12)}</p>
  <p class="muted small">économisés sur un an</p>
</div>
<a class="btn" href="#/dashboard">Voir mes économies</a>
<a class="btn ghost" href="#/abonnements?f=eco">Continuer à faire le ménage</a>
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
  const row = a => `<a class="tx pp al-row ${state.readAlerts.includes(a.id) ? '' : 'unread'}" href="${a.link}" data-alert="${a.id}"><span class="cat">${a.ic}</span><div class="mid"><div class="name">${a.title}</div><div class="meta">${a.text}</div></div>${a.amt ? `<div class="amt">${a.amt}</div>` : ''}</a>`;
  const order = ['Aujourd’hui', 'Cette semaine', 'Plus tôt'];
  const groups = order.filter(g => visible.some(a => a.group === g)).map(g => `<section class="mo"><h2>${g}</h2>${visible.filter(a => a.group === g).map(row).join('')}</section>`).join('');
  const chip = (k, l) => `<button type="button" class="${f === k ? 'on' : ''}" data-af="${k}">${l}</button>`;
  const tog = (k, lab, open) => `<button type="button" class="acct-row" data-alert-set="${k}"><span class="acct-lab">${lab}</span>${!open && !P ? '<span class="acct-aside">Premium</span><span class="acct-go">⟦lock⟧</span>' : `<span class="sw ${alertOn(k) ? 'on' : ''}"></span>`}</button>`;
  return `
<div class="screen act">
  <div class="topbar"><h1>Alertes</h1>${demoTag}</div>
  <p class="al-lead">${unread ? unread + ' non lue' + (unread > 1 ? 's' : '') : 'Tout est lu'} · hausses, doublons, rappels</p>
  <div class="seg ops-seg four">${chip('all','Toutes')}${chip('up','Hausses')}${chip('dup','Doublons')}${chip('next','Rappels')}</div>
  ${unread ? '<div class="al-tools"><button type="button" id="read-all">Tout marquer comme lu</button></div>' : ''}
  <div class="act-list">${groups || (!prem.length ? emptyState('bell', 'Tout est calme', 'Rien dans ce filtre. On vous prévient ici dès qu’un prix bouge ou qu’une banque demande votre attention.') : '')}</div>
  ${P || !prem.length ? '' : `<a class="one-card" href="#/premium"><div><b>${prem.length} alertes d’économies</b><span>Hausses, doublons et rappels. ${CFG.trial}.</span></div>${logoMark()}</a>`}
  <p class="acct-k">Réglages</p>
  <div class="menu-card">
    ${tog('bank','Accès bancaire bientôt expiré', true)}
    ${tog('up','Hausse de prix', false)}
    ${tog('dbl','Doublon et double prélèvement', false)}
    ${tog('next','Rappel avant prélèvement', false)}
    ${tog('trial','Fin d’essai gratuit', false)}
  </div>
</div>`;
};

screens.banques = () => {
  const L = linked(); const P = isP();
  if (LIVE){ const b = L[0]; return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/dashboard">⟦back⟧</a><h1 style="font-size:19px">Mes banques</h1>${demoTag}</div>
  <div class="card bankcard">
    <div style="display:flex;gap:12px;align-items:center">${bankTile(b, 'lg')}
      <div style="flex:1"><div style="font-weight:700">${b.name}</div><div class="muted small">${b.accounts}</div></div>
      <span class="status ${b.status==='expired'?'err':'ok'}">${b.status==='expired'?'Expirée':'Connectée'}</span></div>
    <div class="kv"><span>Données lues</span><span>${b.sync}</span></div>
    <div class="kv"><span>${API ? 'Accès bancaire' : 'Session de test'}</span><span class="${b.status==='expired'?'t-amber':''}">${b.expires}</span></div>
    ${LIVE.accounts.map(a=>`<div class="kv"><span class="small">${a.name}</span><span class="nw">${(a.balance||0).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})} ${a.currency==='EUR'||!a.currency?'€':a.currency}</span></div>`).join('')}
    ${b.status==='expired' ? `<div class="banner amber" style="margin:10px 0 0"><span class="ic">⟦key⟧</span><div><b>Session de test expirée</b>Le jeton Powens de test ne dure que 30 minutes. Les résultats restent affichés ; reconnectez-vous pour relire les comptes.</div></div>` : ''}
    <button class="btn small-btn" id="${API ? 'api-sync' : b.status==='expired'?'pw-connect':'pw-refresh'}" style="margin-top:12px">${b.status==='expired'?'Reconnecter la banque de test':'Relire les opérations'}</button>
  </div>
  <p class="muted small" style="margin:2px 2px 12px">Comptes en euros uniquement. ${LIVE.subs.length} prélèvement${LIVE.subs.length>1?'s':''} retenu${LIVE.subs.length>1?'s':''} sur ${LIVE.txCount} opérations : « confirmé » = au moins 2 prélèvements à ~1 mois d’écart et montant à ±10 % ; « probable » = 1 seul prélèvement au libellé typique d’un abonnement.</p>
  ${API ? sandboxNote() : `<button class="btn ghost" id="pw-quit">Revenir aux données d’exemple</button>
  ${pwNote()}`}
</div>`; }
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/dashboard">⟦back⟧</a><h1 style="font-size:19px">Mes banques</h1>${demoTag}</div>
  <p class="muted small" style="margin:-6px 2px 14px">On vous affiche honnêtement l’état de chaque connexion. Si une banque ne se synchronise pas, vos chiffres peuvent être incomplets.</p>
  ${L.map(b=>`
  <div class="card bankcard">
    <div style="display:flex;gap:12px;align-items:center">${bankTile(b, 'lg')}
      <div style="flex:1"><div style="font-weight:700">${b.name}</div><div class="muted small">${b.accounts}</div></div>
      <span class="status ${b.status==='error'?'err':'ok'}">${b.status==='error'?'Erreur':'Synchronisée'}</span></div>
    <div class="kv"><span>Dernière synchro</span><span>${b.sync}</span></div>
    <div class="kv"><span>Accès valable jusqu’au</span><span class="${b.expiresIn<=7?'t-amber':''}">${b.expires} ${b.expiresIn<=7?`(dans ${b.expiresIn} j)`:''}</span></div>
    <div class="meter"><i style="width:${Math.max(3, b.expiresIn/180*100)}%;background:${b.expiresIn<=7?'var(--accent)':'var(--ink)'}"></i></div>
    ${b.status==='error' ? `<div class="banner err" style="margin:10px 0 0"><span class="ic">⟦link⟧</span><div><b>La banque refuse la connexion</b>Souvent après un changement de mot de passe. Reconnectez-la en 30 secondes.</div></div><button class="btn small-btn" data-toast="Reconnexion lancée (simulation)">Reconnecter</button>`
      : b.expiresIn<=7 ? `<div class="banner amber" style="margin:10px 0 0"><span class="ic">⟦key⟧</span><div><b>Renouvelez votre accès avant le ${b.expires}</b>Votre banque exige une nouvelle validation tous les 180 jours (règle européenne DSP2). On vous le rappellera aussi la veille.</div></div><button class="btn mint small-btn" data-toast="Accès renouvelé pour 180 jours (simulation)">Renouveler l’accès</button>` : ''}
  </div>`).join('')}
  ${P ? `<button class="btn ghost" data-toast="Ajout d’une banque (simulation)">⟦plus⟧ Ajouter une banque</button>`
      : `<a class="btn ghost" href="#/premium">⟦lock⟧ Ajouter une autre banque · Premium</a><p class="muted small center" style="margin-top:8px">La version gratuite inclut 1 banque.</p>`}
  <div class="banner blue" style="margin-top:14px"><span class="ic">⟦lock⟧</span><div><b>Lecture seule</b>${APP_NAME} ne voit jamais vos identifiants et ne peut faire aucun virement. Vous pouvez couper l’accès ici à tout moment.</div></div>
  ${PWX ? `<button class="btn ghost" id="pw-connect" style="margin-top:4px">⟦bank⟧ Connecter une banque de test (Powens)</button>${pwNote()}` : ''}
</div>`;
};

const themePref = () => (window.PrelevoTheme ? PrelevoTheme.get() : 'auto');
const themeLabel = () => ({ light:'Clair', dark:'Sombre', auto:'Automatique' }[themePref()] || 'Automatique');
function appIcon(){ try { const v = localStorage.getItem('prelevo-icon'); if (v === 'noir' || v === 'defaut' || v === 'bleu') return v; } catch (e) {} return 'bleu'; }
function setAppIcon(v){ try { if (v === 'noir' || v === 'defaut') localStorage.setItem('prelevo-icon', v); else localStorage.removeItem('prelevo-icon'); } catch (e) {} document.documentElement.setAttribute('data-icon', appIcon()); }
setAppIcon(appIcon());
let _pickAt = 0;
function pickTheme(v){
  const now = Date.now(); if (now - _pickAt < 350) return; _pickAt = now;
  if (window.PrelevoTheme) PrelevoTheme.set(v);
  render();
  toast(v === 'auto' ? 'Thème automatique' : v === 'dark' ? 'Thème sombre' : 'Thème clair');
}
function pickIcon(v){
  const now = Date.now(); if (now - _pickAt < 350) return; _pickAt = now;
  setAppIcon(v);
  render();
  toast(v === 'noir' ? 'Icône noire' : v === 'defaut' ? 'Icône blanche' : 'Icône par défaut');
}
screens.compte = () => {
  const P = isP(), unread = alerts().filter(a => !state.readAlerts.includes(a.id)).length;
  const row = (href, ic, lab, aside='') => `<a class="acct-row" href="${href}"><span class="acct-ic">⟦${ic}⟧</span><span class="acct-lab">${lab}</span>${aside ? `<span class="acct-aside">${aside}</span>` : ''}<span class="acct-go">⟦chev⟧</span></a>`;
  return `
<div class="screen account">
  <div class="acct-top"><a class="back" href="#/dashboard" aria-label="Fermer">⟦back⟧</a></div>
  <div class="acct-id">
    ${logoMark()}
    <div><h1>${esc(USER.prenom)}</h1><p>Compte et paramètres</p></div>
  </div>
  <a class="one-card" href="#/premium">
    <div><b>${APP_NAME} Premium</b><span>${P ? 'Actif. Zéro pub, alertes et banques illimitées.' : '1 mois offert. Zéro pub, alertes et banques illimitées.'}</span></div>
    ${logoMark()}
  </a>
  <p class="acct-k">Services</p>
  <div class="menu-card">
    ${row('#/banques','bank','Mes banques')}
    ${row('#/abonnements','scissors','Transactions')}
    ${row('#/alertes','bell','Alertes', unread ? String(unread) : '')}
  </div>
  <p class="acct-k">Paramètres</p>
  <div class="menu-card">
    <button type="button" class="acct-row" id="toggle-balance" aria-pressed="${state.hideBalance ? 'true' : 'false'}"><span class="acct-ic">⟦${state.hideBalance ? 'eyeoff' : 'eye'}⟧</span><span class="acct-lab">Masquer le solde</span><span class="sw ${state.hideBalance ? 'on' : ''}"></span></button>
    ${row('#/apparence','auto','Apparence', themeLabel())}
    ${row('#/premium','star',APP_NAME+' Premium', P ? 'Actif' : 'Gratuit')}
    ${row('#/parrainage','gift','Parrainage','1 mois offert')}
  </div>
  <a class="help-card" href="#/aide"><div><b>Obtenir de l’aide</b><span>Questions fréquentes, ou un humain au chat.</span></div><span class="help-ic">⟦chat⟧</span></a>
  <p class="acct-legal"><i class="brand-mark" aria-hidden="true"></i>${APP_NAME} n’est pas une banque. Lecture seule, aucun virement.<br><a href="#/apropos">À propos</a> · ${demoTag}</p>
</div>`;
};
screens.apropos = () => `
<div class="screen">
  <div class="topbar look-bar"><a class="back" href="#/compte" aria-label="Retour">⟦back⟧</a><h1>À propos</h1><span></span></div>
  <div style="display:flex;justify-content:center;margin:8px 0 18px">${logoMark('l')}</div>
  <div class="card about">
    <p>${APP_NAME} n’est pas une banque. C’est une lecture de vos comptes : prélèvements, hausses de prix, reste à vivre. Aucun virement, aucune carte, aucun conseil sponsorisé.</p>
    <p>Les chiffres de Camille sont un exemple. Rien n’est envoyé tant qu’une banque n’est pas connectée.</p>
  </div>
  <div class="card" style="padding:4px 16px">
    <div class="kv"><span>Version</span><span class="muted">Bêta privée</span></div>
    <div class="kv"><span>Formule</span><span class="muted">${isP() ? 'Premium' : 'Gratuit'}</span></div>
  </div>
  <button class="btn ghost" id="reset" type="button">Recommencer la démo</button>
</div>`;
function refCode(){
  try {
    const saved = localStorage.getItem('prelevo-ref');
    if (saved) return saved;
    const base = (USER.prenom || 'PRELEVO').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/gi, '').toUpperCase().slice(0, 8) || 'PRELEVO';
    const n = [...base].reduce((a, ch) => (a * 33 + ch.charCodeAt(0)) % 90, 11);
    const code = base + String(10 + n);
    localStorage.setItem('prelevo-ref', code);
    return code;
  } catch (e) { return 'CAMILLE21'; }
}
function refShareText(){
  return `${USER.prenom} vous invite sur ${APP_NAME}. Code ${refCode()} : 1 mois de Premium offert pour vous deux, dès qu’une banque est connectée. https://jhnxmr.github.io/prelevo/app/?demo=1`;
}
const REF_SEED = [
  { name:'Léa M.', date:'12 sept.', status:'offert', detail:'1 mois Premium crédité' },
  { name:'Noah B.', date:'2 oct.', status:'inscrit', detail:'Compte créé, banque pas encore connectée' },
  { name:'Inès K.', date:'8 oct.', status:'envoye', detail:'Invitation envoyée' },
];
function myRefs(){
  let extra = [];
  try { extra = JSON.parse(localStorage.getItem('prelevo-refs') || '[]'); } catch (e) {}
  return (Array.isArray(extra) ? extra : []).concat(REF_SEED);
}
const REF_LABEL = { offert:'Offert', inscrit:'Inscrit', envoye:'Envoyé' };
screens.parrainage = (qs, sub) => {
  const back = `<div class="topbar look-bar"><a class="back" href="${sub ? '#/parrainage' : '#/compte'}" aria-label="Retour">⟦back⟧</a><h1>${sub === 'inviter' ? 'Parrainer' : sub === 'suivi' ? 'Vos parrainages' : sub === 'comment' ? 'Le parrainage' : 'Parrainage'}</h1><span></span></div>`;
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
  const radio = (v, lab) => `<button type="button" class="th-radio" data-theme-set="${v}" onclick="pickTheme('${v}')" role="radio" aria-checked="${t===v}"><span class="rdot"></span>${lab}</button>`;
  const tiles = [['bleu','Défaut'],['noir','Noir'],['defaut','Blanc']];
  return `
<div class="screen look-page">
  <div class="topbar look-bar"><a class="back" href="#/compte" aria-label="Retour">⟦back⟧</a><h1>Apparence</h1><span></span></div>
  <p class="acct-k">Thème</p>
  <div class="menu-card th-card">
    ${radio('light','Clair')}
    ${radio('dark','Sombre')}
    <button type="button" class="th-auto" data-theme-auto onclick="pickTheme(PrelevoTheme.get()==='auto'?(document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light'):'auto')" aria-pressed="${t==='auto'}">
      <span><b>Automatique</b><small>Le thème utilisera la valeur par défaut de votre appareil</small></span>
      <span class="sw ${t==='auto'?'on':''}"></span>
    </button>
  </div>
  <p class="acct-k">Icône de l’app</p>
  <div class="menu-card icon-card">
    <div class="icon-grid">${tiles.map(([id,lab])=>`<button type="button" class="icon-opt ${icon===id?'on':''}" data-app-icon="${id}" onclick="pickIcon('${id}')" aria-pressed="${icon===id}"><span class="tile t-${id}">${id==='bleu'?'<img src="icons/logo-mark.svg" alt="">':'<i class="glyph"></i>'}</span>${icon===id?'<i class="ibadge">⟦check⟧</i>':''}<span class="ilab">${lab}</span></button>`).join('')}</div>
    <p class="icon-note">Le logo bleu est le logo officiel de Prelevo, partout dans l’app. Noir et Blanc restent des variantes. L’icône déjà posée sur l’écran d’accueil de l’iPhone ne change pas toute seule.</p>
  </div>
</div>`;
};
screens.aide = () => `
<div class="screen">
  <div class="topbar"><a class="back" href="#/compte">⟦back⟧</a><h1 style="font-size:19px">Aide et réglages</h1>${demoTag}</div>
  <div class="card support">
    <div class="sup-head"><div class="avatars"><span class="avc a">S</span><span class="avc b">K</span><span class="avc c">M</span></div>
      <div><b>Support humain</b><div class="muted small">De vraies personnes vous répondent, pas un robot.</div></div></div>
    <p class="small" style="color:var(--ink2);margin:10px 0 12px;line-height:1.45">Sarah, Karim et Marie (exemple) répondent du lundi au samedi, de 9 h à 19 h. Réponse moyenne : moins de 2 h${isP()?' · prioritaire pour vous':''}.</p>
    <div class="btn-pair" style="margin:0">
      <a class="btn mint" href="#/chat">⟦chat⟧ Chat</a>
      <button class="btn ghost" data-toast="E-mail à ${CFG.supportEmail} (simulation)">⟦mail⟧ E-mail</button>
    </div>
  </div>
  <div class="card" style="padding:4px 16px">
    <button type="button" class="kv lnk" id="toggle-balance"><span>⟦${state.hideBalance ? 'eyeoff' : 'eye'}⟧ ${state.hideBalance ? 'Afficher le solde' : 'Masquer le solde'}</span><span>${state.hideBalance ? 'Masqué' : 'Visible'} ›</span></button>
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
    <button class="btn ghost" id="reset" style="margin-top:8px">Recommencer la démo</button>
  </div>
</div>`;

const CHAT = [
  { me:false, t:'Bonjour Camille Je suis Sarah, de l’équipe support. Comment je peux vous aider ?', h:'14:02' },
  { me:true,  t:'FibreBox me dit que je dois envoyer un recommandé, c’est obligatoire ?', h:'14:03' },
  { me:false, t:'Pas forcément ! Si vous avez souscrit en ligne, ils doivent vous proposer la résiliation en ligne. Sinon, la lettre préparée dans l’app suffit : je peux la relire avec vous.', h:'14:05' },
];
screens.chat = () => `
<div class="screen chat-screen">
  <div class="topbar"><a class="back" href="#/aide">⟦back⟧</a><div class="chat-who"><span class="av avc a">S</span><div><b>Sarah</b><div class="muted small">Équipe support · humaine · en ligne</div></div></div>${demoTag}</div>
  <div class="chat">${CHAT.map(m=>`<div class="msg ${m.me?'me':''}"><div class="bubble">${m.t}</div><div class="h">${m.h}</div></div>`).join('')}</div>
  <form class="chat-input" id="chat-form"><input id="chat-text" placeholder="Écrivez votre message…" autocomplete="off"><button class="send" aria-label="Envoyer">⟦send⟧</button></form>
  <p class="muted small center" style="margin-top:8px">Conversation simulée – aucun message n’est envoyé.</p>
</div>`;

let billing = 'year';
screens.premium = () => {
  const t = totals(); const Y = billing==='year';
  const B = API && ME ? ME.billing : null, P = isP();
  const fd = d => d ? new Date(d).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }) : '';
  const status = !P ? '' : B ? `<div class="card plan-status"><div class="ps-h"><span class="plan-pill p">Premium</span><b>${B.interval === 'year' ? 'Formule annuelle' : 'Formule mensuelle'}</b></div>
      <p class="muted small">${B.status === 'trialing' ? `Période d’essai gratuite jusqu’au ${fd(B.periodEnd)}.` : B.cancelAtPeriodEnd ? `Résilié : Premium reste actif jusqu’au ${fd(B.periodEnd)}.` : B.status === 'past_due' ? '<span class="t-red">Paiement en échec : mettez à jour votre carte.</span>' : `Prochain renouvellement le ${fd(B.periodEnd)}.`}</p>
      ${B.manageable ? `<button class="btn ghost" id="billing-portal">Gérer mon abonnement</button>` : ''}</div>`
    : `<div class="card plan-status"><div class="ps-h"><span class="plan-pill p">Premium</span><b>Formule annuelle (exemple)</b></div><p class="muted small">Période d’essai gratuite jusqu’au ${fd(new Date(nowRef().getTime() + 30 * DAY_MS))}. Factures, carte et résiliation : en 1 clic depuis « Gérer mon abonnement ».</p><button class="btn ghost" data-toast="Portail de paiement (simulation)">Gérer mon abonnement</button></div>`;
  const perks = open => `<details class="perks"${open ? ' open' : ''}><summary>Principaux avantages</summary><ul><li>Zéro publicité</li><li>Alertes de hausse de prix</li><li>Rappel avant chaque prélèvement</li><li>Doubles prélèvements, oubliés et doublons</li><li>Résiliation guidée et lettres</li><li>Reste à vivre et suivi des économies</li><li>Banques illimitées</li><li>Support prioritaire</li></ul></details>`;
  const monthEq = Y ? CFG.priceYear / 12 : CFG.priceMonth;
  const times = t.found > 0 ? Math.max(1, Math.round(t.found / monthEq)) : 0;
  const hits = [];
  t.list.filter(s => s.doubleCharge).forEach(s => hits.push(`${s.name} prélevé deux fois`));
  t.dups.forEach(s => { const o = byId(s.duplicate); hits.push(o ? `Doublon : ${s.name} et ${o.name}` : `Doublon : ${s.name}`); });
  t.ups.forEach(s => hits.push(`${s.name} a augmenté de ${eur(increase(s))}`));
  t.smalls.forEach(s => hits.push(`${s.name} · ${eur(s.price)} oubliés`));
  const shown = hits.slice(0, 4), rest = hits.length - shown.length;
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/dashboard">⟦back⟧</a>${demoTag}</div>
  <div class="center" style="margin-bottom:6px">
    
    <h1 style="font-size:25px;letter-spacing:-.02em;margin-top:4px">${APP_NAME} Premium</h1>
    <p class="muted" style="margin-top:6px;font-size:14.5px">${P ? 'Vos alertes et le reste à vivre sont débloqués.' : 'L’app qui vous fait économiser plus qu’elle ne coûte.'}</p>
  </div>
  ${status}
  <div class="payoff">
    <div class="win"><div class="k">${P ? 'Économies débloquées' : 'Trouvées chez ' + USER.prenom}</div><b>${eur(t.found)}</b><div class="k">par mois</div></div>
    <div><div class="k">${Y ? 'Premium annuel' : 'Premium mensuel'}</div><b>${prix(monthEq)}</b><div class="k">par mois${times ? ` · remboursé ${times}×` : ''}</div></div>
  </div>
  ${shown.length ? `<ul class="found-list">${shown.map(h => `<li>${h}</li>`).join('')}${rest > 0 ? `<li>et ${rest} autre${rest > 1 ? 's' : ''}</li>` : ''}</ul>` : ''}
  <div class="plans" role="radiogroup" aria-label="Formules">
    <div class="plan free"><div class="pl-l"><h3>Gratuit</h3><span>Scan + liste · avec pubs</span></div><div class="pl-r"><div class="p">0 €</div></div></div>
    <div class="plan-stack ${Y?'':'on'}"><button class="plan ${Y?'':'on'}" data-billing="month" role="radio" aria-checked="${!Y}">${P && !Y ? '<em class="rec-b">Votre formule</em>' : ''}<i class="radio"></i><div class="pl-l"><h3>Premium Mensuel</h3><span>Sans engagement · Zéro pub</span></div><div class="pl-r"><div class="p">${prix(CFG.priceMonth)}<small>/mois</small></div></div></button>${Y ? '' : perks(true)}</div>
    <div class="plan-stack ${Y?'on':''}"><button class="plan rec ${Y?'on':''}" data-billing="year" role="radio" aria-checked="${Y}"><em class="rec-b">${P && Y ? 'Votre formule' : 'Recommandé'}</em><i class="radio"></i><div class="pl-l"><h3>Premium Annuel <b class="save">−${yearSave()} %</b></h3><span>soit ${prix(CFG.priceYear/12)}/mois · Zéro pub</span></div><div class="pl-r"><div class="p">${prix(CFG.priceYear)}<small>/an</small></div></div></button>${Y ? perks(true) : ''}</div>
  </div>
  ${P ? '' : `<div class="trial">⟦gift⟧ <span><b>${CFG.trial}</b><br>puis <span class="${Y?'':'sel'}">${prix(CFG.priceMonth)}/mois</span> ou <span class="${Y?'sel':''}">${prix(CFG.priceYear)}/an</span></span></div>`}
  <details class="cmp-more">
    <summary>Comparer Gratuit et Premium</summary>
    <div class="card">
    <table class="cmp">
      <tr><th></th><th>Gratuit</th><th>Premium</th></tr>
      <tr><td>Scan des comptes</td><td class="y">⟦check⟧</td><td class="y">⟦check⟧</td></tr>
      <tr><td>Liste des abonnements et total</td><td class="y">⟦check⟧</td><td class="y">⟦check⟧</td></tr>
      <tr><td>Banques connectées</td><td>1</td><td><b>Illimitées</b></td></tr>
      <tr><td>Alertes hausse de prix</td><td class="n">—</td><td class="y">⟦check⟧</td></tr>
      <tr><td>Rappel avant chaque prélèvement</td><td class="n">—</td><td class="y">⟦check⟧</td></tr>
      <tr><td>Alerte double prélèvement</td><td class="n">—</td><td class="y">⟦check⟧</td></tr>
      <tr><td>Petits prélèvements oubliés et doublons</td><td class="n">—</td><td class="y">⟦check⟧</td></tr>
      <tr><td>Résiliation guidée et lettres</td><td class="n">—</td><td class="y">⟦check⟧</td></tr>
      <tr><td>Reste à vivre et suivi des économies</td><td class="n">—</td><td class="y">⟦check⟧</td></tr>
      <tr><td>Support humain</td><td class="y">⟦check⟧</td><td><b>Prioritaire</b></td></tr>
      <tr><td>Sans publicité</td><td class="n">—</td><td class="y">⟦check⟧</td></tr>
      <tr><td>Conseils neutres (aucun sponsor n’influence vos résultats)</td><td class="y">⟦check⟧</td><td class="y">⟦check⟧</td></tr>
    </table>
    </div>
  </details>
  ${neutral}
  <a class="card sup-mini" href="#/chat"><span class="avatars"><span class="avc a">S</span><span class="avc b">K</span></span><div><b>Une question avant de vous abonner ?</b><span>Un humain vous répond, pas un robot.</span></div><span class="chev">⟦chev⟧</span></a>
  ${P ? '' : `<p class="muted small center" style="margin:10px 0 0">${API && ME ? 'Paiement sécurisé par Stripe (mode test : aucune carte réelle débitée). Les 500 premiers inscrits ont 3 mois offerts.' : 'Les 500 premiers inscrits ont 3 mois offerts.'}</p>`}
  <p class="muted small center" style="margin-top:10px">Formule ${Y?'Annuelle':'Mensuelle'} : puis ${Y?prix(CFG.priceYear)+'/an (soit '+prix(CFG.priceYear/12)+'/mois)':prix(CFG.priceMonth)+'/mois'} après l’essai. Annulable en 1 clic, à tout moment. Paiement simulé dans cette maquette.</p>
  ${P ? '' : `<div class="sub-bar"><button class="btn mint" id="go-premium"><span>S’abonner</span><small>${Y ? prix(CFG.priceYear)+' / an' : prix(CFG.priceMonth)+' / mois'} · 1 mois offert</small></button></div>`}
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
  '7J':  { days:7,   stepH:2,  dots:true,  fmt:'hour' },
  '1M':  { days:30,  stepH:4,  dots:true,  fmt:'day' },
  '3M':  { days:91,  stepH:12, dots:false, fmt:'day' },
  '1A':  { days:365, stepH:24, dots:false, fmt:'month' },
  'TOUT':{ days:556, stepH:48, dots:false, fmt:'month' },   // depuis le 1er avr. 2025
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
  Object.entries(cycles).forEach(([k, ds]) => {
    k = +k;
    const fixed = []; 
    ds.forEach(d => {
      if (d.getDate() === 21) {
        const prime = d.getMonth() === 4 ? 5200 : d.getMonth() === 11 ? 6800 : 0;
        fixed.push({ t:new Date(d.getFullYear(), d.getMonth(), 21, 7, 30), amt:INCOME + prime, name: prime ? 'Salaire et prime' : 'Salaire', k:'in' });
      }
      if (d.getDate() === 5) fixed.push({ t:new Date(d.getFullYear(), d.getMonth(), 5, 6, 10), amt:-RENT, name:'Loyer', k:'rent' });
      t.list.forEach(s => { if (s.day === d.getDate()) fixed.push({ t:new Date(d.getFullYear(), d.getMonth(), d.getDate(), 5 + (s.price*7 % 4), 0), amt:-s.price, name:s.name, k:'sub' }); });
    });
    const origin = new Date(k);
    const lastDay = ds[ds.length - 1];
    const endDay = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate(), 23, 59);
    [[1,168],[3,92],[5,46],[7,154],[11,78],[13,36],[14,142],[16,64],[18,52],[21,136],[24,88],[28,74]].forEach(([off, amt]) => {
      const tt = new Date(origin.getFullYear(), origin.getMonth(), origin.getDate() + off, 11 + (off % 4), (off * 11) % 50);
      if (tt < ds[0] || tt > endDay || tt > NOW) return;
      ev.push({ t:tt, amt:-amt, name:'Carte', k:'spend' });
    });
    fixed.forEach(e => { if (e.t <= NOW) ev.push(e); });
  });
  ev.sort((a,b)=>a.t-b.t);
  // Le surplus part en épargne, sauf juste après les primes de mai et décembre : le pic reste visible une quinzaine de jours.
  let run = 1900;
  const xfer = [];
  for (const e of ev) {
    run += e.amt;
    const m = e.t.getMonth(), d = e.t.getDate();
    const spike = (m === 4 && d >= 21) || (m === 5 && d <= 6) || (m === 11 && d >= 21) || (m === 0 && d <= 6);
    if (!spike && e.k !== 'in' && run > 2600) { const skim = Math.round(run - 1800); xfer.push({ t:new Date(e.t.getTime() + 36e5), amt:-skim, name:'Virement épargne', k:'xfer' }); run = 1800; }
  }
  ev.push(...xfer);
  ev.sort((a,b)=>a.t-b.t);
  const remaining = t.list.filter(s => s.day >= 10 && s.day < 21).reduce((a,s)=>a+s.price,0);
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
  for (let tt = from.getTime(); tt <= NOW.getTime() + 1; tt += P.stepH * 36e5){
    const subs = []; let lo = cur, hi = cur;
    while (j < T.ev.length && T.ev[j].t.getTime() <= tt){ cur = T.ev[j].after; lo = Math.min(lo, cur); hi = Math.max(hi, cur); if (T.ev[j].k === 'sub') subs.push(T.ev[j]); j++; }
    out.push({ t:new Date(tt), bal:cur, subs, salary:false });
  }
  if (out[out.length-1].t < NOW) out.push({ t:new Date(NOW), bal:T.end, subs:[] });
  out[out.length-1].bal = T.end;
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
    <div class="muted small" style="margin-bottom:6px">Soldes lus chez ${LIVE.bank}${API ? '' : ' (sandbox Powens)'}</div>
    ${LIVE.accounts.map(a=>`<div class="kv"><span class="small">${a.name}</span><span class="nw">${(a.balance||0).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})} ${a.currency==='EUR'||!a.currency?'€':a.currency}</span></div>`).join('')}</div>`;
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
      <defs><linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4D94FF" stop-opacity=".34"/><stop offset=".7" stop-color="#0066FF" stop-opacity=".06"/><stop offset="1" stop-color="#0066FF" stop-opacity="0"/></linearGradient></defs>
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
  const subs = p.subs.length ? ` · <span class="g-sub">${p.subs.map(e=>`${e.name} −${eur(-e.amt)}`).join(', ')}</span>` : '';
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
  if (tf && tf.dataset.tf !== homeTf) { homeTf = tf.dataset.tf; render(); return; }
  const b = e.target.closest && e.target.closest('[data-period]'); if (!b) return;
  balPeriod = b.dataset.period;
  const sec = document.getElementById('balance'); if (sec) sec.outerHTML = balanceChart();
});

screens.pwscan = () => `
<div class="screen"><div class="loader">
  <div class="spin"></div>
  <h2 style="font-size:20px">Lecture de vos comptes de test…</h2>
  <p class="muted small" style="margin-top:6px">Banque de test Powens. L’analyse se fait dans votre navigateur.</p>
  ${skel()}
  <div class="scanlist" id="pwlist"><div class="done">⟦check⟧ Connexion à la banque de test</div><div id="pw-step">⟦clock⟧ Récupération des opérations…</div></div>
  <div id="pw-err"></div>
</div></div>`;
async function runPwScan(){
  const fail = (title, text) => { const e = $('#pw-err'); if (e) e.innerHTML = icons(`<div class="banner amber" style="margin-top:18px;text-align:left"><span class="ic">⟦alert⟧</span><div><b>${title}</b>${text}</div></div>
    <button class="btn" id="pw-connect">Réessayer</button><a class="btn ghost" href="#/onboarding" id="pw-quit">Revenir à la démo</a>`); };
  const err = PWX.returnError();
  history.replaceState(null, '', location.pathname + '#/pwscan');
  if (err) return fail('Connexion annulée', `Powens a renvoyé : ${String(err).replace(/</g,'&lt;')}`);
  const tk = PWX.tokenInfo();
  if (!tk || tk.expired) return fail('Session de test expirée', 'Le jeton Powens ne dure que 30 minutes. Relancez la connexion.');
  try {
    const r = await PWX.fetchAll();
    applyLive(r); state.connected = true; save();
    location.hash = '#/dashboard';
    toast(`${r.subs.length} prélèvement${r.subs.length>1?'s':''} récurrent${r.subs.length>1?'s':''} détecté${r.subs.length>1?'s':''} sur ${r.txCount} opérations${r.history && r.history.limited ? ' (historique court)' : ''}`);
  } catch(e){
    if (e.status === 401 || e.status === 403) fail('Session de test expirée', 'Le jeton Powens n’est plus valable. Relancez la connexion.');
    else fail('Lecture impossible', String(e.message).replace(/</g,'&lt;'));
  }
}
async function pwRefresh(){
  const tk = PWX.tokenInfo(); if (!tk || tk.expired) { render(); return toast('Session de test expirée : reconnectez la banque de test'); }
  toast('Relecture des opérations…');
  try { applyLive(await PWX.fetchAll()); render(); toast('Opérations relues'); }
  catch(e){ if (e.status===401||e.status===403){ const t = PWX.tokenInfo(); if (t) sessionStorage.setItem('prelevo-pw-token', JSON.stringify({...t, exp:0})); render(); toast('Session de test expirée'); } else toast('Erreur Powens : ' + e.message); }
}

// ---------- compte Prelevo (API) ----------
let loginSent = null;
screens.connexion = (q) => {
  if (q.get('token')) return `<div class="screen"><div class="loader"><div class="spin"></div><h2 style="font-size:20px">Connexion…</h2><p class="muted small" style="margin-top:6px">Vérification de votre lien. Cela ne prend qu’un instant.</p>${skel()}</div></div>`;
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
<div class="screen"><div class="loader">
  <div class="spin"></div>
  <h2 style="font-size:20px">Lecture de vos comptes…</h2>
  <p class="muted small" style="margin-top:6px">La banque transmet vos opérations. Cela peut prendre jusqu’à 30 secondes : vous pouvez laisser cette page ouverte.</p>
  ${skel()}
  <div id="api-err"></div>
</div></div>`;
screens.supprimer = () => !API || !API.loggedIn() ? screens.onboarding() : `
<div class="screen">
  <div class="topbar"><a class="back" href="#/aide">⟦back⟧</a><h1 style="font-size:19px">Supprimer mon compte</h1></div>
  <div class="card">
    <div style="font-weight:700;margin-bottom:6px">Ce qui sera effacé, définitivement :</div>
    <ul class="del-list">
      <li>⟦check⟧<span>votre compte${ME ? ` <b class="brk">${esc(ME.email)}</b>` : ''} et vos sessions</span></li>
      <li>⟦check⟧<span>l’accès à votre banque, aussi chez notre agrégateur (Powens)</span></li>
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
  const fail = (t, x) => { const e = $('#api-err'); if (e) e.innerHTML = icons(`<div class="banner amber" style="margin-top:18px;text-align:left"><span class="ic">⟦alert⟧</span><div><b>${t}</b>${esc(x)}</div></div><button class="btn" id="api-connect">Réessayer</button><a class="btn ghost" href="#/onboarding">Plus tard</a>`); };
  if (!p) return fail('Retour de connexion incomplet', 'Relancez la connexion de votre banque.');
  try {
    const r = await API.finishConnect(p);
    await apiLoadMe();
    location.hash = '#/dashboard';
    toast(`${r.subscriptions} prélèvement${r.subscriptions>1?'s':''} récurrent${r.subscriptions>1?'s':''} détecté${r.subscriptions>1?'s':''}${r.history && r.history.limited ? ' (historique court)' : ''}`);
  } catch(e){
    if (e.status === 401) return apiFail(e);
    if (p.error) return fail('Connexion annulée', e.message);
    // la banque met parfois quelques secondes à transmettre les comptes : on retente via une synchro (le retour n'est valable qu'une fois)
    for (const wait of [4000, 8000, 15000]) {
      await new Promise(ok => setTimeout(ok, wait));
      try { const r = await API.sync(); await apiLoadMe(); if (ME && ME.accounts && ME.accounts.length) { location.hash = '#/dashboard'; toast(`${r.subscriptions} prélèvement${r.subscriptions>1?'s':''} récurrent${r.subscriptions>1?'s':''} détecté${r.subscriptions>1?'s':''}`); return; } }
      catch(e2){ if (e2.status === 401) return apiFail(e2); }
    }
    fail('Lecture impossible', e.message);
  }
}

// ---------- routeur ----------
function render(){
  _timeline = null;
  document.querySelectorAll('body > .sub-bar').forEach(n => n.remove());
  const raw = location.hash.replace(/^#\/?/, '') || (API ? (API.loggedIn() && LIVE ? 'dashboard' : 'onboarding') : state.connected ? 'dashboard' : 'onboarding');
  const [path, qs] = raw.split('?');
  const [name, ...args] = path.split('/');
  const fn = screens[name] || screens.dashboard;
  $('#app').innerHTML = icons(fn(new URLSearchParams(qs||''), ...args));
  const bar = $('#app .sub-bar'); if (bar) document.body.appendChild(bar);
  const tabbed = ['dashboard','operations','abonnements','alertes','premium','abo','aide','apropos','banques','compte','apparence','parrainage'].includes(name) || (!screens[name]);
  $('#tabbar').hidden = !tabbed;
  if (API && ['onboarding','connexion','dashboard','connect','banques'].includes(name)){ const sc = $('#app').firstElementChild; if (sc && !sc.querySelector('.alpha-note')) sc.insertAdjacentHTML('afterbegin', '<div class="alpha-note" role="note"><b>Bêta privée</b> — banques de test uniquement pour l’instant</div>'); }
  const tabName = name==='abo' || name==='operations' ? 'abonnements' : !screens[name] ? 'dashboard' : name;
  document.querySelectorAll('#tabbar a').forEach(a => { const on = a.dataset.tab === tabName; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  $('#alert-dot').classList.toggle('show', alerts().some(a=>!state.readAlerts.includes(a.id)));
  window.scrollTo(0,0);
  if (name==='dashboard') animateHome();
  if (name==='scan') runScan();
  if (name==='pwscan' && PWX && !LIVE) runPwScan();
  if (name==='connexion' && API){ const tk = new URLSearchParams(qs||'').get('token'); if (tk) apiVerify(tk); }
  if (API && !API.loggedIn() && ['dashboard','abonnements','alertes','banques','abo','supprimer'].includes(name)){ location.replace('#/onboarding'); }
  if (name==='resilier' && !isP()) toast('La résiliation guidée fait partie de Premium');
}

function runScan(){
  const items = [...document.querySelectorAll('#scanlist div')];
  items.forEach((el,i)=>setTimeout(()=>el.classList.add('done'), 400 + i*450));
  setTimeout(()=>{ state.connected = true; save(); location.hash = '#/dashboard'; toast(SUBS.length + ' abonnements détectés'); }, 400 + items.length*450 + 500);
}

document.addEventListener('input', e => {
  if (e.target.id !== 'tx-q') return;
  opsQuery = e.target.value;
  const s = opsQuery.trim().toLowerCase();
  document.querySelectorAll('.act-list .mo').forEach(mo => {
    let n = 0;
    mo.querySelectorAll('.tx').forEach(row => {
      const show = !s || (row.querySelector('.name').textContent || '').toLowerCase().includes(s);
      row.hidden = !show;
      if (show) n++;
    });
    mo.hidden = !n;
  });
});
document.addEventListener('click', e => {
  const ops = e.target.closest('[data-ops]'); if (ops){ opsFilter = ops.dataset.ops; const q = document.getElementById('tx-q'); if (q) opsQuery = q.value; render(); return; }
  const th = e.target.closest('[data-theme-set]');
  if (th){ pickTheme(th.dataset.themeSet); return; }
  const thAuto = e.target.closest('[data-theme-auto]');
  if (thAuto && window.PrelevoTheme){
    pickTheme(PrelevoTheme.get() === 'auto' ? (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light') : 'auto');
    return;
  }
  const appIco = e.target.closest('[data-app-icon]');
  if (appIco){ pickIcon(appIco.dataset.appIcon); return; }
  const el = e.target.closest('[data-bank],[data-method],[data-toast],[data-billing],[data-alert],[data-af],[data-alert-set],[data-plan],#go-scan,#keep,#confirm-resil,#go-premium,#reset,#read-all,#pw-connect,#pw-quit,#pw-refresh,#api-connect,#api-sync,#api-logout,#api-delete,#login-again,#del-check,#copy-letter,#print-letter,#billing-portal,#toggle-balance');
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
  else if (el.id==='toggle-balance'){ state.hideBalance = !state.hideBalance; save(); render(); }
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
    let extra = [];
    try { extra = JSON.parse(localStorage.getItem('prelevo-refs') || '[]'); } catch (e) {}
    if (!Array.isArray(extra)) extra = [];
    extra.unshift({ name, date: new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'short' }).replace(/\.$/, ''), status:'envoye', detail:'Invitation envoyée' });
    try { localStorage.setItem('prelevo-refs', JSON.stringify(extra.slice(0, 20))); } catch (e) {}
    location.hash = '#/parrainage/suivi';
    toast('Invitation notée');
    render();
  }
  else if (el.id==='print-letter'){ const l = $('.letter'); if (!l) return; const w = open('', '_blank'); if (!w) return toast('Autorisez les fenêtres pour imprimer'); w.document.write('<pre style="font:14px/1.5 Georgia,serif;white-space:pre-wrap;max-width:640px;margin:40px auto">' + esc(l.innerText) + '</pre>'); w.document.close(); w.print(); }
  else if (el.id==='api-sync'){ toast('Synchronisation…'); API.sync().then(apiLoadMe).then(()=>{ render(); toast('Comptes à jour'); }).catch(apiFail); }
  else if (el.id==='api-logout'){ API.logout().then(()=>{ ME = null; LIVE = null; state.connected = false; save(); location.replace(location.pathname + '#/onboarding'); location.reload(); }); }
  else if (el.id==='del-check'){ const b = $('#api-delete'); if (b) b.disabled = !el.checked; }
  else if (el.id==='api-delete'){ if (!$('#del-check') || !$('#del-check').checked) return; el.disabled = true; el.textContent = 'Suppression…';
    API.deleteAccount().then(()=>{ localStorage.removeItem(KEY); sessionStorage.setItem('prelevo-deleted', '1'); location.replace(location.pathname + '#/onboarding'); location.reload(); })
      .catch(err => { el.disabled = false; el.textContent = 'Supprimer définitivement'; apiFail(err); }); }
  else if (el.id==='login-again'){ loginSent = null; render(); }
  else if (el.id==='pw-connect'){ e.preventDefault(); pwConnect(); }
  else if (el.id==='pw-refresh'){ pwRefresh(); }
  else if (el.id==='pw-quit'){ e.preventDefault(); PWX && PWX.clear(); location.replace(location.pathname + (state.connected ? '#/dashboard' : '#/onboarding')); location.reload(); }
  else if (el.id==='go-scan'){ if(state.bank) location.hash = '#/scan'; }
  else if (el.id==='keep'){ toast('OK, on ne vous alertera plus pour celui-ci'); }
  else if (el.id==='confirm-resil'){ const id = el.dataset.id; if(!state.resiliated.includes(id)) state.resiliated.push(id); save(); location.hash = '#/resilier/'+id+'/4'; }
  else if (el.id==='go-premium'){
    if (API && ME){ el.disabled = true; el.textContent = 'Ouverture du paiement…'; API.checkout(billing).then(r => location.assign(r.url)).catch(e => { el.disabled = false; render(); toast(e.message || 'Paiement indisponible'); }); }
    else { state.premium = true; save(); toast(CFG.trial + ' : Premium activé (simulation)'); render(); } }
  else if (el.id==='billing-portal'){ el.disabled = true; API.portal().then(r => location.assign(r.url)).catch(e => { el.disabled = false; toast(e.message || 'Portail indisponible'); }); }
  else if (el.id==='reset'){ localStorage.removeItem(KEY); location.href = location.pathname + '#/onboarding'; location.reload(); }
});

document.addEventListener('submit', e => {
  if (e.target.id === 'login-form'){ e.preventDefault();
    const email = $('#login-email').value.trim(); const btn = $('#login-submit');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return toast('Adresse e-mail invalide');
    btn.disabled = true; btn.textContent = 'Envoi…';
    API.requestLink(email).then(()=>{ loginSent = email; render(); }).catch(err => { btn.disabled = false; btn.textContent = 'Recevoir mon lien'; apiFail(err); });
    return; }
  if (e.target.id !== 'chat-form') return;
  e.preventDefault();
  const v = $('#chat-text').value.trim(); if (!v) return;
  const h = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  CHAT.push({ me:true, t:v.replace(/</g,'&lt;'), h });
  render();
  setTimeout(()=>{ CHAT.push({ me:false, t:'Merci, je regarde ça et je vous réponds dans quelques minutes (réponse simulée)', h }); if (location.hash.startsWith('#/chat')) render(); }, 1200);
});

if (PWX && !QS.has('demo')) {
  if (PWX.isReturn()) history.replaceState(null, '', location.pathname + location.search + '#/pwscan');
  else { const r = PWX.result(); if (r) applyLive(r); }
}
// expiration du jeton de test (30 min) : on rafraîchit l'affichage quand elle survient
setInterval(() => { if (LIVE && /banques|dashboard|alertes/.test(location.hash)) { const tk = PWX.tokenInfo(); if (tk && tk.expired && !tk._shown) { sessionStorage.setItem('prelevo-pw-token', JSON.stringify({...tk, _shown:1})); render(); toast('Session de test Powens expirée (30 min)'); } } }, 30000);
window.addEventListener('hashchange', render);
if (API){
  if (sessionStorage.getItem('prelevo-deleted')){ sessionStorage.removeItem('prelevo-deleted'); setTimeout(()=>toast('Compte supprimé. Toutes vos données ont été effacées.'), 300); }
  if (API.returnParams()){ render(); apiFinish(); }
  else if (API.loggedIn()){ $('#app').innerHTML = icons(screens.apiwait().replace('Lecture de vos comptes…','Chargement…').replace(/<p class="muted small"[^>]*>.*?<\/p>/,'')); apiLoadMe().then(render); }
  else render();
} else render();

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
  document.querySelector('#home-sync')?.classList.add('on');
  placeRadar(true);
  const shownAt = Date.now();
  try {
    if (API && ME){ toast('Synchronisation…'); await API.sync(); await apiLoadMe(); _ledger = null; render(); placeRadar(true); toast('Comptes à jour'); }
    else if (PWX && LIVE) await pwRefresh();
    else { await new Promise(r => setTimeout(r, 900)); toast('Comptes à jour (exemple)'); }
  } catch(e){ API ? apiFail(e) : toast('Synchronisation impossible'); }
  finally {
    const wait = Math.max(0, 1800 - (Date.now() - shownAt));
    if (wait) await new Promise(r => setTimeout(r, wait));
    _syncing = false;
    document.querySelector('#home-sync')?.classList.remove('on');
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
  let st = null, raf = 0;
  const restore = el => {
    if (!el) return;
    el.classList.remove('scrub');
    const o = el._orig; if (!o) return;
    const amt = document.querySelector('.total [data-count]'), dl = document.getElementById('sp-delta');
    if (amt) { delete amt.dataset.scrub; amt.innerHTML = o.a; }
    if (dl) dl.innerHTML = o.d;
    const dot = el.querySelector('.sp-dot'); if (dot) { dot.hidden = false; dot.style.left = o.l; dot.style.top = o.t; }
    const vl = el.querySelector('.sp-vline'); if (vl) vl.hidden = true;
    if (SPARK) {
      const line = el.querySelector('.sp-line'), dim = el.querySelector('.sp-dim'), area = el.querySelector('.sp-area');
      if (line) line.setAttribute('d', SPARK.line);
      if (area) area.setAttribute('d', SPARK.area);
      if (dim) dim.setAttribute('d', '');
    }
  };
  const paint = () => {
    if (!st || !SPARK || st.axis === 'y' || st.f == null) return;
    const P = SPARK.pts;
    const f = Math.min(P[P.length - 1].x, Math.max(P[0].x, st.f));
    let i = 1;
    while (i < P.length - 1 && P[i].x < f) i++;
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i)];
    const span = b.x - a.x, u = span ? Math.min(1, Math.max(0, (f - a.x) / span)) : 0;
    const y = a.y + (b.y - a.y) * u, v = a.v + (b.v - a.v) * u;
    const t = new Date(a.t.getTime() + (b.t.getTime() - a.t.getTime()) * u);
    const amt = document.querySelector('.total [data-count]'), dl = document.getElementById('sp-delta');
    st.el.classList.add('scrub');
    if (st.vl) { st.vl.hidden = false; st.vl.style.left = f + '%'; }
    if (st.dot) { st.dot.hidden = false; st.dot.style.left = f + '%'; st.dot.style.top = y + '%'; }
    const poly = SPARK.poly, ai = Math.max(0, i - 1), bi = Math.min(poly.length - 1, i);
    const pa = poly[ai], pb = poly[bi];
    const sx = pa[0] + (pb[0] - pa[0]) * u, sy = pa[1] + (pb[1] - pa[1]) * u;
    const seg = arr => arr.map((p, n) => (n ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const left = poly.slice(0, ai + 1).concat([[sx, sy]]);
    const right = [[sx, sy]].concat(poly.slice(bi));
    const line = st.el.querySelector('.sp-line'), dim = st.el.querySelector('.sp-dim'), area = st.el.querySelector('.sp-area');
    if (line) line.setAttribute('d', seg(left));
    if (dim) dim.setAttribute('d', seg(right));
    if (area) area.setAttribute('d', seg(left) + ` L${sx.toFixed(1)},${SPARK.H} L${poly[0][0].toFixed(1)},${SPARK.H} Z`);
    if (amt && !state.hideBalance) { amt.dataset.scrub = '1'; amt.innerHTML = money(v); }
    if (dl && !state.hideBalance) {
      const hh = String(t.getHours()).padStart(2, '0'), mm = String(t.getMinutes()).padStart(2, '0');
      dl.innerHTML = `<span class="scrub-when">${JC[t.getDay()]} ${t.getDate()} ${MOIS[t.getMonth()]} à ${hh}:${mm}</span>`;
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
    if (!st || !SPARK) return;
    const f = xOf(clientX), P = SPARK.pts;
    let i = 0, best = 1e9;
    for (let k = 0; k < P.length; k++) { const dist = Math.abs(P[k].x - f); if (dist < best) { best = dist; i = k; } }
    if (haptic && st.i >= 0 && i !== st.i) buzz(8);
    st.i = i; st.f = f;
  };
  const arm = (el, clientX, clientY) => {
    const amt = document.querySelector('.total [data-count]'), dl = document.getElementById('sp-delta'), dot = el.querySelector('.sp-dot');
    st = { el, i: -1, axis: null, x0: clientX, y0: clientY, lastY: clientY, pointerId: null, vl: el.querySelector('.sp-vline'), dot };
    el._orig = {
      a: (state.hideBalance || !amt || !amt.dataset.count) ? (amt ? amt.innerHTML : '') : money(+amt.dataset.count),
      d: dl ? dl.innerHTML : '',
      l: dot ? dot.style.left : '',
      t: dot ? dot.style.top : ''
    };
    syncDay(clientX, false);
    paint();
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
    if (st || !SPARK || !e.touches || e.touches.length !== 1) return;
    const el = e.target.closest && e.target.closest('.sp-hit');
    if (!el) return;
    const spark = el.closest('.spark');
    if (!spark) return;
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
    if (e.pointerType === 'touch' || e.button > 0 || !SPARK) return;
    const hit = e.target.closest && e.target.closest('.sp-hit');
    if (!hit) return;
    const el = hit.closest('.spark');
    if (!el) return;
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

  window.__scrubTo = f => {
    const el = document.querySelector('.spark'); if (!el || !SPARK) return;
    if (st) end();
    const r = el.getBoundingClientRect();
    arm(el, r.left + r.width * f, r.top + r.height / 2);
    st.axis = 'x';
    syncDay(r.left + r.width * f, false);
    paint();
  };
})();
if (QS.has('demo') && QS.get('scrub')) setTimeout(() => window.__scrubTo(+QS.get('scrub')), 600);  // captures
