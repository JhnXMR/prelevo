import { createServer } from 'node:http';
import { createBank, readEnv } from './bank.js';
import { handleBankRequest } from './http.js';
import { memoryStore, supabaseStore } from './store.js';

const env = readEnv(process.env);
const store = env.supabaseUrl && env.supabaseKey
  ? supabaseStore({ url: env.supabaseUrl, serviceKey: env.supabaseKey })
  : memoryStore();
const bank = createBank({ env, store });

if (env.provider === 'enablebanking' && !env.fixture && (!env.appId || !env.privateKey)) {
  console.error('ENABLEBANKING_APP_ID ou ENABLEBANKING_PRIVATE_KEY manquant. Aucune clé n’est affichée.');
  process.exit(1);
}

const server = createServer((req, res) => {
  handleBankRequest(req, res, { bank, store, fixtureUser: env.fixture ? 'fixture-user' : '' }).then((handled) => {
    if (!handled && !res.headersSent) {
      res.writeHead(404, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Introuvable' }));
    }
  }).catch(() => {
    if (!res.headersSent) {
      res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Une erreur est survenue. Réessayez dans un instant.' }));
    }
  });
});

const port = Number(process.env.PORT) || 8080;
server.listen(port, () => {
  console.log('prelevo-api écoute sur ' + port + ' (' + env.provider + (env.fixture ? ', données fictives' : '') + ')');
});
