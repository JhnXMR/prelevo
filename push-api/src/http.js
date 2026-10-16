import { timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import { dispatchDue, subscribePush, unsubscribePush } from './push.js';

function json(res, status, body) {
  const payload = body == null ? '' : JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 65536) {
        reject(Object.assign(new Error('corps trop volumineux'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch (e) { reject(Object.assign(new Error('JSON illisible'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

function secretOk(given, expected) {
  if (!expected || !given) return false;
  const a = Buffer.from(String(given));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Traite /push/subscribe et /push/dispatch.
 * Renvoie true si la requête est consommée.
 * resolveUser doit être le même contrôle de session que le reste de prelevo-api.
 */
export async function handlePushRequest(req, res, deps) {
  const path = new URL(req.url || '/', 'http://localhost').pathname;
  if (path !== '/push/subscribe' && path !== '/push/dispatch') return false;

  try {
    if (path === '/push/dispatch') {
      if (req.method !== 'POST' || !secretOk(req.headers['x-cron-secret'], deps.cronSecret)) {
        json(res, 401, { error: 'Non autorisé' });
        return true;
      }
      json(res, 200, await dispatchDue({ store: deps.store, sendPush: deps.sendPush, now: deps.now ? deps.now() : new Date() }));
      return true;
    }

    const userId = deps.resolveUser ? await deps.resolveUser(req) : null;
    if (!userId) {
      json(res, 401, { error: 'Non connecté' });
      return true;
    }
    if (req.method === 'DELETE') {
      json(res, 200, await unsubscribePush({ userId, store: deps.store }));
      return true;
    }
    if (req.method !== 'POST') {
      json(res, 405, { error: 'Méthode refusée' });
      return true;
    }
    const body = await readBody(req);
    json(res, 200, await subscribePush({ userId, body, store: deps.store }));
  } catch (err) {
    const status = err && err.status && err.status >= 400 && err.status < 500 ? err.status : 500;
    const message = status === 400 || status === 413 ? err.message : 'L’envoi n’a pas abouti.';
    json(res, status, { error: message });
  }
  return true;
}

export function createPushServer(deps) {
  return createServer((req, res) => {
    handlePushRequest(req, res, deps).then((handled) => {
      if (!handled) json(res, 404, { error: 'Introuvable' });
    }).catch(() => {
      if (!res.headersSent) json(res, 500, { error: 'L’envoi n’a pas abouti.' });
    });
  });
}
