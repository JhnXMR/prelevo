(() => {
  const C = window.PRELEVO_LANDING || {};
  const W = C.waitlist || { provider: 'none' };
  const inc = C.incentive || {};
  document.querySelectorAll('[data-incentive]').forEach(el => {
    if (inc.enabled === false || !inc.text) el.remove(); else el.textContent = '🎁 ' + inc.text;
  });
  if (C.contactEmail) document.querySelectorAll('[data-contact]').forEach(el => el.textContent = C.contactEmail);
  if (C.publisher) document.querySelectorAll('[data-publisher]').forEach(el => el.textContent = C.publisher);

  if (C.contactEmail) document.querySelectorAll('[data-contact-link]').forEach(el => el.href = 'mailto:' + C.contactEmail);

  document.querySelectorAll('[data-theme-set]').forEach(b => b.addEventListener('click', () => {
    if (window.PrelevoTheme) PrelevoTheme.set(b.getAttribute('data-theme-set'));
  }));

  // Provenance de la visite (UTM + site d'origine), gardée le temps de l'onglet, sans cookie.
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const VKEY = 'prelevo-visit';
  const visit = (() => {
    let v = {}; try { v = JSON.parse(sessionStorage.getItem(VKEY) || '{}'); } catch (e) {}
    const q = new URLSearchParams(location.search);
    const fresh = {};
    UTM_KEYS.forEach(k => { const x = (q.get(k) || '').trim().slice(0, 100); if (x) fresh[k] = x; });
    if (!fresh.utm_source && q.get('ref')) fresh.utm_source = q.get('ref').trim().slice(0, 100);
    if (Object.keys(fresh).length) v = fresh;              // un nouveau lien tracé remplace l'ancien
    if (!v.referrer) { try { const r = document.referrer && new URL(document.referrer); if (r && r.host !== location.host) v.referrer = r.host; } catch (e) {} }
    try { sessionStorage.setItem(VKEY, JSON.stringify(v)); } catch (e) {}
    return v;
  })();
  window.PRELEVO_VISIT = visit;

  document.querySelectorAll('.wl .share').forEach(b => b.addEventListener('click', async () => {
    const url = location.origin + location.pathname + '?utm_source=partage&utm_medium=ami';
    const data = { title: 'Prelevo', text: 'Prelevo repère vos abonnements, les hausses de prix et vous aide à résilier. Liste d’attente :', url };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(url); b.textContent = 'Lien copié';
    } catch (e) { if (e && e.name !== 'AbortError') b.textContent = 'Lien copié'; }
  }));

  const KEY = 'prelevo-waitlist';
  const valid = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

  async function send(email, source) {
    const date = new Date().toISOString();
    const p = W.provider || 'none';
    if (p === 'none' || !W.endpoint) {           // aperçu : rien n'est transmis
      const list = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (!list.some(x => x.email === email)) list.push({ email, source, date });
      localStorage.setItem(KEY, JSON.stringify(list));
      return 'local';
    }
    if (p === 'formsubmit') {                    // https://formsubmit.co/ajax/<alias ou e-mail>
      const r = await fetch(W.endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.assign({ email, source, date },
          { utm_source: visit.utm_source || '(direct)', utm_medium: visit.utm_medium || '', utm_campaign: visit.utm_campaign || '',
            utm_content: visit.utm_content || '', utm_term: visit.utm_term || '', referrer: visit.referrer || '' },
          { _subject: 'Nouvelle inscription Prelevo' + (visit.utm_source ? ' · ' + visit.utm_source : ''), _captcha: 'false', _template: 'table', _honey: '' }))
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || String(j.success) !== 'true') throw new Error(j.message || 'HTTP ' + r.status);
      return 'sent';
    }
    if (p === 'google-form') {
      const body = new URLSearchParams({ [W.field]: email });
      await fetch(W.endpoint, { method: 'POST', mode: 'no-cors', body });
      return 'sent';
    }
    if (p === 'apps-script') {
      await fetch(W.endpoint, { method: 'POST', mode: 'no-cors', body: new URLSearchParams({ email, source, date }) });
      return 'sent';
    }
    const r = await fetch(W.endpoint, {                 // formspree / json
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, source, date, _subject: 'Prelevo – liste d’attente' })
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return 'sent';
  }

  document.querySelectorAll('form.wl').forEach(f => f.addEventListener('submit', async ev => {
    ev.preventDefault();
    const msg = f.querySelector('.wl-msg'), btn = f.querySelector('button');
    const email = f.email.value.trim().toLowerCase();
    msg.className = 'wl-msg';
    if (f.website.value) return;                        // robot
    if (!valid(email)) { msg.textContent = 'Vérifiez votre adresse e-mail.'; msg.classList.add('err'); f.email.focus(); return; }
    if (!f.consent.checked) { msg.textContent = 'Coche la case pour accepter de recevoir nos e-mails.'; msg.classList.add('err'); return; }
    btn.disabled = true; msg.textContent = 'Inscription…';
    try {
      const how = await send(email, f.dataset.source || '');
      f.classList.add('done'); msg.textContent = '';
      const ok = f.querySelector('.wl-ok');
      if (how === 'local') ok.querySelector('p').textContent = 'Aperçu : la liste d’attente n’est pas encore branchée, votre e-mail est seulement gardé sur cet appareil.';
      ok.hidden = false; ok.focus({ preventScroll: true });
      ok.scrollIntoView({ block: 'center', behavior: 'smooth' });
    } catch (e) {
      btn.disabled = false; msg.classList.add('err');
      msg.textContent = 'Oups, l’inscription n’est pas passée. Réessayez dans un instant.';
    }
  }));

  // Partage : lien tracé utm_source=partage
  document.querySelectorAll('.wl .share').forEach(b => b.addEventListener('click', async () => {
    const url = location.origin + location.pathname + '?utm_source=partage&utm_medium=ami';
    const data = { title: 'Prelevo', text: 'Prelevo repère vos abonnements, les hausses de prix et vous aide à résilier. Liste d’attente :', url };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(url); b.textContent = 'Lien copié ✓';
    } catch (e) { if (e && e.name !== 'AbortError') { b.textContent = url; } }
  }));
})();
