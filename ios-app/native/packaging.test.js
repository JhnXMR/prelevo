'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const ios = path.join(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(rel.startsWith('/') ? rel : path.join(root, rel)), 'utf8');
}

test('la PWA source ne contient pas le pont natif', function () {
  const app = read('app/app.js');
  const html = read('app/index.html');
  assert.equal(app.includes('PRELEVO_NATIVE_SHARE'), false);
  assert.equal(html.includes('native.js'), false);
  assert.equal(fs.existsSync(path.join(root, 'app/native.js')), false);
});

test('la copie www branche le partage et retire le service worker', function () {
  const app = fs.readFileSync(path.join(ios, 'www/app.js'), 'utf8');
  const html = fs.readFileSync(path.join(ios, 'www/index.html'), 'utf8');
  const css = fs.readFileSync(path.join(ios, 'www/styles.css'), 'utf8');
  const bridge = fs.readFileSync(path.join(ios, 'www/native.js'), 'utf8');
  assert.equal(app.includes('PRELEVO_NATIVE_SHARE'), true);
  assert.equal(html.includes('src="native.js"'), true);
  assert.equal(html.includes('serviceWorker.register'), false);
  assert.equal(css.includes('url("../assets/fonts/'), false);
  assert.equal(css.includes('url("assets/fonts/'), true);
  assert.equal(bridge.includes('BiometricAuthNative'), true);
  assert.equal(bridge.includes('h1.prem-title'), true);
});

test('identité provisoire, sans secret Apple', function () {
  const cfg = JSON.parse(fs.readFileSync(path.join(ios, 'capacitor.config.json'), 'utf8'));
  const plist = fs.readFileSync(path.join(ios, 'ios/App/App/Info.plist'), 'utf8');
  const ent = fs.readFileSync(path.join(ios, 'ios/App/App/App.entitlements'), 'utf8');
  const pbx = fs.readFileSync(path.join(ios, 'ios/App/App.xcodeproj/project.pbxproj'), 'utf8');
  const aasa = fs.readFileSync(path.join(ios, 'templates/apple-app-site-association'), 'utf8');
  assert.equal(cfg.appId, 'fr.prelevo.app');
  assert.equal(cfg.ios.contentInset, 'never');
  assert.equal(plist.includes('<string>prelevo</string>'), true);
  assert.equal(plist.includes('NSFaceIDUsageDescription'), true);
  assert.equal(ent.includes('applinks:jhnxmr.github.io'), true);
  assert.equal(ent.includes('aps-environment'), false);
  assert.equal(pbx.includes('PRODUCT_BUNDLE_IDENTIFIER = fr.prelevo.app;'), true);
  assert.equal(pbx.includes('DEVELOPMENT_TEAM'), false);
  assert.equal(aasa.includes('TEAMID.fr.prelevo.app'), true);
  assert.equal(fs.existsSync(path.join(root, '.well-known/apple-app-site-association')), false);
});
