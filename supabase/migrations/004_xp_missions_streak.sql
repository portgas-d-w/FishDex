-- ============================================================
-- FishDex — Migration 004 : XP, Missions, Streak
-- ============================================================

-- ─── Table user_xp ───────────────────────────────────────────
create table public.user_xp (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  total_xp            integer not null default 0,
  level               integer not null default 1,
  current_streak      integer not null default 0,
  longest_streak      integer not null default 0,
  last_capture_date   date,
  joker_used_week     text,
  vacation_mode_until date,
  vacation_days_used  integer not null default 0,
  vacation_year       integer not null default extract(year from current_date)::integer,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger user_xp_updated_at
  before update on public.user_xp
  for each row execute procedure public.set_updated_at();

alter table public.user_xp enable row level security;

create policy "User reads own XP"
  on public.user_xp for select using (auth.uid() = user_id);
create policy "User inserts own XP"
  on public.user_xp for insert with check (auth.uid() = user_id);
create policy "User updates own XP"
  on public.user_xp for update using (auth.uid() = user_id);

-- ─── Table xp_events ─────────────────────────────────────────
create table public.xp_events (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  catch_id     uuid references public.catches(id) on delete set null,
  event_type   text not null check (event_type in (
    'capture', 'first_discovery', 'personal_record',
    'new_spot', 'photo_added', 'mission_completed', 'streak_bonus'
  )),
  xp_amount    integer not null,
  metadata     jsonb,
  created_at   timestamptz not null default now()
);

create index xp_events_user_idx  on public.xp_events(user_id, created_at desc);
create index xp_events_catch_idx on public.xp_events(catch_id);

alter table public.xp_events enable row level security;

create policy "User reads own events"
  on public.xp_events for select using (auth.uid() = user_id);
create policy "User inserts own events"
  on public.xp_events for insert with check (auth.uid() = user_id);

-- ─── Table missions ──────────────────────────────────────────
create table public.missions (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  type        text not null check (type in ('daily', 'weekly', 'special')),
  title       text not null,
  description text,
  xp_reward   integer not null,
  target      integer not null default 1,
  conditions  jsonb,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.missions enable row level security;

create policy "All authenticated read missions"
  on public.missions for select to authenticated using (true);

-- ─── Table user_missions ─────────────────────────────────────
create table public.user_missions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  mission_id   uuid not null references public.missions(id) on delete cascade,
  period_key   text not null,
  progress     integer not null default 0,
  completed_at timestamptz,
  assigned_at  timestamptz not null default now(),
  expires_at   timestamptz,
  unique(user_id, mission_id, period_key)
);

create index user_missions_user_active_idx on public.user_missions(user_id) where completed_at is null;
create index user_missions_period_idx      on public.user_missions(user_id, period_key);

alter table public.user_missions enable row level security;

create policy "User reads own missions"
  on public.user_missions for select using (auth.uid() = user_id);
create policy "User inserts own missions"
  on public.user_missions for insert with check (auth.uid() = user_id);
create policy "User updates own missions"
  on public.user_missions for update using (auth.uid() = user_id);
