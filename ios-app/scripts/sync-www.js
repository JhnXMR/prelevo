'use strict';
/* Copie /app vers ios-app/www et branche le pont natif. Ne modifie pas /app. */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const appDir = path.join(root, 'app');
const assetsDir = path.join(root, 'assets');
const www = path.join(__dirname, '..', 'www');
const nativeDir = path.join(__dirname, '..', 'native');
const configPath = path.join(__dirname, '..', 'capacitor.config.json');
const MARK = 'PRELEVO_NATIVE_SHARE';

function rm(p) {
  fs.rmSync(p, { recursive: true, force: true });
}
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const name of fs.readdirSync(from)) {
    if (name === 'categories.test.js') continue;
    const src = path.join(from, name);
    const dest = path.join(to, name);
    const st = fs.statSync(src);
    if (st.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

rm(www);
copyDir(appDir, www);
if (fs.existsSync(assetsDir)) copyDir(assetsDir, path.join(www, 'assets'));

const cssPath = path.join(www, 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(/url\("\.\.\/assets\/fonts\//g, 'url("assets/fonts/').replace(/url\(\.\.\/assets\/fonts\//g, 'url(assets/fonts/');
fs.writeFileSync(cssPath, css);

for (const file of ['links.js', 'native.js', 'native.css']) {
  fs.copyFileSync(path.join(nativeDir, file), path.join(www, file));
}

const indexPath = path.join(www, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(/\s*<script>\s*if \('serviceWorker'[\s\S]*?<\/script>/, '');
const inject = [
  '  <link rel="stylesheet" href="native.css">',
  '  <script src="links.js"></script>',
  '  <script src="native.js"></script>'
].join('\n');
if (!html.includes('native.js')) html = html.replace('</body>', inject + '\n</body>');
fs.writeFileSync(indexPath, html);

const appJsPath = path.join(www, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');
if (!appJs.includes(MARK)) {
  const needle = 'function deliverCsv(filename, body, count) {\n  const blob = new Blob([\'\\uFEFF\' + body], { type: \'text/csv;charset=utf-8\' });';
  const hook = 'function deliverCsv(filename, body, count) {\n  const n0 = count || 0;\n  const done = () => n0 + \' opération\' + (n0 > 1 ? \'s\' : \'\') + \' exportée\' + (n0 > 1 ? \'s\' : \'\') + \'.\';\n  if (window.PrelevoNative && typeof PrelevoNative.shareCsv === \'function\') { /* ' + MARK + ' */\n    PrelevoNative.shareCsv(filename, body).then(result => {\n      if (result === \'shared\') toast(done());\n      else if (result !== \'abort\') toast(\'Le partage n’a pas abouti. Réessayez.\');\n    });\n    return;\n  }\n  const blob = new Blob([\'\\uFEFF\' + body], { type: \'text/csv;charset=utf-8\' });';
  if (!appJs.includes(needle)) {
    console.error('deliverCsv introuvable : la copie iOS n’a pas été branchée.');
    process.exit(1);
  }
  appJs = appJs.replace(needle, hook);
  fs.writeFileSync(appJsPath, appJs);
}

const source = fs.readFileSync(path.join(appDir, 'app.js'), 'utf8');
if (source.includes(MARK)) {
  console.error('La PWA /app/app.js a été modifiée. Le pont doit rester dans la copie.');
  process.exit(1);
}

const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const remote = (process.env.CAPACITOR_SERVER_URL || '').trim();
cfg.server = { iosScheme: 'https' };
if (remote) {
  cfg.server.url = remote;
  cfg.server.cleartext = remote.startsWith('http://');
  console.log('Repli : chargement de ' + remote);
} else {
  console.log('Copie locale : ios-app/www');
}
fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2) + '\n');
console.log('www prêt.');
