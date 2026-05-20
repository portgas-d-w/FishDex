import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ChevronLeft, MapPin, Fish, Lock, Camera, Sun, Snowflake, Wind,
  Cloud, Trophy, Thermometer, Lightbulb, Scale, Feather,
  Anchor, Zap, Clock, Layers, Plus, Ruler, Utensils, Timer,
} from 'lucide-react'
import { getRareteConfig } from '@/lib/fishdex/rarete'
import { SpeciesPlaceholder } from '@/components/species/SpeciesPlaceholder'

// ── Types ─────────────────────────────────────────────────────────────────────

type TechniqueRecommandee = {
  nom: string
  animation?: string
  difficulte?: number
  efficacite?: number
  profondeur_optimale?: string
}

type ConditionsIdeales = {
  vent?: string
  meteo?: string
  profondeur?: string
  moment_jour?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const regimeLabels: Record<string, string> = {
  carnivore: 'Carnivore',
  omnivore:  'Omnivore',
  herbivore: 'Herbivore',
}
const regimeSubtitles: Record<string, string> = {
  carnivore: 'insectes, larves, crustacés',
  omnivore:  'végétaux, invertébrés',
  herbivore: 'algues, végétaux aquatiques',
}
const eauLabels: Record<string, string> = {
  douce:    'Eau douce',
  salee:    'Eau salée',
  saumatre: 'Eau saumâtre',
}
const profondeurEnumLabels: Record<string, string> = {
  surface: 'Surface',
  moyenne: 'Eaux moyennes',
  fond:    'Fond',
}
const habitatDescriptions: Record<string, string> = {
  riviere:  "Rivières et torrents d'eau claire et vive, bien oxygénées, fond graveleux.",
  torrent:  "Torrents de montagne à courant rapide et eau très froide.",
  lac:      "Lacs et plans d'eau, zones profondes et eaux tempérées.",
  etang:    "Étangs et eaux stagnantes, fond vaseux, végétation abondante.",
  canal:    "Canaux et cours d'eau lents, eaux riches en matières organiques.",
  estuaire: "Estuaires et zones de transition eau douce / salée.",
  mer:      "Eaux côtières et fonds marins, milieu salé.",
  vase:     "Fonds vaseux et eaux lentes à végétation dense.",
  sable:    "Fonds sableux et eaux ouvertes.",
  rocheuse: "Zones rocheuses, herbiers et récifs sous-marins.",
  herbier:  "Herbiers aquatiques et zones de végétation immergée.",
}

function getHabitatDesc(tags: string[], eau: string | null): string {
  const sentences = tags.map(t => habitatDescriptions[t]).filter(Boolean)
  if (sentences.length) return sentences.join(' ')
  if (eau === 'salee')    return "Eaux salées côtières et milieu marin."
  if (eau === 'saumatre') return "Eaux saumâtres et zones de transition."
  return "Eaux douces continentales."
}

// Filtre la phrase "taille légale" du texte réglementaire pour éviter le doublon
function filterStatutText(text: string): string {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter(s => !s.toLowerCase().includes('taille légale') && !s.toLowerCase().includes('taille legale'))
    .join(' ')
    .trim()
}

function getRareteStyle(rarete: string | null): { bg: string; color: string; label: string } {
  switch (rarete) {
    case 'commun':     return { bg: '#065f46', color: '#6ee7b7', label: 'Commun ✦' }
    case 'peu commun': return { bg: '#0f5142', color: '#5eead4', label: 'Peu commun ✦' }
    case 'rare':       return { bg: '#1e3a5f', color: '#60a5fa', label: 'Rare ⭐' }
    case 'epique':     return { bg: '#581c87', color: '#d8b4fe', label: 'Épique ⭐' }
    case 'legendaire': return { bg: '#78350f', color: '#fcd34d', label: 'Légendaire ⭐' }
    case 'mirage':     return { bg: '#831843', color: '#fbcfe8', label: 'Mirage ✨' }
    default:           return { bg: '#065f46', color: '#6ee7b7', label: 'Commun ✦' }
  }
}

function formatProfondeur(p: string | null | undefined): string {
  if (!p) return '—'
  return profondeurEnumLabels[p] ?? p
}
function formatTaille(min: number | null, max: number | null): string {
  if (min && max && min !== max) return `${min}–${max} cm`
  if (max) return `${max} cm`
  if (min) return `${min} cm`
  return '—'
}
function formatDateLong(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
function formatTag(tag: string) {
  return tag.charAt(0).toUpperCase() + tag.slice(1).replace(/_/g, ' ')
}
function parseSaisonActive(s: string | null): { main: string; sub: string | null } {
  if (!s) return { main: '—', sub: null }
  const idx = s.indexOf('(')
  if (idx === -1) return { main: s.trim(), sub: null }
  return {
    main: s.slice(0, idx).trim(),
    sub:  s.slice(idx + 1).replace(/\)$/, '').trim(),
  }
}

// ── Constants ─────────────────────────────────────────────────────────────────

const RARITY_GLOW: Record<string, string> = {
  commun:       'rgba(52,211,153,0.14)',
  'peu commun': 'rgba(45,212,191,0.14)',
  rare:         'rgba(96,165,250,0.15)',
  epique:       'rgba(168,85,247,0.22)',
  legendaire:   'rgba(251,191,36,0.24)',
  mirage:       'rgba(244,114,182,0.26)',
}

const COLLECTION_BG: Record<string, string> = {
  predateurs:   '/backgrounds/hero-predateurs.png',
  'eaux-vives': '/backgrounds/hero-eaux-vives.png',
  paisibles:    '/backgrounds/hero-paisibles.png',
}

const COLLECTION_THUMB_BG: Record<string, string> = {
  predateurs:   '/backgrounds/card-predateurs.png',
  'eaux-vives': '/backgrounds/card-eaux-vives.png',
  paisibles:    '/backgrounds/card-paisibles.png',
}

const TECHNIQUE_IMAGES: Record<string, string> = {
  'mouche sèche':  '/techniques/mouche-seche.png',
  'mouche seche':  '/techniques/mouche-seche.png',
  'nymphe':        '/techniques/nymphe-fil.png',
  'mouche noyée':  '/techniques/mouche-noyee.png',
  'mouche noyee':  '/techniques/mouche-noyee.png',
  'feeder':        '/techniques/feeder-cheveu.png',
  'cheveu':        '/techniques/feeder-cheveu.png',
  'jerkbait':      '/techniques/jerkbait.png',
  'jekbait':       '/techniques/jerkbait.png',
  'spinnerbait':   '/techniques/spinnerbait.png',
  'swimbait':      '/techniques/swimbait.png',
  'au vif':        '/techniques/vif.png',
  'stalking':      '/techniques/stalking.png',
  'grande canne':  '/techniques/grande-canne.png',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function SpeciesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase  = await createClient()

  const { data: species, error } = await supabase
    .from('species')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !species) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: speciesCollections } = await supabase
    .from('species_collections')
    .select('collection:collections(slug)')
    .eq('species_id', species.id)

  let catchCount    = 0
  let recentCatches: {
    id: string; photo_url: string | null
    poids_kg: number | null; taille_cm: number | null
    date_capture: string | null; lieu: string | null
  }[] = []
  let bestCatch: {
    poids_kg: number | null; taille_cm: number | null
    date_capture: string | null; lieu: string | null
  } | null = null

  if (user) {
    const [recentRes, bestRes, countRes] = await Promise.all([
      supabase
        .from('catches')
        .select('id, photo_url, poids_kg, taille_cm, date_capture, lieu')
        .eq('species_id', species.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6),
      supabase
        .from('catches')
        .select('poids_kg, taille_cm, date_capture, lieu')
        .eq('species_id', species.id)
        .eq('user_id', user.id)
        .order('poids_kg', { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('catches')
        .select('id', { count: 'exact', head: true })
        .eq('species_id', species.id)
        .eq('user_id', user.id),
    ])
    recentCatches = (recentRes.data ?? []) as typeof recentCatches
    bestCatch     = bestRes.data
    catchCount    = countRes.count ?? 0
  }

  const isDiscovered  = catchCount > 0
  const cfg           = getRareteConfig(species.rarete)
  const badgeStyle    = getRareteStyle(species.rarete)
  const dexNum        = String(species.numero_dex ?? 0).padStart(3, '0')
  const isMirage      = species.rarete === 'mirage'

  const colSlugs = (
    (speciesCollections as { collection: { slug: string } | null }[] | null) ?? []
  ).map(sc => sc.collection?.slug).filter(Boolean) as string[]

  const heroBg = colSlugs.reduce<string>(
    (bg, s) => COLLECTION_BG[s] ?? bg,
    '/backgrounds/species-aquatic.webp',
  )

  const thumbBg = colSlugs.reduce<string>(
    (bg, s) => COLLECTION_THUMB_BG[s] ?? bg,
    heroBg,
  )

  const techniquesJson = (species.techniques_recommandees ?? []) as TechniqueRecommandee[]
  const conditionsJson = (species.conditions_ideales ?? null) as ConditionsIdeales | null
  const saisonParsed   = parseSaisonActive(species.saison_active as string | null)
  const habitatTags    = (species.habitat as string[] | null) ?? []
  const habitatDesc    = getHabitatDesc(habitatTags, species.eau)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  function catchPhotoUrl(path: string | null): string | null {
    if (!path) return null
    return `${supabaseUrl}/storage/v1/object/public/catches/${path}`
  }

  // Stats à afficher dans le bloc unifié
  type StatItem = { icon: React.ReactNode; label: string; value: string; sub?: string }
  const statItems: StatItem[] = [
    {
      icon:  <Ruler size={16} className="text-[#4ecdc4]" />,
      label: 'TAILLE MAX',
      value: formatTaille(species.taille_min_cm, species.taille_max_cm),
      sub:   species.taille_moyenne_cm ? `moy. ${species.taille_moyenne_cm} cm` : undefined,
    },
    {
      icon:  <Scale size={16} className="text-[#4ecdc4]" />,
      label: 'POIDS MAX',
      value: species.poids_max_kg ? `${species.poids_max_kg} kg` : '—',
      sub:   species.poids_moyen_kg
               ? `moy. ${Number(species.poids_moyen_kg).toFixed(1).replace('.', ',')} kg`
               : undefined,
    },
    {
      icon:  <Utensils size={16} className="text-[#4ecdc4]" />,
      label: 'RÉGIME',
      value: regimeLabels[species.regime ?? ''] ?? (species.regime ?? '—'),
      sub:   regimeSubtitles[species.regime ?? ''],
    },
  ]
  if (species.longevite_annees) {
    statItems.push({
      icon: <Timer size={16} className="text-[#4ecdc4]" />, label: 'LONGÉVITÉ', value: species.longevite_annees,
    })
  }
  if (species.profondeur) {
    statItems.push({
      icon: <Layers size={16} className="text-[#4ecdc4]" />, label: 'PROFONDEUR', value: formatProfondeur(species.profondeur),
    })
  }

  return (
    <div className="min-h-screen bg-[#0a1628] pb-28">

      {/* ── HERO + IDENTITÉ INTÉGRÉE ─────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: '55vh', minHeight: '340px' }}>

        {/* 1. Base sombre */}
        <div className="absolute inset-0 bg-[#050c18]" />

        {/* 2. Background collection — bien visible */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})`, opacity: 0.65 }}
        />

        {/* 3. Voile léger — préserve les couleurs de la collection */}
        <div className="absolute inset-0" style={{ background: 'rgba(5,12,25,0.22)' }} />

        {/* 4. Fondu bas — amène au fond de contenu */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: '70%',
            background:
              'linear-gradient(to bottom,' +
              'transparent 0%,' +
              'rgba(5,12,25,0.60) 48%,' +
              '#0a1628 78%)',
          }}
        />

        {/* Poisson — 90% de la largeur, centré dans la moitié haute */}
        <div className="absolute inset-x-0 top-0" style={{ bottom: '32%' }}>
          {species.image_url ? (
            <Image
              src={species.image_url}
              alt={species.nom_fr}
              fill
              priority
              sizes="100vw"
              className={`object-contain drop-shadow-[0_8px_48px_rgba(0,0,0,0.90)] transition-all duration-500 ${
                isDiscovered ? 'opacity-100' : 'brightness-0 opacity-8'
              }`}
              style={{ padding: '12px 5% 0' }}
            />
          ) : (
            <SpeciesPlaceholder rarete={species.rarete} className="absolute inset-0" />
          )}
        </div>

        {/* Glow rareté sous le poisson */}
        {isDiscovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 70% 30% at 50% 72%, ${
                RARITY_GLOW[species.rarete ?? 'commun'] ?? RARITY_GLOW.commun
              } 0%, transparent 70%)`,
            }}
          />
        )}

        {isMirage && isDiscovered && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/3 to-transparent animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
        )}

        {/* ── IDENTITÉ — absolue en bas du hero ────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0" style={{ padding: '0 20px 24px' }}>

          {/* 1. Badge rareté + Numéro */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[13px] font-bold px-3 py-0.5 rounded-full"
              style={{ background: badgeStyle.bg, color: badgeStyle.color }}
            >
              {badgeStyle.label}
            </span>
            <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.40)' }}>
              Numéro {dexNum}
            </span>
          </div>

          {/* 2. Nom commun */}
          <h1 className="font-black text-white leading-none tracking-tight mb-1"
            style={{ fontSize: 'clamp(28px, 8vw, 36px)' }}>
            {species.nom_fr}
          </h1>

          {/* 3. Nom scientifique */}
          {species.nom_scientifique && (
            <p className="italic mb-0.5" style={{ fontSize: '14px', color: 'rgba(148,163,184,0.85)' }}>
              {species.nom_scientifique}
            </p>
          )}

          {/* 4. Famille taxonomique */}
          {species.famille && (
            <p className="mb-2" style={{ fontSize: '12px', color: 'rgba(100,116,139,0.85)' }}>
              {species.famille}
            </p>
          )}

          {/* 5. Description — max 3 lignes */}
          {species.description && (
            <p className="leading-relaxed line-clamp-3"
              style={{ fontSize: '13px', color: 'rgba(255,255,255,0.82)' }}>
              {species.description}
            </p>
          )}
        </div>

        {/* Header superposé — haut */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-4">
          <Link
            href="/fishdex"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[rgba(10,22,40,0.55)] border border-white/10 text-white backdrop-blur-sm"
          >
            <ChevronLeft size={18} />
          </Link>
          <span className="font-mono text-[11px] text-white/50 bg-[rgba(10,22,40,0.50)] border border-white/8 px-2.5 py-1 rounded-full backdrop-blur-sm">
            #{dexNum}
          </span>
          <span className="text-[11px] font-semibold text-white/80 bg-[rgba(10,22,40,0.55)] border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            {eauLabels[species.eau ?? ''] ?? 'Eau douce'}
          </span>
        </div>
      </section>

      {/* ── CONTENU ──────────────────────────────────────────────────────── */}
      <div className="px-4 max-w-2xl mx-auto space-y-4 pt-4">

        {/* ── CORRECTION 2 : STATS — UN SEUL BLOC UNIFIÉ ───────────────── */}
        <div
          className="rounded-2xl p-4"
          style={{ background: '#111d2e', border: '1px solid rgba(0,212,255,0.10)' }}
        >
          <div className="flex overflow-x-auto scrollbar-none">
            {statItems.map((stat, i) => (
              <div key={i} className="flex items-stretch flex-1 min-w-0">
                {/* Séparateur vertical — 70% centré */}
                {i > 0 && (
                  <div className="flex items-center px-0 shrink-0">
                    <div className="w-px self-stretch mx-2" style={{ background: 'rgba(255,255,255,0.10)', marginTop: '15%', marginBottom: '15%' }} />
                  </div>
                )}
                {/* Cellule stat */}
                <div className="flex flex-col items-center gap-1.5 flex-1 min-w-[56px] px-1">
                  <div>{stat.icon}</div>
                  <span
                    className="text-center leading-tight uppercase whitespace-nowrap"
                    style={{ fontSize: '10px', color: '#4ecdc4', letterSpacing: '1px', fontWeight: 700 }}
                  >
                    {stat.label}
                  </span>
                  <p className="text-white font-bold text-center leading-none" style={{ fontSize: '20px' }}>
                    {stat.value}
                  </p>
                  {stat.sub && (
                    <p className="text-center leading-tight" style={{ fontSize: '11px', color: '#8899aa' }}>
                      {stat.sub}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HABITAT NATUREL ──────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#111d2e', border: '1px solid rgba(0,212,255,0.08)' }}>
          <div className="flex items-stretch">
            {/* Texte */}
            <div className="flex-1 px-4 py-4 flex flex-col justify-center gap-1.5">
              <div className="flex items-center gap-1.5 mb-1">
                <span style={{ color: '#4ecdc4', opacity: 0.65 }}><MapPin size={11} /></span>
                <p className="font-bold uppercase text-[#4ecdc4]/65" style={{ fontSize: '9px', letterSpacing: '0.12em' }}>
                  HABITAT NATUREL
                </p>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{habitatDesc}</p>
              {species.temperature_eau && (
                <div className="flex items-center gap-1.5 text-[12px] text-white/50 pt-0.5">
                  <Thermometer size={11} className="text-orange-400 shrink-0" />
                  <span>
                    <span className="text-white/75 font-semibold">{species.temperature_eau}</span>
                  </span>
                </div>
              )}
            </div>
            {/* Image panoramique */}
            <div
              className="shrink-0 self-stretch"
              style={{
                width: '42%',
                minHeight: '96px',
                backgroundImage: `url(${thumbBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Fondu gauche pour transition douce */}
              <div className="h-full w-10"
                style={{ background: 'linear-gradient(to right, #111d2e, transparent)' }} />
            </div>
          </div>
        </div>

        {/* ── ACTIVITÉ | CONDITIONS | CONSEIL ──────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">

          {/* ACTIVITÉ */}
          <div className="rounded-2xl p-3" style={{ background: '#111d2e', border: '1px solid rgba(0,212,255,0.08)' }}>
            <CardLabel icon={<Sun size={10} />} label="ACTIVITÉ" />
            <div className="space-y-2.5">
              <div>
                <p style={{ fontSize: '9px', color: '#4ecdc4', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '2px' }}>
                  Saison active
                </p>
                <p className="text-[12px] font-bold text-white leading-tight">{saisonParsed.main}</p>
                {saisonParsed.sub && (
                  <p className="text-[10px] italic mt-0.5" style={{ color: 'rgba(255,255,255,0.32)' }}>
                    {saisonParsed.sub}
                  </p>
                )}
              </div>
              {species.temperature_eau && (
                <div>
                  <p style={{ fontSize: '9px', color: '#4ecdc4', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Temp. eau
                  </p>
                  <p className="text-[12px] font-bold text-white">{species.temperature_eau}</p>
                </div>
              )}
            </div>
          </div>

          {/* CONDITIONS IDÉALES */}
          {conditionsJson ? (
            <div className="rounded-2xl p-3" style={{ background: '#111d2e', border: '1px solid rgba(0,212,255,0.08)' }}>
              <CardLabel icon={<Cloud size={10} />} label="CONDITIONS" />
              <div className="space-y-1.5">
                {conditionsJson.meteo && (
                  <CondLine icon={<Sun size={10} className="text-yellow-400" />} label="Météo" value={conditionsJson.meteo} />
                )}
                {conditionsJson.moment_jour && (
                  <CondLine icon={<Clock size={10} className="text-orange-300" />} label="Moment" value={conditionsJson.moment_jour} />
                )}
                {conditionsJson.profondeur && (
                  <CondLine icon={<Layers size={10} className="text-[#4ecdc4]" />} label="Profondeur" value={conditionsJson.profondeur} />
                )}
                {conditionsJson.vent && (
                  <CondLine icon={<Wind size={10} className="text-sky-300" />} label="Vent" value={conditionsJson.vent} />
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-3 opacity-35" style={{ background: '#111d2e', border: '1px solid rgba(0,212,255,0.08)' }}>
              <CardLabel icon={<Cloud size={10} />} label="CONDITIONS" />
              <p className="text-[10px] text-white/30 italic">À venir</p>
            </div>
          )}

          {/* CONSEIL FISHDEX */}
          {species.conseil_fishdex ? (
            <div
              className="rounded-2xl p-3 relative overflow-hidden"
              style={{ background: 'rgba(240,165,0,0.08)', border: '1px solid rgba(240,165,0,0.20)' }}
            >
              <CardLabel
                icon={<Lightbulb size={10} className="text-[#f0a500]" />}
                label="CONSEIL FISHDEX"
                labelClass="text-[#f0a500]/85"
              />
              <p className="text-[11px] italic leading-relaxed relative z-10 line-clamp-5" style={{ color: 'rgba(255,255,255,0.72)' }}>
                &ldquo;{species.conseil_fishdex}&rdquo;
              </p>
              {/* Plante décorative — cyan */}
              <svg
                width="44" height="48" viewBox="0 0 44 48" fill="none"
                className="absolute bottom-1 right-1 pointer-events-none"
                aria-hidden
              >
                <path d="M22 46 Q22 34 18 24 Q14 14 16 4" stroke="rgba(0,212,255,0.30)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                <path d="M18 24 Q10 20 5 12 Q12 10 18 24" fill="rgba(0,212,255,0.18)"/>
                <path d="M18 24 Q26 18 31 10 Q24 8 18 24" fill="rgba(0,212,255,0.18)"/>
                <path d="M17 13 Q9 8 5 1 Q12 -1 17 13" fill="rgba(0,212,255,0.13)"/>
                <path d="M17 13 Q25 6 29 0 Q22 -2 17 13" fill="rgba(0,212,255,0.13)"/>
                <path d="M20 34 Q14 28 12 23" stroke="rgba(0,212,255,0.22)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                <path d="M12 23 Q5 20 3 14 Q9 13 12 23" fill="rgba(0,212,255,0.13)"/>
              </svg>
            </div>
          ) : (
            <div className="rounded-2xl p-3 opacity-30" style={{ background: '#111d2e', border: '1px solid rgba(0,212,255,0.08)' }}>
              <CardLabel icon={<Lightbulb size={10} className="text-[#f0a500]" />} label="CONSEIL FISHDEX" labelClass="text-[#f0a500]/60" />
            </div>
          )}
        </div>

        {/* ── TECHNIQUES RECOMMANDÉES ──────────────────────────────────── */}
        {techniquesJson.length > 0 && (
          <div className="rounded-2xl overflow-hidden backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div className="px-4 pt-4 pb-1">
              <CardLabel icon={<Fish size={11} />} label="TECHNIQUES RECOMMANDÉES" />
            </div>
            <div>
              {techniquesJson.map((tech, i) => (
                <div key={i}>
                  {i > 0 && <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />}
                  <div className="pr-3 py-0.5 pl-0">
                    <TechniqueRow tech={tech} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback : ancien champ techniques */}
        {techniquesJson.length === 0 && (species.techniques as string[] | null)?.length ? (
          <Card label="TECHNIQUES" icon={<Fish size={11} />}>
            <div className="flex flex-wrap gap-2">
              {(species.techniques as string[]).map((tech: string) => (
                <span key={tech} className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                  style={{ background: 'rgba(0,212,255,0.08)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.20)' }}>
                  {formatTag(tech)}
                </span>
              ))}
            </div>
          </Card>
        ) : null}

        {/* ── VOS CAPTURES + VOTRE RECORD ──────────────────────────────── */}
        {user ? (
          isDiscovered ? (
            <div className="flex gap-3">

              {/* ── CORRECTION 3 : VOS CAPTURES pleine largeur ─────────── */}
              <div className="flex-1 rounded-2xl p-3 min-w-0" style={{ background: '#111d2e', border: '1px solid rgba(0,212,255,0.08)' }}>
                <CardLabel icon={<Fish size={10} />} label={`VOS CAPTURES — ${catchCount}`} />
                {/* Flex pleine largeur — chaque photo prend l'espace dispo */}
                <div className="flex gap-2 overflow-x-auto scrollbar-none">
                  {recentCatches.map((c) => {
                    const img = catchPhotoUrl(c.photo_url)
                    return (
                      <Link key={c.id} href={`/aquarium/${c.id}`}
                        className="relative shrink-0 overflow-hidden"
                        style={{
                          width: '85px', height: '110px',
                          borderRadius: '10px',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                        {img ? (
                          <Image src={img} alt="Capture" fill sizes="85px" className="object-cover" />
                        ) : (
                          /* Placeholder coloré bleu-vert */
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ background: 'linear-gradient(160deg, #0a2a3a 0%, #0d4a5a 100%)' }}
                          >
                            <Fish size={24} className="text-[#00d4ff] opacity-70" />
                          </div>
                        )}
                        {/* Overlay gradient bas */}
                        <div
                          className="absolute inset-x-0 bottom-0 px-1.5 pb-1.5 pt-6"
                          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)' }}
                        >
                          {c.date_capture && (
                            <p className="text-white leading-none" style={{ fontSize: '9px', opacity: 0.85 }}>
                              {formatDateLong(c.date_capture)}
                            </p>
                          )}
                          {c.taille_cm && (
                            <p className="text-white font-semibold leading-tight" style={{ fontSize: '11px' }}>
                              {c.taille_cm} cm
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                  {/* Bouton + Ajouter */}
                  <Link href="/aquarium/nouvelle"
                    className="shrink-0 flex flex-col items-center justify-center gap-1 hover:opacity-80 transition-opacity"
                    style={{
                      width: '80px', height: '110px',
                      borderRadius: '10px',
                      border: '1px dashed rgba(0,212,255,0.40)',
                      background: 'rgba(0,212,255,0.05)',
                    }}>
                    <Plus size={18} style={{ color: '#00d4ff' }} />
                    <span style={{ fontSize: '10px', color: '#00d4ff', fontWeight: 500 }}>Ajouter</span>
                  </Link>
                </div>
              </div>

              {/* VOTRE RECORD */}
              <div className="shrink-0 rounded-2xl p-3 relative overflow-hidden"
                style={{ width: '44%', background: '#111d2e', border: '1px solid rgba(0,212,255,0.08)' }}>
                <CardLabel
                  icon={<Trophy size={10} className="text-amber-400" />}
                  label="VOTRE RECORD"
                  labelClass="text-[#00d4ff]/75"
                />
                {bestCatch ? (
                  <div className="space-y-1.5 relative z-10">
                    {bestCatch.taille_cm != null && (
                      <RecordLine label="TAILLE" value={`${bestCatch.taille_cm} cm`} big />
                    )}
                    {bestCatch.poids_kg != null && (
                      <RecordLine label="POIDS" value={`${bestCatch.poids_kg} kg`} big />
                    )}
                    {bestCatch.date_capture && (
                      <RecordLine label="DATE" value={formatDateLong(bestCatch.date_capture)} />
                    )}
                    {bestCatch.lieu && (
                      <RecordLine label="LIEU" value={bestCatch.lieu} />
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-white/28">Aucun record.</p>
                )}
                {/* Silhouette poisson — 70px, opacity 0.20 */}
                {species.image_url && (
                  <div
                    className="absolute pointer-events-none"
                    style={{ width: '70px', height: '70px', bottom: '-6px', right: '-6px', opacity: 0.20 }}
                  >
                    <Image src={species.image_url} alt="" fill sizes="70px" className="object-contain" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Card label="VOS CAPTURES" icon={<Fish size={11} />}>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{ background: 'rgba(100,116,139,0.2)', border: '1px solid rgba(100,116,139,0.3)', color: '#64748b' }}>
                  <Lock size={11} /> Non découverte
                </span>
              </div>
              <p className="text-[12px] text-white/30 leading-relaxed mb-3">
                Tu n&apos;as pas encore capturé cette espèce.
              </p>
              <Link href="/aquarium/nouvelle"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold"
                style={{ background: 'rgba(0,212,255,0.10)', border: '1px solid rgba(0,212,255,0.22)', color: '#00d4ff' }}>
                <Camera size={13} /> Capturer maintenant
              </Link>
            </Card>
          )
        ) : (
          <Card label="VOS CAPTURES" icon={<Fish size={11} />}>
            <p className="text-[12px] text-white/30 mb-3">Connecte-toi pour suivre tes découvertes.</p>
            <Link href="/login" className="text-[12px] font-semibold" style={{ color: '#00d4ff' }}>
              Se connecter →
            </Link>
          </Card>
        )}

        {/* ── STATUT RÉGLEMENTAIRE ─────────────────────────────────────── */}
        {species.statut_reglementaire && (
          <div className="rounded-2xl p-4" style={{ background: '#111d2e', border: '1px solid rgba(0,212,255,0.08)' }}>
            <CardLabel icon={<Scale size={11} />} label="STATUT RÉGLEMENTAIRE" />
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                {/* Texte réglementaire filtré (sans doublon taille légale) */}
                {(() => {
                  const filtered = filterStatutText(species.statut_reglementaire as string)
                  return filtered ? (
                    <p className="text-[13px] text-white/55 leading-relaxed">{filtered}</p>
                  ) : null
                })()}
                {/* Taille légale en gras — source unique */}
                {species.taille_legale_cm && (
                  <p className="text-[14px] font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    Taille légale : {species.taille_legale_cm} cm minimum
                  </p>
                )}
              </div>
              {/* Tampon réglementaire */}
              <div className="shrink-0 relative" style={{ width: '88px', height: '88px' }}>
                <Image
                  src="/icons/tampon-reglementaire.png"
                  alt="Pêche réglementée en eau douce"
                  fill
                  sizes="88px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Sous-composants ───────────────────────────────────────────────────────────

function Card({ label, icon, children }: {
  label: string; icon?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl p-4" style={{ background: '#111d2e', border: '1px solid rgba(0,212,255,0.08)' }}>
      <CardLabel icon={icon} label={label} />
      {children}
    </div>
  )
}

function CardLabel({ icon, label, labelClass }: {
  icon?: React.ReactNode; label: string; labelClass?: string
}) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <span style={{ color: '#4ecdc4', opacity: 0.65 }}>{icon}</span>
      <p className={`font-bold uppercase ${labelClass ?? 'text-[#4ecdc4]/65'}`}
        style={{ fontSize: '9px', letterSpacing: '0.12em' }}>
        {label}
      </p>
    </div>
  )
}

function CondLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-1.5">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p style={{ fontSize: '8px', color: 'rgba(78,205,196,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1, marginBottom: '2px' }}>
          {label}
        </p>
        <p className="leading-tight" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.72)' }}>{value}</p>
      </div>
    </div>
  )
}

function getTechImage(nom: string): string | null {
  const n = nom.toLowerCase()
  for (const [key, path] of Object.entries(TECHNIQUE_IMAGES)) {
    if (n.includes(key)) return path
  }
  return null
}

function getTechIcon(nom: string): React.ReactNode {
  const n = nom.toLowerCase()
  if (n.includes('mouche') || n.includes('nymphe')) return <Feather size={14} style={{ color: '#4ecdc4' }} />
  if (n.includes('leurre') || n.includes('streamer')) return <Zap size={14} style={{ color: '#4ecdc4' }} />
  if (n.includes('feeder') || n.includes('coup') || n.includes('bolognaise')) return <Anchor size={14} style={{ color: '#4ecdc4' }} />
  return <Fish size={14} style={{ color: '#4ecdc4' }} />
}

function Stars({ count, total = 5 }: { count: number; total?: number }) {
  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className="leading-none" style={{ fontSize: '14px', color: i < count ? '#00d4ff' : '#475569' }}>★</span>
      ))}
    </div>
  )
}

function TechniqueRow({ tech }: { tech: TechniqueRecommandee }) {
  const techImg = getTechImage(tech.nom)
  return (
    <div className="flex items-center" style={{ gap: '10px' }}>

      {/* Image flush à gauche, plus grande */}
      <div className="shrink-0 relative" style={{ width: '190px', height: '82px' }}>
        {techImg ? (
          <Image
            src={techImg}
            alt={tech.nom}
            fill
            sizes="220px"
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span style={{ fontSize: '44px', lineHeight: 1 }}>{getTechEmoji(tech.nom)}</span>
          </div>
        )}
      </div>

      {/* Nom + description */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white leading-tight" style={{ fontSize: '14px' }}>{tech.nom}</p>
        {tech.animation && (
          <p className="text-slate-400 mt-0.5 line-clamp-2" style={{ fontSize: '11px' }}>{tech.animation}</p>
        )}
      </div>

      {/* Colonnes droites — Difficulté + Efficacité fusionnées, Profondeur séparée */}
      <div className="shrink-0 flex items-center" style={{ gap: '12px' }}>

        {/* Colonne 1 : Difficulté + Efficacité empilées */}
        {(tech.difficulte != null || tech.efficacite != null) && (
          <div className="flex flex-col" style={{ gap: '6px' }}>
            {tech.difficulte != null && (
              <div className="flex flex-col items-center">
                <span className="uppercase tracking-wider text-slate-500 mb-0.5" style={{ fontSize: '9px' }}>Difficulté</span>
                <Stars count={tech.difficulte} />
              </div>
            )}
            {tech.efficacite != null && (
              <div className="flex flex-col items-center">
                <span className="uppercase tracking-wider text-slate-500 mb-0.5" style={{ fontSize: '9px' }}>Efficacité</span>
                <Stars count={tech.efficacite} />
              </div>
            )}
          </div>
        )}

        {/* Colonne 2 : Profondeur */}
        {tech.profondeur_optimale && (
          <div className="flex flex-col items-center">
            <span className="uppercase tracking-wider text-slate-500 mb-0.5" style={{ fontSize: '9px', whiteSpace: 'nowrap' }}>Profondeur</span>
            <span className="font-medium text-white" style={{ fontSize: '13px' }}>
              {tech.profondeur_optimale}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function getTechEmoji(nom: string): string {
  const n = nom.toLowerCase()
  if (n.includes('mouche') || n.includes('nymphe')) return '🪰'
  if (n.includes('leurre') || n.includes('jerk') || n.includes('swim')) return '🎣'
  if (n.includes('feeder') || n.includes('cheveu')) return '🎯'
  if (n.includes('vif')) return '🐟'
  if (n.includes('canne') || n.includes('stalking')) return '🎣'
  return '🎣'
}

function RecordLine({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div>
      <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1px' }}>
        {label}
      </p>
      <p className="font-bold text-white truncate" style={{ fontSize: big ? '13px' : '10px' }}>{value}</p>
    </div>
  )
}
