---
name: supabase-migration
description: >
  Charge ce skill avant toute création ou modification de migration SQL
  Supabase dans FishDex. Couvre le format des fichiers, les règles
  d'idempotence, RLS obligatoire, triggers, index et le process
  local → remote. Ne jamais créer une migration sans suivre ce guide.
---

# FishDex — Supabase Migrations

## 1. Format de fichier obligatoire

```
supabase/migrations/[timestamp]_[domaine]_[action].sql

Timestamp : YYYYMMDDHHmmss (toujours en UTC)
Domaine   : fish | catches | sessions | users | spots | gear
Action    : create_table | add_column | add_index | add_rls |
            create_function | create_trigger | seed_data

Exemples valides :
  20240315143022_fish_create_table.sql
  20240315150000_catches_add_column_weight_kg.sql
  20240315160000_sessions_add_rls_policies.sql
  20240315170000_fish_create_function_get_by_rarity.sql

Exemples invalides :
  migration.sql                  ← pas de timestamp
  20240315_new_table.sql         ← timestamp incomplet
  20240315143022_AddFishTable.sql ← PascalCase interdit
```

---

## 2. Structure standard d'une migration

```sql
-- ============================================================
-- Migration : [description courte]
-- Date      : [YYYY-MM-DD]
-- Auteur    : FishDex
-- Dépend de : [migration précédente si dépendance]
-- ============================================================

-- Extensions nécessaires (si pas déjà activées)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- pour recherche full-text

-- ============================================================
-- 1. Table principale
-- ============================================================

CREATE TABLE IF NOT EXISTS public.[nom_table] (
  id          uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  -- colonnes métier ici
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

-- ============================================================
-- 2. Index
-- ============================================================
-- (voir section 5)

-- ============================================================
-- 3. Trigger updated_at
-- ============================================================
-- (voir section 6)

-- ============================================================
-- 4. RLS
-- ============================================================
-- (voir section 4 — OBLIGATOIRE)

-- ============================================================
-- 5. Commentaires de documentation
-- ============================================================
COMMENT ON TABLE public.[nom_table] IS '[description de la table]';
COMMENT ON COLUMN public.[nom_table].[colonne] IS '[description]';
```

---

## 3. Règles d'idempotence (toujours)

Toute migration doit pouvoir être relancée sans erreur.

```sql
-- ✅ Tables
CREATE TABLE IF NOT EXISTS public.fish ( ... );

-- ✅ Colonnes
ALTER TABLE public.fish
  ADD COLUMN IF NOT EXISTS habitat_description text;

-- ✅ Fonctions
CREATE OR REPLACE FUNCTION public.get_fish_by_rarity(p_rarity text)
RETURNS SETOF public.fish AS $$ ... $$ LANGUAGE sql STABLE;

-- ✅ Index
CREATE INDEX IF NOT EXISTS idx_fish_rarity ON public.fish(rarity);

-- ✅ Types enum
DO $$ BEGIN
  CREATE TYPE rarity_level AS ENUM ('common','uncommon','rare','epic','legendary');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ✅ Politiques RLS (drop + recreate pour idempotence)
DROP POLICY IF EXISTS "users_select_own_catches" ON public.catches;
CREATE POLICY "users_select_own_catches" ON public.catches
  FOR SELECT USING (auth.uid() = user_id);

-- ❌ Jamais
CREATE TABLE public.fish ( ... );          -- échoue si existe
ALTER TABLE public.fish ADD COLUMN name;   -- échoue si existe
```

---

## 4. RLS — Obligatoire sur chaque nouvelle table

**Toute table sans RLS est une faille de sécurité.**
Claude Code doit toujours ajouter RLS à la fin de chaque migration de table.

```sql
-- Activer RLS
ALTER TABLE public.[nom_table] ENABLE ROW LEVEL SECURITY;

-- Pattern SELECT : l'utilisateur voit ses propres données
DROP POLICY IF EXISTS "[nom_table]_select_own" ON public.[nom_table];
CREATE POLICY "[nom_table]_select_own" ON public.[nom_table]
  FOR SELECT
  USING (auth.uid() = user_id);

-- Pattern INSERT : l'utilisateur crée ses propres données
DROP POLICY IF EXISTS "[nom_table]_insert_own" ON public.[nom_table];
CREATE POLICY "[nom_table]_insert_own" ON public.[nom_table]
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Pattern UPDATE : l'utilisateur modifie ses propres données
DROP POLICY IF EXISTS "[nom_table]_update_own" ON public.[nom_table];
CREATE POLICY "[nom_table]_update_own" ON public.[nom_table]
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Pattern DELETE : l'utilisateur supprime ses propres données
DROP POLICY IF EXISTS "[nom_table]_delete_own" ON public.[nom_table];
CREATE POLICY "[nom_table]_delete_own" ON public.[nom_table]
  FOR DELETE
  USING (auth.uid() = user_id);

-- Pattern lecture publique (ex: table fish — données communes)
DROP POLICY IF EXISTS "fish_select_public" ON public.fish;
CREATE POLICY "fish_select_public" ON public.fish
  FOR SELECT
  USING (true);  -- tout le monde peut lire les espèces

-- Pattern admin (si table système)
DROP POLICY IF EXISTS "[nom_table]_admin_all" ON public.[nom_table];
CREATE POLICY "[nom_table]_admin_all" ON public.[nom_table]
  USING (auth.jwt() ->> 'role' = 'admin');
```

### Tables FishDex et leurs patterns RLS attendus

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `fish` (espèces) | public | admin only | admin only | admin only |
| `catches` | own | own | own | own |
| `sessions` | own | own | own | own |
| `spots` | own | own | own | own |
| `user_fishdex` | own | own | own | — |
| `records` | own | own | — | — |

---

## 5. Index — règles

```sql
-- Index sur chaque foreign key (toujours)
CREATE INDEX IF NOT EXISTS idx_catches_user_id   ON public.catches(user_id);
CREATE INDEX IF NOT EXISTS idx_catches_fish_id   ON public.catches(fish_id);
CREATE INDEX IF NOT EXISTS idx_catches_session_id ON public.catches(session_id);

-- Index sur champs souvent filtrés
CREATE INDEX IF NOT EXISTS idx_fish_rarity       ON public.fish(rarity);
CREATE INDEX IF NOT EXISTS idx_fish_water_type   ON public.fish(water_type);
CREATE INDEX IF NOT EXISTS idx_catches_caught_at ON public.catches(caught_at DESC);

-- Index full-text pour recherche espèces
CREATE INDEX IF NOT EXISTS idx_fish_search
  ON public.fish USING gin(
    to_tsvector('french', coalesce(common_name,'') || ' ' || coalesce(latin_name,''))
  );

-- Nommage : idx_[table]_[colonne(s)]
```

---

## 6. Trigger updated_at — toujours ajouter

```sql
-- Fonction réutilisable (créer une seule fois)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur chaque table avec updated_at
DROP TRIGGER IF EXISTS set_updated_at_[nom_table] ON public.[nom_table];
CREATE TRIGGER set_updated_at_[nom_table]
  BEFORE UPDATE ON public.[nom_table]
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

---

## 7. Process obligatoire — local avant remote

```bash
# 1. Créer le fichier de migration
supabase migration new [domaine]_[action]

# 2. Écrire le SQL dans le fichier créé
# (suivre toutes les règles ci-dessus)

# 3. Tester en local
supabase db reset          # reset complet + rejoue toutes les migrations
# OU
supabase migration up      # applique uniquement les nouvelles migrations

# 4. Vérifier dans Supabase Studio local
# http://localhost:54323

# 5. Valider les RLS
supabase db lint           # détecte les tables sans RLS

# 6. Seulement si ✅ local OK → push remote
supabase db push

# ❌ Ne jamais push sans avoir testé en local
# ❌ Ne jamais modifier une migration déjà pushée en remote
#    → créer une nouvelle migration corrective à la place
```

---

## 8. Convention de commit

```
feat(db): create catches table with RLS and indexes
feat(db): add weight_kg column to catches
fix(db): correct RLS policy on sessions table
refactor(db): add missing index on fish.rarity

Format : [type](db): [description en anglais, impératif]
Types   : feat | fix | refactor | seed | perf
```

---

## 9. Checklist avant push

- [ ] Nom de fichier : `[timestamp]_[domaine]_[action].sql`
- [ ] Toutes les créations utilisent `IF NOT EXISTS`
- [ ] Toutes les fonctions utilisent `CREATE OR REPLACE`
- [ ] Politiques RLS : `DROP POLICY IF EXISTS` + `CREATE POLICY`
- [ ] `ENABLE ROW LEVEL SECURITY` présent sur la table
- [ ] Index sur toutes les foreign keys
- [ ] Trigger `set_updated_at` ajouté si colonne `updated_at`
- [ ] Commentaires `COMMENT ON TABLE` et `COMMENT ON COLUMN`
- [ ] Testé avec `supabase db reset` en local sans erreur
- [ ] Vérifié avec `supabase db lint` — zéro warning RLS
