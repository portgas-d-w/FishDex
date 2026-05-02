-- ============================================================
-- FishDex — Migration 002 : Table profiles + trigger auth
-- ============================================================
-- À exécuter dans le SQL Editor de ton projet Supabase.
-- Le script est idempotent : DROP IF EXISTS gère le cas où
-- l'ancienne table profiles (migration 001) aurait déjà tourné.
-- ============================================================

-- ─── Nettoyage de l'ancienne version si elle existe ──────────
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists profiles_updated_at on public.profiles;
drop function if exists public.handle_new_user();
drop function if exists public.set_updated_at();
drop table if exists public.profiles cascade;

-- ─── Table profiles ──────────────────────────────────────────
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text unique not null
             constraint username_length check (
               char_length(username) >= 3 and char_length(username) <= 20
             ),
  avatar_url text,
  bio        text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ─── RLS ─────────────────────────────────────────────────────
alter table public.profiles enable row level security;

create policy "Lecture publique des profils"
  on public.profiles for select
  using (true);

create policy "Création de son profil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Modification de son profil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Suppression de son profil"
  on public.profiles for delete
  using (auth.uid() = id);

-- ─── Trigger : updated_at automatique ────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ─── Trigger : créer automatiquement un profil à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
