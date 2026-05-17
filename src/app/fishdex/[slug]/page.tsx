import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ChevronLeft, Ruler, Scale, Utensils, MapPin,
  Fish, Lock, Camera, Sun, Snowflake, Wind,
  Sprout, Sunrise, Sunset, Moon, Cloud, Trophy,
} from 'lucide-react'
import { getRareteConfig } from '@/lib/fishdex/rarete'
import { SpeciesPlaceholder } from '@/components/species/SpeciesPlaceholder'

// ── Helpers ──────────────────────────────────────────────────────────────────

const regimeLabels: Record<string, string> = {
  carnivore:   'Carnivore',
  omnivore:    'Omnivore',
  herbivore:   'Herbivore',
  insectivore: 'Insectivore',
}
const eauLabels: Record<string, string> = {
  douce:    'Eau douce',
  salee:    'Eau salée',
  saumatre: 'Eau saumâtre',
}
const profondeurLabels: Record<string, string> = {
  surface: 'Surface',
  moyenne: 'Eaux moyennes',
  fond:    'Fond',
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
function formatTag(tag: string) {
  return tag.charAt(0).toUpperCase() + tag.slice(1).replace(/_/g, ' ')
}
function formatTaille(min: number | null, max: number | null): string {
  if (min && max && min !== max) return `${min} – ${max} cm`
  if (max) return `${max} cm`
  if (min) return `${min} cm`
  return '—'
}

// ── Constants ─────────────────────────────────────────────────────────────────

const RARITY_GLOW: Record<string, string> = {
  commun:     'rgba(52,211,153,0.10)',
  rare:       'rgba(96,165,250,0.12)',
  epique:     'rgba(168,85,247,0.14)',
  legendaire: 'rgba(251,191,36,0.14)',
  mirage:     'rgba(244,114,182,0.18)',
}

const SEASONS = [
  { key: 'printemps', label: 'Printemps', Icon: Sprout },
  { key: 'ete',       label: 'Été',       Icon: Sun },
  { key: 'automne',   label: 'Automne',   Icon: Wind },
  { key: 'hiver',     label: 'Hiver',     Icon: Snowflake },
] as const

const MOMENTS = [
  { key: 'aube',  label: 'Aube',  Icon: Sunrise },
  { key: 'matin', label: 'Matin', Icon: Sun },
  { key: 'soir',  label: 'Soir',  Icon: Sunset },
  { key: 'nuit',  label: 'Nuit',  Icon: Moon },
] as const

const METEOS = [
  { key: 'beau',    label: 'Beau',    Icon: Sun },
  { key: 'nuageux', label: 'Nuageux', Icon: Cloud },
  { key: 'vent',    label: 'Vent',    Icon: Wind },
] as const

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

  // Prises de l'user pour cette espèce
  let catchCount     = 0
  let recentCatches: { id: string; photo_url: string | null; poids_kg: number | null; taille_cm: number | null; date_capture: string | null; lieu: string | null }[] = []
  let bestCatch:     { poids_kg: number | null; taille_cm: number | null; date_capture: string | null; lieu: string | null } | null = null

  if (user) {
    const [recentRes, bestRes, countRes] = await Promise.all([
      supabase
        .from('catches')
        .select('id, photo_url, poids_kg, taille_cm, date_capture, lieu')
        .eq('species_id', species.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4),

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

  const isDiscovered = catchCount > 0
  const cfg          = getRareteConfig(species.rarete)
  const dexNum       = String(species.numero_dex ?? 0).padStart(3, '0')
  const isMirage     = species.rarete === 'mirage'
  const activeSaisons = new Set(species.saison ?? [])

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  function catchPhotoUrl(path: string | null): string | null {
    if (!path) return null
    return `${supabaseUrl}/storage/v1/object/public/catches/${path}`
  }

  // Habitat texte formaté
  const habitatParts: string[] = []
  if (species.habitat?.length) habitatParts.push(species.habitat.map(formatTag).join(', '))
  if (species.eau) habitatParts.push(eauLabels[species.eau] ?? species.eau)
  if (species.profondeur) habitatParts.push(profondeurLabels[species.profondeur] ?? species.profondeur)
  const habitatText = habitatParts.join(' · ')

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-28">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[42vh] min-h-[260px] overflow-hidden">

        {/* Background aquatique */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/backgrounds/species-aquatic.webp)' }}
        />
        <div className="absolute inset-0 bg-black/35" />

        {/* Illustration espèce */}
        {species.image_url ? (
          <Image
            src={species.image_url}
            alt={species.nom_fr}
            fill
            priority
            sizes="100vw"
            className={`object-contain p-8 transition-all duration-500 drop-shadow-2xl ${
              isDiscovered ? 'opacity-100' : 'brightness-0 opacity-15'
            }`}
          />
        ) : (
          <SpeciesPlaceholder rarete={species.rarete} className="absolute inset-0" />
        )}

        {/* Glow rareté */}
        {isDiscovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 65%, ${
                RARITY_GLOW[species.rarete ?? 'commun'] ?? RARITY_GLOW.commun
              } 0%, transparent 65%)`,
            }}
          />
        )}

        {/* Shimmer mirage */}
        {isMirage && isDiscovered && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/4 to-transparent animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
        )}

        {/* Gradient bas → fond sombre */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0f14] to-transparent" />

        {/* Bouton retour */}
        <Link
          href="/fishdex"
          className="absolute top-4 left-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/50 border border-white/15 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
        >
          <ChevronLeft size={18} />
        </Link>

        {/* Numéro Dex */}
        <span className="absolute top-4 left-1/2 -translate-x-1/2 z-10 font-mono text-[11px] text-white/50 bg-black/40 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
          #{dexNum}
        </span>
      </section>

      {/* ── CONTENU ──────────────────────────────────────────────────────── */}
      <div className="px-4 space-y-4 max-w-2xl mx-auto mt-4">

        {/* IDENTITÉ */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${cfg.badge} ${cfg.badgeBorder}`}>
              {cfg.label}
            </span>
            {isDiscovered && (
              <span className="text-xs text-white/30">Numéro {dexNum}</span>
            )}
          </div>
          <h1 className="text-3xl font-black text-white leading-tight">{species.nom_fr}</h1>
          {species.nom_scientifique && (
            <p className="text-sm text-white/50 italic">{species.nom_scientifique}</p>
          )}
          {species.description && (
            <p className="text-sm text-white/70 leading-relaxed pt-1">{species.description}</p>
          )}
        </div>

        {/* 4 STATS */}
        <div className="grid grid-cols-4 gap-2">
          <StatCard icon={<Ruler size={15} className="text-cyan-400" />} label="Taille">
            {formatTaille(species.taille_min_cm, species.taille_max_cm)}
          </StatCard>
          <StatCard icon={<Scale size={15} className="text-cyan-400" />} label="Poids max">
            {species.poids_max_kg ? `${species.poids_max_kg} kg` : '—'}
          </StatCard>
          <StatCard icon={<Utensils size={15} className="text-cyan-400" />} label="Régime">
            {regimeLabels[species.regime ?? ''] ?? (species.regime ? formatTag(species.regime) : '—')}
          </StatCard>
          <StatCard icon={<MapPin size={15} className="text-cyan-400" />} label="Eau">
            {eauLabels[species.eau ?? ''] ?? '—'}
          </StatCard>
        </div>

        {/* HABITAT NATUREL */}
        {habitatText && (
          <SectionCard label="Habitat naturel" icon={<MapPin size={12} className="text-cyan-400" />}>
            <p className="text-sm text-white/70 leading-relaxed">{habitatText}</p>
            {species.taille_legale_cm && (
              <p className="text-xs text-amber-400/70 mt-2">
                Taille légale de capture : {species.taille_legale_cm} cm minimum
              </p>
            )}
          </SectionCard>
        )}

        {/* ACTIVITÉ */}
        <SectionCard label="Activité" icon={<Sun size={12} className="text-cyan-400" />}>
          <div className="space-y-3">
            {/* Saison — données réelles */}
            <ActivityRow label="Saison">
              {SEASONS.map(({ key, label, Icon }) => {
                const active = activeSaisons.has(key)
                return (
                  <ActivityIcon key={key} label={label} active={active}>
                    <Icon size={14} />
                  </ActivityIcon>
                )
              })}
            </ActivityRow>

            {/* Moment — placeholder */}
            <ActivityRow label="Moment" placeholder>
              {MOMENTS.map(({ key, label, Icon }) => (
                <ActivityIcon key={key} label={label} active={false}>
                  <Icon size={14} />
                </ActivityIcon>
              ))}
            </ActivityRow>

            {/* Météo — placeholder */}
            <ActivityRow label="Météo" placeholder>
              {METEOS.map(({ key, label, Icon }) => (
                <ActivityIcon key={key} label={label} active={false}>
                  <Icon size={14} />
                </ActivityIcon>
              ))}
            </ActivityRow>
          </div>
        </SectionCard>

        {/* TECHNIQUES RECOMMANDÉES */}
        {species.techniques && species.techniques.length > 0 && (
          <SectionCard label="Techniques recommandées" icon={<Fish size={12} className="text-cyan-400" />}>
            <div className="flex flex-wrap gap-2">
              {species.techniques.map((tech: string) => (
                <span
                  key={tech}
                  className="text-xs px-2.5 py-1 rounded-full border bg-cyan-900/20 text-cyan-300 border-cyan-700/30 font-medium"
                >
                  {formatTag(tech)}
                </span>
              ))}
            </div>
            {species.difficulte != null && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/8">
                <span className="text-[10px] text-white/30 uppercase tracking-wider">Difficulté</span>
                <span className="text-amber-400 text-sm">{'★'.repeat(species.difficulte)}</span>
                <span className="text-white/15 text-sm">{'★'.repeat(5 - species.difficulte)}</span>
              </div>
            )}
          </SectionCard>
        )}

        {/* VOS CAPTURES */}
        {user ? (
          isDiscovered ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Vos captures */}
              <SectionCard label={`Vos captures — ${catchCount}`} icon={<Fish size={12} className="text-cyan-400" />}>
                {recentCatches.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {recentCatches.map((c) => {
                      const img = catchPhotoUrl(c.photo_url)
                      return (
                        <Link
                          key={c.id}
                          href={`/aquarium/${c.id}`}
                          className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-black/30 shrink-0 hover:border-cyan-400/30 transition-colors"
                        >
                          {img ? (
                            <Image src={img} alt="Capture" fill sizes="56px" className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Fish size={18} className="text-white/20" />
                            </div>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
                <Link
                  href="/aquarium"
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Voir toutes vos captures →
                </Link>
              </SectionCard>

              {/* Votre meilleur */}
              <SectionCard label="Votre meilleur" icon={<Trophy size={12} className="text-cyan-400" />}>
                {bestCatch ? (
                  <div className="grid grid-cols-2 gap-2">
                    {bestCatch.taille_cm != null && (
                      <RecordStat label="Taille" value={`${bestCatch.taille_cm} cm`} />
                    )}
                    {bestCatch.poids_kg != null && (
                      <RecordStat label="Poids" value={`${bestCatch.poids_kg} kg`} />
                    )}
                    {bestCatch.lieu && (
                      <RecordStat label="Lieu" value={bestCatch.lieu} />
                    )}
                    {bestCatch.date_capture && (
                      <RecordStat label="Date" value={formatDate(bestCatch.date_capture)} />
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-white/30">Aucun record enregistré.</p>
                )}
              </SectionCard>
            </div>
          ) : (
            <SectionCard label="Vos captures" icon={<Fish size={12} className="text-cyan-400" />}>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-500 text-xs font-semibold">
                  <Lock size={11} />
                  Non découverte
                </span>
              </div>
              <p className="text-xs text-white/30 leading-relaxed mb-3">
                Tu n&apos;as pas encore capturé cette espèce. Pars pêcher pour la débloquer.
              </p>
              <Link
                href="/aquarium/nouvelle"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400/10 border border-cyan-400/25 text-cyan-400 hover:bg-cyan-400/20 transition-colors text-sm font-semibold"
              >
                <Camera size={13} />
                Capturer maintenant
              </Link>
            </SectionCard>
          )
        ) : (
          <SectionCard label="Vos captures" icon={<Fish size={12} className="text-cyan-400" />}>
            <p className="text-xs text-white/30 mb-3">Connecte-toi pour suivre tes découvertes.</p>
            <Link href="/login" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
              Se connecter →
            </Link>
          </SectionCard>
        )}

        {/* VARIANTES RARES — placeholder H2.5 */}
        <SectionCard label="Variantes rares" icon={<Fish size={12} className="text-cyan-400" />}>
          <p className="text-xs text-white/25 italic">Variantes à venir avec Collections (H2.5)</p>
        </SectionCard>

      </div>
    </div>
  )
}

// ── Sous-composants ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        {icon}
        <span className="text-[9px] font-semibold uppercase tracking-wider text-white/30">{label}</span>
      </div>
      <p className="text-xs font-semibold text-white text-center leading-tight">{children}</p>
    </div>
  )
}

function SectionCard({
  label,
  icon,
  children,
}: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5">
      <div className="flex items-center gap-1.5 mb-3">
        {icon}
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">{label}</p>
      </div>
      {children}
    </div>
  )
}

function ActivityRow({
  label,
  placeholder,
  children,
}: {
  label: string
  placeholder?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-white/30 w-14 shrink-0 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2 flex-wrap">
        {children}
      </div>
      {placeholder && (
        <span className="text-[9px] text-white/20 italic ml-auto">À venir</span>
      )}
    </div>
  )
}

function ActivityIcon({
  label,
  active,
  children,
}: {
  label: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={`flex flex-col items-center gap-0.5 transition-opacity ${active ? 'opacity-100' : 'opacity-20'}`}
      title={label}
    >
      <div className={`w-7 h-7 rounded-full border flex items-center justify-center ${
        active
          ? 'bg-cyan-400/15 border-cyan-400/30 text-cyan-400'
          : 'bg-white/4 border-white/10 text-white/40'
      }`}>
        {children}
      </div>
    </div>
  )
}

function RecordStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xs font-semibold text-white truncate">{value}</p>
    </div>
  )
}
