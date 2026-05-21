import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronLeft, MapPin, Fish, Clock, Trophy,
  Star, Cloud, Sun, Snowflake, Wind, Sprout,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { EndSessionForm } from '@/components/sessions/EndSessionForm'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
function formatDuration(startedAt: string, endedAt?: string): string {
  const end = endedAt ? new Date(endedAt) : new Date()
  const diff = end.getTime() - new Date(startedAt).getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h > 0) return `${h}h${String(m).padStart(2, '0')}`
  return `${m} min`
}

const SEASON_ICON: Record<string, React.ElementType> = {
  printemps: Sprout,
  été:       Sun,
  automne:   Wind,
  hiver:     Snowflake,
}
const SEASON_COLOR: Record<string, string> = {
  printemps: 'text-emerald-400',
  été:       'text-amber-400',
  automne:   'text-orange-400',
  hiver:     'text-blue-400',
}
const LIGHT_LABELS: Record<string, string> = {
  aube: 'Aube', matin: 'Matin', midi: 'Midi',
  aprem: 'Après-midi', crépuscule: 'Crépuscule', nuit: 'Nuit',
}
const RARETE_BADGE: Record<string, string> = {
  commun:     'bg-white/10 text-slate-300 border-white/15',
  peu_commun: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/25',
  rare:       'bg-blue-400/15 text-blue-300 border-blue-400/25',
  epique:     'bg-purple-500/15 text-purple-300 border-purple-500/25',
  legendaire: 'bg-amber-400/15 text-amber-300 border-amber-400/25',
  mirage:     'bg-gradient-to-r from-amber-400/15 via-pink-400/15 to-purple-500/15 text-pink-300 border-pink-400/25',
}
const RARETE_LABEL: Record<string, string> = {
  commun: 'Commun', peu_commun: 'Peu commun', rare: 'Rare',
  epique: 'Épique', legendaire: 'Légendaire', mirage: '✦ Mirage',
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function FinSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Session doit exister, appartenir à l'user, et être encore active
  const { data: session, error } = await supabase
    .from('sessions')
    .select('*, spot:spot_id(id, nom)')
    .eq('id', id)
    .eq('user_id', user.id)
    .is('ended_at', null)
    .single()

  if (error || !session) {
    // Session déjà terminée ou inexistante → rediriger vers le détail
    redirect(`/sessions/${id}`)
  }

  // Captures de la session
  const { data: catchRows } = await supabase
    .from('catches')
    .select('id, poids_kg, taille_cm, created_at, photo_url, species_id, species:species_id(nom_fr, image_url, rarete, numero_dex)')
    .eq('session_id', id)
    .order('created_at', { ascending: true })

  const catchList = catchRows ?? []

  // Détecter les nouvelles espèces (capturées pour la 1ère fois au total)
  const sessionSpeciesIds = [...new Set(
    catchList.map(c => c.species_id).filter(Boolean)
  )] as string[]

  let newSpecies: Array<{
    species_id: string
    nom_fr: string
    image_url: string | null
    rarete: string | null
    numero_dex: number | null
  }> = []

  if (sessionSpeciesIds.length > 0) {
    const { data: allCatches } = await supabase
      .from('catches')
      .select('species_id')
      .eq('user_id', user.id)
      .in('species_id', sessionSpeciesIds)

    const countMap: Record<string, number> = {}
    for (const c of allCatches ?? []) {
      if (c.species_id) countMap[c.species_id] = (countMap[c.species_id] ?? 0) + 1
    }

    // species avec count = 1 → uniquement capturées cette session
    const firstTimeIds = new Set(
      Object.entries(countMap).filter(([, n]) => n === 1).map(([id]) => id)
    )

    // Dédupliquer + enrichir
    const seen = new Set<string>()
    for (const c of catchList) {
      if (!c.species_id || !firstTimeIds.has(c.species_id) || seen.has(c.species_id)) continue
      seen.add(c.species_id)
      type Sp = { nom_fr: string; image_url: string | null; rarete: string | null; numero_dex: number | null }
      const sp = (Array.isArray(c.species) ? c.species[0] : c.species) as Sp | null
      if (sp) newSpecies.push({ species_id: c.species_id, ...sp })
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  function catchPhoto(path: string | null) {
    return path ? `${supabaseUrl}/storage/v1/object/public/catches/${path}` : null
  }

  type Spot = { id: string; nom: string } | null
  const spot = (Array.isArray(session.spot) ? session.spot[0] : session.spot) as Spot

  // Meilleure capture (poids)
  const bestByPoids = catchList.reduce<typeof catchList[0] | null>((best, c) => {
    if (c.poids_kg == null) return best
    if (!best || c.poids_kg > (best.poids_kg ?? 0)) return c
    return best
  }, null)

  // Espèces uniques
  type Sp = { nom_fr: string; image_url: string | null; rarete: string | null; numero_dex: number | null }
  const uniqueSpecies = new Set(catchList.map(c => {
    const sp = (Array.isArray(c.species) ? c.species[0] : c.species) as Sp | null
    return sp?.nom_fr
  }).filter(Boolean))

  // Souvenir du jour : photo de la meilleure capture
  const souvenirPhoto = bestByPoids
    ? catchPhoto(bestByPoids.photo_url) ?? (Array.isArray(bestByPoids.species) ? (bestByPoids.species[0] as Sp | null)?.image_url : (bestByPoids.species as Sp | null)?.image_url) ?? null
    : null

  // Timeline des événements
  type TimelineEvent = { time: string; label: string; sublabel?: string; type: 'start' | 'catch' | 'new_species' | 'end' }
  const timeline: TimelineEvent[] = [
    { time: formatTime(session.started_at), label: 'Début de session', sublabel: session.light_phase ? LIGHT_LABELS[session.light_phase] : undefined, type: 'start' },
  ]
  for (const c of catchList) {
    const sp = (Array.isArray(c.species) ? c.species[0] : c.species) as Sp | null
    const isNew = c.species_id ? newSpecies.some(n => n.species_id === c.species_id) : false
    const stats = [c.taille_cm ? `${c.taille_cm} cm` : null, c.poids_kg ? `${c.poids_kg} kg` : null].filter(Boolean).join(' · ')
    timeline.push({
      time: formatTime(c.created_at),
      label: sp?.nom_fr ?? 'Capture',
      sublabel: stats || undefined,
      type: isNew ? 'new_species' : 'catch',
    })
  }
  timeline.push({ time: formatTime(new Date().toISOString()), label: 'Fin de session', type: 'end' })

  const SeasonIcon = SEASON_ICON[session.season ?? ''] ?? Cloud
  const seasonColor = SEASON_COLOR[session.season ?? ''] ?? 'text-white/40'

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-28">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-[32vh] min-h-[200px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/backgrounds/home-default.webp)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#0a0f14]" />

        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 z-10">
          <Link
            href={`/sessions/${id}`}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/50 border border-white/15 text-white backdrop-blur-sm"
          >
            <ChevronLeft size={18} />
          </Link>
        </div>

        {/* Titre dans le hero */}
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <h1 className="text-2xl font-black text-white">Fin de session</h1>
          <p className="text-sm text-white/50 mt-0.5">Quelle belle aventure !</p>
          {spot && (
            <div className="flex items-center gap-1.5 mt-2">
              <MapPin size={11} className="text-cyan-400/70" />
              <span className="text-xs text-white/50">{spot.nom}</span>
              <span className="text-white/20">·</span>
              <span className="text-xs text-white/40">{formatDate(session.started_at)}</span>
            </div>
          )}
        </div>
      </section>

      {/* ── CONTENU ──────────────────────────────────────────── */}
      <div className="px-4 space-y-4 mt-2">

        {/* RÉSUMÉ STATS */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4">
            Résumé de la session
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="flex justify-center mb-1"><Fish size={16} className="text-cyan-400" /></div>
              <p className="text-xl font-bold text-white">{catchList.length}</p>
              <p className="text-[10px] text-white/30">Captures</p>
            </div>
            <div>
              <div className="flex justify-center mb-1"><Star size={16} className="text-cyan-400" /></div>
              <p className="text-xl font-bold text-white">{uniqueSpecies.size}</p>
              <p className="text-[10px] text-white/30">Espèces</p>
            </div>
            <div>
              <div className="flex justify-center mb-1"><Clock size={16} className="text-cyan-400" /></div>
              <p className="text-xl font-bold text-white">{formatDuration(session.started_at)}</p>
              <p className="text-[10px] text-white/30">Durée</p>
            </div>
            <div>
              <div className="flex justify-center mb-1"><Trophy size={16} className="text-cyan-400" /></div>
              <p className="text-xl font-bold text-white">
                {bestByPoids?.poids_kg ? `${bestByPoids.poids_kg}kg` : '—'}
              </p>
              <p className="text-[10px] text-white/30">Record</p>
            </div>
          </div>
        </div>

        {/* CAPTURES RÉALISÉES */}
        {catchList.length > 0 && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">
                Captures réalisées
              </p>
              <Link href="/aquarium" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                Voir toutes
              </Link>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
              {catchList.map(c => {
                const sp = (Array.isArray(c.species) ? c.species[0] : c.species) as Sp | null
                const img = catchPhoto(c.photo_url) ?? sp?.image_url
                const rarity = sp?.rarete ?? 'commun'
                return (
                  <Link
                    key={c.id}
                    href={`/aquarium/${c.id}`}
                    className={`shrink-0 w-28 rounded-xl overflow-hidden border ${
                      rarity === 'mirage' ? 'border-pink-400/30' :
                      rarity === 'legendaire' ? 'border-amber-400/25' :
                      rarity === 'rare' ? 'border-blue-400/25' :
                      'border-white/10'
                    } bg-black/30`}
                  >
                    <div className="relative aspect-[4/3] bg-black/40">
                      {img ? (
                        <Image src={img} alt={sp?.nom_fr ?? 'Prise'} fill sizes="112px" className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Fish size={18} className="text-white/15" />
                        </div>
                      )}
                      <span className={`absolute top-1 right-1 text-[8px] font-bold px-1.5 py-0.5 rounded border backdrop-blur-sm ${RARETE_BADGE[rarity] ?? RARETE_BADGE.commun}`}>
                        {RARETE_LABEL[rarity] ?? rarity}
                      </span>
                    </div>
                    <div className="px-2 py-1.5">
                      <p className="text-[11px] font-semibold text-white truncate">{sp?.nom_fr ?? 'Inconnue'}</p>
                      <div className="flex gap-1 flex-wrap">
                        {c.taille_cm && <span className="text-[10px] text-cyan-400/80">{c.taille_cm} cm</span>}
                        {c.poids_kg && <span className="text-[10px] text-white/30">{c.poids_kg} kg</span>}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* NOUVELLE ESPÈCE DÉCOUVERTE */}
        {newSpecies.length > 0 && (
          <div className="rounded-2xl bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-400/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
                Nouvelle espèce découverte !
              </p>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300">
                NOUVEAU
              </span>
            </div>
            {newSpecies.map(sp => {
              const dexNum = sp.numero_dex ? `#${String(sp.numero_dex).padStart(3, '0')}` : null
              return (
                <div key={sp.species_id} className="flex items-center gap-3">
                  {sp.image_url && (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-black/30 shrink-0">
                      <Image src={sp.image_url} alt={sp.nom_fr} fill sizes="48px" className="object-contain p-1" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-white">{sp.nom_fr}</p>
                    <p className="text-xs text-white/40">
                      C&apos;est une première pour toi
                      {dexNum && <span className="ml-1.5 text-cyan-400/70">FishDex {dexNum}</span>}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CONDITIONS PENDANT LA SESSION */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
            Conditions pendant la session
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            {session.season && (
              <div className="flex items-center gap-1.5">
                <SeasonIcon size={14} className={seasonColor} />
                <span className="text-xs text-white/60 capitalize">{session.season}</span>
              </div>
            )}
            {session.light_phase && (
              <div className="flex items-center gap-1.5">
                <Sun size={14} className="text-white/30" />
                <span className="text-xs text-white/60">{LIGHT_LABELS[session.light_phase]}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Cloud size={14} className="text-white/20" />
              <span className="text-xs text-white/25 italic">Météo — H3</span>
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4">
            Timeline de la session
          </p>
          <div className="relative space-y-0">
            {timeline.map((event, i) => {
              const isLast = i === timeline.length - 1
              const dotColor =
                event.type === 'start' ? 'bg-emerald-400' :
                event.type === 'end'   ? 'bg-red-400' :
                event.type === 'new_species' ? 'bg-amber-400' :
                'bg-cyan-400/70'

              return (
                <div key={i} className="flex gap-3">
                  {/* Ligne + dot */}
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor}`} />
                    {!isLast && <div className="w-px flex-1 bg-white/8 mt-1" />}
                  </div>

                  {/* Contenu */}
                  <div className={`pb-4 min-w-0 ${isLast ? 'pb-0' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/30 tabular-nums shrink-0">{event.time}</span>
                      <span className={`text-xs font-medium ${
                        event.type === 'new_species' ? 'text-amber-300' :
                        event.type === 'end' ? 'text-red-400/80' :
                        event.type === 'start' ? 'text-emerald-400' :
                        'text-white/80'
                      }`}>{event.label}</span>
                      {event.type === 'new_species' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          NOUVEAU
                        </span>
                      )}
                    </div>
                    {event.sublabel && (
                      <p className="text-[10px] text-white/30 mt-0.5 ml-0">{event.sublabel}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* STATS + SOUVENIR DU JOUR */}
        <div className="grid grid-cols-2 gap-3">
          {/* Stats */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2">
            <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Tes stats</p>
            <div className="flex justify-between">
              <span className="text-xs text-white/40">Prises</span>
              <span className="text-xs font-semibold text-white">{catchList.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-white/40">Espèces</span>
              <span className="text-xs font-semibold text-white">{uniqueSpecies.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-white/40">Durée</span>
              <span className="text-xs font-semibold text-white">{formatDuration(session.started_at)}</span>
            </div>
            {bestByPoids?.poids_kg && (
              <div className="flex justify-between">
                <span className="text-xs text-white/40">Max</span>
                <span className="text-xs font-semibold text-cyan-400">{bestByPoids.poids_kg} kg</span>
              </div>
            )}
          </div>

          {/* Souvenir du jour */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Souvenir du jour</p>
            {souvenirPhoto ? (
              <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/30">
                <Image src={souvenirPhoto} alt="Souvenir" fill sizes="50vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            ) : (
              <div className="aspect-square rounded-xl border border-dashed border-white/10 flex items-center justify-center">
                <p className="text-[10px] text-white/20 text-center px-2">Photo de ta meilleure prise</p>
              </div>
            )}
          </div>
        </div>

        {/* FORMULAIRE FIN DE SESSION */}
        <div className="pt-2">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4 text-center">
            Avant de refermer
          </p>
          <EndSessionForm sessionId={id} userId={user.id} initialNotes={session.notes} />
        </div>

      </div>
    </div>
  )
}
