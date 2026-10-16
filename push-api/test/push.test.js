import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { parisDay, rollDebit } from '../src/dates.js';
import { createPushServer } from '../src/http.js';
import { memoryStore, supabaseStore } from '../src/store.js';
import { assertVapid } from '../src/vapid.js';

const SUB = {
  endpoint: 'https://push.example/sub/1',
  keys: { p256dh: 'p256', auth: 'authkey' }
};

function alert(extra = {}) {
  return {
    id: 'fibrebox',
    name: 'FibreBox Internet',
    amount: 39.99,
    day: 12,
    leadDays: 3,
    debitOn: '2026-10-12',
    ...extra
  };
}

function listen(deps) {
  const server = createPushServer(deps);
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({
        server,
        url: 'http://127.0.0.1:' + port,
        close: () => new Promise((done) => server.close(done))
      });
    });
  });
}

describe('dates', () => {
  test('le jour de Paris bascule à minuit, pas à minuit UTC', () => {
    assert.equal(parisDay(new Date('2026-10-08T22:30:00Z')), '2026-10-09');
    assert.equal(parisDay(new Date('2026-10-08T21:30:00Z')), '2026-10-08');
  });

  test('J-3 du 12 octobre tombe le 9', () => {
    const rolled = rollDebit('2026-10-12', 12, 3, '2026-10-09');
    assert.deepEqual(rolled, { debitOn: '2026-10-12', reminder: '2026-10-09' });
    assert.equal(rollDebit('2026-10-12', 12, 1, '2026-10-09').reminder, '2026-10-11');
  });

  test('un jour 31 qui déborde reste le jour nominal', () => {
    assert.deepEqual(rollDebit('2026-03-31', 31, 3, '2026-03-28'), {
      debitOn: '2026-03-31',
      reminder: '2026-03-28'
    });
    assert.equal(rollDebit('2026-05-01', 31, 3, '2026-04-02').debitOn, '2026-05-01');
  });
});

describe('routes', () => {
  test('sans session, la réponse est Non connecté', async () => {
    const sent = [];
    const app = await listen({
      store: memoryStore(),
      resolveUser: () => null,
      sendPush: async () => sent.push(1),
      cronSecret: 'cron-secret'
    });
    const res = await fetch(app.url + '/push/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}'
    });
    assert.equal(res.status, 401);
    assert.deepEqual(await res.json(), { error: 'Non connecté' });
    assert.equal(sent.length, 0);
    await app.close();
  });

  test('abonnement, rappel J-3, pas de second envoi, puis le mois suivant', async () => {
    const calls = [];
    const store = memoryStore();
    let now = new Date('2026-10-09T06:00:00Z');
    const app = await listen({
      store,
      resolveUser: (req) => req.headers.authorization === 'Bearer session-a' ? '11111111-1111-1111-1111-111111111111' : null,
      sendPush: async (sub, payload) => calls.push({ sub, payload: JSON.parse(payload) }),
      cronSecret: 'cron-secret',
      now: () => now
    });
    const post = await fetch(app.url + '/push/subscribe', {
      method: 'POST',
      headers: { authorization: 'Bearer session-a', 'content-type': 'application/json' },
      body: JSON.stringify({
        subscription: SUB,
        alerts: [alert(), alert({ id: 'flixo', name: 'Flixo', amount: 13.49, leadDays: 1 })]
      })
    });
    assert.equal(post.status, 200);

    const first = await fetch(app.url + '/push/dispatch', { method: 'POST', headers: { 'x-cron-secret': 'cron-secret' } });
    assert.deepEqual(await first.json(), { sent: 1, removed: 0 });
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0].payload, {
      title: 'Prélèvement dans 3 jours',
      body: 'FibreBox Internet · 39,99 €',
      url: '#/prelevements',
      tag: 'prelevement-fibrebox'
    });
    assert.equal(calls[0].sub.endpoint, SUB.endpoint);

    const again = await fetch(app.url + '/push/subscribe', {
      method: 'POST',
      headers: { authorization: 'Bearer session-a', 'content-type': 'application/json' },
      body: JSON.stringify({ subscription: SUB, alerts: [alert(), alert({ id: 'flixo', name: 'Flixo', amount: 13.49, leadDays: 1 })] })
    });
    assert.equal(again.status, 200);
    const second = await fetch(app.url + '/push/dispatch', { method: 'POST', headers: { 'x-cron-secret': 'cron-secret' } });
    assert.deepEqual(await second.json(), { sent: 0, removed: 0 });

    now = new Date('2026-11-09T07:00:00Z');
    const third = await fetch(app.url + '/push/dispatch', { method: 'POST', headers: { 'x-cron-secret': 'cron-secret' } });
    assert.deepEqual(await third.json(), { sent: 1, removed: 0 });
    assert.equal(calls[1].payload.tag, 'prelevement-fibrebox');
    await app.close();
  });

  test('le défaut est J-3, J-7 part le bon jour, un secret cron faux n’envoie rien', async () => {
    const calls = [];
    const app = await listen({
      store: memoryStore(),
      resolveUser: () => 'user-1',
      sendPush: async (_sub, payload) => calls.push(JSON.parse(payload)),
      cronSecret: 'cron-secret',
      now: () => new Date('2026-10-05T08:00:00Z')
    });
    await fetch(app.url + '/push/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subscription: SUB, alerts: [alert({ leadDays: 4 }), alert({ id: 'cloud', name: 'Cloud+ 200 Go', amount: 2.99, leadDays: 7 })] })
    });
    const denied = await fetch(app.url + '/push/dispatch', { method: 'POST', headers: { 'x-cron-secret': 'autre' } });
    assert.equal(denied.status, 401);
    assert.deepEqual(await denied.json(), { error: 'Non autorisé' });
    const ok = await fetch(app.url + '/push/dispatch', { method: 'POST', headers: { 'x-cron-secret': 'cron-secret' } });
    assert.deepEqual(await ok.json(), { sent: 1, removed: 0 });
    assert.equal(calls[0].title, 'Prélèvement dans 7 jours');
    assert.equal(calls[0].tag, 'prelevement-cloud');
    await app.close();
  });

  test('404 ou 410 retire l’abonnement, DELETE aussi', async () => {
    const store = memoryStore();
    let fail = true;
    const app = await listen({
      store,
      resolveUser: () => 'user-1',
      sendPush: async () => {
        if (fail) {
          const err = new Error('gone');
          err.statusCode = 410;
          throw err;
        }
      },
      cronSecret: 'cron-secret',
      now: () => new Date('2026-10-09T06:00:00Z')
    });
    await fetch(app.url + '/push/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subscription: SUB, alerts: [alert()] })
    });
    const gone = await fetch(app.url + '/push/dispatch', { method: 'POST', headers: { 'x-cron-secret': 'cron-secret' } });
    assert.deepEqual(await gone.json(), { sent: 0, removed: 1 });
    fail = false;
    const after = await fetch(app.url + '/push/dispatch', { method: 'POST', headers: { 'x-cron-secret': 'cron-secret' } });
    assert.deepEqual(await after.json(), { sent: 0, removed: 0 });

    await fetch(app.url + '/push/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subscription: SUB, alerts: [alert()] })
    });
    const del = await fetch(app.url + '/push/subscribe', { method: 'DELETE' });
    assert.equal(del.status, 200);
    const empty = await fetch(app.url + '/push/dispatch', { method: 'POST', headers: { 'x-cron-secret': 'cron-secret' } });
    assert.deepEqual(await empty.json(), { sent: 0, removed: 0 });
    await app.close();
  });

  test('un endpoint http est refusé', async () => {
    const app = await listen({
      store: memoryStore(),
      resolveUser: () => 'user-1',
      sendPush: async () => {},
      cronSecret: 'cron-secret'
    });
    const res = await fetch(app.url + '/push/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subscription: { endpoint: 'http://push.example/x', keys: { p256dh: 'a', auth: 'b' } }, alerts: [] })
    });
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: 'L’abonnement est incomplet.' });
    await app.close();
  });
});

describe('secrets', () => {
  test('une config VAPID incomplète ne répète pas la clé privée', () => {
    assert.throws(() => assertVapid({
      VAPID_PUBLIC_KEY: '',
      VAPID_PRIVATE_KEY: 'super-secret-value',
      VAPID_SUBJECT: ''
    }), (err) => {
      assert.deepEqual(err.missing, ['VAPID_PUBLIC_KEY', 'VAPID_SUBJECT']);
      assert.equal(JSON.stringify(err).includes('super-secret-value'), false);
      assert.equal(String(err.message).includes('super-secret-value'), false);
      return true;
    });
  });

  test('la migration active RLS et ne contient pas de secret', () => {
    const sql = readFileSync(new URL('../supabase/migrations/20261015090000_push_subscriptions.sql', import.meta.url), 'utf8');
    assert.match(sql, /enable row level security/);
    assert.match(sql, /push_subscriptions/);
    assert.match(sql, /push_alerts/);
    assert.equal(sql.includes('VAPID_PRIVATE_KEY='), false);
    assert.equal(sql.includes('SERVICE_ROLE'), false);
  });
});

describe('supabase', () => {
  test('l’upsert n’écrit pas la clé VAPID et garde un envoi déjà fait', async () => {
    const calls = [];
    const rows = {
      push_subscriptions: [{ id: 'sub-1', user_id: '11111111-1111-1111-1111-111111111111', endpoint: SUB.endpoint, p256dh: 'p256', auth_secret: 'authkey' }],
      push_alerts: [{ external_id: 'fibrebox', debit_on: '2026-10-12', lead_days: 3, sent_for: 'fibrebox:2026-10-12' }]
    };
    const fetchImpl = async (url, opts) => {
      calls.push({ url, opts });
      if (String(opts.headers.authorization).includes('service-role-secret') === false) throw new Error('header');
      const u = new URL(url);
      if (opts.method === 'POST' && u.pathname.endsWith('/push_subscriptions')) {
        assert.equal(JSON.stringify(opts.body).includes('vapid-private'), false);
        return { ok: true, text: async () => JSON.stringify(rows.push_subscriptions) };
      }
      if (opts.method === 'GET') return { ok: true, text: async () => JSON.stringify(rows.push_alerts) };
      if (opts.method === 'DELETE') return { ok: true, text: async () => '' };
      if (opts.method === 'POST') {
        const body = JSON.parse(opts.body);
        assert.equal(body[0].sent_for, 'fibrebox:2026-10-12');
        return { ok: true, text: async () => '' };
      }
      return { ok: false, status: 500, text: async () => 'service-role-secret' };
    };
    const store = supabaseStore({ url: 'https://db.example', serviceKey: 'service-role-secret', fetchImpl });
    await store.upsertSubscription({ userId: rows.push_subscriptions[0].user_id, endpoint: SUB.endpoint, p256dh: 'p256', auth: 'authkey' });
    await store.replaceAlerts('sub-1', rows.push_subscriptions[0].user_id, [{
      externalId: 'fibrebox', name: 'FibreBox Internet', amount: 39.99, leadDays: 3, nominalDay: 12, debitOn: '2026-10-12'
    }]);
    assert.equal(calls.some((c) => c.url.includes('on_conflict=user_id,endpoint')), true);
    await assert.rejects(() => supabaseStore({
      url: 'https://db.example',
      serviceKey: 'service-role-secret',
      fetchImpl: async () => ({ ok: false, status: 500, text: async () => 'service-role-secret' })
    }).upsertSubscription({ userId: '11111111-1111-1111-1111-111111111111', endpoint: SUB.endpoint, p256dh: 'a', auth: 'b' }), (err) => {
      assert.equal(String(err.message).includes('service-role-secret'), false);
      return true;
    });
  });
});
