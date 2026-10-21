/** Comptes fictifs, uniquement hors production et sans clé privée. Société Générale, courant + carte. */
export function fixtureSession() {
  return {
    session_id: 'fixture-session',
    aspsp: { name: 'Société Générale', country: 'FR' },
    accounts: [
      {
        uid: '11111111-1111-4111-8111-111111111111',
        identification_hash: 'courant-demo',
        name: 'Compte courant',
        cash_account_type: 'CACC',
        currency: 'EUR'
      },
      {
        uid: '22222222-2222-4222-8222-222222222222',
        identification_hash: 'carte-demo',
        name: 'Carte',
        cash_account_type: 'CARD',
        currency: 'EUR'
      }
    ]
  };
}

export function fixtureBalances(uid) {
  if (String(uid).startsWith('2222')) {
    return { balances: [{ balance_type: 'CLBD', balance_amount: { currency: 'EUR', amount: '86.20' } }] };
  }
  return { balances: [{ balance_type: 'CLBD', balance_amount: { currency: 'EUR', amount: '1842.37' } }] };
}

export function fixtureTransactions(uid) {
  if (String(uid).startsWith('2222')) {
    return [
      { transaction_id: 'tx-carte-1', credit_debit_indicator: 'DBIT', status: 'BOOK', booking_date: '2026-10-03', transaction_amount: { currency: 'EUR', amount: '12.40' }, remittance_information: ['Boulangerie Martin'], merchant_category_code: '5411' }
    ];
  }
  return [
    { transaction_id: 'tx-salaire', credit_debit_indicator: 'CRDT', status: 'BOOK', booking_date: '2026-09-28', transaction_amount: { currency: 'EUR', amount: '2200.00' }, remittance_information: ['Salaire'] },
    { transaction_id: 'tx-loyer', credit_debit_indicator: 'DBIT', status: 'BOOK', booking_date: '2026-10-05', transaction_amount: { currency: 'EUR', amount: '780.00' }, remittance_information: ['Loyer'] },
    { transaction_id: 'tx-netflix-1', credit_debit_indicator: 'DBIT', status: 'BOOK', booking_date: '2026-08-12', transaction_amount: { currency: 'EUR', amount: '13.49' }, remittance_information: ['Netflix'] },
    { transaction_id: 'tx-netflix-2', credit_debit_indicator: 'DBIT', status: 'BOOK', booking_date: '2026-09-12', transaction_amount: { currency: 'EUR', amount: '13.49' }, remittance_information: ['Netflix'] },
    { transaction_id: 'tx-netflix-3', credit_debit_indicator: 'DBIT', status: 'BOOK', booking_date: '2026-10-12', transaction_amount: { currency: 'EUR', amount: '13.49' }, remittance_information: ['Netflix'] }
  ];
}
