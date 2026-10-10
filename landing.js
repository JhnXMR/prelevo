(() => {
  const C = window.PRELEVO_LANDING || {};
  const W = C.waitlist || { provider: 'none' };
  const inc = C.incentive || {};
  document.querySelectorAll('[data-incentive]').forEach(el => {
    if (inc.enabled === false || !inc.text) el.remove(); else el.textContent = '🎁 ' + inc.text;
  });
  if (C.contactEmail) document.querySelectorAll('[data-contact]').forEach(el => el.textContent = C.contactEmail);
  if (C.publisher) document.querySelectorAll('[data-publisher]').forEach(el => el.textContent = C.publisher);

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
        body: JSON.stringify({ email, source, date, _subject: 'Nouvelle inscription Prelevo', _captcha: 'false', _template: 'table', _honey: '' })
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
    if (!valid(email)) { msg.textContent = 'Vérifie ton adresse e-mail.'; msg.classList.add('err'); f.email.focus(); return; }
    if (!f.consent.checked) { msg.textContent = 'Coche la case pour accepter de recevoir nos e-mails.'; msg.classList.add('err'); return; }
    btn.disabled = true; msg.textContent = 'Inscription…';
    try {
      const how = await send(email, f.dataset.source || '');
      f.classList.add('done'); msg.classList.add('ok');
      msg.textContent = how === 'local'
        ? 'Merci ! (Aperçu : la liste d’attente n’est pas encore branchée, ton e-mail est seulement gardé sur cet appareil.)'
        : 'C’est noté ! On te prévient dès que Prelevo est prêt.';
    } catch (e) {
      btn.disabled = false; msg.classList.add('err');
      msg.textContent = 'Oups, l’inscription n’est pas passée. Réessaie dans un instant.';
    }
  }));
})();
