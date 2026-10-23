import { randomUUID } from 'node:crypto';
import { detect } from './detect.js';
import { createEnableBanking } from './enablebanking.js';
import { fixtureBalances, fixtureSession, fixtureTransactions } from './fixture.js';
import { mapAccount, mapTransaction, publicAccount, publicTransaction } from './map.js';

const STATE_MS = 15 * 60 * 1000;
const SG = { name: 'Société Générale', country: 'FR', color: '#E60028' };

export function readEnv(raw = process.env) {
  const provider = String(raw.BANK_PROVIDER || 'powens').trim().toLowerCase() === 'enablebanking' ? 'enablebanking' : 'powens';
  const fixture = provider === 'enablebanking'
    && raw.ENABLEBANKING_FIXTURE === '1'
    && raw.NODE_ENV !== 'production'
    && !raw.ENABLEBANKING_PRIVATE_KEY;
  return {
    provider,
    fixture,
    appId: String(raw.ENABLEBANKING_APP_ID || '').trim(),
    privateKey: raw.ENABLEBANKING_PRIVATE_KEY ? String(raw.ENABLEBANKING_PRIVATE_KEY) : '',
    redirectUrl: String(raw.ENABLEBANKING_REDIRECT_URL || 'https://jhndlt.github.io/prelevo/app/').trim(),
    aspspName: String(raw.ENABLEBANKING_ASPSP_NAME || SG.name).trim() || SG.name,
    aspspCountry: String(raw.ENABLEBANKING_ASPSP_COUNTRY || SG.country).trim().toUpperCase() || SG.country,
    psuType: String(raw.ENABLEBANKING_PSU_TYPE || 'personal').trim() || 'personal',
    supabaseUrl: String(raw.SUPABASE_URL || '').trim(),
    supabaseKey: raw.SUPABASE_SERVICE_ROLE_KEY ? String(raw.SUPABASE_SERVICE_ROLE_KEY) : ''
  };
}

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function dateFrom(now) {
  return new Date(now.getTime() - 365 * 86400000).toISOString().slice(0, 10);
}

async function pull(client, session, now, env) {
  const accounts = [];
  const transactions = [];
  for (const raw of session.accounts || []) {
    if (!raw || !raw.uid) {
      const bare = mapAccount(raw, null);
      if (bare.id) accounts.push(bare);
      continue;
    }
    const balances = env.fixture ? fixtureBalances(raw.uid) : await client.balances(raw.uid);
    const mapped = mapAccount(raw, balances);
    accounts.push(mapped);
    const list = env.fixture ? fixtureTransactions(raw.uid) : await client.transactions(raw.uid, dateFrom(now));
    for (const tx of list) transactions.push(mapTransaction(tx, mapped.id));
  }
  const analysis = detect(accounts, transactions, now);
  return { accounts, transactions, analysis, sessionId: session.session_id, aspspName: (session.aspsp && session.aspsp.name) || env.aspspName };
}

export function toMe(snap) {
  const c = snap && snap.connection;
  if (!c) return { bankConnected: false, provider: 'enablebanking', accounts: [], transactions: [], subscriptions: [], txCount: 0 };
  const transactions = (snap.transactions || []).map(publicTransaction);
  return {
    bankConnected: true,
    provider: 'enablebanking',
    bank: { name: c.aspspName || SG.name, logo: null, color: SG.color, status: c.status || 'ok', provider: 'enablebanking' },
    accounts: (snap.accounts || []).map(publicAccount),
    transactions,
    subscriptions: c.subscriptions || [],
    stats: c.stats || {},
    txCount: transactions.length,
    lastSyncAt: c.syncedAt || null
  };
}

function callbackBody(analysis) {
  return { subscriptions: analysis.subs.length, history: analysis.history };
}

/**
 * Routes banque. Lecture seule.
 * BANK_PROVIDER=powens : ces routes ne parlent pas à Enable Banking.
 */
export function createBank({ env, store, client, now = () => new Date() }) {
  const eb = () => client || createEnableBanking({ appId: env.appId, privateKey: env.privateKey, now });

  function assertEnabled() {
    if (env.provider !== 'enablebanking') throw httpError(501, 'Le fournisseur bancaire actif n’est pas Enable Banking.');
    if (!env.fixture && (!env.appId || !env.privateKey)) throw httpError(503, 'La connexion bancaire n’est pas configurée. Réessayez plus tard.');
  }

  async function savePull(userId, pulled) {
    const syncedAt = now().toISOString();
    const connection = {
      userId,
      sessionId: pulled.sessionId,
      aspspName: pulled.aspspName,
      aspspCountry: env.aspspCountry,
      validUntil: new Date(now().getTime() + 180 * 86400000).toISOString(),
      status: 'ok',
      syncedAt,
      subscriptions: pulled.analysis.subs,
      stats: {
        months: pulled.analysis.months,
        income: pulled.analysis.income,
        spent: pulled.analysis.spent,
        payIn: pulled.analysis.payIn,
        days: pulled.analysis.history.days,
        debits: pulled.analysis.history.debits,
        total: pulled.analysis.history.total,
        limited: pulled.analysis.history.limited,
        savings: pulled.analysis.savings,
        bank: pulled.aspspName
      }
    };
    await store.saveConnection(connection);
    await store.replaceAccounts(userId, pulled.accounts);
    await store.replaceTransactions(userId, pulled.transactions);
    return connection;
  }

  return {
    async connect(userId) {
      assertEnabled();
      const state = randomUUID();
      await store.saveState({ state, userId, expiresAt: new Date(now().getTime() + STATE_MS).toISOString() });
      if (env.fixture) {
        const back = new URL(env.redirectUrl);
        back.searchParams.set('code', 'fixture');
        back.searchParams.set('state', state);
        return { url: back.toString() };
      }
      const started = await eb().startAuth({
        state,
        redirectUrl: env.redirectUrl,
        aspspName: env.aspspName,
        aspspCountry: env.aspspCountry,
        psuType: env.psuType
      });
      if (!started || !started.url) throw httpError(502, 'La banque n’a pas ouvert la connexion. Réessayez.');
      return { url: started.url };
    },
    async callback(userId, body) {
      assertEnabled();
      const state = body && body.state;
      const code = body && body.code;
      if (body && body.error) throw httpError(400, 'La connexion a été annulée. Vous pouvez réessayer quand vous voulez.');
      if (!state || !code) throw httpError(400, 'Retour de connexion incomplet. Relancez la connexion de votre banque.');
      const pending = await store.takeState(String(state), userId, now());
      if (!pending) throw httpError(400, 'Ce retour ne correspond pas à votre demande. Relancez la connexion.');
      const session = env.fixture ? fixtureSession() : await eb().createSession(String(code).slice(0, 2048));
      if (!session || !session.session_id) throw httpError(502, 'La session bancaire n’a pas été créée. Réessayez.');
      const pulled = await pull(eb(), session, now(), env);
      if (!pulled.accounts.length) throw httpError(400, 'Aucun compte n’a été autorisé. Vous pouvez relancer la connexion.');
      await savePull(userId, pulled);
      return callbackBody(pulled.analysis);
    },
    async sync(userId) {
      assertEnabled();
      const current = await store.getConnection(userId);
      if (!current || !current.sessionId) throw httpError(404, 'Aucune banque n’est connectée.');
      const session = env.fixture ? fixtureSession() : await eb().getSession(current.sessionId);
      const pulled = await pull(eb(), { ...session, session_id: current.sessionId }, now(), env);
      await savePull(userId, pulled);
      return callbackBody(pulled.analysis);
    },
    async me(userId) {
      if (env.provider !== 'enablebanking') return { bankConnected: false, provider: env.provider };
      return toMe(await store.snapshot(userId));
    },
    async disconnect(userId) {
      if (env.provider !== 'enablebanking') return { ok: true };
      const current = await store.getConnection(userId);
      if (current && current.sessionId && !env.fixture) {
        try { await eb().deleteSession(current.sessionId); }
        catch (e) { throw httpError(502, 'Nous n’avons pas pu retirer l’accès chez l’agrégateur. Réessayez : vos données sont encore là.'); }
      }
      await store.deleteUserBank(userId);
      return { ok: true };
    }
  };
}
