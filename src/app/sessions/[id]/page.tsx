import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronLeft, MapPin, Clock, Fish, Star,
  Cloud, Sun, Snowflake, Wind, Sprout, Lock, Pencil,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SessionTimer } from '@/components/sessions/SessionTimer'
import { EndSessionButton } from '@/components/sessions/EndSessionButton'
import { BookmarkButton } from '@/components/sessions/BookmarkButton'
import { DeleteSessionButton } from '@/components/sessions/DeleteSessionButton'
import { SessionShareButton } from '@/components/sessions/SessionShareButton'
import { SessionTimelineHorizontal, SessionTimelineVertical } from '@/components/sessions/SessionTimeline'
import { SessionNotesEditor } from '@/components/sessions/SessionNotesEditor'
import type { TimelineEvent } from '@/components/sessions/SessionTimeline'
import { RESSENTI_OPTIONS } from '@/lib/sessions/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtDuration(s: string, e: string): string {
  const diff = new Date(e).getTime() - new Date(s).getTime()
  const h = Math.floor(diff / 3_600_000), m = Math.floor((diff % 3_600_000) / 60_000)
  return h > 0 ? `${h}h${String(m).padStart(2,'0')}` : `${m} min`
}

const RARETE_BADGE: Record<string, string> = {
  commun: 'bg-white/10 text-slate-300 border-white/15',
  rare: 'bg-blue-400/15 text-blue-300 border-blue-400/25',
  epique: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
  legendaire: 'bg-amber-400/15 text-amber-300 border-amber-400/25',
  mirage: 'bg-gradient-to-r from-amber-400/15 via-pink-400/15 to-purple-500/15 text-pink-300 border-pink-400/25',
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
const STYLE_LABEL: Record<string, string> = {
  carnassiers: 'Carnassiers', carpe: 'Carpe', truite: 'Truite', mouche: 'Mouche', feeder: 'Feeder', mer: 'Mer',
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function SessionDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: session, error } = await supabase
    .from('sessions').select('*').eq('id', id).eq('user_id', user.id).single()
  if (error || !session) notFound()

  const isActive = session.ended_at === null

  // Spot
  let spotNom: string | null = null
  if (session.spot_id) {
    const { data: spot } = await supabase.from('spots').select('nom').eq('id', session.spot_id).single()
    spotNom = (spot as { nom: string } | null)?.nom ?? null
  }

  // Captures
  const { data: catchRows } = await supabase
    .from('catches')
    .select('id, poids_kg, taille_cm, created_at, photo_url, species_id, species:species_id(nom_fr, image_url, rarete)')
    .eq('session_id', id).order('created_at', { ascending: true })
  const catchList = catchRows ?? []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  function catchPhoto(path: string | null) { return path ? `${supabaseUrl}/storage/v1/object/public/catches/${path}` : null }
  type Sp = { nom_fr: string; image_url: string | null; rarete: string | null }

  const uniqueSpecies = new Set(catchList.map(c => c.species_id).filter(Boolean))
  const bestPoids = Math.max(0, ...catchList.map(c => c.poids_kg ?? 0).filter(Boolean))

  // Éditable
  const isEditable = isActive || (session.editable_until ? new Date() < new Date(session.editable_until) : false)
  const editableUntilLabel = session.editable_until
    ? new Date(session.editable_until).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) +
      ' à ' + new Date(session.editable_until).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : null

  // Ressenti
  const ressentiOpt = session.ressenti
    ? RESSENTI_OPTIONS.find(o => o.value === session.ressenti)
    : null

  // Timeline
  const events: TimelineEvent[] = [
    { time: fmt(session.started_at), label: 'Début', type: 'start' },
    ...catchList.map(c => {
      const sp = (Array.isArray(c.species) ? c.species[0] : c.species) as Sp | null
      return {
        time: fmt(c.created_at),
        label: sp?.nom_fr ?? 'Capture',
        sublabel: c.poids_kg ? `${c.poids_kg} kg` : c.taille_cm ? `${c.taille_cm} cm` : undefined,
        type: 'catch' as TimelineEvent['type'],
      }
    }),
    session.ended_at
      ? { time: fmt(session.ended_at), label: 'Fin', type: 'end' as TimelineEvent['type'] }
      : { time: 'En cours', label: 'Session active', type: 'end' as TimelineEvent['type'] },
  ]

  const SeasonIcon = SEASON_ICON[session.season ?? ''] ?? Cloud
  const seasonColor = SEASON_COLOR[session.season ?? ''] ?? 'text-white/30'

  const heroGradient = session.season === 'été' ? 'from-amber-900/70' :
    session.season === 'printemps' ? 'from-emerald-900/70' :
    session.season === 'automne' ? 'from-orange-900/70' : 'from-blue-900/70'

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-28">

      {/* HERO */}
      <section className="relative h-[38vh] min-h-[230px] overflow-hidden">
        {session.photo_ambiance_url ? (
          <Image src={session.photo_ambiance_url} alt="Ambiance" fill className="object-cover" sizes="100vw" priority />
        ) : (
          <div className={`absolute inset-0 bg-cover bg-center`} style={{ backgroundImage: 'url(/backgrounds/home-default.webp)' }} />
        )}
        <div className={`absolute inset-0 bg-gradient-to-b ${heroGradient} to-[#0a0f14]`} />

        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 z-10">
          <Link href="/sessions" className="w-9 h-9 flex items-center justify-center rounded-full bg-black/50 border border-white/15 text-white backdrop-blur-sm">
            <ChevronLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            {isActive && (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            )}
            <BookmarkButton sessionId={id} isBookmarked={session.is_bookmarked ?? false} />
          </div>
        </div>

        {/* Infos */}
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <p className="text-xs text-white/40 mb-1">{fmtDate(session.started_at)}</p>
          {isActive ? (
            <div className="text-4xl font-black text-white drop-shadow-lg">
              <SessionTimer startedAt={session.started_at} />
            </div>
          ) : (
            <p className="text-2xl font-black text-white">{fmtDuration(session.started_at, session.ended_at!)}</p>
          )}
          {session.ended_at && (
            <p className="text-xs text-white/35 mt-0.5">{fmt(session.started_at)} – {fmt(session.ended_at)}</p>
          )}
        </div>
      </section>

      <div className="px-4 space-y-4 mt-4">

        {/* INFOS */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-2.5">
          {spotNom && (
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-cyan-400 shrink-0" />
              <p className="text-sm font-semibold text-white">{spotNom}</p>
            </div>
          )}
          {session.title && (
            <p className="text-sm font-medium text-white/70 italic">&ldquo;{session.title}&rdquo;</p>
          )}
          <div className="flex flex-wrap gap-2">
            {session.season && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/50 capitalize">{session.season}</span>
            )}
            {session.light_phase && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/50">{LIGHT_LABELS[session.light_phase]}</span>
            )}
            {session.style_peche && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400/80">{STYLE_LABEL[session.style_peche] ?? session.style_peche}</span>
            )}
            {session.intention && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/50 capitalize">{session.intention}</span>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: 'Captures',  icon: Fish,  value: catchList.length.toString() },
            { label: 'Espèces',   icon: Star,  value: uniqueSpecies.size.toString() },
            { label: 'Plus lourd', icon: Clock, value: bestPoids > 0 ? `${bestPoids} kg` : '—' },
          ].map(({ label, icon: Icon, value }) => (
            <div key={label} className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
              <Icon size={14} className="text-cyan-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="text-[10px] text-white/30">{label}</p>
            </div>
          ))}
        </div>

        {/* CAPTURES */}
        {catchList.length > 0 && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Captures</p>
              {isActive && (
                <Link href="/aquarium/nouvelle" className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                  <span>+ Ajouter</span>
                </Link>
              )}
            </div>
            <div className="flex gap-2.5 overflow-x-auto -mx-5 px-5 scrollbar-none pb-1">
              {catchList.map(c => {
                const sp = (Array.isArray(c.species) ? c.species[0] : c.species) as Sp | null
                const img = catchPhoto(c.photo_url) ?? sp?.image_url
                const rarity = sp?.rarete ?? 'commun'
                return (
                  <Link key={c.id} href={`/aquarium/${c.id}`} className={`shrink-0 w-28 rounded-xl overflow-hidden border ${rarity === 'mirage' ? 'border-pink-400/30' : rarity === 'legendaire' ? 'border-amber-400/25' : 'border-white/10'} bg-black/30`}>
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
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* CONDITIONS */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Conditions</p>
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
        {catchList.length > 0 && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 overflow-hidden">
            <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4">Timeline</p>
            {isActive
              ? <SessionTimelineVertical events={events} />
              : <SessionTimelineHorizontal events={events} />
            }
          </div>
        )}

        {/* NOTES */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Notes</p>
          <SessionNotesEditor
            sessionId={id}
            initialNotes={session.notes}
            readonly={!isActive && !isEditable}
          />
          {!isActive && isEditable && editableUntilLabel && (
            <p className="text-[10px] text-white/20 mt-2">Modifiable jusqu&apos;au {editableUntilLabel}</p>
          )}
        </div>

        {/* RESSENTI (lecture seule) */}
        {ressentiOpt && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Ressenti</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{ressentiOpt.emoji}</span>
              <span className="text-sm text-white/70">{ressentiOpt.label}</span>
            </div>
          </div>
        )}

        {/* CTA SESSION ACTIVE */}
        {isActive && (
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <Link href="/capture" className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-semibold text-white hover:bg-white/8 transition-colors">
                Capture IA
              </Link>
              <Link href="/aquarium/nouvelle" className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-semibold text-white hover:bg-white/8 transition-colors">
                + Saisie manuelle
              </Link>
            </div>
            <div className="flex justify-center">
              <EndSessionButton sessionId={id} />
            </div>
          </div>
        )}

        {/* ACTIONS SESSION TERMINÉE */}
        {!isActive && (
          <div className="flex items-center justify-between pt-2 pb-4">
            <div className="flex items-center gap-2">
              {isEditable ? (
                <Link
                  href={`/sessions/${id}/edit`}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white hover:bg-white/8 transition-colors"
                >
                  <Pencil size={14} />
                  Modifier
                </Link>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/4 border border-white/8">
                  <Lock size={12} className="text-white/25" />
                  <span className="text-xs text-white/30">Session figée</span>
                </div>
              )}
              <SessionShareButton data={{
                sessionId: id,
                date: fmtDate(session.started_at),
                duration: session.ended_at ? fmtDuration(session.started_at, session.ended_at) : '—',
                spotNom,
                catchCount: catchList.length,
                uniqueSpecies: uniqueSpecies.size,
                bestPoids,
                season: session.season ?? null,
                ressenti: ressentiOpt ? { emoji: ressentiOpt.emoji, label: ressentiOpt.label } : null,
              }} />
            </div>
            <DeleteSessionButton sessionId={id} />
          </div>
        )}

      </div>
    </div>
  )
}
