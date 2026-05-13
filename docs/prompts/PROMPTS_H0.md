# 🔴 FishDex — Prompts Claude Code · Phase H0 STABILISATION

> Prompts opérationnels à copier-coller dans Claude Code.
> **Toujours utiliser dans l'ordre.** Ne pas sauter une étape.
>
> Statut phase : H0 = base saine avant tout pivot.
> Estimation : 1-2 semaines de travail effectif.

---

## 📋 Comment utiliser ce document

1. **Lis le prompt en entier** avant de le copier
2. **Adapte-le si besoin** (chemins de fichiers spécifiques à ton repo)
3. **Copie tout le bloc entre les marqueurs `---PROMPT---`**
4. **Colle dans Claude Code**
5. **Suis le plan étape par étape**, valide quand le prompt demande validation
6. **Marque comme ✅ dans le master** quand terminé

---

## ⚠️ Règles d'or pour TOUS les prompts H0

- **Ne pas enchaîner les S sans validation utilisateur entre chaque**
- **Toujours `npx tsc --noEmit` avant chaque commit**
- **Commits séparés par sous-étape** (jamais 2 features dans 1 commit)
- **Tester en local** avant de push
- **Vérifier Vercel build OK** après chaque push

---

# 🔴 PROMPT S0.1 — Fix bug XP DÉFINITIF

**Priorité : ABSOLUE. Bloquant pour tout le reste.**

**Avant de lancer** : ferme Supabase si la traduction du navigateur est active dessus (les mots-clés SQL doivent rester en anglais).

---PROMPT---

CONTEXTE — Bug XP critique non résolu

Je travaille sur FishDex, une app Next.js 15 + Supabase. Le système XP est en panne :
- xp_events s'enregistrent correctement (xp_amount > 0, types variés : Capture, photo_added, mission_completed)
- MAIS user_xp.total_xp reste à zéro
- L'UI affiche "Niveau 1 - 0 XP" toujours

Plusieurs tentatives de fix ont échoué dans le passé. Je veux un fix DÉFINITIF, pas un patch.

TA MISSION — Suis ce processus RIGOUREUSEMENT, étape par étape, en validant avec moi aux moments critiques.

═══════════════════════════════════════════
ÉTAPE 1 — DIAGNOSTIC EXHAUSTIF (lecture seule, pas de code)
═══════════════════════════════════════════

Lis et analyse en profondeur :
- supabase/migrations/*.sql (TOUTES les migrations liées à XP, user_xp, xp_events)
- src/lib/xp/award.ts (logique d'attribution XP)
- src/lib/xp/calculator.ts (formules XP/level)
- src/app/actions/catches.ts (création prise + déclenchement XP)
- src/app/actions/xp.ts (si existe)
- src/lib/missions/*.ts (logique missions)
- Tout autre fichier qui touche à user_xp ou xp_events

Réponds aux questions suivantes :
1. Existe-t-il un trigger PostgreSQL sur xp_events qui devrait updater user_xp ?
2. Si NON, le code TypeScript fait-il INSERT xp_events PUIS UPDATE user_xp ?
3. Si OUI à 2, pourquoi l'UPDATE user_xp échoue-t-il silencieusement ?
4. Les missions UPDATE user_missions correctement. Donc on cherche pourquoi UNIQUEMENT user_xp ne se met pas à jour.
5. Y a-t-il une RLS policy qui bloque l'UPDATE user_xp côté serveur ?

═══════════════════════════════════════════
ÉTAPE 2 — RAPPORT DIAGNOSTIC + VALIDATION USER
═══════════════════════════════════════════

Présente-moi un rapport structuré contenant :

A) LOCALISATION EXACTE du bug
   (fichier + ligne(s) où ça casse)

B) CAUSE RACINE identifiée parmi ces 5 hypothèses :
   - HYPOTHÈSE 1 : Aucun trigger PG, le code TS oublie l'UPDATE user_xp
   - HYPOTHÈSE 2 : Trigger PG existe mais erreur syntaxe ou permissions
   - HYPOTHÈSE 3 : RLS bloque silencieusement l'UPDATE user_xp
   - HYPOTHÈSE 4 : Race condition / try-catch silencieux dans le code
   - HYPOTHÈSE 5 : Autre — détaille précisément

C) SOLUTION PROPOSÉE parmi 3 approches :
   - APPROCHE A : Trigger PostgreSQL sur xp_events (auto-update user_xp)
   - APPROCHE B : Server Action TypeScript avec transaction
   - APPROCHE C : RPC PostgreSQL function appelée par le code TS (RECOMMANDÉ : atomique et lisible)

   Quelle approche tu recommandes et POURQUOI ?

ATTENDS MA VALIDATION explicite avant de passer à l'étape 3.

═══════════════════════════════════════════
ÉTAPE 3 — IMPLÉMENTATION DU FIX
═══════════════════════════════════════════

Après ma validation, implémente la solution choisie avec ces principes :

1. Crée une fonction SQL helper RÉUTILISABLE :

CREATE OR REPLACE FUNCTION public.level_from_xp(xp INTEGER)
RETURNS INTEGER AS $$
  SELECT GREATEST(1, FLOOR(1 + SQRT(GREATEST(0, xp)::numeric / 100))::integer);
$$ LANGUAGE SQL IMMUTABLE;

2. Le fix doit être :
   - ATOMIQUE (xp_events INSERT + user_xp UPDATE = même transaction)
   - IDEMPOTENT (pas de double comptage si appelé 2x)
   - AVEC RECALCUL du level via level_from_xp() après chaque update total_xp

3. Pas de try-catch silencieux. Si erreur → faire remonter.

4. Documente le fix dans un commentaire SQL/TS au-dessus du code.

═══════════════════════════════════════════
ÉTAPE 4 — SCRIPT DE RATTRAPAGE
═══════════════════════════════════════════

Génère un fichier SQL `supabase/scripts/recalc_xp.sql` avec exactement ce contenu (à copier dans Supabase SQL Editor) :

-- SCRIPT DE RATTRAPAGE — Recalcule total_xp + level pour tous les users
-- À lancer UNE SEULE FOIS dans Supabase SQL Editor

-- 1. Update users qui ont déjà une ligne user_xp
UPDATE public.user_xp u
SET
  total_xp = COALESCE((
    SELECT SUM(xp_amount)
    FROM public.xp_events
    WHERE user_id = u.user_id
  ), 0),
  level = public.level_from_xp(COALESCE((
    SELECT SUM(xp_amount)
    FROM public.xp_events
    WHERE user_id = u.user_id
  ), 0)),
  updated_at = NOW();

-- 2. Insert lignes manquantes pour users avec events orphelins
INSERT INTO public.user_xp (user_id, total_xp, level, updated_at)
SELECT
  e.user_id,
  SUM(e.xp_amount) AS total_xp,
  public.level_from_xp(SUM(e.xp_amount)) AS level,
  NOW()
FROM public.xp_events e
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_xp x WHERE x.user_id = e.user_id
)
GROUP BY e.user_id;

-- 3. Vérification finale : doit retourner 0 lignes
SELECT
  u.user_id,
  u.total_xp AS xp_dans_user_xp,
  COALESCE(SUM(e.xp_amount), 0) AS xp_dans_events,
  u.total_xp - COALESCE(SUM(e.xp_amount), 0) AS delta
FROM public.user_xp u
LEFT JOIN public.xp_events e ON e.user_id = u.user_id
GROUP BY u.user_id, u.total_xp
HAVING u.total_xp != COALESCE(SUM(e.xp_amount), 0);

═══════════════════════════════════════════
ÉTAPE 5 — TESTS OBLIGATOIRES (5 scénarios)
═══════════════════════════════════════════

Une fois le fix appliqué + script de rattrapage exécuté, vérifie :

TEST 1 : Cohérence globale
  → SELECT du script de rattrapage doit retourner 0 lignes

TEST 2 : Nouvelle prise commune sans photo
  → Créer une prise via l'app
  → Vérifier xp_events : +10 XP attendu (selon balance actuelle)
  → Vérifier user_xp.total_xp : a augmenté de +10

TEST 3 : Nouvelle prise rare avec photo
  → Créer une prise rare avec photo
  → Vérifier xp_events : +25 (rare) + 5 (photo) = +30 XP
  → Vérifier user_xp.total_xp : a augmenté de +30

TEST 4 : Nouvelle espèce (première découverte)
  → Capturer une espèce jamais capturée
  → Vérifier xp_events : bonus première espèce (+50 typiquement)
  → Vérifier user_xp.total_xp : reflète le bonus

TEST 5 : Recalcul du level
  → Si un user passe de 95 → 105 XP
  → Vérifier user_xp.level : passe de 1 à 2 (seuil 100 XP)

═══════════════════════════════════════════
ÉTAPE 6 — COMMIT
═══════════════════════════════════════════

1. `npx tsc --noEmit` → doit passer sans erreur
2. `npm run dev` → vérifier visuellement que l'app tourne
3. Commit unique avec message :
   "fix(xp): user_xp se met à jour atomiquement après chaque action"

═══════════════════════════════════════════
RÈGLES STRICTES
═══════════════════════════════════════════

⚠️ NE PAS toucher au système streak (current_streak, longest_streak)
⚠️ NE PAS modifier les xp_events existants (juste les recalculer côté user_xp)
⚠️ NE PAS faire de fix rapide sans cause racine identifiée
⚠️ Si tu hésites entre 2 approches → STOP et demande-moi
⚠️ Toujours respecter l'idempotence (peut-on relancer la fonction 2x sans bug ?)

Commence par l'ÉTAPE 1. Quand tu as fait l'audit, présente-moi le rapport de l'ÉTAPE 2 et ATTENDS ma validation avant d'écrire du code.

---PROMPT---

---

# 🔴 PROMPT S0.2 — Audit sécurité Supabase

**À lancer SEULEMENT après que S0.1 (fix XP) soit validé et testé.**

**Préalable manuel (à faire AVANT le prompt)** :
1. Dashboard Supabase → Project Settings → API → Regenerate "service_role" key
2. Mettre à jour `.env.local`
3. Sur Vercel : Settings → Environment Variables → modifier `SUPABASE_SERVICE_ROLE_KEY`
4. Redéployer Vercel

---PROMPT---

CONTEXTE — Audit sécurité Supabase

J'ai déjà régénéré la service_role key manuellement et propagé sur Vercel. Maintenant je veux un audit complet des RLS policies pour identifier d'éventuels trous.

═══════════════════════════════════════════
ÉTAPE 1 — INVENTAIRE DES TABLES + RLS
═══════════════════════════════════════════

Demande-moi d'exécuter ces requêtes dans Supabase SQL Editor et donne-moi le résultat :

1) Liste des tables avec RLS activé :
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

2) Liste de toutes les policies :
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

3) Policies dangereuses (où qual = 'true' = accès non restreint) :
SELECT *
FROM pg_policies
WHERE schemaname = 'public' AND qual = 'true';

ATTENDS que je te donne les résultats.

═══════════════════════════════════════════
ÉTAPE 2 — ANALYSE + RAPPORT
═══════════════════════════════════════════

Une fois les résultats reçus, analyse selon ces critères de sécurité attendus :

| Table | Lecture | Écriture/Update/Delete |
|---|---|---|
| profiles | tous (profils publics) | owner only |
| catches | owner + autres si is_public=TRUE | owner only |
| xp_events | owner only | service_role only (jamais le user) |
| user_xp | owner only (lecture) | service_role/trigger only |
| user_missions | owner only | service_role/trigger only |
| missions | tous (lecture pool) | service_role only |
| badges | tous (lecture pool) | service_role only |
| user_badges | owner only | service_role only |
| species | tous (lecture publique) | service_role only |
| sessions (futur) | owner only | owner only avec contrainte editable_until |
| spots (futur) | owner only | owner only |

Pour chaque table, identifie :
- ✅ Policies correctes
- ⚠️ Policies à ajuster (donne la correction SQL)
- ❌ Trous de sécurité (donne le fix SQL)

═══════════════════════════════════════════
ÉTAPE 3 — VALIDATION USER
═══════════════════════════════════════════

Présente-moi le rapport sous forme de table claire et ATTENDS ma validation avant de proposer des migrations.

═══════════════════════════════════════════
ÉTAPE 4 — MIGRATION DE FIX (si nécessaire)
═══════════════════════════════════════════

Si trous identifiés :
1. Crée une migration `supabase/migrations/[timestamp]_security_rls_fixes.sql`
2. Les DROP POLICY + CREATE POLICY ciblés pour chaque correction
3. Ne touche pas aux policies déjà correctes

═══════════════════════════════════════════
ÉTAPE 5 — COMMIT
═══════════════════════════════════════════

Commit unique avec message :
"security: regenerate service_role key + audit and fix RLS policies"

Commence par l'ÉTAPE 1 (génère les requêtes SQL à me copier-coller dans Supabase).

---PROMPT---

---

# 🟢 PROMPT S0.3 — Nettoyage code mort

**Plus simple que S0.1 et S0.2, format compact.**

---PROMPT---

CONTEXTE — Nettoyage des composants abandonnés

Le projet contient du code mort de Phases 1 et 2 abandonnées. Mission : identifier + supprimer SANS rien casser.

ÉTAPE 1 — IDENTIFICATION
Liste les dossiers/fichiers candidats à la suppression :
- src/components/spot/ (Phase 1 abandonnée)
- src/components/fishdex/ (Phase 2 abandonnée)
- Toute autre route/composant orphelin que tu détectes (cherche dans src/app et src/components)

ÉTAPE 2 — VÉRIFICATION DES IMPORTS
Pour CHAQUE fichier candidat, lance un grep des imports :
grep -r "from '@/components/spot" src/
grep -r "from '@/components/fishdex" src/

Si UN SEUL import trouvé → ne pas supprimer, signale-le.

ÉTAPE 3 — DÉPENDANCES NPM
Lance `npx depcheck` et liste les packages NPM non utilisés (à candidate à suppression de package.json).

ÉTAPE 4 — RAPPORT + VALIDATION
Présente-moi :
- Liste des fichiers à supprimer (confirmés sans imports)
- Liste des packages NPM à retirer
ATTENDS ma validation avant de supprimer.

ÉTAPE 5 — SUPPRESSION
- Supprime les fichiers validés
- npm uninstall des packages validés
- `npx tsc --noEmit` doit passer
- `npm run dev` doit démarrer sans erreur

ÉTAPE 6 — COMMIT
"refactor: remove abandoned Phase 1/2 components and unused deps"

⚠️ En cas de doute sur UN SEUL fichier → ne supprime PAS, demande-moi.

---PROMPT---

---

# 🟢 PROMPT S0.4 — Création ARCHITECTURE.md

**Documentaire pur, pas de code.**

---PROMPT---

CONTEXTE — Création documentation architecture

Je veux un fichier ARCHITECTURE.md à la racine du repo qui serve de référence pour comprendre le projet rapidement.

GÉNÈRE le fichier ARCHITECTURE.md avec ces sections (markdown propre, pas de bullet points anarchiques) :

1. # FishDex — Architecture technique

2. ## Stack
   Liste : Next.js 15 (App Router) + TS + Tailwind, Supabase, Vercel, etc.

3. ## Structure des dossiers
   Arbre détaillé de src/ avec 1 phrase explicative par dossier important

4. ## Routes principales
   Table avec colonnes : Route | Fichier | Description | État (Done/En cours/À venir)

5. ## Composants par page
   Pour chaque grande page (Home/FishDex/Aquarium/Sessions/Profil) :
   - Composants utilisés
   - Server Actions appelées
   - Tables BDD consommées

6. ## Server Actions disponibles
   Liste toutes les Server Actions par fichier (catches.ts, profile.ts, xp.ts, etc.) avec signature

7. ## Tables BDD avec relations
   Schéma textuel des tables principales + relations (FK)

8. ## Variables d'environnement
   Liste les ENV vars requises (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, etc.)
   Sans donner les valeurs.

9. ## Conventions de code
   - File naming
   - Commits conventionnels (feat:, fix:, refactor:, docs:)
   - Branches Git
   - Tests manuels

10. ## Décisions architecturales clés
    - Pourquoi Server Components par défaut
    - Pourquoi Supabase RLS au lieu de checks manuels
    - Pourquoi pas d'ORM (Drizzle/Prisma)

INSTRUCTIONS :
1. Lis la codebase actuelle pour produire un doc EXACT (pas inventé)
2. Crée le fichier `ARCHITECTURE.md` à la racine du repo
3. Commit : "docs: add ARCHITECTURE.md with current project state"

⚠️ Ne pas inventer de composants/routes/tables qui n'existent pas
⚠️ Si tu n'es pas sûr → marquer "À VÉRIFIER" plutôt que d'inventer

---PROMPT---

---

# ✅ CHECKLIST FINALE H0 — avant de passer à H1

Cocher quand validé :

- [ ] **S0.1 — Fix XP** : DÉFINITIF, 5 tests passés, commit poussé
- [ ] **S0.2 — Sécurité** : service_role régénérée, RLS auditées + fixées
- [ ] **S0.3 — Nettoyage** : code mort supprimé, deps inutiles retirées
- [ ] **S0.4 — Doc** : ARCHITECTURE.md créé et à jour
- [ ] `npx tsc --noEmit` : passe sans erreur
- [ ] Build Vercel : OK
- [ ] App tourne en prod : https://fish-dex-six.vercel.app

⚠️ **Tant qu'un seul item est KO, NE PAS passer à H1.**

Bonne stabilisation. 🔧
