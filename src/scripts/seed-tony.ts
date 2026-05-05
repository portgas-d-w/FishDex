// src/scripts/seed-tony.ts
// Crée l'utilisateur démo TonyDemo avec les 57 espèces du FishDex débloquées.
// Usage : npx tsx src/scripts/seed-tony.ts

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL         = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY     = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌  NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local')
  process.exit(1)
}

// ── Config Tony ───────────────────────────────────────────────────────────────
const TONY = {
  email:    'tony@fishdex.demo',
  password: 'TonyDemo2025!',
  username: 'TonyDemo',
  bio:      'Pêcheur passionné depuis 15 ans 🎣',
}

const SPOTS = [
  'Lac du Bourget', 'Étang des Pins',   'Rivière Loue',
  'Lac Léman',       'Étang du Lotus',   'Rivière Sarthe',
  "Lac d'Annecy",    'Bassin du Parc',   'Étang Privé',
  'Rivière Allier',
]

const NOTES = [
  'Belle prise !',             'Combat intense !',        'Première de la saison',
  'Au lever du soleil',        'Sur appât naturel',       'Prise inattendue',
  'Superbe spécimen',          'Relâché avec soin',       'Spot parfait',
  'Conditions idéales',        'Un vrai plaisir !',       'Record personnel !',
  'Une belle journée de pêche','Le soleil était avec moi','Technique parfaite',
]

const XP_BY_RARITY: Record<string, number> = {
  commun: 10, peu_commun: 15, rare: 25, epique: 60, legendaire: 150, shiny: 500,
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function pick<T>(arr: T[], i: number): T { return arr[i % arr.length] }

function randomDate(): string {
  const now       = Date.now()
  const sixMonths = now - 180 * 24 * 60 * 60 * 1000
  return new Date(sixMonths + Math.random() * (now - sixMonths)).toISOString().split('T')[0]
}

function realisticWeight(max: number | null): number | null {
  if (!max || max <= 0) return null
  return parseFloat((max * 0.1 + Math.random() * max * 0.8).toFixed(3))
}

function realisticSize(max: number | null, min: number | null): number | null {
  if (!max) return null
  const lo = min ?? max * 0.3
  return parseFloat((lo + Math.random() * (max - lo)).toFixed(1))
}

function calcLevel(xp: number): number {
  return Math.max(1, Math.floor(1 + Math.sqrt(Math.max(0, xp) / 100)))
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // 1. Créer ou récupérer TonyDemo ─────────────────────────────────────────────
  console.log('\n🔍  Vérification de TonyDemo...')
  const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  let tony = users.find(u => u.email === TONY.email)

  if (!tony) {
    console.log('👤  Création de TonyDemo...')
    const { data, error } = await supabase.auth.admin.createUser({
      email:         TONY.email,
      password:      TONY.password,
      email_confirm: true,
      user_metadata: { username: TONY.username },
    })
    if (error || !data.user) throw new Error(`Création user échouée: ${error?.message}`)
    tony = data.user

    // Le trigger handle_new_user crée le profil — on complète bio + onboarding
    await supabase.from('profiles')
      .update({ bio: TONY.bio, username: TONY.username })
      .eq('id', tony.id)

    // onboarding_completed si la colonne existe (phase 9)
    await supabase.from('profiles')
      .update({ onboarding_completed: true } as Record<string, unknown>)
      .eq('id', tony.id)

    console.log(`✅  TonyDemo créé (id: ${tony.id})`)
  } else {
    console.log(`ℹ️   TonyDemo existe déjà (id: ${tony.id})`)
  }

  // 2. Idempotence : arrêt si 57 prises déjà présentes ────────────────────────
  const { count: existingCount } = await supabase
    .from('catches')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', tony.id)

  if ((existingCount ?? 0) >= 57) {
    console.log(`ℹ️   TonyDemo a déjà ${existingCount} prises — rien à faire.\n`)
    process.exit(0)
  }

  // 3. Récupérer toutes les espèces ────────────────────────────────────────────
  console.log('🐟  Récupération des espèces...')
  const { data: species, error: spErr } = await supabase
    .from('species')
    .select('id, nom_fr, rarete, taille_max_cm, taille_min_cm, poids_max_kg')
    .order('numero_dex', { ascending: true })

  if (spErr || !species?.length) throw new Error(`Espèces: ${spErr?.message ?? 'aucune espèce trouvée'}`)
  console.log(`✅  ${species.length} espèces récupérées`)

  // 4. Insérer les catches ──────────────────────────────────────────────────────
  console.log('🎣  Insertion des prises...')
  const catchRows = species.map((sp, i) => ({
    user_id:      tony!.id,
    species_id:   sp.id,
    date_capture: randomDate(),
    lieu:         pick(SPOTS, i),
    poids_kg:     realisticWeight(sp.poids_max_kg),
    taille_cm:    realisticSize(sp.taille_max_cm, sp.taille_min_cm),
    notes:        pick(NOTES, i),
    photo_url:    null,
    is_public:    true,
  }))

  const { data: inserted, error: catchErr } = await supabase
    .from('catches')
    .insert(catchRows)
    .select('id')

  if (catchErr || !inserted) throw new Error(`Catches: ${catchErr?.message}`)
  console.log(`✅  ${inserted.length} prises insérées`)

  // 5. Insérer les xp_events ───────────────────────────────────────────────────
  console.log('⚡  Calcul et insertion des XP events...')
  let totalXp = 0

  const xpRows = species.flatMap((sp, i) => {
    const base      = XP_BY_RARITY[sp.rarete ?? 'commun'] ?? 10
    const spotBonus = i < 10 ? 20 : 0   // 10 spots distincts → bonus new_spot
    totalXp += base + 50 + spotBonus

    const rows: {
      user_id: string; catch_id: string
      event_type: string; xp_amount: number; metadata: Record<string, unknown> | null
    }[] = [
      {
        user_id:    tony!.id,
        catch_id:   inserted[i].id,
        event_type: 'capture',
        xp_amount:  base,
        metadata:   { rarete: sp.rarete },
      },
      {
        user_id:    tony!.id,
        catch_id:   inserted[i].id,
        event_type: 'first_discovery',
        xp_amount:  50,
        metadata:   null,
      },
    ]

    if (i < 10) {
      rows.push({
        user_id:    tony!.id,
        catch_id:   inserted[i].id,
        event_type: 'new_spot',
        xp_amount:  20,
        metadata:   { lieu: pick(SPOTS, i) },
      })
    }

    return rows
  })

  const { error: xpEvErr } = await supabase.from('xp_events').insert(xpRows)
  if (xpEvErr) console.warn(`⚠️   xp_events: ${xpEvErr.message}`)
  else console.log(`✅  ${xpRows.length} xp_events insérés`)

  // 6. Mettre à jour user_xp via la fonction RPC SECURITY DEFINER ──────────────
  console.log('🏆  Mise à jour user_xp...')
  const level = calcLevel(totalXp)

  const { error: rpcErr } = await supabase.rpc('upsert_user_xp', {
    p_user_id:           tony.id,
    p_total_xp:          totalXp,
    p_level:             level,
    p_current_streak:    15,
    p_longest_streak:    30,
    p_last_capture_date: new Date().toISOString().split('T')[0],
    p_joker_used_week:   null,
  })
  if (rpcErr) console.warn(`⚠️   upsert_user_xp RPC: ${rpcErr.message}`)
  else console.log(`✅  user_xp mis à jour`)

  // 7. Récap ────────────────────────────────────────────────────────────────────
  const line = '═'.repeat(41)
  console.log(`\n╔${line}╗`)
  console.log(`║    🎉  TonyDemo créé avec succès !       ║`)
  console.log(`╠${line}╣`)
  console.log(`║  📧  Email    : ${TONY.email.padEnd(25)}║`)
  console.log(`║  🔑  Password : ${TONY.password.padEnd(25)}║`)
  console.log(`║  ⚡  XP total : ${String(totalXp).padEnd(25)}║`)
  console.log(`║  🏆  Niveau   : ${String(level).padEnd(25)}║`)
  console.log(`║  🐟  Espèces  : ${String(inserted.length).padEnd(25)}║`)
  console.log(`╚${line}╝\n`)
}

main().catch(e => { console.error('\n❌ ', e.message ?? e); process.exit(1) })
