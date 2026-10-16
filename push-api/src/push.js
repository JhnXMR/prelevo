import { buildPayload, normalizeLead, parisDay, parseDay, rollDebit } from './dates.js';

const ID = /^[A-Za-z0-9_-]{1,80}$/;

function bad(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

export function normalizeAlerts(raw) {
  if (!Array.isArray(raw)) throw bad('Les alertes sont illisibles.');
  const out = [];
  const seen = new Set();
  raw.forEach((item) => {
    if (!item || typeof item !== 'object') return;
    const externalId = String(item.id || '');
    if (!ID.test(externalId) || seen.has(externalId)) return;
    const name = String(item.name || '').replace(/[\r\n]+/g, ' ').trim();
    if (!name || name.length > 120) return;
    const debit = parseDay(item.debitOn);
    if (!debit) return;
    const asked = Number(item.day);
    const nominalDay = asked >= 1 && asked <= 31 ? asked : debit.d;
    seen.add(externalId);
    out.push({
      externalId,
      name,
      amount: Number.isFinite(Number(item.amount)) ? Number(item.amount) : 0,
      leadDays: normalizeLead(item.leadDays),
      nominalDay,
      debitOn: item.debitOn
    });
  });
  if (raw.length && !out.length) throw bad('Les alertes sont illisibles.');
  return out;
}

export function normalizeSubscription(raw) {
  const sub = raw && typeof raw === 'object' ? raw : null;
  const endpoint = sub && typeof sub.endpoint === 'string' ? sub.endpoint.trim() : '';
  const keys = sub && sub.keys && typeof sub.keys === 'object' ? sub.keys : {};
  const p256dh = typeof keys.p256dh === 'string' ? keys.p256dh.trim() : '';
  const auth = typeof keys.auth === 'string' ? keys.auth.trim() : '';
  let url;
  try { url = new URL(endpoint); } catch (e) { url = null; }
  if (!url || url.protocol !== 'https:' || endpoint.length > 2000 || !p256dh || !auth || p256dh.length > 200 || auth.length > 200) {
    throw bad('L’abonnement est incomplet.');
  }
  return { endpoint, p256dh, auth };
}

export async function subscribePush({ userId, body, store }) {
  const subscription = normalizeSubscription(body && body.subscription);
  const alerts = normalizeAlerts(body && body.alerts);
  const saved = await store.upsertSubscription({ userId, ...subscription });
  await store.replaceAlerts(saved.id, userId, alerts);
  return { ok: true };
}

export async function unsubscribePush({ userId, store }) {
  await store.deleteUser(userId);
  return { ok: true };
}

export async function dispatchDue({ store, sendPush, now = new Date() }) {
  const today = parisDay(now);
  const rows = await store.listAlerts();
  let sent = 0;
  let removed = 0;
  const gone = new Set();
  for (const row of rows) {
    if (gone.has(row.subscriptionId)) continue;
    const rolled = rollDebit(row.debitOn, row.nominalDay, row.leadDays, today);
    if (!rolled || rolled.reminder !== today) {
      if (rolled && rolled.debitOn !== String(row.debitOn).slice(0, 10)) {
        await store.markSent(row.id, row.sentFor, rolled.debitOn);
      }
      continue;
    }
    const sentFor = row.externalId + ':' + rolled.debitOn;
    if (row.sentFor === sentFor) continue;
    const payload = buildPayload(row);
    try {
      await sendPush({
        endpoint: row.endpoint,
        keys: { p256dh: row.p256dh, auth: row.auth }
      }, JSON.stringify(payload));
      await store.markSent(row.id, sentFor, rolled.debitOn);
      sent += 1;
    } catch (err) {
      const code = err && (err.statusCode || err.status);
      if ((code === 404 || code === 410) && !gone.has(row.subscriptionId)) {
        gone.add(row.subscriptionId);
        await store.deleteSubscription(row.subscriptionId);
        removed += 1;
      }
    }
  }
  return { sent, removed };
}
