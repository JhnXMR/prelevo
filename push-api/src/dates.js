const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function normalizeLead(n) {
  n = Number(n);
  return n === 1 || n === 7 ? n : 3;
}

export function parseDay(iso) {
  const m = DAY.exec(String(iso || ''));
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, mo, d };
}

export function parisDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(now);
  const pick = (type) => parts.find((p) => p.type === type).value;
  return pick('year') + '-' + pick('month') + '-' + pick('day');
}

export function addDays(iso, delta) {
  const p = parseDay(iso);
  if (!p) return null;
  const dt = new Date(Date.UTC(p.y, p.mo - 1, p.d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return dt.toISOString().slice(0, 10);
}

function candidate(year, monthIndex, nominalDay) {
  return new Date(Date.UTC(year, monthIndex, nominalDay)).toISOString().slice(0, 10);
}

/** Prochain prélèvement dont le jour de rappel (J-x) n'est pas encore passé, heure de Paris. */
export function rollDebit(debitOn, nominalDay, lead, today) {
  const p = parseDay(debitOn);
  const day = Number(nominalDay);
  if (!p || !(day >= 1 && day <= 31) || !parseDay(today)) return null;
  const leadDays = normalizeLead(lead);
  const start = new Date(Date.UTC(p.y, p.mo - 2, 1));
  for (let i = 0; i < 40; i++) {
    const current = candidate(start.getUTCFullYear(), start.getUTCMonth() + i, day);
    const reminder = addDays(current, -leadDays);
    if (reminder && reminder >= today) return { debitOn: current, reminder };
  }
  return null;
}

export function euroPlain(n) {
  const v = Number(n);
  const safe = Number.isFinite(v) ? v : 0;
  const sign = safe < 0 ? '-' : '';
  const [whole, frac] = Math.abs(safe).toFixed(2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f');
  return sign + grouped + ',' + frac + ' €';
}

export function buildPayload(row) {
  const lead = normalizeLead(row.leadDays);
  const title = lead === 1 ? 'Prélèvement demain' : 'Prélèvement dans ' + lead + ' jours';
  const name = String(row.name || 'Prélèvement').replace(/[\r\n]+/g, ' ').trim() || 'Prélèvement';
  return {
    title,
    body: name + ' · ' + euroPlain(row.amount),
    url: '#/prelevements',
    tag: 'prelevement-' + row.externalId
  };
}
