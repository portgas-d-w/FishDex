import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Ruler, Scale, MapPin, Star, Fish, Lock, Camera, Droplets, Utensils, Layers } from 'lucide-react'
import { getRareteConfig } from '@/lib/fishdex/rarete'
import type { SpeciesRow } from '@/types/fishdex'

// ── Helpers ──────────────────────────────────────────────

const eauLabels: Record<string, string> = {
  douce: 'Eau douce', salee: 'Eau salée', saumatre: 'Eau saumâtre',
}
const regimeLabels: Record<string, string> = {
  carnivore: 'Carnivore', omnivore: 'Omnivore', herbivore: 'Herbivore',
}
const profondeurLabels: Record<string, string> = {
  surface: 'Surface', moyenne: 'Eaux moyennes', fond: 'Fond',
}
const saisonConfig: Record<string, { label: string; classes: string }> = {
  printemps: { label: 'Printemps', classes: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/40' },
  ete:       { label: 'Été',       classes: 'bg-amber-900/50  text-amber-300  border-amber-700/40'  },
  automne:   { label: 'Automne',   classes: 'bg-orange-900/50 text-orange-300 border-orange-700/40' },
  hiver:     { label: 'Hiver',     classes: 'bg-blue-900/50   text-blue-300   border-blue-700/40'   },
}

function formatTag(tag: string) {
  return tag.charAt(0).toUpperCase() + tag.slice(1).replace(/_/g, ' ')
}
function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
function formatHabitat(habitat: string[] | null) {
  if (!habitat?.length) return '—'
  return habitat.slice(0, 3).map(formatTag).join(', ')
}

// ── Page ─────────────────────────────────────────────────

export default async function SpeciesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: species, error } = await supabase
    .from('species')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !species) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  // Prises de l'user pour cette espèce
  let catchCount = 0
  let maxPoids: number | null = null
  let maxPoidsDate: string | null = null

  if (user) {
    const { data: userCatches } = await supabase
      .from('catches')
      .select('poids_kg, date_capture')
      .eq('species_id', species.id)
      .eq('user_id', user.id)
      .order('poids_kg', { ascending: false, nullsFirst: false })

    if (userCatches?.length) {
      catchCount = userCatches.length
      const heaviest = userCatches.find((c) => c.poids_kg != null)
      maxPoids = heaviest?.poids_kg ?? null
      maxPoidsDate = heaviest?.date_capture ?? null
    }
  }

  const isDiscovered = catchCount > 0
  const cfg = getRareteConfig(species.rarete)
  const dexNum = String(species.numero_dex ?? 0).padStart(3, '0')
  const isShiny = species.rarete === 'shiny'

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 pb-24">

      {/* ── Hero immersif ── */}
      <div className="relative h-[50vh] min-h-[300px] w-full overflow-hidden bg-slate-900">
        <Image
          src={species.image_url || '/fishes/placeholder.svg'}
          alt={species.nom_fr}
          fill
          priority
          sizes="100vw"
          className={`object-contain p-8 transition-all duration-500 ${isDiscovered ? 'opacity-100' : '[filter:brightness(0)] opacity-30'}`}
        />

        {/* Overlay gradient bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Bouton retour */}
        <Link
          href="/fishdex"
          className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/60 text-slate-300 hover:text-teal-400 hover:border-teal-500/40 backdrop-blur-sm transition-all text-sm"
        >
          <ChevronLeft size={16} />
          <span className="font-medium">FishDex</span>
        </Link>

        {/* Numéro dex centré */}
        <span className="absolute top-4 left-1/2 -translate-x-1/2 z-10 font-mono text-xs text-slate-500 bg-slate-900/70 border border-slate-700/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
          #{dexNum}
        </span>

        {/* Badge rareté haut droite */}
        {species.rarete && (
          <span
            className={`absolute top-4 right-4 z-10 text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm
              ${cfg.badge} ${cfg.badgeBorder}
              ${isShiny ? 'animate-pulse' : ''}`}
          >
            {cfg.label}
          </span>
        )}

        {/* Nom sur l'image */}
        <div className="absolute bottom-5 left-4 right-4 z-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-lg">
            {species.nom_fr}
          </h1>
          <p className="text-sm text-slate-300 italic mt-0.5 drop-shadow">
            {species.nom_scientifique}
          </p>
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="flex flex-col gap-5 px-4 pt-5 max-w-2xl mx-auto w-full">

        {/* ── Infos clés 2×2 ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KeyStat icon={<Ruler size={16} className="text-teal-400" />} label="Taille max">
            {species.taille_max_cm ? `${species.taille_max_cm} cm` : '—'}
          </KeyStat>
          <KeyStat icon={<Scale size={16} className="text-teal-400" />} label="Poids max">
            {species.poids_max_kg ? `${species.poids_max_kg} kg` : '—'}
          </KeyStat>
          <KeyStat icon={<MapPin size={16} className="text-teal-400" />} label="Habitat">
            <span className="truncate">{formatHabitat(species.habitat)}</span>
          </KeyStat>
          <KeyStat icon={<Star size={16} className="text-teal-400" />} label="Difficulté">
            <span className="text-amber-400">{'★'.repeat(species.difficulte ?? 0)}</span>
            <span className="text-slate-700">{'★'.repeat(5 - (species.difficulte ?? 0))}</span>
          </KeyStat>
        </div>

        {/* ── Description ── */}
        {species.description && (
          <section className="rounded-2xl bg-slate-900/60 border border-slate-800/60 p-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              À propos
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">{species.description}</p>
          </section>
        )}

        {/* ── Infos détaillées ── */}
        <section className="rounded-2xl bg-slate-900/60 border border-slate-800/60 p-4 flex flex-col gap-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Biologie & Pêche
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {species.famille && (
              <InfoRow label="Famille" value={species.famille} />
            )}
            {species.eau && (
              <InfoRow
                label={<span className="flex items-center gap-1"><Droplets size={12} />Eau</span>}
                value={eauLabels[species.eau] ?? species.eau}
              />
            )}
            {species.regime && (
              <InfoRow
                label={<span className="flex items-center gap-1"><Utensils size={12} />Régime</span>}
                value={regimeLabels[species.regime] ?? species.regime}
              />
            )}
            {species.profondeur && (
              <InfoRow
                label={<span className="flex items-center gap-1"><Layers size={12} />Profondeur</span>}
                value={profondeurLabels[species.profondeur] ?? species.profondeur}
              />
            )}
            {species.taille_legale_cm && (
              <InfoRow label="Taille légale" value={`${species.taille_legale_cm} cm min.`} />
            )}
          </div>

          {/* Saisons */}
          {species.saison && species.saison.length > 0 && (
            <div>
              <p className="text-xs text-slate-600 mb-1.5">Saisons favorables</p>
              <div className="flex flex-wrap gap-1.5">
                {species.saison.map((s: string) => {
                  const sc = saisonConfig[s]
                  return (
                    <span key={s} className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${sc?.classes ?? 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      {sc?.label ?? formatTag(s)}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Techniques */}
          {species.techniques && species.techniques.length > 0 && (
            <div>
              <p className="text-xs text-slate-600 mb-1.5">Techniques recommandées</p>
              <div className="flex flex-wrap gap-1.5">
                {species.techniques.map((tech: string) => (
                  <span key={tech} className="text-xs px-2.5 py-0.5 rounded-full border bg-teal-900/30 text-teal-300 border-teal-700/30 font-medium">
                    {formatTag(tech)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── État de découverte ── */}
        <section className={`rounded-2xl border p-4 flex flex-col gap-3 ${
          isDiscovered
            ? 'bg-emerald-900/20 border-emerald-700/30'
            : 'bg-slate-900/40 border-slate-800/60'
        }`}>
          {isDiscovered ? (
            <>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Fish size={12} />
                  Découverte
                </span>
                <span className="text-xs text-slate-400">
                  Capturée{' '}
                  <span className="font-semibold text-slate-200">
                    {catchCount} fois{catchCount > 1 ? '' : ''}
                  </span>
                </span>
              </div>

              {maxPoids != null && maxPoidsDate && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Scale size={12} className="text-amber-400 shrink-0" />
                  Plus lourd :{' '}
                  <span className="font-semibold text-amber-400">{maxPoids} kg</span>
                  {' '}le {formatDate(maxPoidsDate)}
                </div>
              )}

              <Link
                href="/aquarium"
                className="self-start text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors underline underline-offset-2"
              >
                Voir mes prises →
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-500 text-xs font-bold">
                  <Lock size={12} />
                  Non découverte
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tu n&apos;as pas encore capturé cette espèce.
                {user ? ' Pars pêcher pour la débloquer !' : ' Connecte-toi pour suivre tes découvertes.'}
              </p>
              {user && (
                <Link
                  href="/aquarium/nouvelle"
                  className="self-start flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 transition-colors text-xs font-semibold"
                >
                  <Camera size={14} />
                  Aller pêcher
                </Link>
              )}
            </>
          )}
        </section>

      </div>
    </div>
  )
}

// ── Sous-composants ───────────────────────────────────────

function KeyStat({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60">
      <div className="flex items-center gap-1.5 text-slate-500">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-sm font-semibold text-slate-200 leading-tight">{children}</span>
    </div>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: React.ReactNode
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60 last:border-0 gap-2">
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <span className="text-xs text-slate-200 font-medium text-right">{value}</span>
    </div>
  )
}
