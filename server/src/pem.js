/** PEM venant de l’environnement : guillemets éventuels, et \n échappés. */
export function normalizePem(raw) {
  let s = String(raw == null ? '' : raw).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) s = s.slice(1, -1);
  s = s.replace(/\\n/g, '\n').replace(/\r\n/g, '\n').trim();
  return s;
}

export function assertPrivateKey(pem) {
  if (!pem.includes('BEGIN') || !pem.includes('PRIVATE KEY')) {
    const err = new Error('ENABLEBANKING_PRIVATE_KEY illisible');
    err.code = 'config';
    throw err;
  }
  return pem;
}
