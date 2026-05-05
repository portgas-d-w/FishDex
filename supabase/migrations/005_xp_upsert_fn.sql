-- ============================================================
-- FishDex — Migration 005 : fonction upsert_user_xp
-- Contourne les limites RLS du upsert JS côté serveur en
-- exécutant la mise à jour atomiquement via SECURITY DEFINER.
-- ============================================================

create or replace function public.upsert_user_xp(
  p_user_id           uuid,
  p_total_xp          integer,
  p_level             integer,
  p_current_streak    integer,
  p_longest_streak    integer,
  p_last_capture_date date,
  p_joker_used_week   text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_xp (
    user_id, total_xp, level,
    current_streak, longest_streak,
    last_capture_date, joker_used_week,
    updated_at
  )
  values (
    p_user_id, p_total_xp, p_level,
    p_current_streak, p_longest_streak,
    p_last_capture_date, p_joker_used_week,
    now()
  )
  on conflict (user_id) do update set
    total_xp          = excluded.total_xp,
    level             = excluded.level,
    current_streak    = excluded.current_streak,
    longest_streak    = excluded.longest_streak,
    last_capture_date = excluded.last_capture_date,
    joker_used_week   = excluded.joker_used_week,
    updated_at        = now();
end;
$$;

-- Autoriser les utilisateurs authentifiés à appeler cette fonction
grant execute on function public.upsert_user_xp(uuid, integer, integer, integer, integer, date, text)
  to authenticated;

-- ─── Backfill : recalculer total_xp + level à partir des xp_events ───
-- À exécuter UNE FOIS manuellement si des events existaient déjà.
-- (Décommenter et exécuter dans le SQL Editor Supabase)
--
-- with sums as (
--   select user_id, sum(xp_amount) as total
--   from public.xp_events
--   group by user_id
-- )
-- update public.user_xp u
-- set
--   total_xp = s.total,
--   level    = greatest(1, floor(1 + sqrt(greatest(0, s.total)::numeric / 100)))::integer,
--   updated_at = now()
-- from sums s
-- where u.user_id = s.user_id;
--
-- Si certains users n'ont pas encore de ligne dans user_xp :
-- insert into public.user_xp (user_id, total_xp, level, updated_at)
-- select
--   e.user_id,
--   sum(e.xp_amount) as total_xp,
--   greatest(1, floor(1 + sqrt(greatest(0, sum(e.xp_amount))::numeric / 100)))::integer,
--   now()
-- from public.xp_events e
-- where not exists (select 1 from public.user_xp x where x.user_id = e.user_id)
-- group by e.user_id;
