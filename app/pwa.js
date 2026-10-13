/* Prelevo – installation PWA + mise à jour du service worker. */
'use strict';
(function () {
  const DISMISS_KEY = 'prelevo-install-dismiss';
  const DISMISS_MS = 14 * 24 * 3600 * 1000; // 14 jours
  let deferred = null;
  let refreshing = false;

  const $ = (id) => document.getElementById(id);
  const standalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches ||
    !!navigator.standalone;

  const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  const dismissed = () => {
    try {
      const t = +localStorage.getItem(DISMISS_KEY);
      return t && Date.now() - t < DISMISS_MS;
    } catch (e) {
      return false;
    }
  };
  const setDismissed = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch (e) {}
  };

  function show(el) {
    if (!el) return;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('on'));
    document.body.classList.add(el.id === 'pwa-update' ? 'has-pwa-update' : 'has-pwa-install');
  }
  function hide(el) {
    if (!el) return;
    el.classList.remove('on');
    el.hidden = true;
    document.body.classList.remove(el.id === 'pwa-update' ? 'has-pwa-update' : 'has-pwa-install');
  }

  function syncInstallCta() {
    const row = $('pwa-install-row');
    const installed = standalone();
    if (row) {
      row.hidden = installed;
      const lab = row.querySelector('.pwa-row-lab');
      if (lab) lab.textContent = deferred ? 'Installer Prelevo' : isIos() ? 'Ajouter à l’écran d’accueil' : 'Installer Prelevo';
    }
  }

  function maybeShowInstall() {
    const bar = $('pwa-install');
    if (!bar || standalone() || dismissed()) {
      hide(bar);
      syncInstallCta();
      return;
    }
    const desc = $('pwa-install-desc');
    const actions = $('pwa-install-actions');
    const iosOk = $('pwa-ios-ok');
    if (deferred) {
      if (desc) desc.textContent = 'Accès rapide depuis l’écran d’accueil, même hors ligne.';
      if (actions) actions.hidden = false;
      if (iosOk) iosOk.hidden = true;
      show(bar);
    } else if (isIos()) {
      if (desc) desc.textContent = 'Sur iPhone : Partager, puis « Sur l’écran d’accueil ».';
      if (actions) actions.hidden = true;
      if (iosOk) iosOk.hidden = false;
      show(bar);
    } else {
      hide(bar);
    }
    syncInstallCta();
  }

  function showUpdate() {
    show($('pwa-update'));
  }

  async function doInstall() {
    if (!deferred) return;
    const ev = deferred;
    deferred = null;
    hide($('pwa-install'));
    try {
      await ev.prompt();
      const choice = await ev.userChoice;
      if (choice && choice.outcome === 'dismissed') setDismissed();
    } catch (e) {
      setDismissed();
    }
    syncInstallCta();
  }

  function dismissInstall() {
    setDismissed();
    hide($('pwa-install'));
    syncInstallCta();
  }

  function applyUpdate(reg) {
    const w = reg && reg.waiting;
    if (!w) return;
    w.postMessage({ type: 'SKIP_WAITING' });
  }

  function watchWaiting(worker, reg) {
    if (!worker) return;
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate(reg);
    });
  }

  async function registerSw() {
    if (!('serviceWorker' in navigator)) return;
    try {
      const reg = await navigator.serviceWorker.register('sw.js');
      if (reg.waiting && navigator.serviceWorker.controller) showUpdate();
      reg.addEventListener('updatefound', () => watchWaiting(reg.installing, reg));
      // re-check au focus / retour en ligne
      const check = () => reg.update().catch(() => {});
      window.addEventListener('focus', check);
      window.addEventListener('online', check);
      setInterval(check, 60 * 60 * 1000);

      const btn = $('pwa-update-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          btn.disabled = true;
          btn.textContent = 'Mise à jour…';
          applyUpdate(reg);
          // si le worker n'est plus en waiting (déjà activé), on recharge quand même
          setTimeout(() => {
            if (!refreshing) location.reload();
          }, 2500);
        });
      }
    } catch (e) {}
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    maybeShowInstall();
  });

  window.addEventListener('appinstalled', () => {
    deferred = null;
    setDismissed();
    hide($('pwa-install'));
    syncInstallCta();
  });

  navigator.serviceWorker &&
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      location.reload();
    });

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-pwa]');
    if (!t) return;
    const act = t.getAttribute('data-pwa');
    if (act === 'install') doInstall();
    else if (act === 'dismiss-install') dismissInstall();
    else if (act === 'open-install') {
      if (standalone()) return;
      if (deferred) {
        doInstall();
        return;
      }
      // Depuis Aide : on réaffiche même après « Plus tard »
      try {
        localStorage.removeItem(DISMISS_KEY);
      } catch (err) {}
      if (isIos()) maybeShowInstall();
      else {
        const bar = $('pwa-install');
        const desc = $('pwa-install-desc');
        const actions = $('pwa-install-actions');
        const iosOk = $('pwa-ios-ok');
        if (desc) desc.textContent = 'Utilisez le menu du navigateur → « Installer l’application » (ou l’icône ⊕ dans la barre d’adresse).';
        if (actions) actions.hidden = true;
        if (iosOk) {
          iosOk.hidden = false;
          iosOk.textContent = 'Compris';
        }
        show(bar);
      }
    }
  });

  // exposé pour que l’écran Aide rafraîchisse le CTA après render()
  window.PrelevoPwa = { syncInstallCta, maybeShowInstall, standalone };

  window.addEventListener('load', () => {
    maybeShowInstall();
    registerSw();
  });
})();
