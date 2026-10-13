/* Prelevo – notifications locales + abonnement Web Push (si clé VAPID / API). */
'use strict';
(function () {
  const FLAG = 'prelevo-push-on';
  const SUB_KEY = 'prelevo-push-endpoint';

  const supported = () =>
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator;

  const permission = () => (supported() ? Notification.permission : 'denied');

  const enabled = () => {
    try {
      return localStorage.getItem(FLAG) === '1';
    } catch (e) {
      return false;
    }
  };

  const setEnabled = (on) => {
    try {
      if (on) localStorage.setItem(FLAG, '1');
      else localStorage.removeItem(FLAG);
    } catch (e) {}
  };

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(base64);
    const out = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  async function reg() {
    return navigator.serviceWorker.ready;
  }

  async function resolveVapid() {
    const cfg = (window.APP_CONFIG && window.APP_CONFIG.vapidPublicKey) || '';
    if (cfg) return cfg;
    if (window.PAPI && typeof window.PAPI.vapidPublicKey === 'function') {
      try {
        const r = await window.PAPI.vapidPublicKey();
        return (r && (r.publicKey || r.vapidPublicKey || r.key)) || '';
      } catch (e) {
        return '';
      }
    }
    return '';
  }

  async function subscribePush() {
    const key = await resolveVapid();
    if (!key || !('PushManager' in window)) return null;
    const r = await reg();
    let sub = await r.pushManager.getSubscription();
    if (!sub) {
      sub = await r.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key)
      });
    }
    try {
      localStorage.setItem(SUB_KEY, sub.endpoint);
    } catch (e) {}
    if (window.PAPI && typeof window.PAPI.pushSubscribe === 'function') {
      try {
        await window.PAPI.pushSubscribe(sub.toJSON());
      } catch (e) {
        /* backend pas encore prêt : on garde l’abonnement local */
      }
    }
    return sub;
  }

  async function unsubscribePush() {
    const r = await reg();
    const sub = await r.pushManager.getSubscription();
    if (sub) {
      if (window.PAPI && typeof window.PAPI.pushUnsubscribe === 'function') {
        try {
          await window.PAPI.pushUnsubscribe({ endpoint: sub.endpoint });
        } catch (e) {}
      }
      await sub.unsubscribe();
    }
    try {
      localStorage.removeItem(SUB_KEY);
    } catch (e) {}
  }

  async function showLocal(payload) {
    const p = Object.assign(
      {
        title: 'Prelevo',
        body: 'Nouvelle alerte',
        url: './#/alertes',
        tag: 'prelevo-local'
      },
      payload || {}
    );
    const r = await reg();
    await r.showNotification(p.title, {
      body: p.body,
      icon: './icons/icon-192.png',
      badge: './icons/favicon-32.png',
      tag: p.tag,
      data: { url: p.url },
      renotify: true
    });
  }

  async function enable() {
    if (!supported()) throw new Error('Notifications non supportées sur cet appareil');
    let perm = permission();
    if (perm === 'default') perm = await Notification.requestPermission();
    if (perm !== 'granted') throw new Error('Notifications refusées — autorisez-les dans le navigateur');
    setEnabled(true);
    try {
      await subscribePush();
    } catch (e) {
      /* mode local seul */
    }
    return status();
  }

  async function disable() {
    setEnabled(false);
    try {
      await unsubscribePush();
    } catch (e) {}
    return status();
  }

  async function toggle() {
    return enabled() ? disable() : enable();
  }

  /** Aperçu d’une alerte (hausse / rappel / banque) via notification locale. */
  async function preview(sample) {
    if (!supported()) throw new Error('Notifications non supportées');
    if (permission() !== 'granted') await enable();
    const s = sample || {
      title: 'Flixo+',
      body: 'Prix passé de 10,99 € à 13,49 €',
      url: './#/alertes?f=up',
      tag: 'prelevo-preview-up'
    };
    await showLocal({
      title: s.title || 'Prelevo',
      body: s.body,
      url: s.url || './#/alertes',
      tag: s.tag || 'prelevo-preview'
    });
  }

  function status() {
    return {
      supported: supported(),
      permission: permission(),
      enabled: enabled(),
      mode: enabled() ? 'on' : 'off'
    };
  }

  // Navigation demandée par le SW (clic notification)
  navigator.serviceWorker &&
    navigator.serviceWorker.addEventListener('message', (e) => {
      if (!e.data || e.data.type !== 'PRELEVO_NAV') return;
      const raw = e.data.url || '#/alertes';
      const hash = raw.includes('#') ? raw.slice(raw.indexOf('#')) : '#/alertes';
      if (location.hash !== hash) location.hash = hash;
      else if (typeof window.render === 'function') window.render();
    });

  window.PrelevoPush = {
    supported,
    permission,
    enabled,
    enable,
    disable,
    toggle,
    preview,
    showLocal,
    status
  };
})();
