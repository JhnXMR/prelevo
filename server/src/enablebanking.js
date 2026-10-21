import { signAppJwt } from './jwt.js';

const API = 'https://api.enablebanking.com';
const CONSENT_DAYS = 180;

export function consentUntil(now = new Date()) {
  return new Date(now.getTime() + CONSENT_DAYS * 86400000).toISOString();
}

function clientMessage(status) {
  if (status === 401 || status === 403) return 'L’agrégateur a refusé la requête. Réessayez dans un instant.';
  if (status === 429) return 'Trop de lectures auprès de la banque. Patientez un instant, puis réessayez.';
  if (status === 404) return 'Cette session bancaire n’est plus valable. Reconnectez votre banque.';
  return 'La banque n’a pas répondu. Réessayez dans un instant.';
}

/**
 * Client lecture seule. Aucune route de paiement n’est appelée.
 * fetchImpl permet les tests sans réseau.
 */
export function createEnableBanking({ appId, privateKey, fetchImpl = fetch, now = () => new Date() }) {
  async function call(method, path, body) {
    const jwt = signAppJwt({ appId, privateKey, now: now() });
    let res;
    try {
      res = await fetchImpl(API + path, {
        method,
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + jwt,
          ...(body ? { 'Content-Type': 'application/json' } : {})
        },
        body: body ? JSON.stringify(body) : undefined
      });
    } catch (e) {
      const err = new Error('La banque est injoignable. Vérifiez votre connexion, puis réessayez.');
      err.status = 502;
      throw err;
    }
    const text = await res.text();
    let data = null;
    if (text) { try { data = JSON.parse(text); } catch (e) { data = null; } }
    if (!res.ok) {
      const err = new Error(clientMessage(res.status));
      err.status = res.status >= 400 && res.status < 500 ? res.status : 502;
      throw err;
    }
    return data || {};
  }

  return {
    startAuth({ state, redirectUrl, aspspName, aspspCountry, psuType }) {
      return call('POST', '/auth', {
        access: { valid_until: consentUntil(now()), balances: true, transactions: true },
        aspsp: { name: aspspName, country: aspspCountry },
        state,
        redirect_url: redirectUrl,
        psu_type: psuType,
        language: 'fr'
      });
    },
    createSession(code) {
      return call('POST', '/sessions', { code });
    },
    getSession(sessionId) {
      return call('GET', '/sessions/' + encodeURIComponent(sessionId));
    },
    balances(accountUid) {
      return call('GET', '/accounts/' + encodeURIComponent(accountUid) + '/balances');
    },
    async transactions(accountUid, dateFrom) {
      const out = [];
      let continuation = '';
      for (let page = 0; page < 30; page++) {
        const q = new URLSearchParams({ date_from: dateFrom });
        if (continuation) q.set('continuation_key', continuation);
        const data = await call('GET', '/accounts/' + encodeURIComponent(accountUid) + '/transactions?' + q.toString());
        out.push(...(data.transactions || []));
        continuation = data.continuation_key || '';
        if (!continuation) break;
      }
      return out;
    },
    deleteSession(sessionId) {
      return call('DELETE', '/sessions/' + encodeURIComponent(sessionId));
    }
  };
}
