// Même lecture que l’app : un débit régulier devient un prélèvement (id, name, price, day).
const STOP = /\b(PRLV|PRELEVEMENT|PRELEVT|SEPA|SDD|ECH|CB|CARTE|PAIEMENT|PAIEMT|FACT|DU|LE|LA|LES|DE|DES|REF|MANDAT|ICS|EUR|FR)\b/g;
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
const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const CADENCES = [
  { id: 'week', label: 'chaque semaine', min: 5, max: 9, perMonth: 52 / 12, minOcc: 3 },
  { id: 'month', label: 'chaque mois', min: 25, max: 35, perMonth: 1, minOcc: 2 },
  { id: 'quarter', label: 'chaque trimestre', min: 84, max: 98, perMonth: 1 / 3, minOcc: 2 },
  { id: 'year', label: 'chaque année', min: 340, max: 390, perMonth: 1 / 12, minOcc: 2 }
];
const YEAR_KW = /\b(ANNUEL|ANNUELLE|AN|ANNEE|COTISATION)\b/;
const round2 = (x) => Math.round(x * 100) / 100;
const days = (a, b) => Math.round((b - a) / 864e5);
const dOf = (t) => new Date((t.date) + 'T12:00:00');
const title = (s) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const median = (a) => { const b = a.slice().sort((x, y) => x - y); const m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };
const fits = (g, c) => [1, 2, 3].some((k) => g >= c.min * k && g <= c.max * k);

function norm(s) {
  STOP.lastIndex = 0;
  return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
    .replace(/\d{2}[\/.]\d{2}([\/.]\d{2,4})?/g, ' ')
    .replace(/X{2,}\d*|\b\w*\d{3,}\w*\b|N°\S*/g, ' ')
    .replace(/[^A-Z ]+/g, ' ').replace(STOP, ' ').replace(/\s+/g, ' ').trim()
    .split(' ').filter((w) => w.length > 1).slice(0, 5).join(' ');
}

export function detect(accounts, txs, today = new Date()) {
  const eurAcc = new Set(accounts.filter((a) => !a.currency || a.currency === 'EUR').map((a) => a.id));
  const seen = new Set();
  const all = txs.filter((t) => t.value < 0 && eurAcc.has(t.account) && !EXCLUDE_TYPES.includes(t.type))
    .map((t) => ({ ...t, _n: norm(t.wording), _d: dOf(t), _a: -t.value }))
    .filter((t) => t._n && !EXCLUDE_KW.test(t._n) && Number.isFinite(t._d.getTime()))
    .filter((t) => { const k = t._n + '|' + t._a + '|' + t.date; if (seen.has(k)) return false; seen.add(k); return true; });
  const debits = all.filter((t) => !t.coming && t._d <= today);
  const groups = {};
  debits.forEach((t) => { (groups[t._n] = groups[t._n] || []).push(t); });
  const months = [];
  for (let i = 5; i >= 0; i--) months.push(new Date(today.getFullYear(), today.getMonth() - i, 1));
  const subs = [];
  Object.entries(groups).forEach(([n, list]) => {
    list.sort((a, b) => a._d - b._d);
    const gaps = list.slice(1).map((t, k) => days(list[k]._d, t._d));
    let cad = null;
    if (gaps.length) {
      const m = median(gaps);
      cad = CADENCES.find((c) => m >= c.min && m <= c.max && list.length >= c.minOcc && gaps.every((g) => fits(g, c))) || null;
    }
    if (!cad && !SUB_KW.test(n)) return;
    const c = cad || (YEAR_KW.test(n) ? CADENCES[3] : CADENCES[1]);
    const last = list[list.length - 1];
    const amount = round2(last._a);
    const price = round2(amount * c.perMonth);
    const cat = CATS.find((x) => x[0].test(n)) || [null, 'Prélèvement', '#3A4458'];
    const words = title(n).split(' ');
    const first = list[0]._d;
    subs.push({
      id: 'eb-' + n.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''),
      name: title(n), cat: cat[1], color: cat[2],
      ini: (words[0][0] + (words[1] ? words[1][0] : (words[0][1] || ''))).toUpperCase(),
      price, amount, cadence: c.id, cadenceLabel: c.label,
      day: last._d.getDate(), since: MOIS[first.getMonth()] + ' ' + first.getFullYear(),
      small: price < 10, live: true, count: list.length, confirmed: !!cad,
      lastDate: last.date, label: last.wording,
      note: cad ? null : 'Probable · 1 seul prélèvement vu'
    });
  });
  subs.sort((a, b) => (b.confirmed - a.confirmed) || (b.price - a.price));
  const recent = txs.filter((t) => !t.coming && eurAcc.has(t.account) && days(dOf(t), today) <= 30 && days(dOf(t), today) >= 0);
  const income = round2(recent.filter((t) => t.value > 0).reduce((a, t) => a + t.value, 0));
  const spent = round2(recent.filter((t) => t.value < 0).reduce((a, t) => a - t.value, 0));
  const dates = debits.map((t) => t._d).sort((a, b) => a - b);
  const histDays = dates.length ? days(dates[0], dates[dates.length - 1]) : 0;
  return {
    subs,
    months: months.map((m) => MOIS[m.getMonth()]),
    income, spent, payIn: 30,
    history: { days: histDays, debits: debits.length, total: txs.length, limited: histDays < 60 || debits.length < 20 },
    savings: { increases: 0, small: round2(subs.filter((s) => s.small).reduce((a, s) => a + s.price, 0)), duplicates: 0, total: 0 }
  };
}
