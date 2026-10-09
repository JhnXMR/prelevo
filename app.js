/* Scan Finance – maquette cliquable. TOUTES LES DONNÉES SONT DES EXEMPLES FICTIFS. */
'use strict';
const CFG = window.APP_CONFIG || { name:'Scan Finance', tagline:'l’app qui traque tes abonnements', priceMonth:3.99, priceYear:29.99, trial:'1 mois offert pour essayer', supportEmail:'support@exemple.fr' };
const APP_NAME = CFG.name;
document.title = `${APP_NAME} – ${CFG.tagline}`;

const USER = { prenom: 'Camille', nom: 'Exemple', adresse: '12 rue de l’Exemple\n75011 Paris' };
const INCOME = 2150;          // salaire net (exemple)
const RENT = 720;             // loyer (exemple)
const SPENT = 486.30;         // dépenses courantes déjà faites ce mois-ci (exemple)
const PAYDAY_IN = 12;         // jours avant la prochaine paie
const PAST_SAVED = 6.99;      // un abonnement déjà résilié le mois dernier (exemple)

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
const KEY = 'scanfinance-demo';
const state = Object.assign({ connected:false, bank:null, resiliated:[], premium:false, readAlerts:[] }, JSON.parse(localStorage.getItem(KEY) || '{}'));
const save = () => localStorage.setItem(KEY, JSON.stringify(state));
// URL ?demo=1 => démarre directement connecté (pratique pour les captures)
const QS = new URLSearchParams(location.search);
if (QS.has('demo')) { state.connected = true; state.bank = state.bank || 'b1'; save(); }
if (QS.get('plan') === 'premium') { state.premium = true; save(); }
if (QS.get('plan') === 'free') { state.premium = false; save(); }
const isP = () => state.premium;
const linked = () => isP() ? LINKED : LINKED.slice(0,1);

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
const demoTag = '<span class="demo">Données d’exemple</span>';
const lockBadge = (t='Premium') => `<span class="badge b-lock">🔒 ${t}</span>`;
const neutral = `<div class="neutral"><span>🚫</span><div><b>Zéro pub, zéro partenariat commercial</b>On ne touche aucune commission : nos conseils sont 100 % neutres. Notre seul revenu, c’est ton abonnement.</div></div>`;
const teaser = (title, text) => `<a class="teaser" href="#/premium"><div class="tl">🔒</div><div><b>${title}</b><span>${text}</span></div><div class="tc">Débloquer</div></a>`;
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'),2200); }

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
  t.ups.forEach(s => out.push({ id:'up-'+s.id, ic:'📈', bg:'var(--redbg)', title:`${s.name} a augmenté de ${eur(increase(s))}`,
    text:`Tu paies maintenant ${eur(s.price)}/mois au lieu de ${eur(s.prev)} (+${pct(s)} %). Soit ${eur(increase(s)*12)} de plus par an.`, when: s.id==='flixo'?'Il y a 2 h':'Détecté lors du scan', link:'#/abo/'+s.id }));
  t.list.filter(s=>s.trial).forEach(s => out.push({ id:'trial-'+s.id, ic:'⏳', bg:'var(--amberbg)', title:`Essai gratuit devenu payant : ${s.name}`,
    text:`${eur(s.price)} prélevés le 2 sept. Tu l’utilises encore ?`, when:'Il y a 5 j', link:'#/abo/'+s.id }));
  t.dups.forEach(s => out.push({ id:'dup-'+s.id, ic:'👯', bg:'var(--bluebg)', title:'Doublon détecté : 2 abonnements musique',
    text:`${s.name} et ${byId(s.duplicate).name} font la même chose. Garder un seul = ${eur(s.price*12)} économisés par an.`, when:'Hier', link:'#/abo/'+s.id }));
  t.list.filter(s=>s.doubleCharge).forEach(s => out.push({ id:'dbl-'+s.id, ic:'⚠️', bg:'var(--redbg)', title:`Prélevé 2 fois : ${s.name}`,
    text:`${eur(s.price)} débités deux fois le ${s.doubleCharge}. On t’aide à demander le remboursement.`, when:'Ce matin', link:'#/abo/'+s.id }));
  const next = t.list.filter(s=>s.day>=9 && s.day<=12).sort((a,b)=>a.day-b.day);
  next.forEach(s => out.push({ id:'next-'+s.id, ic:'🗓️', bg:'var(--mintbg)', title:`Prélèvement le ${s.day} oct. : ${s.name}`,
    text:`${eur(s.price)} seront prélevés ${s.day===10?'demain':'dans '+(s.day-9)+' jours'}.`, when:'Aujourd’hui', link:'#/abo/'+s.id }));
  if (t.reste < 700) out.push({ id:'low', ic:'⚠️', bg:'var(--amberbg)', title:'Reste à vivre en baisse',
    text:`Il te reste ${eur(t.reste)} pour ${PAYDAY_IN} jours, soit ${eur(t.reste/PAYDAY_IN)} par jour.`, when:'Aujourd’hui', link:'#/dashboard' });
  out.forEach(a => a.premium = true);
  linked().forEach(b => {
    if (b.expiresIn <= 7) out.unshift({ id:'exp-'+b.id, ic:'🔑', bg:'var(--amberbg)', title:`Accès à ${b.name} : expire dans ${b.expiresIn} jours`,
      text:`Ta banque demande de renouveler l’accès tous les 180 jours. 30 secondes suffisent, sinon tes données ne se mettront plus à jour.`, when:'Aujourd’hui', link:'#/banques' });
    if (b.status==='error') out.unshift({ id:'err-'+b.id, ic:'🔌', bg:'var(--redbg)', title:`${b.name} ne se synchronise plus`,
      text:`Dernière tentative ${b.sync}. Reconnecte-la pour garder des chiffres justes.`, when:'Hier', link:'#/banques' });
  });
  const first = out.filter(a=>!a.premium).concat(out.filter(a=>a.id==='dbl-mobi'||a.id==='up-flixo'));
  const rest = out.filter(a=>!first.includes(a));
  return [...first, ...rest.filter(a=>!a.id.startsWith('up-')), ...rest.filter(a=>a.id.startsWith('up-'))];
}

// ---------- écrans ----------
const screens = {};
const brandBar = (right=demoTag) => `<div class="topbar"><div class="brand"><img src="icons/icon-192.png" alt="">${APP_NAME}</div>${right}</div>`;
const yearSave = () => Math.round((1 - CFG.priceYear / (CFG.priceMonth*12)) * 100);

screens.onboarding = () => `
<div class="onb">
  <img class="logo-xl" src="icons/icon-192.png" alt="">
  <h1>Arrête de payer pour des abonnements <em>que tu as oubliés.</em></h1>
  <p class="lead">${APP_NAME} analyse tes comptes, repère tous tes prélèvements récurrents et te prévient quand un prix augmente.</p>
  <ul>
    <li><span>🔍</span>Tous tes abonnements détectés en 30 secondes</li>
    <li><span>📈</span>Alerte dès qu’un prix augmente en douce</li>
    <li><span>✂️</span>Résiliation guidée, lettre prête à envoyer</li>
    <li><span>🚫</span>Zéro pub, zéro partenariat commercial : des conseils neutres</li>
    <li><span>🙋</span>Un support humain qui répond vraiment</li>
  </ul>
  <div class="spacer"></div>
  <a class="btn" href="#/connect">Connecter ma banque</a>
  <p class="fine">🔒 Accès en lecture seule via un agrégateur bancaire agréé. ${APP_NAME} ne peut jamais déplacer ton argent.<br>Maquette – données d’exemple</p>
</div>`;

screens.connect = () => `
<div class="screen">
  <div class="topbar"><a class="back" href="#/onboarding">‹</a>${demoTag}</div>
  <h1 style="font-size:24px;letter-spacing:-.02em">Choisis ta banque</h1>
  <p class="muted small" style="margin-top:6px">Connexion sécurisée, en lecture seule (simulation).</p>
  <div class="search" style="margin-top:16px">🔍 Rechercher une banque</div>
  <div class="banks">${BANKS.map(b=>`<button class="bank ${state.bank===b.id?'on':''}" data-bank="${b.id}">${logo(b)}${b.name}</button>`).join('')}</div>
  <div class="banner blue"><span class="ic">🔒</span><div><b>Tes identifiants restent chez ta banque</b>${APP_NAME} passe par un agrégateur agréé (DSP2). L’accès dure 180 jours : on te prévient avant qu’il expire, et tu peux le retirer à tout moment.</div></div>
  <button class="btn mint" id="go-scan" ${state.bank?'':'disabled style="opacity:.5"'}>Continuer</button>
</div>`;

screens.scan = () => `
<div class="screen"><div class="loader">
  <div class="spin"></div>
  <h2 style="font-size:20px">Analyse de tes 12 derniers mois…</h2>
  <p class="muted small" style="margin-top:6px">Simulation – aucune vraie banque n’est contactée</p>
  <div class="scanlist" id="scanlist">
    <div>✅ Connexion à ${(BANKS.find(b=>b.id===state.bank)||BANKS[0]).name}</div>
    <div>✅ 1 248 opérations lues</div>
    <div>✅ ${SUBS.length} prélèvements récurrents trouvés</div>
    <div>✅ ${SUBS.filter(increase).length} hausses de prix repérées</div>
    <div>✅ ${SUBS.filter(s=>s.small).length} petits prélèvements oubliés</div>
  </div>
</div></div>`;

function bankStrip(){
  const L = linked(); const warn = L.find(b=>b.status==='error') || L.find(b=>b.expiresIn<=7);
  return `<a class="bankstrip" href="#/banques">
    <div class="bs-logos">${L.map(b=>`<span class="bs-l" style="background:${b.color}">${b.ini}<i class="st ${b.status==='error'?'err':b.expiresIn<=7?'warn':'ok'}"></i></span>`).join('')}</div>
    <div class="bs-txt">${warn ? (warn.status==='error' ? `<b class="t-red">${warn.name} : synchro en échec</b>` : `<b class="t-amber">Accès ${warn.name} : expire dans ${warn.expiresIn} j</b>`) : '<b>Comptes à jour</b>'}<span>${L.length} banque${L.length>1?'s':''} · synchro ${L[0].sync}</span></div>
    <span class="chev">›</span></a>`;
}

screens.dashboard = () => {
  const t = totals(); const used = (t.fixed + SPENT) / INCOME * 100; const P = isP();
  return `
<div class="screen">
  ${brandBar(`<a class="gear" href="#/aide" aria-label="Aide et réglages">⚙︎</a>`)}
  <p class="hello">Bonjour ${USER.prenom} 👋 <span class="plan-pill ${P?'p':''}">${P?'★ Premium':'Gratuit'}</span> ${demoTag}</p>
  ${bankStrip()}
  ${P ? `
  <div class="hero">
    <div class="lbl">Reste à vivre jusqu’à la paie</div>
    <div class="big">${eur(t.reste)}</div>
    <div class="sub">soit ${eur(t.reste/PAYDAY_IN)} par jour pendant ${PAYDAY_IN} jours</div>
    <div class="bar"><i style="width:${Math.min(100,used).toFixed(0)}%"></i></div>
    <div class="bar-legend"><span>Dépensé + charges : ${eur0(t.fixed+SPENT)}</span><span>Revenus : ${eur0(INCOME)}</span></div>
  </div>` : `
  <a class="hero" href="#/abonnements">
    <div class="lbl">Tes abonnements détectés</div>
    <div class="big">${eur(t.monthly)}<span style="font-size:16px;opacity:.7"> /mois</span></div>
    <div class="sub">${t.list.length} prélèvements récurrents · ${eur0(t.monthly*12)} par an</div>
  </a>`}
  <div class="grid2">
    ${P ? `<a class="kpi" href="#/abonnements"><div class="lbl">Abonnements / mois</div><div class="val">${eur(t.monthly)}</div><div class="hint">${t.list.length} actifs · ${eur0(t.monthly*12)}/an</div></a>`
        : `<a class="kpi locked" href="#/premium"><div class="lbl">Reste à vivre 🔒</div><div class="val blur">${eur(t.reste)}</div><div class="hint">Disponible en Premium</div></a>`}
    <a class="kpi green" href="${P?'#/abonnements?f=eco':'#/premium'}"><div class="lbl">Économies trouvées ${P?'':'🔒'}</div><div class="val">${eur(t.found)}</div><div class="hint">${P?'par mois, à récupérer':'par mois · débloque-les'}</div></a>
  </div>
  ${P ? `
  <div class="card" style="display:flex;align-items:center;gap:12px">
    <div style="font-size:26px">🏆</div>
    <div style="flex:1"><div style="font-weight:700">${eur(t.achieved)} économisés / mois</div><div class="muted small">grâce à tes résiliations · ${eur(t.achieved*12)} sur un an</div></div>
  </div>
  ${t.list.some(s=>s.doubleCharge)?`<a class="banner red" href="#/abo/mobi"><span class="ic">⚠️</span><div><b>Prélevé 2 fois : Mobi Forfait</b>15,99 € débités deux fois le 8 oct. Demande le remboursement.</div></a>`:''}
  ${t.ups.length?`<a class="banner red" href="#/abonnements?f=up"><span class="ic">📈</span><div><b>${t.ups.length} abonnements ont augmenté</b>+${eur(t.upsAmt)}/mois depuis l’an dernier sans que tu ne changes rien.</div></a>`:''}
  ${t.smalls.length?`<a class="banner amber" href="#/abonnements?f=small"><span class="ic">🕵️</span><div><b>${t.smalls.length} petits prélèvements oubliés</b>${eur(t.smalls.reduce((a,s)=>a+s.price,0))}/mois qui passent inaperçus.</div></a>`:''}
  ` : `
  <div class="section-h"><h2>On a trouvé de quoi économiser</h2></div>
  ${teaser(`${t.ups.length} hausses de prix détectées`, 'Découvre lesquels de tes abonnements ont augmenté')}
  ${teaser('1 double prélèvement', 'Un abonnement t’a été débité deux fois ce mois-ci')}
  ${teaser(`${t.smalls.length} petits prélèvements oubliés`, 'Des petites sommes qui partent chaque mois')}
  <a class="btn mint" href="#/premium" style="margin:6px 0 4px">Récupérer ${eur(t.found)}/mois</a>
  <p class="muted small center" style="margin-bottom:14px">🎁 ${CFG.trial} · puis ${prix(CFG.priceMonth)}/mois</p>`}
  <div class="section-h"><h2>Prochains prélèvements</h2><a href="#/abonnements">Tout voir</a></div>
  <div class="card" style="padding:4px 16px">
    ${t.list.filter(s=>s.day>=10).sort((a,b)=>a.day-b.day).slice(0,4).map(s=>`
      <a class="row" href="#/abo/${s.id}">${logo(s)}<div class="mid"><div class="name">${s.name}</div><div class="meta">le ${s.day} oct.${P?' · rappel la veille 🔔':''}</div></div><div class="amt">${eur(s.price)}</div></a>`).join('')}
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
      <div class="mid"><div class="name">${s.name}${P ? `${increase(s)?`<span class="badge b-red">▲ +${pct(s)} %</span>`:''}${s.doubleCharge?'<span class="badge b-red">2× prélevé</span>':''}${t.dups.includes(s)?'<span class="badge b-blue">Doublon</span>':''}${s.trial?'<span class="badge b-amber">Essai fini</span>':''}` : ((increase(s)||s.small||s.doubleCharge||t.dups.includes(s)) ? lockBadge('Alerte') : '')}</div>
      <div class="meta">${P ? (s.note || s.cat) : s.cat} · le ${s.day}</div></div>
      <div class="amt">${eur(s.price)}${P && increase(s)?`<small class="strike">${eur(s.prev)}</small>`:'<small>/mois</small>'}</div></a>`;
  const chip = (k,l) => P ? `<a class="chip ${f===k?'on':''}" href="#/abonnements${k==='all'?'':'?f='+k}">${l}</a>` : `<a class="chip ${k==='all'?'on':''}" href="${k==='all'?'#/abonnements':'#/premium'}">${k==='all'?l:'🔒 '+l.replace(/^\S+ /,'')}</a>`;
  return `
<div class="screen">
  <div class="topbar"><h1>Abonnements</h1>${demoTag}</div>
  <div class="card" style="display:flex;justify-content:space-between;align-items:center">
    <div><div class="muted small">Total mensuel</div><div style="font-size:26px;font-weight:760;letter-spacing:-.02em">${eur(t.monthly)}</div></div>
    <div style="text-align:right"><div class="muted small">Sur un an</div><div style="font-weight:700">${eur0(t.monthly*12)}</div></div>
  </div>
  <div class="chips">${chip('all','Tous ('+t.list.length+')')}${chip('up','📈 Hausses ('+t.ups.length+')')}${chip('small','🕵️ Oubliés ('+t.smalls.length+')')}${chip('eco','💶 À économiser')}</div>
  ${P?'':teaser(`${eur(t.found)}/mois d’économies repérées`, `${t.ups.length} hausses, 1 doublon, 1 double prélèvement, ${t.smalls.length} oubliés`)}
  ${list.length?`<div class="card" style="padding:4px 16px">${list.map(row).join('')}</div>`:''}
  ${showSmall && t.smalls.length?`
  <div class="section-h"><h2>🕵️ Petits prélèvements oubliés</h2><span class="muted small">${eur(t.smalls.reduce((a,s)=>a+s.price,0))}/mois</span></div>
  <p class="muted small" style="margin:-4px 2px 10px">Moins de 5 € chacun, mais ${eur0(t.smalls.reduce((a,s)=>a+s.price,0)*12)} par an au total.</p>
  <div class="card" style="padding:4px 16px">${t.smalls.map(row).join('')}</div>`:''}
  ${state.resiliated.length?`<div class="section-h"><h2>✅ Résiliés</h2></div><div class="card" style="padding:4px 16px">${SUBS.filter(s=>state.resiliated.includes(s.id)).map(s=>`<div class="row">${logo(s)}<div class="mid"><div class="name">${s.name}</div><div class="meta">Résiliation envoyée</div></div><div class="amt" style="color:var(--mint)">−${eur(s.price)}</div></div>`).join('')}</div>`:''}
</div>`;
};

screens.abo = (q, id) => {
  const s = byId(id); if (!s) return screens.abonnements(q);
  const t = totals(); const P = isP(); const max = Math.max(...s.hist, 1); const done = state.resiliated.includes(s.id);
  const flagged = increase(s) || s.small || s.doubleCharge || t.dups.includes(s);
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/abonnements">‹</a>${demoTag}</div>
  <div class="detail-head">${logo(s)}
    <div class="muted small">${s.cat}</div>
    <div class="price">${eur(s.price)}<span class="muted" style="font-size:15px;font-weight:600"> /mois</span></div>
    <div style="margin-top:6px">${P ? `${increase(s)?`<span class="badge b-red">▲ +${eur(increase(s))} (+${pct(s)} %)</span>`:''}${t.dups.includes(s)?'<span class="badge b-blue">Doublon avec '+byId(s.duplicate).name+'</span>':''}${s.small?'<span class="badge b-amber">Petit prélèvement oublié</span>':''}` : (flagged?lockBadge('1 alerte sur cet abonnement'):'')}${done?'<span class="badge b-green">Résiliation envoyée</span>':''}</div>
  </div>
  ${P ? `
  ${s.doubleCharge?`<div class="banner red"><span class="ic">⚠️</span><div><b>Prélevé deux fois le ${s.doubleCharge}</b>${eur(s.price)} en trop. On te prépare la demande de remboursement.<br><a href="#" data-toast="Demande de remboursement prête (simulation)" style="font-weight:700;text-decoration:underline">Demander le remboursement</a></div></div>`:''}
  ${increase(s)?`<div class="banner red"><span class="ic">📈</span><div><b>Hausse de prix détectée</b>Tu payais ${eur(s.prev)}. Cette hausse te coûte ${eur(increase(s)*12)} de plus par an.</div></div>`:''}
  ${s.note?`<div class="banner amber"><span class="ic">💡</span><div><b>${s.note}</b>${eur(s.price*12)} par an pour un service que tu as peut-être oublié.</div></div>`:''}
  ${s.tip?`<div class="banner blue"><span class="ic">💡</span><div>${s.tip} <i>(Conseil neutre : aucun partenariat.)</i></div></div>`:''}` : (flagged ? teaser('Une alerte attend sur cet abonnement', 'Hausse, doublon ou oubli : découvre-la en Premium') : '')}
  <div class="card">
    <div style="font-weight:700;margin-bottom:4px">Historique des prélèvements</div>
    <div class="chart">${s.hist.map((v,i)=>`<div class="col ${P&&i>0&&v>s.hist[i-1]?'up':''}"><span>${v?v.toFixed(2).replace('.',','):'–'}</span><i style="height:${Math.max(4,v/max*70)}px"></i>${MONTHS[i]}</div>`).join('')}</div>
  </div>
  <div class="card" style="padding:4px 16px">
    <div class="kv"><span>Prochain prélèvement</span><span>${s.day} ${s.day>=9?'oct.':'nov.'}</span></div>
    <div class="kv"><span>Rappel avant prélèvement</span><span>${P?'la veille 🔔':'🔒 Premium'}</span></div>
    <div class="kv"><span>Coût sur un an</span><span>${eur(s.price*12)}</span></div>
    <div class="kv"><span>Client depuis</span><span>${s.since}</span></div>
  </div>
  ${done?`<a class="btn ghost" href="#/abonnements">Retour aux abonnements</a>` : P ? `
  <a class="btn danger" href="#/resilier/${s.id}/1">✂️ Résilier cet abonnement</a>
  <button class="btn ghost" id="keep">Je le garde, ne plus m’alerter</button>` : `
  <a class="btn danger locked-btn" href="#/premium">🔒 Résiliation guidée · Premium</a>
  <p class="muted small center" style="margin-top:10px">Lettre prête, démarches pas à pas et suivi jusqu’à l’arrêt du prélèvement. ${CFG.trial}.</p>`}
</div>`;
};

const resil = { method:'lettre' };
screens.resilier = (q, id, step) => {
  const s = byId(id); if (!s) return screens.abonnements(q);
  if (!isP()) return screens.premium(q);
  step = +step || 1;
  const steps = `<div class="steps">${[1,2,3].map(i=>`<i class="${i<=step?'on':''}"></i>`).join('')}</div>`;
  const head = `<div class="topbar"><a class="back" href="${step===1?'#/abo/'+s.id:'#/resilier/'+s.id+'/'+(step-1)}">‹</a><span class="muted small">Étape ${Math.min(step,3)} sur 3</span>${demoTag}</div>`;
  if (step===1) return `
<div class="screen">${head}${steps}
  <h1 style="font-size:23px;letter-spacing:-.02em">Résilier ${s.name}</h1>
  <p class="muted small" style="margin:6px 0 16px">Choisis comment tu veux résilier. On prépare tout pour toi.</p>
  ${[
    ['lettre','✉️','Lettre de résiliation','Lettre prête à imprimer ou à envoyer en recommandé'],
    ['email','📧','E-mail au service client','Texte prêt à copier-coller'],
    ['enligne','🌐','En ligne en 3 clics', s.cancel.online ? s.cancel.where : 'Non proposé par ce service'],
  ].map(([k,ic,b,sp])=>`<button class="option ${resil.method===k?'on':''}" data-method="${k}" ${k==='enligne'&&!s.cancel.online?'disabled style="opacity:.5"':''}><span class="ic">${ic}</span><div><b>${b}</b><span>${sp}</span></div></button>`).join('')}
  <div class="card" style="padding:4px 16px"><div class="kv"><span>Comment résilier</span><span style="text-align:right;max-width:58%">${s.cancel.where}</span></div><div class="kv"><span>Préavis</span><span style="text-align:right;max-width:58%">${s.cancel.notice}</span></div></div>
  <div class="banner blue"><span class="ic">⚖️</span><div>Pour un contrat souscrit en ligne, la loi impose au service de proposer une résiliation en ligne simple (« résiliation en 3 clics »).</div></div>
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
    <button class="btn ghost" data-toast="Lettre copiée (simulation)">📋 Copier</button>
    <button class="btn ghost" data-toast="PDF téléchargé (simulation)">⬇️ PDF</button>
  </div>
  <a class="btn" href="#/resilier/${s.id}/3">C’est envoyé</a>
  <a class="help-link" href="#/chat">🙋 Un doute ? Un humain t’aide à rédiger</a>
</div>`;
  }
  if (step===3) return `
<div class="screen">${head}${steps}
  <h1 style="font-size:23px;letter-spacing:-.02em">Dernière vérification</h1>
  <p class="muted small" style="margin:6px 0 16px">On surveille ton compte pour toi.</p>
  <div class="card" style="padding:4px 16px">
    <div class="kv"><span>✅ Demande envoyée</span><span>${new Date().toLocaleDateString('fr-FR')}</span></div>
    <div class="kv"><span>⏳ Confirmation attendue</span><span>sous 10 jours</span></div>
    <div class="kv"><span>🔔 On t’alerte si</span><span style="text-align:right;max-width:55%">un nouveau prélèvement ${s.name} passe malgré tout</span></div>
  </div>
  <div class="banner green"><span class="ic">💶</span><div><b>${eur(s.price)} économisés par mois</b>soit ${eur(s.price*12)} sur un an.</div></div>
  <button class="btn mint" id="confirm-resil" data-id="${s.id}">Confirmer la résiliation</button>
</div>`;
  return `
<div class="screen"><div class="success">
  <div class="ok">✓</div>
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
    <div class="locked-cta"><div class="lc-box"><b>Hausses de prix, doubles prélèvements, rappels avant chaque prélèvement</b><a href="#/premium">Débloquer · ${CFG.trial}</a></div></div>
  </div>`}
  <div class="section-h"><h2>Réglages des alertes</h2></div>
  <div class="card" style="padding:4px 16px">
    <div class="kv"><span>Accès bancaire bientôt expiré</span><span class="y">Activée</span></div>
    <div class="kv"><span>Hausse de prix</span><span>${P?'<span class="y">Activée</span>':'🔒 Premium'}</span></div>
    <div class="kv"><span>Double prélèvement</span><span>${P?'<span class="y">Activée</span>':'🔒 Premium'}</span></div>
    <div class="kv"><span>Rappel avant prélèvement</span><span>${P?'la veille':'🔒 Premium'}</span></div>
    <div class="kv"><span>Fin d’essai gratuit</span><span>${P?'<span class="y">Activée</span>':'🔒 Premium'}</span></div>
  </div>
</div>`;
};

screens.banques = () => {
  const L = linked(); const P = isP();
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/dashboard">‹</a><h1 style="font-size:19px">Mes banques</h1>${demoTag}</div>
  <p class="muted small" style="margin:-6px 2px 14px">On t’affiche honnêtement l’état de chaque connexion. Si une banque ne se synchronise pas, tes chiffres peuvent être incomplets.</p>
  ${L.map(b=>`
  <div class="card bankcard">
    <div style="display:flex;gap:12px;align-items:center">${logo(b)}
      <div style="flex:1"><div style="font-weight:700">${b.name}</div><div class="muted small">${b.accounts}</div></div>
      <span class="status ${b.status==='error'?'err':'ok'}">${b.status==='error'?'● Erreur':'● Synchronisée'}</span></div>
    <div class="kv"><span>Dernière synchro</span><span>${b.sync}</span></div>
    <div class="kv"><span>Accès valable jusqu’au</span><span class="${b.expiresIn<=7?'t-amber':''}">${b.expires} ${b.expiresIn<=7?`(dans ${b.expiresIn} j)`:''}</span></div>
    <div class="meter"><i style="width:${Math.max(3, b.expiresIn/180*100)}%;background:${b.expiresIn<=7?'var(--amber)':'var(--mint)'}"></i></div>
    ${b.status==='error' ? `<div class="banner red" style="margin:10px 0 0"><span class="ic">🔌</span><div><b>La banque refuse la connexion</b>Souvent après un changement de mot de passe. Reconnecte-la en 30 secondes.</div></div><button class="btn small-btn" data-toast="Reconnexion lancée (simulation)">Reconnecter</button>`
      : b.expiresIn<=7 ? `<div class="banner amber" style="margin:10px 0 0"><span class="ic">🔑</span><div><b>Renouvelle ton accès avant le ${b.expires}</b>Ta banque exige une nouvelle validation tous les 180 jours (règle européenne DSP2). On te le rappellera aussi la veille.</div></div><button class="btn mint small-btn" data-toast="Accès renouvelé pour 180 jours (simulation)">Renouveler l’accès</button>` : ''}
  </div>`).join('')}
  ${P ? `<button class="btn ghost" data-toast="Ajout d’une banque (simulation)">＋ Ajouter une banque</button>`
      : `<a class="btn ghost" href="#/premium">🔒 Ajouter une autre banque · Premium</a><p class="muted small center" style="margin-top:8px">La version gratuite inclut 1 banque.</p>`}
  <div class="banner blue" style="margin-top:14px"><span class="ic">🔒</span><div><b>Lecture seule</b>${APP_NAME} ne voit jamais tes identifiants et ne peut faire aucun virement. Tu peux couper l’accès ici à tout moment.</div></div>
</div>`;
};

screens.aide = () => `
<div class="screen">
  <div class="topbar"><a class="back" href="#/dashboard">‹</a><h1 style="font-size:19px">Aide et réglages</h1>${demoTag}</div>
  <div class="card support">
    <div class="sup-head"><div class="avatars"><span style="background:#F59E0B">S</span><span style="background:#3B82F6">K</span><span style="background:#10B981">M</span></div>
      <div><b>Support humain</b><div class="muted small">De vraies personnes te répondent, pas un robot.</div></div></div>
    <p class="small" style="color:var(--ink2);margin:10px 0 12px;line-height:1.45">Sarah, Karim et Marie (exemple) répondent du lundi au samedi, de 9 h à 19 h. Réponse moyenne : moins de 2 h${isP()?' · prioritaire pour toi ★':''}.</p>
    <div class="btn-pair" style="margin:0">
      <a class="btn mint" href="#/chat">💬 Chat</a>
      <button class="btn ghost" data-toast="E-mail à ${CFG.supportEmail} (simulation)">✉️ E-mail</button>
    </div>
  </div>
  <div class="card" style="padding:4px 16px">
    <a class="kv lnk" href="#/banques"><span>🏦 Mes banques et synchronisation</span><span>›</span></a>
    <a class="kv lnk" href="#/alertes"><span>🔔 Alertes</span><span>›</span></a>
    <a class="kv lnk" href="#/premium"><span>★ Mon abonnement</span><span>${isP()?'Premium':'Gratuit'} ›</span></a>
    <div class="kv"><span>🛡️ Mes données</span><span class="muted">Jamais revendues</span></div>
  </div>
  ${neutral}
  <div class="card">
    <div style="font-weight:700;margin-bottom:8px">Mode démo</div>
    <div class="toggle"><button class="${isP()?'':'on'}" data-plan="free">Gratuit</button><button class="${isP()?'on':''}" data-plan="premium">Premium</button></div>
    <button class="btn ghost" id="reset" style="margin-top:8px">Recommencer la démo</button>
  </div>
</div>`;

const CHAT = [
  { me:false, t:'Bonjour Camille 👋 Je suis Sarah, de l’équipe support. Comment je peux t’aider ?', h:'14:02' },
  { me:true,  t:'FibreBox me dit que je dois envoyer un recommandé, c’est obligatoire ?', h:'14:03' },
  { me:false, t:'Pas forcément ! Si tu as souscrit en ligne, ils doivent te proposer la résiliation en ligne. Sinon, la lettre préparée dans l’app suffit : je peux la relire avec toi.', h:'14:05' },
];
screens.chat = () => `
<div class="screen chat-screen">
  <div class="topbar"><a class="back" href="#/aide">‹</a><div class="chat-who"><span class="av" style="background:#F59E0B">S</span><div><b>Sarah</b><div class="muted small">Équipe support · humaine 🙋 · en ligne</div></div></div>${demoTag}</div>
  <div class="chat">${CHAT.map(m=>`<div class="msg ${m.me?'me':''}"><div class="bubble">${m.t}</div><div class="h">${m.h}</div></div>`).join('')}</div>
  <form class="chat-input" id="chat-form"><input id="chat-text" placeholder="Écris ton message…" autocomplete="off"><button class="send">➤</button></form>
  <p class="muted small center" style="margin-top:8px">Conversation simulée – aucun message n’est envoyé.</p>
</div>`;

let billing = 'year';
screens.premium = () => {
  const t = totals(); const Y = billing==='year';
  return `
<div class="screen">
  <div class="topbar"><a class="back" href="#/dashboard">‹</a>${demoTag}</div>
  <div class="center" style="margin-bottom:6px">
    <div style="font-size:40px">★</div>
    <h1 style="font-size:25px;letter-spacing:-.02em;margin-top:4px">${APP_NAME} Premium</h1>
    <p class="muted" style="margin-top:6px;font-size:14.5px">L’app qui te fait économiser plus qu’elle ne coûte.</p>
  </div>
  <div class="banner green" style="margin-top:14px"><span class="ic">💶</span><div><b>Chez ${USER.prenom} (exemple) : ${eur(t.found)}/mois d’économies trouvées</b>Premium coûte ${prix(CFG.priceMonth)}/mois. Il est remboursé dès la première résiliation.</div></div>
  <div class="toggle"><button class="${Y?'':'on'}" data-billing="month">Mensuel</button><button class="${Y?'on':''}" data-billing="year">Annuel −${yearSave()} %</button></div>
  <div class="plans">
    <div class="plan"><h3>Gratuit</h3><div class="p">0 €</div><div class="muted small">scan + liste</div></div>
    <div class="plan pro"><h3>Premium</h3><div class="p">${Y?prix(CFG.priceYear)+'<small>/an</small>':prix(CFG.priceMonth)+'<small>/mois</small>'}</div><div class="muted small">${Y?'soit '+prix(CFG.priceYear/12)+'/mois':'sans engagement'}</div></div>
  </div>
  <div class="trial">🎁 <b>${CFG.trial}</b> · puis ${Y?prix(CFG.priceYear)+'/an':prix(CFG.priceMonth)+'/mois'}</div>
  <div class="card">
    <table class="cmp">
      <tr><th></th><th>Gratuit</th><th>Premium</th></tr>
      <tr><td>Scan des comptes</td><td class="y">✓</td><td class="y">✓</td></tr>
      <tr><td>Liste des abonnements et total</td><td class="y">✓</td><td class="y">✓</td></tr>
      <tr><td>Banques connectées</td><td>1</td><td><b>Illimitées</b></td></tr>
      <tr><td>Alertes hausse de prix</td><td class="n">🔒</td><td class="y">✓</td></tr>
      <tr><td>Rappel avant chaque prélèvement</td><td class="n">🔒</td><td class="y">✓</td></tr>
      <tr><td>Alerte double prélèvement</td><td class="n">🔒</td><td class="y">✓</td></tr>
      <tr><td>Petits prélèvements oubliés et doublons</td><td class="n">🔒</td><td class="y">✓</td></tr>
      <tr><td>Résiliation guidée et lettres</td><td class="n">🔒</td><td class="y">✓</td></tr>
      <tr><td>Reste à vivre et suivi des économies</td><td class="n">🔒</td><td class="y">✓</td></tr>
      <tr><td>Support humain</td><td class="y">✓</td><td><b>Prioritaire</b></td></tr>
      <tr><td>Zéro pub, zéro partenariat</td><td class="y">✓</td><td class="y">✓</td></tr>
    </table>
  </div>
  ${neutral}
  <a class="card sup-mini" href="#/chat"><span class="avatars"><span style="background:#F59E0B">S</span><span style="background:#3B82F6">K</span></span><div><b>Une question avant de t’abonner ?</b><span>Un humain te répond, pas un robot.</span></div><span class="chev">›</span></a>
  <button class="btn mint" id="go-premium">${state.premium?'✓ Premium actif (démo)':'Commencer : '+CFG.trial}</button>
  <p class="muted small center" style="margin-top:10px">Puis ${Y?prix(CFG.priceYear)+'/an':prix(CFG.priceMonth)+'/mois'}. Annulable en 1 clic, à tout moment. Paiement simulé dans cette maquette.</p>
</div>`;
};

// ---------- routeur ----------
function render(){
  const raw = location.hash.replace(/^#\/?/, '') || (state.connected ? 'dashboard' : 'onboarding');
  const [path, qs] = raw.split('?');
  const [name, ...args] = path.split('/');
  const fn = screens[name] || screens.dashboard;
  $('#app').innerHTML = fn(new URLSearchParams(qs||''), ...args);
  const tabbed = ['dashboard','abonnements','alertes','premium','abo','aide','banques'].includes(name) || (!screens[name]);
  $('#tabbar').hidden = !tabbed;
  const tabName = name==='abo' ? 'abonnements' : (!screens[name] ? 'dashboard' : name);
  document.querySelectorAll('#tabbar a').forEach(a=>a.classList.toggle('on', a.dataset.tab===tabName));
  $('#alert-dot').classList.toggle('show', alerts().some(a=>!state.readAlerts.includes(a.id)));
  window.scrollTo(0,0);
  if (name==='scan') runScan();
  if (name==='resilier' && !isP()) toast('La résiliation guidée fait partie de Premium');
}

function runScan(){
  const items = [...document.querySelectorAll('#scanlist div')];
  items.forEach((el,i)=>setTimeout(()=>el.classList.add('done'), 400 + i*450));
  setTimeout(()=>{ state.connected = true; save(); location.hash = '#/dashboard'; toast(SUBS.length + ' abonnements détectés'); }, 400 + items.length*450 + 500);
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-bank],[data-method],[data-toast],[data-billing],[data-alert],[data-plan],#go-scan,#keep,#confirm-resil,#go-premium,#reset');
  if (!el) return;
  if (el.dataset.toast){ e.preventDefault(); toast(el.dataset.toast); }
  else if (el.dataset.bank){ state.bank = el.dataset.bank; save(); render(); }
  else if (el.dataset.method){ resil.method = el.dataset.method; render(); }
  else if (el.dataset.billing){ billing = el.dataset.billing; render(); }
  else if (el.dataset.plan){ state.premium = el.dataset.plan==='premium'; save(); toast('Mode démo : ' + (state.premium?'Premium':'Gratuit')); render(); }
  else if (el.dataset.alert){ if(!state.readAlerts.includes(el.dataset.alert)){ state.readAlerts.push(el.dataset.alert); save(); } }
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
  setTimeout(()=>{ CHAT.push({ me:false, t:'Merci, je regarde ça et je te réponds dans quelques minutes 🙂 (réponse simulée)', h }); if (location.hash.startsWith('#/chat')) render(); }, 1200);
});

window.addEventListener('hashchange', render);
render();
