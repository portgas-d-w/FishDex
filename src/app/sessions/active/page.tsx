import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, MapPin, Fish, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getActiveSession } from '@/app/actions/sessions'
import { hasLegendeAccess } from '@/lib/stripe/access'
import { SessionTimer } from '@/components/sessions/SessionTimer'
import { SessionTimelineVertical } from '@/components/sessions/SessionTimeline'
import { ActiveSessionNotes } from '@/components/sessions/ActiveSessionNotes'
import type { TimelineEvent } from '@/components/sessions/SessionTimeline'

export const metadata = { title: 'Session active — FishDex' }

const RARETE_BADGE: Record<string, string> = {
  commun:     'bg-white/10 text-slate-300 border-white/15',
  rare:       'bg-blue-400/15 text-blue-300 border-blue-400/25',
  epique:     'bg-purple-500/15 text-purple-300 border-purple-500/25',
  legendaire: 'bg-amber-400/15 text-amber-300 border-amber-400/25',
  mirage:     'bg-gradient-to-r from-amber-400/15 via-pink-400/15 to-purple-500/15 text-pink-300 border-pink-400/25',
}
const RARETE_LABEL: Record<string, string> = {
  commun: 'Commun', rare: 'Rare', epique: 'Épique', legendaire: 'Légendaire', mirage: '✦ Mirage',
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export default async function ActiveSessionPage() {
  const session = await getActiveSession()
  if (!session) redirect('/sessions')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const isLegende = await hasLegendeAccess(user.id)

  // Spot
  let spotNom: string | null = null
  if (session.spot_id) {
    const { data: spot } = await supabase.from('spots').select('nom').eq('id', session.spot_id).single()
    spotNom = (spot as { nom: string } | null)?.nom ?? null
  }

  // Captures de la session
  const { data: catchRows } = await supabase
    .from('catches')
    .select('id, poids_kg, taille_cm, created_at, photo_url, species_id, species:species_id(nom_fr, image_url, rarete)')
    .eq('session_id', session.id)
    .order('created_at', { ascending: true })

  const catchList = catchRows ?? []
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

  type Sp = { nom_fr: string; image_url: string | null; rarete: string | null }
  function photoUrl(path: string | null) {
    return path ? `${supabaseUrl}/storage/v1/object/public/catches/${path}` : null
  }

  // Stats
  const uniqueSpecies = new Set(catchList.map(c => c.species_id).filter(Boolean))

  // Nouvelles espèces détectées cette session
  const speciesIds = [...uniqueSpecies] as string[]
  const newSpeciesIds = new Set<string>()
  if (speciesIds.length > 0) {
    const { data: allCatches } = await supabase
      .from('catches').select('species_id').eq('user_id', user.id).in('species_id', speciesIds)
    const countMap: Record<string, number> = {}
    for (const c of allCatches ?? []) {
      if (c.species_id) countMap[c.species_id] = (countMap[c.species_id] ?? 0) + 1
    }
    for (const [id, n] of Object.entries(countMap)) {
      if (n === 1) newSpeciesIds.add(id)
    }
  }

  // Plus grosse prise
  const bestPoids = Math.max(...catchList.map(c => c.poids_kg ?? 0))
  const bestTaille = Math.max(...catchList.map(c => c.taille_cm ?? 0))

  // Timeline
  const events: TimelineEvent[] = [
    { time: formatTime(session.started_at), label: 'Début de session', type: 'start' },
    ...catchList.map(c => {
      const sp = (Array.isArray(c.species) ? c.species[0] : c.species) as Sp | null
      const isNew = c.species_id ? newSpeciesIds.has(c.species_id) : false
      const stats = [c.taille_cm ? `${c.taille_cm} cm` : null, c.poids_kg ? `${c.poids_kg} kg` : null].filter(Boolean).join(' · ')
      return {
        time: formatTime(c.created_at),
        label: sp?.nom_fr ?? 'Capture',
        sublabel: stats || undefined,
        type: (isNew ? 'new_species' : 'catch') as TimelineEvent['type'],
      }
    }),
    { time: 'En cours', label: 'Session en cours', type: 'end' as TimelineEvent['type'] },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-32">

      {/* HERO */}
      <section className="relative h-[40vh] min-h-[240px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/backgrounds/home-default.webp)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#0a0f14]" />

        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 z-10">
          <Link href="/sessions" className="w-9 h-9 flex items-center justify-center rounded-full bg-black/50 border border-white/15 text-white backdrop-blur-sm">
            <ChevronLeft size={18} />
          </Link>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Session active
          </span>
        </div>

        {/* Infos hero */}
        <div className="absolute bottom-8 left-6 right-6 z-10">
          {spotNom && (
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={12} className="text-white/50" />
              <p className="text-sm text-white/70">{spotNom}</p>
            </div>
          )}
          <p className="text-[11px] font-semibold tracking-widest text-white/30 uppercase mb-1">Durée de la session</p>
          <div className="text-4xl font-black text-white drop-shadow-lg">
            <SessionTimer startedAt={session.started_at} />
          </div>
          <p className="text-xs text-white/30 mt-1">Démarrée à {formatTime(session.started_at)}</p>
        </div>
      </section>

      {/* STATS ROW */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Captures',  value: catchList.length },
            { label: 'Espèces',   value: uniqueSpecies.size },
            { label: 'Plus grosse', value: bestPoids > 0 ? `${bestPoids}kg` : bestTaille > 0 ? `${bestTaille}cm` : '—' },
            { label: 'Nouvelles', value: newSpeciesIds.size },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="text-[9px] text-white/30 leading-tight mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TIMELINE EN DIRECT */}
      {catchList.length > 0 && (
        <div className="mx-4 mt-4 rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4">Timeline en direct</p>
          <SessionTimelineVertical events={events} />
        </div>
      )}

      {/* DERNIÈRES CAPTURES */}
      {catchList.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Dernières captures</p>
            <Link href="/aquarium" className="text-xs text-white/30 hover:text-white/60 transition-colors">Voir tout</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 px-4 scrollbar-none">
            {[...catchList].reverse().slice(0, 6).map(c => {
              const sp = (Array.isArray(c.species) ? c.species[0] : c.species) as Sp | null
              const img = photoUrl(c.photo_url) ?? sp?.image_url
              const rarity = sp?.rarete ?? 'commun'
              const isNew = c.species_id ? newSpeciesIds.has(c.species_id) : false
              return (
                <Link key={c.id} href={`/aquarium/${c.id}`} className="shrink-0 w-32 rounded-xl overflow-hidden border border-white/10 bg-black/30">
                  <div className="relative aspect-[4/3] bg-black/40">
                    {img
                      ? <Image src={img} alt={sp?.nom_fr ?? 'Prise'} fill sizes="128px" className="object-cover" />
                      : <div className="absolute inset-0 flex items-center justify-center"><Fish size={20} className="text-white/15" /></div>
                    }
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 to-transparent" />
                    {isNew && (
                      <span className="absolute top-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-400/25 text-amber-300 border border-amber-400/30">
                        NOUVEAU
                      </span>
                    )}
                    <span className={`absolute top-1 right-1 text-[8px] font-bold px-1.5 py-0.5 rounded border backdrop-blur-sm ${RARETE_BADGE[rarity] ?? RARETE_BADGE.commun}`}>
                      {RARETE_LABEL[rarity] ?? rarity}
                    </span>
                  </div>
                  <div className="px-2 py-1.5">
                    <p className="text-[11px] font-semibold text-white truncate">{sp?.nom_fr ?? 'Inconnue'}</p>
                    <div className="flex gap-1">
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

      {/* NOTES EN DIRECT */}
      <ActiveSessionNotes
        sessionId={session.id}
        initialNotes={session.notes ?? null}
        isLegende={isLegende}
      />

      {/* CTA flottants */}
      <div className="fixed bottom-20 left-4 right-4 flex flex-col gap-2.5 z-40">
        <Link
          href="/aquarium/nouvelle"
          className="flex items-center justify-center gap-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-colors py-4 text-base font-bold text-[#0a0f14] shadow-[0_0_30px_rgba(34,211,238,0.45)]"
        >
          <Plus size={18} />
          Ajouter une prise
        </Link>
        <Link
          href={`/sessions/${session.id}/end`}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/8 transition-colors py-3.5 text-sm font-semibold text-white/70"
        >
          Terminer la Session
        </Link>
      </div>
    </div>
  )
}
