-- ============================================================
-- FishDex — Migration 006 : Système de Badges
-- ============================================================

-- ─── Table badges ────────────────────────────────────────────
create table public.badges (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  category      text not null check (category in ('discovery', 'performance', 'regularity', 'hidden')),
  title         text not null,
  description   text,
  icon          text,
  color         text,
  is_hidden     boolean not null default false,
  conditions    jsonb,
  xp_reward     integer not null default 0,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ─── Table user_badges ───────────────────────────────────────
create table public.user_badges (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  badge_id    uuid not null references public.badges(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique(user_id, badge_id)
);

create index user_badges_user_idx on public.user_badges(user_id);

-- ─── RLS ─────────────────────────────────────────────────────
alter table public.badges enable row level security;
create policy "All authenticated read badges"
  on public.badges for select to authenticated using (true);

alter table public.user_badges enable row level security;
create policy "User reads own badges"
  on public.user_badges for select using (auth.uid() = user_id);
create policy "User inserts own badges"
  on public.user_badges for insert with check (auth.uid() = user_id);

-- ─── Seed badges ─────────────────────────────────────────────
insert into public.badges
  (slug, category, title, description, icon, color, is_hidden, xp_reward, display_order)
values
  -- DÉCOUVERTE
  ('premiere_prise',   'discovery',   'Première prise',    'Réaliser sa toute première capture',              '🎣', 'emerald', false,   50,  1),
  ('cartographe',      'discovery',   'Cartographe',       'Pêcher dans 10 spots différents',                 '🗺️', 'cyan',    false,  200,  2),
  ('encyclopediste',   'discovery',   'Encyclopédiste',    'Découvrir 50 espèces différentes',                '📚', 'blue',    false,  500,  3),
  ('completionniste',  'discovery',   'Complétionniste',   'Découvrir les 57 espèces du FishDex',             '🏆', 'amber',   false, 2000,  4),

  -- PERFORMANCE
  ('trophe',           'performance', 'Trophée',           'Capturer un poisson de plus de 5 kg',             '🐟', 'amber',   false,  150,  5),
  ('geant',            'performance', 'Géant',             'Capturer un poisson de plus de 15 kg',            '🦈', 'red',     false,  500,  6),
  ('premiere_shiny',   'performance', 'Première Shiny',    'Capturer une espèce de rareté Shiny',             '✨', 'fuchsia', false, 1000,  7),

  -- RÉGULARITÉ
  ('serie_7',          'regularity',  'Série de 7 jours',  'Pêcher 7 jours consécutifs',                      '🔥', 'orange',  false,  100,  8),
  ('serie_30',         'regularity',  'Série de 30 jours', 'Pêcher 30 jours consécutifs',                     '⭐', 'yellow',  false,  500,  9),
  ('pecheur_matinal',  'regularity',  'Pêcheur matinal',   'Réaliser 10 prises avant 8h du matin',            '🌅', 'cyan',    false,  200, 10),
  ('pecheur_nocturne', 'regularity',  'Pêcheur nocturne',  'Réaliser 10 prises après 22h',                    '🌙', 'indigo',  false,  200, 11),

  -- CACHÉS
  ('marathon',         'hidden',      'Marathon',          'Réaliser 8 prises en une seule journée',          '🏃', 'emerald', true,   400, 12),
  ('rarete_absolue',   'hidden',      'Rareté absolue',    'Capturer une légendaire et une shiny le même jour','💎', 'purple',  true,  1000, 13),
  ('pleine_lune',      'hidden',      'Pleine lune',       'Capturer un poisson lors d''une nuit de pleine lune','🌕','yellow', true,   500, 14),
  ('sous_la_pluie',    'hidden',      'Sous la pluie',     'Capturer un poisson sous la pluie',               '🌧️', 'blue',   true,   300, 15),
  ('aube_parfaite',    'hidden',      'L''aube parfaite',  'Réaliser sa première prise à 5h du matin pile',   '🌄', 'amber',   true,   500, 16);
