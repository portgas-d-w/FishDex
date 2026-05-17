import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Fish, Clock, Star, Cloud, Sun, Snowflake, Wind, Sprout } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SessionTimelineHorizontal } from '@/components/sessions/SessionTimeline'
import { SessionEndForm } from '@/components/sessions/SessionEndForm'
import type { TimelineEvent } from '@/components/sessions/SessionTimeline'

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
const SEASON_ICON: Record<string, React.ElementType> = {
  printemps: Sprout, été: Sun, automne: Wind, hiver: Snowflake,
}
const SEASON_COLOR: Record<string, string> = {
  printemps: 'text-emerald-400', été: 'text-amber-400', automne: 'text-orange-400', hiver: 'text-blue-400',
}
const LIGHT_LABELS: Record<string, string> = {
  aube: 'Aube', matin: 'Matin', midi: 'Midi', aprem: 'Après-midi', crépuscule: 'Crépuscule', nuit: 'Nuit',
}

function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtDuration(start: string, end?: string): string {
  const diff = (end ? new Date(end) : new Date()).getTime() - new Date(start).getTime()
  const h = Math.floor(diff / 3_600_000), m = Math.floor((diff % 3_600_000) / 60_000)
  return h > 0 ? `${h}h${String(m).padStart(2,'0')}` : `${m} min`
}

export default async function EndSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: session, error } = await supabase
    .from('sessions').select('*').eq('id', id).eq('user_id', user.id).is('ended_at', null).single()
  if (error || !session) redirect(`/sessions/${id}`)

  let spotNom: string | null = null
  if (session.spot_id) {
    const { data: spot } = await supabase.from('spots').select('nom').eq('id', session.spot_id).single()
    spotNom = (spot as { nom: string } | null)?.nom ?? null
  }

  const { data: catchRows } = await supabase
    .from('catches')
    .select('id, poids_kg, taille_cm, created_at, photo_url, species_id, species:species_id(nom_fr, image_url, rarete, numero_dex)')
    .eq('session_id', id).order('created_at', { ascending: true })
  const catchList = catchRows ?? []

  // Nouvelles espèces
  const sessionSpeciesIds = [...new Set(catchList.map(c => c.species_id).filter(Boolean))] as string[]
  type Sp = { nom_fr: string; image_url: string | null; rarete: string | null; numero_dex: number | null }
  const newSpecies: { species_id: string; nom_fr: string; image_url: string | null; rarete: string | null; numero_dex: number | null }[] = []

  if (sessionSpeciesIds.length > 0) {
    const { data: all } = await supabase.from('catches').select('species_id').eq('user_id', user.id).in('species_id', sessionSpeciesIds)
    const cnt: Record<string, number> = {}
    for (const c of all ?? []) { if (c.species_id) cnt[c.species_id] = (cnt[c.species_id] ?? 0) + 1 }
    const seen = new Set<string>()
    for (const c of catchList) {
      if (!c.species_id || cnt[c.species_id] !== 1 || seen.has(c.species_id)) continue
      seen.add(c.species_id)
      const sp = (Array.isArray(c.species) ? c.species[0] : c.species) as Sp | null
      if (sp) newSpecies.push({ species_id: c.species_id, ...sp })
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  function catchPhoto(path: string | null) {
    return path ? `${supabaseUrl}/storage/v1/object/public/catches/${path}` : null
  }

  const uniqueSpecies = new Set(catchList.map(c => c.species_id).filter(Boolean))
  const bestPoids = Math.max(0, ...catchList.map(c => c.poids_kg ?? 0).filter(Boolean))

  // Timeline events
  const events: TimelineEvent[] = [
    { time: fmt(session.started_at), label: 'Début', type: 'start' },
    ...catchList.map(c => {
      const sp = (Array.isArray(c.species) ? c.species[0] : c.species) as Sp | null
      const isNew = c.species_id ? newSpecies.some(n => n.species_id === c.species_id) : false
      return {
        time: fmt(c.created_at),
        label: sp?.nom_fr ?? 'Capture',
        sublabel: c.poids_kg ? `${c.poids_kg} kg` : c.taille_cm ? `${c.taille_cm} cm` : undefined,
        type: (isNew ? 'new_species' : 'catch') as TimelineEvent['type'],
      }
    }),
    { time: fmt(new Date().toISOString()), label: 'Fin', type: 'end' },
  ]

  const SeasonIcon = SEASON_ICON[session.season ?? ''] ?? Cloud
  const seasonColor = SEASON_COLOR[session.season ?? ''] ?? 'text-white/30'

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-28">
      {/* HERO */}
      <section className="relative h-[30vh] min-h-[180px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/backgrounds/home-default.webp)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[#0a0f14]" />
        <div className="absolute top-12 left-4 z-10">
          <Link href={`/sessions/${id}`} className="w-9 h-9 flex items-center justify-center rounded-full bg-black/50 border border-white/15 text-white backdrop-blur-sm">
            <ChevronLeft size={18} />
          </Link>
        </div>
        <div className="absolute bottom-6 left-6 z-10">
          <h1 className="text-2xl font-black text-white">Fin de session</h1>
          <p className="text-sm text-white/50 mt-0.5">Quelle belle aventure !</p>
          {spotNom && <p className="text-xs text-white/35 mt-1">{spotNom} · {fmtDate(session.started_at)}</p>}
        </div>
      </section>

      <div className="px-4 space-y-4 mt-2">
        {/* RÉSUMÉ */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4">Résumé de la session</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="flex justify-center mb-1"><Fish size={16} className="text-cyan-400" /></div>
              <p className="text-2xl font-bold text-white">{catchList.length}</p>
              <p className="text-[10px] text-white/30">Captures</p>
            </div>
            <div>
              <div className="flex justify-center mb-1"><Star size={16} className="text-cyan-400" /></div>
              <p className="text-2xl font-bold text-white">{uniqueSpecies.size}</p>
              <p className="text-[10px] text-white/30">Espèces</p>
            </div>
            <div>
              <div className="flex justify-center mb-1"><Clock size={16} className="text-cyan-400" /></div>
              <p className="text-2xl font-bold text-white">{fmtDuration(session.started_at)}</p>
              <p className="text-[10px] text-white/30">Durée</p>
            </div>
          </div>
        </div>

        {/* CAPTURES */}
        {catchList.length > 0 && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Captures réalisées</p>
            <div className="flex gap-2.5 overflow-x-auto -mx-5 px-5 scrollbar-none pb-1">
              {catchList.map(c => {
                const sp = (Array.isArray(c.species) ? c.species[0] : c.species) as Sp | null
                const img = catchPhoto(c.photo_url) ?? sp?.image_url
                const rarity = sp?.rarete ?? 'commun'
                return (
                  <div key={c.id} className="shrink-0 w-28 rounded-xl overflow-hidden border border-white/10 bg-black/30">
                    <div className="relative aspect-[4/3] bg-black/40">
                      {img ? <Image src={img} alt={sp?.nom_fr ?? 'Prise'} fill sizes="112px" className="object-cover" /> : <div className="absolute inset-0 flex items-center justify-center"><Fish size={18} className="text-white/15" /></div>}
                      <span className={`absolute top-1 right-1 text-[8px] font-bold px-1.5 py-0.5 rounded border backdrop-blur-sm ${RARETE_BADGE[rarity] ?? RARETE_BADGE.commun}`}>{RARETE_LABEL[rarity] ?? rarity}</span>
                    </div>
                    <div className="px-2 py-1.5">
                      <p className="text-[11px] font-semibold text-white truncate">{sp?.nom_fr ?? 'Inconnue'}</p>
                      <div className="flex gap-1">
                        {c.taille_cm && <span className="text-[10px] text-cyan-400/80">{c.taille_cm} cm</span>}
                        {c.poids_kg && <span className="text-[10px] text-white/30">{c.poids_kg} kg</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* NOUVELLE ESPÈCE */}
        {newSpecies.length > 0 && (
          <div className="rounded-2xl bg-gradient-to-br from-cyan-900/25 to-blue-900/15 border border-cyan-400/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase">Nouvelle espèce découverte !</p>
              <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300">NOUVEAU</span>
            </div>
            {newSpecies.map(sp => (
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
                    {sp.numero_dex && <span className="ml-1.5 text-cyan-400/70">FishDex #{String(sp.numero_dex).padStart(3,'0')}</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONDITIONS */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Conditions pendant la session</p>
          <div className="flex flex-wrap gap-4">
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
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 overflow-hidden">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4">Timeline de ta session</p>
          <SessionTimelineHorizontal events={events} />
        </div>

        {/* FORMULAIRE END */}
        <SessionEndForm sessionId={id} userId={user.id} initialNotes={session.notes} />
      </div>
    </div>
  )
}
