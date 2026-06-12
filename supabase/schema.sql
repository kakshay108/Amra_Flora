-- Amra Flowers — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- The app works without Supabase (orders live in memory); add it for
-- persistent, production-grade order storage.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  items               jsonb not null,
  subtotal            integer not null,
  delivery            integer not null,
  total               integer not null,
  customer            jsonb not null,
  status              text not null default 'pending',
  razorpay_order_id   text,
  razorpay_payment_id text,
  user_id             uuid references auth.users (id) on delete set null,
  created_at          timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- Row Level Security: the service-role key (used by the server) bypasses RLS,
-- so these policies only govern direct client access.
alter table public.orders enable row level security;

-- Signed-in customers can read their own orders.
drop policy if exists "own orders are viewable" on public.orders;
create policy "own orders are viewable"
  on public.orders for select
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Saved bouquet designs (optional accounts feature)
-- ---------------------------------------------------------------------------
create table if not exists public.bouquet_designs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users (id) on delete cascade,
  name        text not null,
  config      jsonb not null,
  thumbnail   text,
  created_at  timestamptz not null default now()
);

alter table public.bouquet_designs enable row level security;

drop policy if exists "own designs are manageable" on public.bouquet_designs;
create policy "own designs are manageable"
  on public.bouquet_designs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Profiles (for admin role, future use)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id        uuid primary key references auth.users (id) on delete cascade,
  role      text not null default 'customer',
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "own profile is viewable" on public.profiles;
create policy "own profile is viewable"
  on public.profiles for select
  using (auth.uid() = id);
