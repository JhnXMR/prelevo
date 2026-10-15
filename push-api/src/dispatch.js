import { pathToFileURL } from 'node:url';
import { dispatchDue } from './push.js';
import { createWebPush } from './send.js';
import { supabaseStore } from './store.js';

export async function runDispatch(env = process.env, now = new Date()) {
  const store = supabaseStore({
    url: env.SUPABASE_URL,
    serviceKey: env.SUPABASE_SERVICE_ROLE_KEY
  });
  const sendPush = createWebPush(env);
  return dispatchDue({ store, sendPush, now });
}

function startedHere() {
  if (!process.argv[1]) return false;
  return import.meta.url === pathToFileURL(process.argv[1]).href;
}

if (startedHere()) {
  runDispatch().then((result) => {
    process.stdout.write(JSON.stringify({ sent: result.sent, removed: result.removed }) + '\n');
  }).catch((err) => {
    const missing = err && err.missing ? ' (' + err.missing.join(', ') + ')' : '';
    process.stderr.write((err && err.message ? err.message : 'Échec') + missing + '\n');
    process.exitCode = 1;
  });
}
