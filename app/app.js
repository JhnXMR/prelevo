/* Prelevo – maquette cliquable. TOUTES LES DONNÉES SONT DES EXEMPLES FICTIFS. */
'use strict';
const CFG = window.APP_CONFIG || { name:'Prelevo', tagline:'l’app qui traque tes abonnements', priceMonth:3.99, priceYear:29.99, trial:'1 mois offert pour essayer', supportEmail:'support@exemple.fr' };
const APP_NAME = CFG.name;
document.title = `${APP_NAME} – ${CFG.tagline}`;

const USER = { prenom: 'Camille', nom: 'Exemple', adresse: '12 rue de l’Exemple\n75011 Paris' };
let INCOME = 2150;          // salaire net (exemple)
let RENT = 720;             // loyer (exemple)
let SPENT = 486.30;         // dépenses courantes déjà faites ce mois-ci (exemple)
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

const BANKS = [
  { id:'b1', name:'Banque Exemple', color:'#E2001A', ini:'BE' },
  { id:'b2', name:'Crédit Fictif', color:'#00965E', ini:'CF' },
  { id:'b3', name:'NéoBanque Démo', color:'#111827', ini:'ND' },
  { id:'b4', name:'Caisse Test', color:'#1F4E9C', ini:'CT' },
  { id:'b5', name:'Banque en ligne', color:'#FF6B00', ini:'BL' },
  { id:'b6', name:'Autre banque', color:'#8A94A8', ini:'+' },
];

// Comptes connectés (exemple) : statut de synchro + expiration de l'accès (renouvellement DSP2 tous les 180 jours)
const LINKED = [
  { id:'b1', name:'Banque Exemple', color:'#E2001A', ini:'BE', accounts:'Compte courant · Livret A', status:'ok', sync:'il y a 12 min', expiresIn:6, expires:'15 oct.' },
  { id:'b2', name:'Crédit Fictif', color:'#00965E', ini:'CF', accounts:'Compte joint', status:'ok', sync:'il y a 3 h', expiresIn:142, expires:'28 févr.' },
  { id:'b3', name:'NéoBanque Démo', color:'#111827', ini:'ND', accounts:'Carte en ligne', status:'error', sync:'échec depuis hier 18:40', expiresIn:63, expires:'11 déc.' },
];

// ---------- état (localStorage) ----------
const KEY = 'prelevo-demo';
const state = Object.assign({ connected:false, bank:null, resiliated:[], premium:false, readAlerts:[] }, JSON.parse(localStorage.getItem(KEY) || '{}'));
const save = () => localStorage.setItem(KEY, JSON.stringify(state));
// URL ?demo=1 => démarre directement connecté (pratique pour les captures)
const QS = new URLSearchParams(location.search);
if (QS.has('demo')) { state.connected = true; state.bank = state.bank || 'b1'; save(); }
if (QS.get('plan') === 'premium') { state.premium = true; save(); }
if (QS.get('plan') === 'free') { state.premium = false; save(); }
const isP = () => state.premium;
const linked = () => LIVE ? [liveBank()] : isP() ? LINKED : LINKED.slice(0,1);

// ---------- Banque de TEST Powens (sandbox) : vraies données de test, analysées dans le navigateur ----------
const PWX = window.PW || null;
if (PWX && QS.has('demo')) PWX.clear();            // ?demo=1 = toujours les données d'exemple
let LIVE = null;
function applyLive(r){
  LIVE = r;
  SUBS.splice(0, SUBS.length, ...r.subs);
  MONTHS.splice(0, MONTHS.length, ...r.months);
  INCOME = r.income; RENT = 0; SPENT = r.spent; PAYDAY_IN = r.payIn; PAST_SAVED = 0;
  Object.assign(USER, { prenom:'', nom:'[Prénom Nom]', adresse:'[Ton adresse]' });
  state.resiliated = state.resiliated.filter(id => SUBS.some(s => s.id === id));
  demoTag = '<span class="demo live">Banque de test Powens</span>';
}
function liveBank(){
  const tk = PWX && PWX.tokenInfo(); const expired = !tk || tk.expired;
  const mins = tk ? Math.max(0, Math.round((tk.exp - Date.now())/60000)) : 0;
  const n = LIVE.accounts.length;
  return { id:'pw', name:LIVE.bank, color:'#0066FF', ini:'PW', live:true,
    accounts:`${n} compte${n>1?'s':''} de test · ${LIVE.txCount} opérations`,
    status: expired ? 'expired' : 'ok', sync: 'il y a ' + Math.max(0, Math.round((Date.now()-LIVE.at)/60000)) + ' min',
    expiresIn: 999, expires: expired ? 'expirée' : `encore ${mins} min`, mins };
}
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
  chev:'<path d="M9 5l7 7-7 7"/>',
};
const icons = html => html.replace(/⟦(\w+)⟧/g, (_, n) => ICONS[n] ? SVG(ICONS[n]) : '');

// ---------- utilitaires ----------
const eur = n => n.toLocaleString('fr-FR', { minimumFractionDigits:2, maximumFractionDigits:2 }) + ' €';
const prix = n => n.toLocaleString('fr-FR', { minimumFractionDigits:2, maximumFractionDigits:2 }) + ' €';
const eur0 = n => Math.round(n).toLocaleString('fr-FR') + ' €';
const $ = s => document.querySelector(s);
const active = () => SUBS.filter(s => !state.resiliated.includes(s.id));
const byId = id => SUBS.find(s => s.id === id);
const logo = (s, cls='logo') => `<div class="${cls}" style="background:${s.color}">${s.ini}</div>`;
const increase = s => s.prev && s.price > s.prev ? s.price - s.prev : 0;
const pct = s => Math.round(increase(s) / s.prev * 100);
let demoTag = '<span class="demo">Données d’exemple</span>';
const lockBadge = (t='Premium') => `<span class="badge b-lock">⟦lock⟧ ${t}</span>`;
const neutral = `<div class="neutral"><span class="nic">⟦ban⟧</span><div><b>Zéro pub en Premium · conseils toujours neutres</b>La version gratuite affiche quelques pubs, toujours signalées « Sponsorisé ». Les sponsors n’influencent jamais tes alertes, tes résultats ni nos conseils, et on ne touche aucune commission sur tes résiliations.</div></div>`;
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

function alerts(){
  const t = totals(); const out = [];
  t.ups.forEach(s => out.push({ id:'up-'+s.id, ic:'⟦trend⟧', bg:'var(--redbg)', title:`${s.name} a augmenté de ${eur(increase(s))}`,
    text:`Tu paies maintenant ${eur(s.price)}/mois au lieu de ${eur(s.prev)} (+${pct(s)} %). Soit ${eur(increase(s)*12)} de plus par an.`, when: s.id==='flixo'?'Il y a 2 h':'Détecté lors du scan', link:'#/abo/'+s.id }));
  t.list.filter(s=>s.trial).forEach(s => out.push({ id:'trial-'+s.id, ic:'⟦clock⟧', bg:'var(--amberbg)', title:`Essai gratuit devenu payant : ${s.name}`,
    text:`${eur(s.price)} prélevés le 2 sept. Tu l’utilises encore ?`, when:'Il y a 5 j', link:'#/abo/'+s.id }));
  t.dups.forEach(s => out.push({ id:'dup-'+s.id, ic:'⟦copy⟧', bg:'var(--bluebg)', title:'Doublon détecté : 2 abonnements musique',
    text:`${s.name} et ${byId(s.duplicate).name} font la même chose. Garder un seul = ${eur(s.price*12)} économisés par an.`, when:'Hier', link:'#/abo/'+s.id }));
  t.list.filter(s=>s.doubleCharge).forEach(s => out.push({ id:'dbl-'+s.id, ic:'⟦alert⟧', bg:'var(--redbg)', title:`Prélevé 2 fois : ${s.name}`,
    text:`${eur(s.price)} débités deux fois le ${s.doubleCharge}. On t’aide à demander le remboursement.`, when:'Ce matin', link:'#/abo/'+s.id }));
  const next = t.list.filter(s=>s.day>=9 && s.day<=12).sort((a,b)=>a.day-b.day);
  next.forEach(s => out.push({ id:'next-'+s.id, ic:'⟦calendar⟧', bg:'var(--mintbg)', title:`Prélèvement le ${s.day} oct. : ${s.name}`,
    text:`${eur(s.price)} seront prélevés ${s.day===10?'demain':'dans '+(s.day-9)+' jours'}.`, when:'Aujourd’hui', link:'#/abo/'+s.id }));
  if (t.reste < 700) out.push({ id:'low', ic:'⟦alert⟧', bg:'var(--amberbg)', title:'Reste à vivre en baisse',
    text:`Il te reste ${eur(t.reste)} pour ${PAYDAY_IN} jours, soit ${eur(t.reste/PAYDAY_IN)} par jour.`, when:'Aujourd’hui', link:'#/dashboard' });
  out.forEach(a => a.premium = true);
  linked().forEach(b => {
    if (b.expiresIn <= 7) out.unshift({ id:'exp-'+b.id, ic:'⟦key⟧', bg:'var(--amberbg)', title:`Accès à ${b.name} : expire dans ${b.expiresIn} jours`,
      text:`Ta banque demande de renouveler l’accès tous les 180 jours. 30 secondes suffisent, sinon tes données ne se mettront plus à jour.`, when:'Aujourd’hui', link:'#/banques' });
    if (b.status==='expired') out.unshift({ id:'pwexp', ic:'⟦key⟧', bg:'var(--amberbg)', title:'Session de test Powens expirée',
      text:'Le jeton de test dure 30 minutes. Tes résultats restent affichés ; reconnecte la banque de test pour les relire.', when:'Maintenant', link:'#/banques' });
    if (b.status==='error') out.unshift({ id:'err-'+b.id, ic:'⟦link⟧', bg:'var(--redbg)', title:`${b.name} ne se synchronise plus`,
      text:`Dernière tentative ${b.sync}. Reconnecte-la pour garder des chiffres justes.`, when:'Hier', link:'#/banques' });
  });
  const first = out.filter(a=>!a.premium).concat(out.filter(a=>a.id==='dbl-mobi'||a.id==='up-flixo'));
  const rest = out.filter(a=>!first.includes(a));
  return [...first, ...rest.filter(a=>!a.id.startsWith('up-')), ...rest.filter(a=>a.id.startsWith('up-'))];
}

// ---------- écrans ----------
const screens = {};
const brandBar = (right=demoTag) => `<div class="topbar"><div class="brand"><span class="lg"><img class="lg-l" src="icons/logo-mark.svg" alt=""><img class="lg-d" src="icons/logo-mark-white.svg" alt=""></span>${APP_NAME}</div>${right}</div>`;
const yearSave = () => Math.round((1 - CFG.priceYear / (CFG.priceMonth*12)) * 100);

screens.onboarding = () => `
<div class="onb">
  <span class="lg"><img class="logo-xl lg-l" src="icons/logo-mark.svg" alt=""><img class="logo-xl lg-d" src="icons/logo-mark-white.svg" alt="Prelevo"></span>
  <h1>Arrête de payer pour des abonnements <em>que tu as oubliés.</em></h1>
  <p class="lead">${APP_NAME} analyse tes comptes, repère tous tes prélèvements récurrents et te prévient quand un prix augmente.</p>
  <ul>
    <li><span>⟦search⟧</span>Tous tes abonnements détectés en 30 secondes</li>
    <li><span>⟦trend⟧</span>Alerte dès qu’un prix augmente en douce</li>
    <li><span>⟦scissors⟧</span>Résiliation guidée, lettre prête à envoyer</li>
    <li><span class="nic">⟦ban⟧</span>Des conseils neutres : les sponsors n’influencent jamais tes résultats</li>
    <li><span>⟦user⟧</span>Un support humain qui répond vraiment</li>
  </ul>
  <div class="spacer"></div>
  <a class="btn" href="#/connect">Connecter ma banque</a>
  ${PWX ? `<button class="btn ghost" id="pw-connect" style="margin-top:8px">⟦bank⟧ Connecter une banque de test</button>` : ''}
  <p class="fine">⟦lock⟧ Gratuit pour commencer, Premium à ${prix(CFG.priceMonth)}/mois.<br>Accès en lecture seule via un agrégateur bancaire agréé. ${APP_NAME} ne peut jamais déplacer ton argent.<br>Maquette – données d’exemple</p>
</div>`;

screens.connect = () => `
<div class="screen">
  <div class="topbar"><a class="back" href="#/onboarding">⟦back⟧</a>${demoTag}</div>
  <h1 style="font-size:24px;letter-spacing:-.02em">Choisis ta banque</h1>
  <p class="muted small" style="margin-top:6px">Connexion sécurisée, en lecture seule (simulation).</p>
  <div class="search" style="margin-top:16px">⟦search⟧ Rechercher une banque</div>
  <div class="banks">${BANKS.map(b=>`<button class="bank ${state.bank===b.id?'on':''}" data-bank="${b.id}">${logo(b)}${b.name}</button>`).join('')}</div>
  <div class="banner blue"><span class="ic">⟦lock⟧</span><div><b>Tes identifiants restent chez ta banque</b>${APP_NAME} passe par un agrégateur agréé (DSP2). L’accès dure 180 jours : on te prévient avant qu’il expire, et tu peux le retirer à tout moment.</div></div>
  <button class="btn mint" id="go-scan" ${state.bank?'':'disabled style="opacity:.5"'}>Continuer</button>
  ${PWX ? `<div class="section-h"><h2>Ou essaie une vraie connexion… de test</h2></div>
  <p class="muted small" style="margin:-4px 2px 10px">Passe par l’agrégateur Powens avec ses fausses banques : ${APP_NAME} analyse alors de vraies opérations de test.</p>
  <button class="btn ghost" id="pw-connect">⟦bank⟧ Connecter une banque de test</button>
  ${pwNote()}` : ''}
</div>`;

screens.scan = () => `
<div class="screen"><div class="loader">
  <div class="spin"></div>
  <h2 style="font-size:20px">Analyse de tes 12 derniers mois…</h2>
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
    <div class="bs-logos"><span class="bs-l" style="background:${b.color}">${b.ini}<i class="st ${b.status==='expired'?'warn':'ok'}"></i></span></div>
    <div class="bs-txt">${b.status==='expired' ? '<b class="t-amber">Session de test expirée · reconnecter</b>' : `<b>${b.name} · banque de test</b>`}<span>${b.accounts}</span></div>
    <span class="chev">⟦chev⟧</span></a>`; }
  const warn = L.find(b=>b.status==='error') || L.find(b=>b.expiresIn<=7);
  return `<a class="bankstrip" href="#/banques">
    <div class="bs-logos">${L.map(b=>`<span class="bs-l" style="background:${b.color}">${b.ini}<i class="st ${b.status==='error'?'err':b.expiresIn<=7?'warn':'ok'}"></i></span>`).join('')}</div>
    <div class="bs-txt">${warn ? (warn.status==='error' ? `<b class="t-red">${warn.name} : synchro en échec</b>` : `<b class="t-amber">Accès ${warn.name} : expire dans ${warn.expiresIn} j</b>`) : '<b>Comptes à jour</b>'}<span>${L.length} banque${L.length>1?'s':''} · synchro ${L[0].sync}</span></div>
    <span class="chev">⟦chev⟧</span></a>`;
}

screens.dashboard = () => {
  const t = totals(); const used = (t.fixed + SPENT) / INCOME * 100; const P = isP();
  return `
<div class="screen">
  ${brandBar(`<a class="gear" href="#/aide" aria-label="Aide et réglages">⟦settings⟧</a>`)}
  <p class="hello">Bonjour${USER.prenom?' '+USER.prenom:''} <span class="plan-pill ${P?'p':''}">${P?'Premium':'Gratuit'}</span> ${demoTag}</p>
  ${bankStrip()}
  ${P ? `
  <div class="hero">
    <div class="lbl">Reste à vivre jusqu’à la paie</div>
    <div class="big">${eur(t.reste)}</div>
    <div class="sub">soit ${eur(t.reste/PAYDAY_IN)} par jour pendant ${PAYDAY_IN} jours</div>
    <div class="bar"><i style="width:${Math.min(100,used).toFixed(0)}%"></i></div>
    <div class="bar-legend"><span>Dépensé + charges : ${eur0(t.fixed+SPENT)}</span><span>Revenus : ${eur0(INCOME)}</span></div>
  </div>
  ${balanceChart()}` : `
  <a class="hero" href="#/abonnements">
    <div class="lbl">Tes abonnements détectés</div>
    <div class="big">${eur(t.monthly)}<span style="font-size:16px;opacity:.7"> /mois</span></div>
    <div class="sub">${t.list.length} prélèvements récurrents · ${eur0(t.monthly*12)} par an</div>
  </a>`}
  <div class="grid2">
    ${P ? `<a class="kpi" href="#/abonnements"><div class="lbl">Abonnements / mois</div><div class="val">${eur(t.monthly)}</div><div class="hint">${t.list.length} actifs · ${eur0(t.monthly*12)}/an</div></a>`
        : `<a class="kpi locked" href="#/premium"><div class="lbl">Reste à vivre ⟦lock⟧</div><div class="val blur">${eur(t.reste)}</div><div class="hint">Disponible en Premium</div></a>`}
    <a class="kpi green" href="${P?'#/abonnements?f=eco':'#/premium'}"><div class="lbl">Économies trouvées ${P?'':'⟦lock⟧'}</div><div class="val">${eur(t.found)}</div><div class="hint">${P?'par mois, à récupérer':'par mois · débloque-les'}</div></a>
  </div>
  ${P ? '' : balanceChart()}
  ${P ? `
  <div class="card" style="display:flex;align-items:center;gap:12px">
    <div class="ic-round">⟦check⟧</div>
    <div style="flex:1"><div style="font-weight:700">${eur(t.achieved)} économisés / mois</div><div class="muted small">grâce à tes résiliations · ${eur(t.achieved*12)} sur un an</div></div>
  </div>
  ${t.list.some(s=>s.doubleCharge)?`<a class="banner red" href="#/abo/mobi"><span class="ic">⟦alert⟧</span><div><b>Prélevé 2 fois : Mobi Forfait</b>15,99 € débités deux fois le 8 oct. Demande le remboursement.</div></a>`:''}
  ${t.ups.length?`<a class="banner red" href="#/abonnements?f=up"><span class="ic">⟦trend⟧</span><div><b>${t.ups.length} abonnements ont augmenté</b>+${eur(t.upsAmt)}/mois depuis l’an dernier sans que tu ne changes rien.</div></a>`:''}
  ${t.smalls.length?`<a class="banner amber" href="#/abonnements?f=small"><span class="ic">⟦search⟧</span><div><b>${t.smalls.length} petit${t.smalls.length>1?'s':''} prélèvement${t.smalls.length>1?'s':''} oublié${t.smalls.length>1?'s':''}</b>${eur(t.smalls.reduce((a,s)=>a+s.price,0))}/mois qui passent inaperçus.</div></a>`:''}
  ` : `
  <div class="section-h"><h2>On a trouvé de quoi économiser</h2></div>
  ${!LIVE || t.ups.length ? teaser(`${t.ups.length} hausse${t.ups.length>1?'s':''} de prix détectée${t.ups.length>1?'s':''}`, 'Découvre lesquels de tes abonnements ont augmenté') : ''}
  ${t.list.some(s=>s.doubleCharge) ? teaser('1 double prélèvement', 'Un abonnement t’a été débité deux fois ce mois-ci') : ''}
  ${!LIVE || t.smalls.length ? teaser(`${t.smalls.length} petit${t.smalls.length>1?'s':''} prélèvement${t.smalls.length>1?'s':''} oublié${t.smalls.length>1?'s':''}`, 'Des petites sommes qui partent chaque mois') : ''}
  <a class="btn mint" href="#/premium" style="margin:6px 0 4px">Récupérer ${eur(t.found)}/mois</a>
  <p class="muted small center" style="margin-bottom:14px">⟦gift⟧ ${CFG.trial} · puis ${prix(CFG.priceMonth)}/mois</p>`}
  ${adSlot('dash')}
  <div class="section-h"><h2>Prochains prélèvements</h2><a href="#/abonnements">Tout voir</a></div>
  <div class="card" style="padding:4px 16px">
    ${t.list.filter(s=>s.day>=10).sort((a,b)=>a.day-b.day).slice(0,4).map(s=>`
      <a class="row" href="#/abo/${s.id}">${logo(s)}<div class="mid"><div class="name">${s.name}</div><div class="meta">le ${s.day} oct.${P?' · rappel la veille ⟦bell⟧':''}</div></div><div class="amt">${eur(s.price)}</div></a>`).join('')}
  </div>
  ${neutral}
</div>`;
};

screens.abonnements = (q) => {
  const t = totals(); const P = isP(); let f = q.get('f') || 'all';
  if (!P && f!=='all') f = 'all';
  let list = P ? t.list.filter(s=>!s.small) : t.list;
  if (f==='up') list = t.ups;
  if (f==='eco') list = t.list.filter(s=>increase(s)||s.small||t.dups.includes(s));
  const showSmall = P && (f==='all' || f==='small');
  if (f==='small') list = [];
  const row = s => `<a class="row" href="#/abo/${s.id}">${logo(s)}
      <div class="mid"><div class="name">${s.name}${P ? `${increase(s)?`<span class="badge b-red">+${pct(s)} %</span>`:''}${s.doubleCharge?'<span class="badge b-red">2× prélevé</span>':''}${t.dups.includes(s)?'<span class="badge b-blue">Doublon</span>':''}${s.trial?'<span class="badge b-amber">Essai fini</span>':''}` : ((increase(s)||s.small||s.doubleCharge||t.dups.includes(s)) ? lockBadge('Alerte') : '')}</div>
      <div class="meta">${P ? (s.note || s.cat) : s.cat} · le ${s.day}</div></div>
      <div class="amt">${eur(s.price)}${P && increase(s)?`<small class="strike">${eur(s.prev)}</small>`:'<small>/mois</small>'}</div></a>`;
  const chip = (k,l) => P ? `<a class="chip ${f===k?'on':''}" href="#/abonnements${k==='all'?'':'?f='+k}">${l}</a>` : `<a class="chip ${k==='all'?'on':''}" href="${k==='all'?'#/abonnements':'#/premium'}">${k==='all'?l:'⟦lock⟧ '+l.replace(/^\S+ /,'')}</a>`;
  return `
<div class="screen">
  <div class="topbar"><h1>Abonnements</h1>${demoTag}</div>
  <div class="card" style="display:flex;justify-content:space-between;align-items:center">
    <div><div class="muted small">Total mensuel</div><div style="font-size:26px;font-weight:760;letter-spacing:-.02em">${eur(t.monthly)}</div></div>
    <div style="text-align:right"><div class="muted small">Sur un an</div><div style="font-weight:700">${eur0(t.monthly*12)}</div></div>
  </div>
  <div class="chips">${chip('all','Tous ('+t.list.length+')')}${chip('up','⟦trend⟧ Hausses ('+t.ups.length+')')}${chip('small','⟦search⟧ Oubliés ('+t.smalls.length+')')}${chip('eco','⟦coin⟧ À économiser')}</div>
  ${P?'':teaser(`${eur(t.found)}/mois d’économies repérées`, LIVE ? `${t.ups.length} hausse${t.ups.length>1?'s':''}, ${t.smalls.length} petit${t.smalls.length>1?'s':''} prélèvement${t.smalls.length>1?'s':''} sous 10 €` : `${t.ups.length} hausses, 1 doublon, 1 double prélèvement, ${t.smalls.length} oubliés`)}
  ${list.length?`<div class="card" style="padding:4px 16px">${list.map(row).join('')}</div>`:''}
  ${adSlot('subs')}
  ${showSmall && t.smalls.length?`
  <div class="section-h"><h2>⟦search⟧ Petits prélèvements oubliés</h2><span class="muted small">${eur(t.smalls.reduce((a,s)=>a+s.price,0))}/mois</span></div>
  <p class="muted small" style="margin:-4px 2px 10px">Moins de ${LIVE?10:5} € chacun, mais ${eur0(t.smalls.reduce((a,s)=>a+s.price,0)*12)} par an au total.</p>
  <div class="card" style="padding:4px 16px">${t.smalls.map(row).join('')}</div>`:''}
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
  ${s.doubleCharge?`<div class="banner red"><span class="ic">⟦alert⟧</span><div><b>Prélevé deux fois le ${s.doubleCharge}</b>${eur(s.price)} en trop. On te prépare la demande de remboursement.<br><a href="#" data-toast="Demande de remboursement prête (simulation)" style="font-weight:700;text-decoration:underline">Demander le remboursement</a></div></div>`:''}
  ${increase(s)?`<div class="banner red"><span class="ic">⟦trend⟧</span><div><b>Hausse de prix détectée</b>Tu payais ${eur(s.prev)}. Cette hausse te coûte ${eur(increase(s)*12)} de plus par an.</div></div>`:''}
  ${s.note?`<div class="banner amber"><span class="ic">⟦info⟧</span><div><b>${s.note}</b>${eur(s.price*12)} par an pour un service que tu as peut-être oublié.</div></div>`:''}
  ${s.tip?`<div class="banner blue"><span class="ic">⟦info⟧</span><div>${s.tip} <i>(Conseil neutre : aucun sponsor derrière ce conseil.)</i></div></div>`:''}` : (flagged ? teaser('Une alerte attend sur cet abonnement', 'Hausse, doublon ou oubli : découvre-la en Premium') : '')}
  <div class="card">
    <div style="font-weight:700;margin-bottom:4px">Historique des prélèvements</div>
    <div class="chart">${s.hist.map((v,i)=>`<div class="col ${P&&i>0&&v>s.hist[i-1]?'up':''}"><span>${v?v.toFixed(2).replace('.',','):'–'}</span><i style="height:${Math.max(4,v/max*70)}px"></i>${MONTHS[i]}</div>`).join('')}</div>
  </div>
  <div class="card" style="padding:4px 16px">
    <div class="kv"><span>Prochain prélèvement</span><span>${s.day} ${s.day>=9?'oct.':'nov.'}</span></div>
    <div class="kv"><span>Rappel avant prélèvement</span><span>${P?'la veille ⟦bell⟧':'⟦lock⟧ Premium'}</span></div>
    <div class="kv"><span>Coût sur un an</span><span>${eur(s.price*12)}</span></div>
    <div class="kv"><span>Client depuis</span><span>${s.since}</span></div>
    ${s.live ? `<div class="kv"><span>Libellé bancaire</span><span class="small">${s.label}</span></div>
    <div class="kv"><span>Dernier prélèvement</span><span>${new Date(s.lastDate+'T12:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}</span></div>
    <div class="kv"><span>Détection</span><span>${s.confirmed ? `Récurrent confirmé (${s.count}×)` : 'Probable (1×)'}</span></div>` : ''}
  </div>
  ${done?`<a class="btn ghost" href="#/abonnements">Retour aux abonnements</a>` : P ? `
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
  <p class="muted small" style="margin:6px 0 16px">Choisis comment tu veux résilier. On prépare tout pour toi.</p>
  ${[
    ['lettre','⟦mail⟧','Lettre de résiliation','Lettre prête à imprimer ou à envoyer en recommandé'],
    ['email','⟦mail⟧','E-mail au service client','Texte prêt à copier-coller'],
    ['enligne','⟦globe⟧','En ligne en 3 clics', s.cancel.online ? s.cancel.where : 'Non proposé par ce service'],
  ].map(([k,ic,b,sp])=>`<button class="option ${resil.method===k?'on':''}" data-method="${k}" ${k==='enligne'&&!s.cancel.online?'disabled style="opacity:.5"':''}><span class="ic">${ic}</span><div><b>${b}</b><span>${sp}</span></div></button>`).join('')}
  <div class="card" style="padding:4px 16px"><div class="kv"><span>Comment résilier</span><span style="text-align:right;max-width:58%">${s.cancel.where}</span></div><div class="kv"><span>Préavis</span><span style="text-align:right;max-width:58%">${s.cancel.notice}</span></div></div>
  <div class="banner blue"><span class="ic">⟦info⟧</span><div>Pour un contrat souscrit en ligne, la loi impose au service de proposer une résiliation en ligne simple (« résiliation en 3 clics »).</div></div>
  <a class="btn" href="#/resilier/${s.id}/2">Continuer</a>
</div>`;
  if (step===2) {
    const today = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
    const letter = resil.method==='email'
? `Objet : Demande de résiliation – ${s.name}

Bonjour,

Je vous demande par la présente de résilier mon abonnement ${s.name} (identifiant client : EX-${s.id.toUpperCase()}-0042), à compter de la prochaine échéance, conformément aux conditions générales.

Merci de me confirmer la prise en compte de cette demande et la date effective de fin de contrat, et de cesser tout prélèvement à compter de cette date.

Cordialement,
${USER.prenom} ${USER.nom}`
: `${USER.prenom} ${USER.nom}
${USER.adresse}

Service clients ${s.name}
Adresse du service résiliation

Paris, le ${today}

Objet : Résiliation de mon abonnement
Réf. client : EX-${s.id.toUpperCase()}-0042
Lettre recommandée avec accusé de réception

Madame, Monsieur,

Par la présente, je vous informe de ma volonté de résilier mon abonnement ${s.name}, souscrit en ${s.since}, à compter de la prochaine échéance (${s.cancel.notice.toLowerCase()}).

Je vous remercie de bien vouloir me confirmer la date effective de résiliation et de cesser tout prélèvement à compter de cette date.

Veuillez agréer, Madame, Monsieur, l’expression de mes salutations distinguées.

${USER.prenom} ${USER.nom}`;
    return `
<div class="screen">${head}${steps}
  <h1 style="font-size:23px;letter-spacing:-.02em">Ta ${resil.method==='email'?'demande':'lettre'} est prête</h1>
  <p class="muted small" style="margin:6px 0 14px">Vérifie les informations, tout est prérempli.</p>
  ${resil.method==='enligne'
    ? `<div class="card"><b>Résilie directement chez ${s.name}</b><p class="muted small" style="margin-top:6px">Chemin : ${s.cancel.where}</p><p class="muted small" style="margin-top:6px">On te guide écran par écran, puis tu reviens confirmer ici.</p></div>`
    : `<div class="letter">${letter}</div>`}
  <div class="btn-pair">
    <button class="btn ghost" data-toast="Lettre copiée (simulation)">⟦copy⟧ Copier</button>
    <button class="btn ghost" data-toast="PDF téléchargé (simulation)">⟦download⟧ PDF</button>
  </div>
  <a class="btn" href="#/resilier/${s.id}/3">C’est envoyé</a>
  <a class="help-link" href="#/chat">⟦user⟧ Un doute ? Un humain t’aide à rédiger</a>
</div>`;
  }
  if (step===3) return `
<div class="screen">${head}${steps}
  <h1 style="font-size:23px;letter-spacing:-.02em">Dernière vérification</h1>
  <p class="muted small" style="margin:6px 0 16px">On surveille ton compte pour toi.</p>
  <div class="card" style="padding:4px 16px">
    <div class="kv"><span>⟦check⟧ Demande envoyée</span><span>${new Date().toLocaleDateString('fr-FR')}</span></div>
    <div class="kv"><span>⟦clock⟧ Confirmation attendue</span><span>sous 10 jours</span></div>
    <div class="kv"><span>⟦bell⟧ On t’alerte si</span><span style="text-align:right;max-width:55%">un nouveau prélèvement ${s.name} passe malgré tout</span></div>
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

screens.alertes = () => {
  const al = alerts(); const P = isP();
  const item = a => `<a class="alert-item ${state.readAlerts.includes(a.id)?'':'unread'}" href="${a.link}" data-alert="${a.id}">
    <div class="aic" style="background:${a.bg}">${a.ic}</div>
    <div><b>${a.title}</b><p>${a.text}</p><div class="when">${a.when}</div></div></a>`;
  const free = al.filter(a=>!a.premium), prem = al.filter(a=>a.premium);
  return `
<div class="screen">
  <div class="topbar"><h1>Alertes</h1>${demoTag}</div>
  ${free.map(item).join('')}
  ${P ? prem.map(item).join('') : `
  <div class="section-h"><h2>${prem.length} alertes d’économies en attente</h2>${lockBadge()}</div>
  <div class="locked-wrap">
    <div class="lock">${prem.slice(0,3).map(a=>item({...a, title:a.title.replace(/[0-9]+,[0-9]+ €/g,'••• €'), text:'•••••••• •••••• ••••• •••••••• ••• •••••• •••••••••'})).join('')}</div>
    <div class="locked-cta"><div class="lc-box"><b>Hausses de prix, doubles prélèvements, rappels avant chaque prélèvement</b><a href="#/premium">Débloquer · ${prix(CFG.priceMonth)}/mois</a><span class="lc-trial">${CFG.trial}</span></div></div>
  </div>`}
  <div class="section-h"><h2>Réglages des alertes</h2></div>
  <div class="card" style="padding:4px 16px">
    <div class="kv"><span>Accès bancaire bientôt expiré</span><span class="y">Activée</span></div>
    <div class="kv"><span>Hausse de prix</span><span>${P?'<span class="y">Activée</span>':'⟦lock⟧ Premium'}</span></div>
    <div class="kv"><span>Double prélèvement</span><span>${P?'<span class="y">Activée</span>':'⟦lock⟧ Premium'}</span></div>
    <div class="kv"><span>Rappel avant prélèvement</span><span>${P?'la veille':'⟦lock⟧ Premium'}</span></div>
    <div class="kv"><span>Fin d’essai gratuit</span><span>${P?'<span class="y">Activée</span>':'⟦lock⟧ Premium'}</span></div>
  </div>
</div>`;
};

screens.banques = () => {
  const L = linked(); const P = isP();
  if (LIVE){ const b = L[0]; return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/dashboard">⟦back⟧</a><h1 style="font-size:19px">Mes banques</h1>${demoTag}</div>
  <div class="card bankcard">
    <div style="display:flex;gap:12px;align-items:center">${logo(b)}
      <div style="flex:1"><div style="font-weight:700">${b.name}</div><div class="muted small">${b.accounts}</div></div>
      <span class="status ${b.status==='expired'?'err':'ok'}">${b.status==='expired'?'Expirée':'Connectée'}</span></div>
    <div class="kv"><span>Données lues</span><span>${b.sync}</span></div>
    <div class="kv"><span>Session de test</span><span class="${b.status==='expired'?'t-amber':''}">${b.expires}</span></div>
    ${LIVE.accounts.map(a=>`<div class="kv"><span class="small">${a.name}</span><span class="nw">${(a.balance||0).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})} ${a.currency==='EUR'||!a.currency?'€':a.currency}</span></div>`).join('')}
    ${b.status==='expired' ? `<div class="banner amber" style="margin:10px 0 0"><span class="ic">⟦key⟧</span><div><b>Session de test expirée</b>Le jeton Powens de test ne dure que 30 minutes. Les résultats restent affichés ; reconnecte-toi pour relire les comptes.</div></div>` : ''}
    <button class="btn small-btn" id="${b.status==='expired'?'pw-connect':'pw-refresh'}" style="margin-top:12px">${b.status==='expired'?'Reconnecter la banque de test':'Relire les opérations'}</button>
  </div>
  <p class="muted small" style="margin:2px 2px 12px">Comptes en euros uniquement. ${LIVE.subs.length} prélèvement${LIVE.subs.length>1?'s':''} retenu${LIVE.subs.length>1?'s':''} sur ${LIVE.txCount} opérations : « confirmé » = au moins 2 prélèvements à ~1 mois d’écart et montant à ±10 % ; « probable » = 1 seul prélèvement au libellé typique d’un abonnement.</p>
  <button class="btn ghost" id="pw-quit">Revenir aux données d’exemple</button>
  ${pwNote()}
</div>`; }
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/dashboard">⟦back⟧</a><h1 style="font-size:19px">Mes banques</h1>${demoTag}</div>
  <p class="muted small" style="margin:-6px 2px 14px">On t’affiche honnêtement l’état de chaque connexion. Si une banque ne se synchronise pas, tes chiffres peuvent être incomplets.</p>
  ${L.map(b=>`
  <div class="card bankcard">
    <div style="display:flex;gap:12px;align-items:center">${logo(b)}
      <div style="flex:1"><div style="font-weight:700">${b.name}</div><div class="muted small">${b.accounts}</div></div>
      <span class="status ${b.status==='error'?'err':'ok'}">${b.status==='error'?'Erreur':'Synchronisée'}</span></div>
    <div class="kv"><span>Dernière synchro</span><span>${b.sync}</span></div>
    <div class="kv"><span>Accès valable jusqu’au</span><span class="${b.expiresIn<=7?'t-amber':''}">${b.expires} ${b.expiresIn<=7?`(dans ${b.expiresIn} j)`:''}</span></div>
    <div class="meter"><i style="width:${Math.max(3, b.expiresIn/180*100)}%;background:${b.expiresIn<=7?'var(--accent)':'var(--ink)'}"></i></div>
    ${b.status==='error' ? `<div class="banner err" style="margin:10px 0 0"><span class="ic">⟦link⟧</span><div><b>La banque refuse la connexion</b>Souvent après un changement de mot de passe. Reconnecte-la en 30 secondes.</div></div><button class="btn small-btn" data-toast="Reconnexion lancée (simulation)">Reconnecter</button>`
      : b.expiresIn<=7 ? `<div class="banner amber" style="margin:10px 0 0"><span class="ic">⟦key⟧</span><div><b>Renouvelle ton accès avant le ${b.expires}</b>Ta banque exige une nouvelle validation tous les 180 jours (règle européenne DSP2). On te le rappellera aussi la veille.</div></div><button class="btn mint small-btn" data-toast="Accès renouvelé pour 180 jours (simulation)">Renouveler l’accès</button>` : ''}
  </div>`).join('')}
  ${P ? `<button class="btn ghost" data-toast="Ajout d’une banque (simulation)">⟦plus⟧ Ajouter une banque</button>`
      : `<a class="btn ghost" href="#/premium">⟦lock⟧ Ajouter une autre banque · Premium</a><p class="muted small center" style="margin-top:8px">La version gratuite inclut 1 banque.</p>`}
  <div class="banner blue" style="margin-top:14px"><span class="ic">⟦lock⟧</span><div><b>Lecture seule</b>${APP_NAME} ne voit jamais tes identifiants et ne peut faire aucun virement. Tu peux couper l’accès ici à tout moment.</div></div>
  ${PWX ? `<button class="btn ghost" id="pw-connect" style="margin-top:4px">⟦bank⟧ Connecter une banque de test (Powens)</button>${pwNote()}` : ''}
</div>`;
};

const themePref = () => (window.PrelevoTheme ? PrelevoTheme.get() : 'auto');
screens.aide = () => `
<div class="screen">
  <div class="topbar"><a class="back" href="#/dashboard">⟦back⟧</a><h1 style="font-size:19px">Aide et réglages</h1>${demoTag}</div>
  <div class="card support">
    <div class="sup-head"><div class="avatars"><span style="background:#F59E0B">S</span><span style="background:#3B82F6">K</span><span style="background:#10B981">M</span></div>
      <div><b>Support humain</b><div class="muted small">De vraies personnes te répondent, pas un robot.</div></div></div>
    <p class="small" style="color:var(--ink2);margin:10px 0 12px;line-height:1.45">Sarah, Karim et Marie (exemple) répondent du lundi au samedi, de 9 h à 19 h. Réponse moyenne : moins de 2 h${isP()?' · prioritaire pour toi':''}.</p>
    <div class="btn-pair" style="margin:0">
      <a class="btn mint" href="#/chat">⟦chat⟧ Chat</a>
      <button class="btn ghost" data-toast="E-mail à ${CFG.supportEmail} (simulation)">⟦mail⟧ E-mail</button>
    </div>
  </div>
  <div class="card" style="padding:4px 16px">
    <a class="kv lnk" href="#/banques"><span>⟦bank⟧ Mes banques et synchronisation</span><span>›</span></a>
    <a class="kv lnk" href="#/alertes"><span>⟦bell⟧ Alertes</span><span>›</span></a>
    <a class="kv lnk" href="#/premium"><span>⟦star⟧ Mon abonnement</span><span>${isP()?'Premium':'Gratuit'} ›</span></a>
    <div class="kv"><span>⟦shield⟧ Mes données</span><span class="muted">Jamais revendues</span></div>
  </div>
  <div class="card theme-card">
    <div style="font-weight:700">Apparence</div>
    <div class="muted small">Automatique suit le réglage de ton téléphone.</div>
    <div class="seg" role="radiogroup" aria-label="Thème">${[['light','sun','Jour'],['dark','moon','Nuit'],['auto','auto','Automatique']].map(([v,ic,l])=>`<button type="button" role="radio" aria-checked="${themePref()===v}" class="${themePref()===v?'on':''}" data-theme-set="${v}">⟦${ic}⟧${l}</button>`).join('')}</div>
  </div>
  ${neutral}
  <div class="card">
    <div style="font-weight:700;margin-bottom:8px">Mode démo</div>
    <div class="toggle"><button class="${isP()?'':'on'}" data-plan="free">Gratuit</button><button class="${isP()?'on':''}" data-plan="premium">Premium</button></div>
    <button class="btn ghost" id="reset" style="margin-top:8px">Recommencer la démo</button>
  </div>
</div>`;

const CHAT = [
  { me:false, t:'Bonjour Camille Je suis Sarah, de l’équipe support. Comment je peux t’aider ?', h:'14:02' },
  { me:true,  t:'FibreBox me dit que je dois envoyer un recommandé, c’est obligatoire ?', h:'14:03' },
  { me:false, t:'Pas forcément ! Si tu as souscrit en ligne, ils doivent te proposer la résiliation en ligne. Sinon, la lettre préparée dans l’app suffit : je peux la relire avec toi.', h:'14:05' },
];
screens.chat = () => `
<div class="screen chat-screen">
  <div class="topbar"><a class="back" href="#/aide">⟦back⟧</a><div class="chat-who"><span class="av" style="background:#F59E0B">S</span><div><b>Sarah</b><div class="muted small">Équipe support · humaine · en ligne</div></div></div>${demoTag}</div>
  <div class="chat">${CHAT.map(m=>`<div class="msg ${m.me?'me':''}"><div class="bubble">${m.t}</div><div class="h">${m.h}</div></div>`).join('')}</div>
  <form class="chat-input" id="chat-form"><input id="chat-text" placeholder="Écris ton message…" autocomplete="off"><button class="send" aria-label="Envoyer">⟦send⟧</button></form>
  <p class="muted small center" style="margin-top:8px">Conversation simulée – aucun message n’est envoyé.</p>
</div>`;

let billing = 'year';
screens.premium = () => {
  const t = totals(); const Y = billing==='year';
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/dashboard">⟦back⟧</a>${demoTag}</div>
  <div class="center" style="margin-bottom:6px">
    
    <h1 style="font-size:25px;letter-spacing:-.02em;margin-top:4px">${APP_NAME} Premium</h1>
    <p class="muted" style="margin-top:6px;font-size:14.5px">L’app qui te fait économiser plus qu’elle ne coûte.</p>
  </div>
  <div class="banner green" style="margin-top:14px"><span class="ic">⟦coin⟧</span><div><b>Chez ${USER.prenom} (exemple) : ${eur(t.found)}/mois d’économies trouvées</b>Premium coûte ${prix(CFG.priceMonth)}/mois. Il est remboursé dès la première résiliation.</div></div>
  <div class="plans" role="radiogroup" aria-label="Formules">
    <div class="plan free"><div class="pl-l"><h3>Gratuit</h3><span>Scan + liste · avec pubs</span></div><div class="pl-r"><div class="p">0 €</div></div></div>
    <button class="plan ${Y?'':'on'}" data-billing="month" role="radio" aria-checked="${!Y}"><i class="radio"></i><div class="pl-l"><h3>Premium Mensuel</h3><span>Sans engagement · Zéro pub</span></div><div class="pl-r"><div class="p">${prix(CFG.priceMonth)}<small>/mois</small></div></div></button>
    <button class="plan rec ${Y?'on':''}" data-billing="year" role="radio" aria-checked="${Y}"><em class="rec-b">Recommandé</em><i class="radio"></i><div class="pl-l"><h3>Premium Annuel <b class="save">−${yearSave()} %</b></h3><span>soit ${prix(CFG.priceYear/12)}/mois · Zéro pub</span></div><div class="pl-r"><div class="p">${prix(CFG.priceYear)}<small>/an</small></div></div></button>
  </div>
  <div class="trial">⟦gift⟧ <span><b>${CFG.trial}</b><br>puis <span class="${Y?'':'sel'}">${prix(CFG.priceMonth)}/mois</span> ou <span class="${Y?'sel':''}">${prix(CFG.priceYear)}/an</span></span></div>
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
      <tr><td>Conseils neutres (aucun sponsor n’influence tes résultats)</td><td class="y">⟦check⟧</td><td class="y">⟦check⟧</td></tr>
    </table>
  </div>
  ${neutral}
  <a class="card sup-mini" href="#/chat"><span class="avatars"><span style="background:#F59E0B">S</span><span style="background:#3B82F6">K</span></span><div><b>Une question avant de t’abonner ?</b><span>Un humain te répond, pas un robot.</span></div><span class="chev">⟦chev⟧</span></a>
  <button class="btn mint" id="go-premium">${state.premium?'Premium actif (démo)':'Commencer : '+CFG.trial}</button>
  <p class="muted small center" style="margin-top:10px">Formule ${Y?'Annuelle':'Mensuelle'} : puis ${Y?prix(CFG.priceYear)+'/an (soit '+prix(CFG.priceYear/12)+'/mois)':prix(CFG.priceMonth)+'/mois'} après l’essai. Annulable en 1 clic, à tout moment. Paiement simulé dans cette maquette.</p>
</div>`;
};


// ---------- Courbe « Solde » (données d'exemple cohérentes avec le reste à vivre) ----------
// Paie le 21 de chaque mois, loyer le 5, abonnements à leur date, dépenses carte réparties dans la journée.
// Solde d'aujourd'hui = reste à vivre + prélèvements encore à venir avant la paie + reliquat du mois précédent.
const LEFTOVER = 57.20;
const NOW = new Date(2026, 9, 9, 20, 0);                 // 9 oct. 2026, 20 h (date fictive de la démo)
const MOIS = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const PERIODS = {
  '7J':  { days:7,   stepH:2,  dots:true,  fmt:'hour' },
  '1M':  { days:30,  stepH:4,  dots:true,  fmt:'day' },
  '3M':  { days:91,  stepH:12, dots:false, fmt:'day' },
  '1A':  { days:365, stepH:24, dots:false, fmt:'month' },
  'TOUT':{ days:556, stepH:48, dots:false, fmt:'month' },   // depuis le 1er avr. 2025
};
let balPeriod = '1M';
let _timeline = null;
function rng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function timeline(){
  if (_timeline) return _timeline;
  const R = rng(20261009), t = totals();
  const start = new Date(2025, 3, 1);
  const days = []; for (let d = new Date(start); d <= NOW; d.setDate(d.getDate()+1)) days.push(new Date(d));
  const ev = [];   // {t: Date, amt, name, k}
  // cycles de paie : on fixe l'épargne nette de chaque cycle passé (souvent négative : fins de mois de plus en plus tendues)
  const cycleKey = d => { const m = d.getDate() >= 21 ? d.getMonth() : d.getMonth() - 1; return new Date(d.getFullYear(), m, 21).getTime(); };
  const cycles = {};
  days.forEach(d => { const k = cycleKey(d); (cycles[k] = cycles[k] || []).push(d); });
  const curKey = cycleKey(NOW);
  Object.entries(cycles).forEach(([k, ds]) => {
    k = +k; const isCur = k === curKey;
    const fixed = []; 
    ds.forEach(d => {
      if (d.getDate() === 21) fixed.push({ t:new Date(d.getFullYear(), d.getMonth(), 21, 7, 30), amt:INCOME, name:'Salaire', k:'in' });
      if (d.getDate() === 5) fixed.push({ t:new Date(d.getFullYear(), d.getMonth(), 5, 6, 10), amt:-RENT, name:'Loyer', k:'rent' });
      t.list.forEach(s => { if (s.day === d.getDate()) fixed.push({ t:new Date(d.getFullYear(), d.getMonth(), d.getDate(), 5 + (s.price*7 % 4), 0), amt:-s.price, name:s.name, k:'sub' }); });
    });
    const fixedSum = fixed.reduce((a,e)=>a+e.amt,0);
    const full = ds.length >= 28;
    const save = -95 + R() * 120;                                   // épargne nette du cycle
    const spendTotal = isCur ? SPENT : (full ? fixedSum + (ds[0].getDate()===21 ? 0 : INCOME) - save : 22 * ds.length);
    const w = ds.map(() => 0.3 + R() * 1.4), sw = w.reduce((a,b)=>a+b,0);
    ds.forEach((d, i) => {
      let left = Math.max(0, spendTotal) * w[i] / sw;
      const n = 1 + Math.floor(R() * 4);
      for (let j = 0; j < n; j++){
        const part = j === n-1 ? left : left * (0.2 + R() * 0.5); left -= part;
        const h = 8 + R() * 13;
        const tt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(h), Math.floor((h%1)*60));
        if (tt <= NOW) ev.push({ t:tt, amt:-part, name:'Carte', k:'spend' });
      }
    });
    fixed.forEach(e => { if (e.t <= NOW) ev.push(e); });
  });
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
  if (LIVE) return `<div class="card" id="balance"><div style="font-weight:700;margin-bottom:2px">Comptes de test</div>
    <div class="muted small" style="margin-bottom:6px">Soldes lus chez ${LIVE.bank} (sandbox Powens)</div>
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
  const b = e.target.closest && e.target.closest('[data-period]'); if (!b) return;
  balPeriod = b.dataset.period;
  const sec = document.getElementById('balance'); if (sec) sec.outerHTML = balanceChart();
});

screens.pwscan = () => `
<div class="screen"><div class="loader">
  <div class="spin"></div>
  <h2 style="font-size:20px">Lecture de tes comptes de test…</h2>
  <p class="muted small" style="margin-top:6px">Banque de test Powens · analyse faite dans ton navigateur</p>
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
  if (!tk || tk.expired) return fail('Session de test expirée', 'Le jeton Powens ne dure que 30 minutes. Relance la connexion.');
  try {
    const r = await PWX.fetchAll();
    applyLive(r); state.connected = true; save();
    location.hash = '#/dashboard';
    toast(`${r.subs.length} prélèvement${r.subs.length>1?'s':''} récurrent${r.subs.length>1?'s':''} détecté${r.subs.length>1?'s':''} sur ${r.txCount} opérations`);
  } catch(e){
    if (e.status === 401 || e.status === 403) fail('Session de test expirée', 'Le jeton Powens n’est plus valable. Relance la connexion.');
    else fail('Lecture impossible', String(e.message).replace(/</g,'&lt;'));
  }
}
async function pwRefresh(){
  const tk = PWX.tokenInfo(); if (!tk || tk.expired) { render(); return toast('Session de test expirée : reconnecte la banque de test'); }
  toast('Relecture des opérations…');
  try { applyLive(await PWX.fetchAll()); render(); toast('Opérations relues'); }
  catch(e){ if (e.status===401||e.status===403){ const t = PWX.tokenInfo(); if (t) sessionStorage.setItem('prelevo-pw-token', JSON.stringify({...t, exp:0})); render(); toast('Session de test expirée'); } else toast('Erreur Powens : ' + e.message); }
}

// ---------- routeur ----------
function render(){
  _timeline = null;
  const raw = location.hash.replace(/^#\/?/, '') || (state.connected ? 'dashboard' : 'onboarding');
  const [path, qs] = raw.split('?');
  const [name, ...args] = path.split('/');
  const fn = screens[name] || screens.dashboard;
  $('#app').innerHTML = icons(fn(new URLSearchParams(qs||''), ...args));
  const tabbed = ['dashboard','abonnements','alertes','premium','abo','aide','banques'].includes(name) || (!screens[name]);
  $('#tabbar').hidden = !tabbed;
  const tabName = name==='abo' ? 'abonnements' : (!screens[name] ? 'dashboard' : name);
  document.querySelectorAll('#tabbar a').forEach(a=>a.classList.toggle('on', a.dataset.tab===tabName));
  $('#alert-dot').classList.toggle('show', alerts().some(a=>!state.readAlerts.includes(a.id)));
  window.scrollTo(0,0);
  if (name==='scan') runScan();
  if (name==='pwscan' && PWX && !LIVE) runPwScan();
  if (name==='resilier' && !isP()) toast('La résiliation guidée fait partie de Premium');
}

function runScan(){
  const items = [...document.querySelectorAll('#scanlist div')];
  items.forEach((el,i)=>setTimeout(()=>el.classList.add('done'), 400 + i*450));
  setTimeout(()=>{ state.connected = true; save(); location.hash = '#/dashboard'; toast(SUBS.length + ' abonnements détectés'); }, 400 + items.length*450 + 500);
}

document.addEventListener('click', e => {
  const th = e.target.closest('[data-theme-set]');
  if (th){ if (window.PrelevoTheme) PrelevoTheme.set(th.dataset.themeSet); document.querySelectorAll('[data-theme-set]').forEach(b=>{ const on=b===th; b.classList.toggle('on',on); b.setAttribute('aria-checked',on); }); return; }
  const el = e.target.closest('[data-bank],[data-method],[data-toast],[data-billing],[data-alert],[data-plan],#go-scan,#keep,#confirm-resil,#go-premium,#reset,#pw-connect,#pw-quit,#pw-refresh');
  if (!el) return;
  if (el.dataset.toast){ e.preventDefault(); toast(el.dataset.toast); }
  else if (el.dataset.bank){ state.bank = el.dataset.bank; save(); render(); }
  else if (el.dataset.method){ resil.method = el.dataset.method; render(); }
  else if (el.dataset.billing){ billing = el.dataset.billing; render(); }
  else if (el.dataset.plan){ state.premium = el.dataset.plan==='premium'; save(); toast('Mode démo : ' + (state.premium?'Premium':'Gratuit')); render(); }
  else if (el.dataset.alert){ if(!state.readAlerts.includes(el.dataset.alert)){ state.readAlerts.push(el.dataset.alert); save(); } }
  else if (el.id==='pw-connect'){ e.preventDefault(); pwConnect(); }
  else if (el.id==='pw-refresh'){ pwRefresh(); }
  else if (el.id==='pw-quit'){ e.preventDefault(); PWX && PWX.clear(); location.replace(location.pathname + (state.connected ? '#/dashboard' : '#/onboarding')); location.reload(); }
  else if (el.id==='go-scan'){ if(state.bank) location.hash = '#/scan'; }
  else if (el.id==='keep'){ toast('OK, on ne t’alertera plus pour celui-ci'); }
  else if (el.id==='confirm-resil'){ const id = el.dataset.id; if(!state.resiliated.includes(id)) state.resiliated.push(id); save(); location.hash = '#/resilier/'+id+'/4'; }
  else if (el.id==='go-premium'){ state.premium = true; save(); toast(CFG.trial + ' : Premium activé (simulation)'); render(); }
  else if (el.id==='reset'){ localStorage.removeItem(KEY); location.href = location.pathname + '#/onboarding'; location.reload(); }
});

document.addEventListener('submit', e => {
  if (e.target.id !== 'chat-form') return;
  e.preventDefault();
  const v = $('#chat-text').value.trim(); if (!v) return;
  const h = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  CHAT.push({ me:true, t:v.replace(/</g,'&lt;'), h });
  render();
  setTimeout(()=>{ CHAT.push({ me:false, t:'Merci, je regarde ça et je te réponds dans quelques minutes (réponse simulée)', h }); if (location.hash.startsWith('#/chat')) render(); }, 1200);
});

if (PWX && !QS.has('demo')) {
  if (PWX.isReturn()) history.replaceState(null, '', location.pathname + location.search + '#/pwscan');
  else { const r = PWX.result(); if (r) applyLive(r); }
}
// expiration du jeton de test (30 min) : on rafraîchit l'affichage quand elle survient
setInterval(() => { if (LIVE && /banques|dashboard|alertes/.test(location.hash)) { const tk = PWX.tokenInfo(); if (tk && tk.expired && !tk._shown) { sessionStorage.setItem('prelevo-pw-token', JSON.stringify({...tk, _shown:1})); render(); toast('Session de test Powens expirée (30 min)'); } } }, 30000);
window.addEventListener('hashchange', render);
render();
