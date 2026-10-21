import { createHash } from 'node:crypto';

const TYPE = { CACC: 'checking', CARD: 'card', SVGS: 'savings', LOAN: 'loan', CASH: 'cash', OTHR: 'other' };
const BALANCE_ORDER = ['CLBD', 'XPCD', 'ITAV', 'CLAV'];

function num(amount) {
  const n = Number(amount);
  return Number.isFinite(n) ? n : 0;
}

export function pickBalance(payload) {
  const list = (payload && payload.balances) || [];
  const found = BALANCE_ORDER.map((t) => list.find((b) => b && b.balance_type === t)).find(Boolean) || list[0];
  if (!found || !found.balance_amount) return { amount: 0, currency: 'EUR' };
  return {
    amount: Math.round(num(found.balance_amount.amount) * 100) / 100,
    currency: found.balance_amount.currency || 'EUR'
  };
}

export function accountName(account) {
  const type = TYPE[account && account.cash_account_type] || 'other';
  const raw = String((account && (account.name || account.product)) || '').replace(/\s+/g, ' ').trim();
  if (raw) return raw.slice(0, 80);
  if (type === 'card') return 'Carte';
  if (type === 'checking') return 'Compte courant';
  if (type === 'savings') return 'Épargne';
  return 'Compte';
}

/** Compte tel que l’app l’affiche. Pas d’IBAN. */
export function mapAccount(account, balances) {
  const bal = pickBalance(balances);
  const type = TYPE[account && account.cash_account_type] || 'other';
  const id = (account && (account.identification_hash || account.uid)) || '';
  return {
    id: String(id),
    uid: account && account.uid ? String(account.uid) : '',
    name: accountName(account),
    type,
    balance: bal.amount,
    currency: bal.currency || (account && account.currency) || 'EUR'
  };
}

function wordingOf(tx) {
  const lines = Array.isArray(tx.remittance_information) ? tx.remittance_information.filter(Boolean) : [];
  const raw = lines.join(' ')
    || (tx.creditor && tx.creditor.name)
    || (tx.debtor && tx.debtor.name)
    || (tx.note)
    || 'Opération';
  return String(raw)
    .replace(/\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180) || 'Opération';
}

/** Opération au format déjà lu par l’app (value signé, date, wording). */
export function mapTransaction(tx, accountId) {
  const abs = Math.abs(num(tx && tx.transaction_amount && tx.transaction_amount.amount));
  const value = Math.round((tx && tx.credit_debit_indicator === 'DBIT' ? -abs : abs) * 100) / 100;
  const date = (tx && (tx.booking_date || tx.transaction_date || tx.value_date)) || '';
  const wording = wordingOf(tx || {});
  const id = (tx && (tx.transaction_id || tx.entry_reference)) || createHash('sha256')
    .update([accountId, date, value, wording].join('|'))
    .digest('hex')
    .slice(0, 32);
  const type = tx && tx.merchant_category_code ? 'card' : (value > 0 ? 'transfer' : 'bank');
  return {
    id: String(id),
    account: accountId,
    date: String(date).slice(0, 10),
    value,
    wording,
    type,
    coming: !!(tx && tx.status === 'PDNG')
  };
}

export function publicAccount(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    balance: row.balance,
    currency: row.currency || 'EUR'
  };
}

export function publicTransaction(row) {
  return {
    id: row.id,
    account: row.account,
    date: row.date,
    value: row.value,
    wording: row.wording,
    type: row.type,
    coming: !!row.coming
  };
}
