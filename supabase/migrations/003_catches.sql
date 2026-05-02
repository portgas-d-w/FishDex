-- ============================================================
-- FishDex — Migration 003 : Table catches + RLS + Storage
-- ============================================================

-- ─── Table catches ───────────────────────────────────────────
create table public.catches (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  species_id    uuid not null references public.species(id) on delete restrict,
  variety_id    uuid references public.varieties(id) on delete set null,
  mutation_id   uuid references public.mutations(id) on delete set null,
  date_capture  date not null default current_date,
  lieu          text,
  poids_kg      numeric(6,3),
  taille_cm     numeric(6,1),
  notes         text,
  photo_url     text,
  is_public     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── Index ───────────────────────────────────────────────────
create index catches_user_date_idx  on public.catches(user_id, date_capture desc);
create index catches_species_id_idx on public.catches(species_id);

-- ─── Trigger updated_at (réutilise set_updated_at de la migration 002)
create trigger catches_updated_at
  before update on public.catches
  for each row execute procedure public.set_updated_at();

-- ─── RLS ─────────────────────────────────────────────────────
alter table public.catches enable row level security;

-- L'owner voit toutes ses prises, tout le monde voit les prises publiques
create policy "Lecture des prises"
  on public.catches for select
  using (
    auth.uid() = user_id
    or is_public = true
  );

create policy "Création de ses propres prises"
  on public.catches for insert
  with check (auth.uid() = user_id);

create policy "Modification de ses propres prises"
  on public.catches for update
  using (auth.uid() = user_id);

create policy "Suppression de ses propres prises"
  on public.catches for delete
  using (auth.uid() = user_id);

-- ─── Storage : policies sur storage.objects ──────────────────
-- (Le bucket "catches" doit être créé manuellement dans le Dashboard
--  avant d'exécuter ces policies)

-- Upload dans son propre dossier {user_id}/
create policy "Upload dans son propre dossier"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'catches'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Lecture : owner voit ses fichiers, les photos des catches publiques sont visibles
create policy "Lecture des photos"
  on storage.objects for select
  using (
    bucket_id = 'catches'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1 from public.catches c
        where c.photo_url = name
          and c.is_public = true
      )
    )
  );

-- Mise à jour : owner uniquement
create policy "Mise à jour de ses photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'catches'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Suppression : owner uniquement
create policy "Suppression de ses photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'catches'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
