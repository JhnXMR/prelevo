/* Store unique : localStorage protégé et petit bus. Aucun framework. */
(function (global) {
  'use strict';
  const bus = new Map();

  function on(type, fn) {
    const list = bus.get(type) || [];
    list.push(fn);
    bus.set(type, list);
    return function off() {
      const cur = bus.get(type) || [];
      const i = cur.indexOf(fn);
      if (i >= 0) cur.splice(i, 1);
    };
  }

  function emit(type, detail) {
    (bus.get(type) || []).slice().forEach(fn => {
      try { fn(detail); } catch (e) {}
    });
  }

  function readRaw(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function writeRaw(key, value) {
    try { localStorage.setItem(key, String(value)); return true; } catch (e) { return false; }
  }

  function remove(key) {
    try { localStorage.removeItem(key); } catch (e) {}
  }

  function readJSON(key, fallback) {
    const raw = readRaw(key);
    if (raw == null || raw === '') return fallback;
    try {
      const value = JSON.parse(raw);
      return value == null ? fallback : value;
    } catch (e) { return fallback; }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
  }

  global.PrelevoStore = { on: on, emit: emit, readRaw: readRaw, writeRaw: writeRaw, readJSON: readJSON, writeJSON: writeJSON, remove: remove };
})(window);
