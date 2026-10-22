/* Pont natif iOS. Inactif hors de Capacitor : la PWA ne charge pas ce fichier. */
(function () {
  'use strict';
  var cap = window.Capacitor;
  if (!cap || typeof cap.isNativePlatform !== 'function' || !cap.isNativePlatform()) return;

  document.documentElement.classList.add('native-ios');

  var LOCK_KEY = 'prelevo-ios-lock';
  var PUSH_KEY = 'prelevo-ios-push';

  function plugin(name) {
    try { return cap.Plugins && cap.Plugins[name] ? cap.Plugins[name] : null; }
    catch (e) { return null; }
  }

  function toast(msg) {
    if (typeof window.toast === 'function') { window.toast(msg); return; }
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
  }

  function locked() {
    try { return localStorage.getItem(LOCK_KEY) === '1'; }
    catch (e) { return false; }
  }
  function setLocked(on) {
    try { if (on) localStorage.setItem(LOCK_KEY, '1'); else localStorage.removeItem(LOCK_KEY); }
    catch (e) {}
  }
  function pushOn() {
    try { return localStorage.getItem(PUSH_KEY) === '1'; }
    catch (e) { return false; }
  }
  function setPush(on) {
    try { if (on) localStorage.setItem(PUSH_KEY, '1'); else localStorage.removeItem(PUSH_KEY); }
    catch (e) {}
  }

  function haptic(style) {
    var H = plugin('Haptics');
    if (!H || !H.impact) return;
    H.impact({ style: style || 'LIGHT' }).catch(function () {});
  }

  function applyThemeBar() {
    var S = plugin('StatusBar');
    if (!S) return;
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var style = dark ? 'DARK' : 'LIGHT';
    var color = dark ? '#0A0B0D' : '#FFFFFF';
    if (S.setOverlaysWebView) S.setOverlaysWebView({ overlay: true }).catch(function () {});
    if (S.setStyle) S.setStyle({ style: style }).catch(function () {});
    if (S.setBackgroundColor) S.setBackgroundColor({ color: color }).catch(function () {});
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', color);
  }

  function applyIncoming(raw) {
    if (!window.PrelevoLinks) return;
    var route = window.PrelevoLinks.routeIncomingUrl(raw);
    if (!route) return;
    var next = location.pathname + (route.search || '') + (route.hash || '');
    var cur = location.pathname + location.search + location.hash;
    if (cur === next) return;
    location.replace(next);
  }

  function listenLinks() {
    var App = plugin('App');
    if (!App) return;
    if (App.addListener) {
      App.addListener('appUrlOpen', function (event) {
        if (event && event.url) applyIncoming(event.url);
      });
      App.addListener('appStateChange', function (state) {
        if (state && state.isActive) maybeLock(false);
      });
    }
    if (App.getLaunchUrl) {
      App.getLaunchUrl().then(function (res) {
        if (res && res.url) applyIncoming(res.url);
      }).catch(function () {});
    }
  }

  var lockEl = null;
  function ensureLock() {
    if (lockEl) return lockEl;
    lockEl = document.createElement('div');
    lockEl.className = 'native-lock';
    lockEl.hidden = true;
    lockEl.innerHTML = '<h1>Prelevo est verrouillé</h1><p>Déverrouillez avec Face ID, Touch ID ou le code de l’iPhone.</p><button type="button" class="btn" id="native-unlock">Déverrouiller</button>';
    document.body.appendChild(lockEl);
    lockEl.querySelector('#native-unlock').addEventListener('click', function () {
      haptic('MEDIUM');
      promptBio(false);
    });
    return lockEl;
  }

  function showLock(on) {
    var el = ensureLock();
    el.hidden = !on;
  }

  function promptBio(fromToggle) {
    var Bio = bioPlugin();
    if (!Bio || !Bio.authenticate) {
      toast('Le verrouillage biométrique n’est pas disponible sur cet appareil.');
      if (fromToggle) setLocked(false);
      decorate();
      return;
    }
    Bio.authenticate({
      reason: 'Déverrouillez Prelevo',
      cancelTitle: 'Annuler',
      allowDeviceCredential: true,
      iosFallbackTitle: 'Utiliser le code',
      androidTitle: 'Prelevo',
      androidSubtitle: 'Déverrouillez l’app'
    }).then(function () {
      if (fromToggle) setLocked(true);
      showLock(false);
      haptic('MEDIUM');
      decorate();
    }).catch(function () {
      if (fromToggle) {
        setLocked(false);
        toast('Le verrouillage n’a pas été activé.');
        decorate();
      } else {
        showLock(true);
      }
    });
  }

  function pwaLockOwns() {
    try {
      var rec = JSON.parse(localStorage.getItem('prelevo-lock') || 'null');
      return !!(rec && rec.enabled && rec.hash);
    } catch (e) { return false; }
  }

  function maybeLock(forcePrompt) {
    if (pwaLockOwns()) { showLock(false); return; }
    if (!locked()) { showLock(false); return; }
    showLock(true);
    if (forcePrompt) promptBio(false);
  }

  function registerPush() {
    var Push = plugin('PushNotifications');
    if (!Push || !Push.register) {
      toast('Les notifications de l’iPhone seront branchées avec APNs.');
      return;
    }
    if (Push.addListener && !registerPush.wired) {
      registerPush.wired = true;
      Push.addListener('registration', function (token) {
        try { if (token && token.value) localStorage.setItem('prelevo-apns-token', token.value); } catch (e) {}
      });
      Push.addListener('registrationError', function () {
        toast('L’inscription APNs n’a pas abouti. Elle sera branchée plus tard.');
      });
    }
    var ask = Push.requestPermissions ? Push.requestPermissions() : Promise.resolve({ receive: 'granted' });
    ask.then(function (perm) {
      var ok = perm && (perm.receive === 'granted' || perm.receive === 'prompt');
      if (perm && perm.receive === 'denied') {
        setPush(false);
        toast('Les notifications sont bloquées dans les réglages de l’iPhone.');
        decorate();
        return;
      }
      return Push.register().then(function () {
        setPush(true);
        toast('Cet iPhone est prêt. L’envoi APNs sera branché plus tard.');
        decorate();
      });
    }).catch(function () {
      toast('Les notifications de l’iPhone seront branchées avec APNs.');
    });
  }

  function bioPlugin() {
    return plugin('BiometricAuthNative') || plugin('BiometricAuth');
  }

  function lockLabel(info) {
    var kind = info && info.biometryType;
    if (kind === 1 || kind === 'touchId') return 'Verrouillage Touch ID';
    if (kind === 2 || kind === 'faceId') return 'Verrouillage Face ID';
    return 'Verrouillage de l’app';
  }

  function decorate() {
    var account = document.querySelector('.screen.account');
    var reset = account && account.querySelector('#reset');
    if (pwaLockOwns()) {
      var oldRow = account && account.querySelector('#native-lock-row');
      if (oldRow) oldRow.remove();
    } else if (reset && reset.parentElement && !account.querySelector('#native-lock-row')) {
      var card = reset.parentElement;
      var lockRow = document.createElement('button');
      lockRow.type = 'button';
      lockRow.className = 'acct-row';
      lockRow.id = 'native-lock-row';
      lockRow.setAttribute('role', 'switch');
      lockRow.setAttribute('aria-checked', locked() ? 'true' : 'false');
      lockRow.innerHTML = '<span class="acct-lab" id="native-lock-lab">Verrouillage Face ID</span><span class="sw' + (locked() ? ' on' : '') + '"></span>';
      var pushRow = document.createElement('button');
      pushRow.type = 'button';
      pushRow.className = 'acct-row';
      pushRow.id = 'native-push-row';
      pushRow.innerHTML = '<span class="acct-lab">Notifications de l’iPhone</span><span class="acct-aside">' + (pushOn() ? 'Activées' : 'Désactivées') + '</span>';
      card.insertBefore(pushRow, card.firstChild);
      card.insertBefore(lockRow, pushRow);
    }
    var lab = document.getElementById('native-lock-lab');
    var Bio = bioPlugin();
    if (lab && Bio && Bio.checkBiometry) {
      Bio.checkBiometry().then(function (info) {
        if (lab.isConnected) lab.textContent = lockLabel(info);
      }).catch(function () {});
    }
    var row = document.getElementById('native-lock-row');
    if (row) {
      row.setAttribute('aria-checked', locked() ? 'true' : 'false');
      var sw = row.querySelector('.sw');
      if (sw) sw.classList.toggle('on', locked());
    }
    var aside = document.querySelector('#native-push-row .acct-aside');
    if (aside) aside.textContent = pushOn() ? 'Activées' : 'Désactivées';

    var premium = document.querySelector('.screen');
    var title = premium && premium.querySelector('h1.prem-title');
    if (title && !premium.querySelector('.native-pay-note')) {
      var note = document.createElement('p');
      note.className = 'native-pay-note';
      note.textContent = 'Dans l’app iOS, l’abonnement Premium passera par l’achat intégré Apple. Le paiement par carte de la version web n’est pas proposé ici.';
      var top = premium.querySelector('.topbar');
      if (top && top.nextSibling) premium.insertBefore(note, top.nextSibling);
      else premium.insertBefore(note, premium.firstChild);
    }
  }

  document.addEventListener('click', function (e) {
    var pay = e.target.closest && e.target.closest('[data-checkout], #billing-portal, [data-portal]');
    if (pay) {
      e.preventDefault();
      e.stopImmediatePropagation();
      toast('L’abonnement iOS se fera par l’achat intégré Apple.');
      return;
    }
    var lockRow = e.target.closest && e.target.closest('#native-lock-row');
    if (lockRow) {
      e.preventDefault();
      e.stopImmediatePropagation();
      haptic('LIGHT');
      if (locked()) { setLocked(false); showLock(false); decorate(); toast('Verrouillage retiré de cet iPhone.'); return; }
      promptBio(true);
      return;
    }
    var pushRow = e.target.closest && e.target.closest('#native-push-row');
    if (pushRow) {
      e.preventDefault();
      e.stopImmediatePropagation();
      haptic('LIGHT');
      if (pushOn()) { setPush(false); decorate(); toast('Notifications de l’iPhone désactivées sur cet appareil.'); return; }
      registerPush();
      return;
    }
    if (e.target.closest && e.target.closest('.btn, #tabbar a, .acct-row')) haptic('LIGHT');
  }, true);

  var appRoot = document.getElementById('app');
  if (appRoot) {
    new MutationObserver(function () { decorate(); }).observe(appRoot, { childList: true });
  }
  new MutationObserver(function () { applyThemeBar(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  window.PrelevoNative = {
    shareCsv: function (filename, body) {
      var Filesystem = plugin('Filesystem');
      var Share = plugin('Share');
      if (!Filesystem || !Share || !Filesystem.writeFile || !Share.share) return Promise.resolve('unavailable');
      var csv = '\uFEFF' + String(body || '');
      var data = btoa(unescape(encodeURIComponent(csv)));
      return Filesystem.writeFile({ path: filename, data: data, directory: 'CACHE' }).then(function () {
        return Filesystem.getUri({ path: filename, directory: 'CACHE' });
      }).then(function (uri) {
        return Share.share({
          title: 'Transactions Prelevo',
          files: [uri.uri || uri],
          dialogTitle: 'Exporter les transactions'
        });
      }).then(function () { return 'shared'; }).catch(function (err) {
        var name = err && (err.message || err.errorMessage || '');
        if (err && (err.code === 'OS-PLUG-FILE-0010' || /cancel|abort/i.test(String(name)))) return 'abort';
        return 'error';
      });
    }
  };

  applyThemeBar();
  listenLinks();
  decorate();
  if (locked()) maybeLock(true);
  else if (pushOn()) {
    var Push = plugin('PushNotifications');
    if (Push && Push.register) Push.register().catch(function () {});
  }
  var Splash = plugin('SplashScreen');
  if (Splash && Splash.hide) Splash.hide().catch(function () {});
})();
