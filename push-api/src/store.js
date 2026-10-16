export function memoryStore() {
  const subs = [];
  const alerts = [];
  let n = 1;
  const id = (p) => p + n++;

  return {
    async upsertSubscription({ userId, endpoint, p256dh, auth }) {
      let row = subs.find((s) => s.userId === userId && s.endpoint === endpoint);
      if (!row) {
        row = { id: id('sub-'), userId, endpoint, p256dh, auth };
        subs.push(row);
      } else {
        row.p256dh = p256dh;
        row.auth = auth;
      }
      return { ...row };
    },
    async replaceAlerts(subscriptionId, userId, items) {
      const prev = alerts.filter((a) => a.subscriptionId === subscriptionId);
      for (let i = alerts.length - 1; i >= 0; i--) {
        if (alerts[i].subscriptionId === subscriptionId) alerts.splice(i, 1);
      }
      items.forEach((item) => {
        const old = prev.find((p) => p.externalId === item.externalId && p.debitOn === item.debitOn && p.leadDays === item.leadDays);
        alerts.push({
          id: id('al-'),
          subscriptionId,
          userId,
          sentFor: old ? old.sentFor : null,
          externalId: item.externalId,
          name: item.name,
          amount: item.amount,
          leadDays: item.leadDays,
          nominalDay: item.nominalDay,
          debitOn: item.debitOn
        });
      });
    },
    async deleteUser(userId) {
      const ids = subs.filter((s) => s.userId === userId).map((s) => s.id);
      for (let i = subs.length - 1; i >= 0; i--) if (subs[i].userId === userId) subs.splice(i, 1);
      for (let i = alerts.length - 1; i >= 0; i--) {
        if (ids.includes(alerts[i].subscriptionId)) alerts.splice(i, 1);
      }
    },
    async deleteSubscription(subscriptionId) {
      for (let i = subs.length - 1; i >= 0; i--) if (subs[i].id === subscriptionId) subs.splice(i, 1);
      for (let i = alerts.length - 1; i >= 0; i--) {
        if (alerts[i].subscriptionId === subscriptionId) alerts.splice(i, 1);
      }
    },
    async listAlerts() {
      return alerts.map((a) => {
        const s = subs.find((x) => x.id === a.subscriptionId);
        if (!s) return null;
        return {
          ...a,
          endpoint: s.endpoint,
          p256dh: s.p256dh,
          auth: s.auth
        };
      }).filter(Boolean);
    },
    async markSent(alertId, sentFor, debitOn) {
      const row = alerts.find((a) => a.id === alertId);
      if (!row) return;
      row.sentFor = sentFor;
      row.debitOn = debitOn;
    }
  };
}

function restError() {
  const err = new Error('Supabase a refusé la requête');
  err.code = 'supabase';
  return err;
}

export function supabaseStore({ url, serviceKey, fetchImpl = fetch }) {
  const base = String(url || '').replace(/\/+$/, '');
  if (!base || !serviceKey) {
    const err = new Error('Configuration Supabase incomplète');
    err.code = 'config';
    throw err;
  }

  async function rest(method, path, body, prefer) {
    const res = await fetchImpl(base + '/rest/v1/' + path, {
      method,
      headers: {
        apikey: serviceKey,
        authorization: 'Bearer ' + serviceKey,
        accept: 'application/json',
        ...(body != null ? { 'content-type': 'application/json' } : {}),
        ...(prefer ? { prefer } : {})
      },
      body: body == null ? undefined : JSON.stringify(body)
    });
    const text = await res.text();
    if (!res.ok) throw restError();
    if (!text) return null;
    return JSON.parse(text);
  }

  return {
    async upsertSubscription({ userId, endpoint, p256dh, auth }) {
      const rows = await rest('POST', 'push_subscriptions?on_conflict=user_id,endpoint', {
        user_id: userId,
        endpoint,
        p256dh,
        auth_secret: auth,
        updated_at: new Date().toISOString()
      }, 'resolution=merge-duplicates,return=representation');
      const row = Array.isArray(rows) ? rows[0] : rows;
      if (!row || !row.id) throw restError();
      return { id: row.id, userId: row.user_id, endpoint: row.endpoint, p256dh: row.p256dh, auth: row.auth_secret };
    },
    async replaceAlerts(subscriptionId, userId, items) {
      const existing = await rest('GET', 'push_alerts?subscription_id=eq.' + encodeURIComponent(subscriptionId) + '&select=external_id,debit_on,lead_days,sent_for');
      const keep = new Map((existing || []).map((row) => [
        row.external_id + ':' + String(row.debit_on || '').slice(0, 10) + ':' + Number(row.lead_days),
        row.sent_for
      ]));
      await rest('DELETE', 'push_alerts?subscription_id=eq.' + encodeURIComponent(subscriptionId), null, 'return=minimal');
      if (!items.length) return;
      await rest('POST', 'push_alerts', items.map((item) => ({
        user_id: userId,
        subscription_id: subscriptionId,
        external_id: item.externalId,
        name: item.name,
        amount: item.amount,
        lead_days: item.leadDays,
        nominal_day: item.nominalDay,
        debit_on: item.debitOn,
        sent_for: keep.get(item.externalId + ':' + item.debitOn + ':' + item.leadDays) || null
      })), 'return=minimal');
    },
    async deleteUser(userId) {
      await rest('DELETE', 'push_subscriptions?user_id=eq.' + encodeURIComponent(userId), null, 'return=minimal');
    },
    async deleteSubscription(subscriptionId) {
      await rest('DELETE', 'push_subscriptions?id=eq.' + encodeURIComponent(subscriptionId), null, 'return=minimal');
    },
    async listAlerts() {
      const rows = await rest('GET',
        'push_alerts?select=id,user_id,subscription_id,external_id,name,amount,lead_days,nominal_day,debit_on,sent_for,push_subscriptions(endpoint,p256dh,auth_secret)',
        null, null);
      return (rows || []).map((row) => {
        const sub = row.push_subscriptions || {};
        return {
          id: row.id,
          userId: row.user_id,
          subscriptionId: row.subscription_id,
          externalId: row.external_id,
          name: row.name,
          amount: row.amount,
          leadDays: row.lead_days,
          nominalDay: row.nominal_day,
          debitOn: String(row.debit_on || '').slice(0, 10),
          sentFor: row.sent_for,
          endpoint: sub.endpoint,
          p256dh: sub.p256dh,
          auth: sub.auth_secret
        };
      }).filter((row) => row.endpoint);
    },
    async markSent(alertId, sentFor, debitOn) {
      await rest('PATCH', 'push_alerts?id=eq.' + encodeURIComponent(alertId), {
        sent_for: sentFor,
        debit_on: debitOn,
        updated_at: new Date().toISOString()
      }, 'return=minimal');
    }
  };
}
