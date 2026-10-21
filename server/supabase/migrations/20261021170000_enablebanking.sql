-- Lecture bancaire Enable Banking. Aucun IBAN. La clé service seule écrit.
-- anon et authenticated : aucun droit. RLS activé, sans politique pour ces rôles.

create table if not exists public.app_sessions (
  token_hash text primary key,
  user_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.bank_oauth_states (
  state text primary key,
  user_id text not null,
  expires_at timestamptz not null
);

create table if not exists public.bank_connections (
  user_id text primary key,
  provider text not null,
  session_id text,
  aspsp_name text,
  aspsp_country text,
  valid_until timestamptz,
  status text,
  synced_at timestamptz,
  subscriptions jsonb not null default '[]'::jsonb,
  stats jsonb not null default '{}'::jsonb
);

create table if not exists public.bank_accounts (
  user_id text not null,
  external_id text not null,
  uid text,
  name text not null,
  account_type text,
  currency text,
  balance numeric(14,2) not null default 0,
  primary key (user_id, external_id)
);

create table if not exists public.bank_transactions (
  user_id text not null,
  external_id text not null,
  account_id text,
  booked_on date,
  amount numeric(14,2) not null default 0,
  wording text,
  tx_type text,
  coming boolean not null default false,
  primary key (user_id, external_id)
);

alter table public.app_sessions enable row level security;
alter table public.bank_oauth_states enable row level security;
alter table public.bank_connections enable row level security;
alter table public.bank_accounts enable row level security;
alter table public.bank_transactions enable row level security;

revoke all on table public.app_sessions from public, anon, authenticated;
revoke all on table public.bank_oauth_states from public, anon, authenticated;
revoke all on table public.bank_connections from public, anon, authenticated;
revoke all on table public.bank_accounts from public, anon, authenticated;
revoke all on table public.bank_transactions from public, anon, authenticated;

grant select, insert, update, delete on table public.app_sessions to service_role;
grant select, insert, update, delete on table public.bank_oauth_states to service_role;
grant select, insert, update, delete on table public.bank_connections to service_role;
grant select, insert, update, delete on table public.bank_accounts to service_role;
grant select, insert, update, delete on table public.bank_transactions to service_role;
