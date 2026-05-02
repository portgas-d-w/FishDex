-- ============================================================
-- FishDex — Migration 001 : Schéma initial
-- ============================================================

-- ─── Table profiles (prolonge les utilisateurs Supabase Auth) ───
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  pseudo     text unique not null,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- ─── Table species (les 35 espèces de poissons) ─────────────────
create table public.species (
  id                  serial primary key,
  common_name         text not null,
  scientific_name     text not null,
  photo_url           text,
  average_size_cm     int,
  max_size_cm         int,
  average_weight_g    int,
  max_weight_g        int,
  diet                text,
  reproduction_period text,
  conservation_status text check (conservation_status in ('LC','NT','VU','EN','CR','EW','EX')),
  description         text,
  created_at          timestamptz default now() not null
);

-- ─── Table catches (les prises des utilisateurs) ────────────────
create table public.catches (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  species_id  int  not null references public.species(id),
  photo_url   text,
  caught_at   timestamptz default now() not null,
  size_cm     decimal(5,1),
  weight_kg   int,
  weight_g    int,
  technique   text check (technique in (
                'Pêche au coup','Feeder','Mouche','Leurres',
                'Carpe','Toc','Vif','Traîne','Autre'
              )),
  notes       text,
  latitude    decimal(9,6),
  longitude   decimal(9,6),
  released    boolean default false not null,
  is_public   boolean default false not null,
  created_at  timestamptz default now() not null
);

-- ─── Index pour accélérer les requêtes fréquentes ───────────────
create index catches_user_id_idx       on public.catches(user_id);
create index catches_species_id_idx    on public.catches(species_id);
create index catches_caught_at_idx     on public.catches(caught_at desc);

-- ─── Fonction : créer automatiquement un profil à l'inscription ─
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, pseudo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'pseudo', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Row Level Security (RLS) — chaque utilisateur ne voit
-- que ses propres données
-- ============================================================

-- Profiles
alter table public.profiles enable row level security;

create policy "Lecture de son propre profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Modification de son propre profil"
  on public.profiles for update
  using (auth.uid() = id);

-- Species (lecture publique pour tout utilisateur connecté)
alter table public.species enable row level security;

create policy "Lecture publique des espèces"
  on public.species for select
  to authenticated
  using (true);

-- Catches
alter table public.catches enable row level security;

create policy "Lecture de ses propres prises"
  on public.catches for select
  using (auth.uid() = user_id);

create policy "Ajout de ses propres prises"
  on public.catches for insert
  with check (auth.uid() = user_id);

create policy "Modification de ses propres prises"
  on public.catches for update
  using (auth.uid() = user_id);

create policy "Suppression de ses propres prises"
  on public.catches for delete
  using (auth.uid() = user_id);
