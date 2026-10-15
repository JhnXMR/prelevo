-- Abonnements Web Push et rappels J-1 / J-3 / J-7.
-- Aucun secret ici : les clés VAPID restent dans l'environnement.
-- Appliquer dans Supabase (SQL ou supabase db push). Ne pas lancer depuis l'app.

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  endpoint text not null,
  p256dh text not null,
  auth_secret text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, endpoint)
);

create table if not exists public.push_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  subscription_id uuid not null references public.push_subscriptions (id) on delete cascade,
  external_id text not null,
  name text not null,
  amount numeric(12, 2),
  lead_days smallint not null default 3 check (lead_days in (1, 3, 7)),
  nominal_day smallint not null check (nominal_day between 1 and 31),
  debit_on date not null,
  sent_for text,
  updated_at timestamptz not null default now(),
  unique (subscription_id, external_id)
);

create index if not exists push_alerts_user_idx on public.push_alerts (user_id);
create index if not exists push_subscriptions_user_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;
alter table public.push_alerts enable row level security;

revoke all on public.push_subscriptions from anon, authenticated;
revoke all on public.push_alerts from anon, authenticated;

-- Pas de politique pour anon ni authenticated : seul le rôle service, déjà utilisé
-- par l'API, lit et écrit ces tables. user_id est l'identifiant du compte Prelevo.
-- Si vos comptes sont dans auth.users, vous pouvez ajouter :
--   foreign key (user_id) references auth.users (id) on delete cascade
