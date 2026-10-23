function json(res, status, body, origin) {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  };
  if (origin) {
    headers['access-control-allow-origin'] = origin;
    headers['vary'] = 'Origin';
    headers['access-control-allow-headers'] = 'authorization, content-type, accept';
    headers['access-control-allow-methods'] = 'GET, POST, DELETE, OPTIONS';
  }
  res.writeHead(status, headers);
  res.end(body == null ? '' : JSON.stringify(body));
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

function bearer(req) {
  const h = req.headers.authorization || req.headers.Authorization || '';
  const m = /^Bearer\s+(.+)$/i.exec(String(h));
  return m ? m[1].trim() : '';
}

const ALLOWED_ORIGIN = 'https://jhndlt.github.io';

function allowOrigin(req) {
  const origin = req.headers.origin || '';
  if (origin === ALLOWED_ORIGIN) return origin;
  if (/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin)) return origin;
  return '';
}

/**
 * POST /bank/connect, POST /bank/callback, POST /bank/sync, GET /me, DELETE /me.
 * Renvoie true si la requête est consommée.
 */
export async function handleBankRequest(req, res, { bank, store, fixtureUser }) {
  const url = new URL(req.url || '/', 'http://localhost');
  const path = url.pathname;
  const known = path === '/bank/connect' || path === '/bank/callback' || path === '/bank/sync' || path === '/me' || path === '/health';
  if (!known) return false;
  const origin = allowOrigin(req);
  if (req.method === 'OPTIONS') { json(res, 204, null, origin); return true; }
  try {
    if (path === '/health' && req.method === 'GET') { json(res, 200, { ok: true }, origin); return true; }
    const token = bearer(req);
    let userId = null;
    if (fixtureUser && token === 'fixture') userId = fixtureUser;
    else if (token && store.userIdForToken) userId = await store.userIdForToken(token);
    if (!userId) { json(res, 401, { error: 'Non connecté' }, origin); return true; }
    if (path === '/me' && req.method === 'GET') { json(res, 200, await bank.me(userId), origin); return true; }
    if (path === '/me' && req.method === 'DELETE') { json(res, 200, await bank.disconnect(userId), origin); return true; }
    if (req.method !== 'POST') { json(res, 405, { error: 'Méthode refusée' }, origin); return true; }
    if (path === '/bank/connect') { json(res, 200, await bank.connect(userId), origin); return true; }
    const body = await readBody(req);
    if (path === '/bank/callback') { json(res, 200, await bank.callback(userId, body), origin); return true; }
    if (path === '/bank/sync') { json(res, 200, await bank.sync(userId), origin); return true; }
    json(res, 404, { error: 'Introuvable' }, origin);
  } catch (err) {
    const status = err && err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
    const message = status === 500 ? 'Une erreur est survenue. Réessayez dans un instant.' : err.message;
    if (!res.headersSent) json(res, status, { error: message }, origin);
  }
  return true;
}
