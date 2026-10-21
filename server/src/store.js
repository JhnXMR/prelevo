import { createHash } from 'node:crypto';

const sha256 = (token) => createHash('sha256').update(String(token)).digest('hex');

export function memoryStore() {
  const states = new Map();
  const connections = new Map();
  const accounts = new Map();
  const txs = new Map();
  const sessions = new Map();
  return {
    async putSession(token, userId) { sessions.set(sha256(token), userId); },
    async userIdForToken(token) { return sessions.get(sha256(token)) || null; },
    async saveState(row) { states.set(row.state, row); },
    async takeState(state, userId, now) {
      const row = states.get(state);
      if (!row || row.userId !== userId) return null;
      states.delete(state);
      if (new Date(row.expiresAt).getTime() <= now.getTime()) return null;
      return row;
    },
    async saveConnection(row) { connections.set(row.userId, row); },
    async getConnection(userId) { return connections.get(userId) || null; },
    async replaceAccounts(userId, rows) { accounts.set(userId, rows); },
    async replaceTransactions(userId, rows) { txs.set(userId, rows); },
    async snapshot(userId) {
      return {
        connection: connections.get(userId) || null,
        accounts: accounts.get(userId) || [],
        transactions: txs.get(userId) || []
      };
    },
    async deleteUserBank(userId) {
      connections.delete(userId);
      accounts.delete(userId);
      txs.delete(userId);
    }
  };
}

function serviceHeaders(serviceKey, prefer) {
  return {
    apikey: serviceKey,
    authorization: 'Bearer ' + serviceKey,
    accept: 'application/json',
    'content-type': 'application/json',
    prefer: prefer || 'return=minimal'
  };
}

async function rest(fetchImpl, base, serviceKey, method, path, body) {
  const res = await fetchImpl(base + '/rest/v1/' + path, {
    method,
    headers: serviceHeaders(serviceKey, method === 'POST' ? 'resolution=merge-duplicates,return=minimal' : 'return=minimal'),
    body: body == null ? undefined : JSON.stringify(body)
  });
  if (!res.ok) {
    const err = new Error('La sauvegarde de vos comptes a échoué. Réessayez.');
    err.status = 502;
    throw err;
  }
  return res;
}

/** Clé service uniquement. Les rôles anon et authenticated n’ont aucun droit. */
export function supabaseStore({ url, serviceKey, fetchImpl = fetch }) {
  const base = String(url || '').replace(/\/+$/, '');
  const go = (method, path, body) => rest(fetchImpl, base, serviceKey, method, path, body);
  async function select(path) {
    const res = await fetchImpl(base + '/rest/v1/' + path, { headers: serviceHeaders(serviceKey, 'return=representation') });
    if (!res.ok) return [];
    return res.json();
  }
  return {
    async userIdForToken(token) {
      const rows = await select('app_sessions?token_hash=eq.' + sha256(token) + '&select=user_id');
      return rows[0] && rows[0].user_id || null;
    },
    async saveState(row) {
      await go('POST', 'bank_oauth_states?on_conflict=state', { state: row.state, user_id: row.userId, expires_at: row.expiresAt });
    },
    async takeState(state, userId, now) {
      const rows = await select('bank_oauth_states?state=eq.' + encodeURIComponent(state) + '&select=user_id,expires_at');
      await go('DELETE', 'bank_oauth_states?state=eq.' + encodeURIComponent(state));
      const row = rows[0];
      if (!row || row.user_id !== userId) return null;
      if (new Date(row.expires_at).getTime() <= now.getTime()) return null;
      return { state, userId };
    },
    async saveConnection(row) {
      await go('POST', 'bank_connections?on_conflict=user_id', {
        user_id: row.userId,
        provider: 'enablebanking',
        session_id: row.sessionId,
        aspsp_name: row.aspspName,
        aspsp_country: row.aspspCountry,
        valid_until: row.validUntil,
        status: row.status || 'ok',
        synced_at: row.syncedAt,
        subscriptions: row.subscriptions || [],
        stats: row.stats || {}
      });
    },
    async getConnection(userId) {
      const rows = await select('bank_connections?user_id=eq.' + encodeURIComponent(userId) + '&select=*');
      const row = rows[0];
      if (!row) return null;
      return {
        userId: row.user_id, sessionId: row.session_id, aspspName: row.aspsp_name,
        aspspCountry: row.aspsp_country, validUntil: row.valid_until, status: row.status,
        syncedAt: row.synced_at, subscriptions: row.subscriptions || [], stats: row.stats || {}
      };
    },
    async replaceAccounts(userId, rows) {
      await go('DELETE', 'bank_accounts?user_id=eq.' + encodeURIComponent(userId));
      if (!rows.length) return;
      await go('POST', 'bank_accounts', rows.map((a) => ({
        user_id: userId, external_id: a.id, uid: a.uid || null, name: a.name,
        account_type: a.type, currency: a.currency, balance: a.balance
      })));
    },
    async replaceTransactions(userId, rows) {
      await go('DELETE', 'bank_transactions?user_id=eq.' + encodeURIComponent(userId));
      if (!rows.length) return;
      await go('POST', 'bank_transactions', rows.map((t) => ({
        user_id: userId, external_id: t.id, account_id: t.account, booked_on: t.date || null,
        amount: t.value, wording: t.wording, tx_type: t.type, coming: !!t.coming
      })));
    },
    async snapshot(userId) {
      const connection = await this.getConnection(userId);
      const accRows = await select('bank_accounts?user_id=eq.' + encodeURIComponent(userId) + '&select=external_id,name,account_type,currency,balance');
      const txRows = await select('bank_transactions?user_id=eq.' + encodeURIComponent(userId) + '&select=external_id,account_id,booked_on,amount,wording,tx_type,coming&order=booked_on.desc');
      return {
        connection,
        accounts: accRows.map((a) => ({ id: a.external_id, name: a.name, type: a.account_type, balance: Number(a.balance), currency: a.currency })),
        transactions: txRows.map((t) => ({ id: t.external_id, account: t.account_id, date: t.booked_on, value: Number(t.amount), wording: t.wording, type: t.tx_type, coming: !!t.coming }))
      };
    },
    async deleteUserBank(userId) {
      await go('DELETE', 'bank_transactions?user_id=eq.' + encodeURIComponent(userId));
      await go('DELETE', 'bank_accounts?user_id=eq.' + encodeURIComponent(userId));
      await go('DELETE', 'bank_connections?user_id=eq.' + encodeURIComponent(userId));
    }
  };
}
