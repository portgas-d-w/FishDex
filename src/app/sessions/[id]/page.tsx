import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronLeft, MapPin, Clock, Fish, Plus,
  Calendar, Star, FileText, Camera,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SessionTimer } from '@/components/sessions/SessionTimer'
import { EndSessionButton } from '@/components/sessions/EndSessionButton'
import { SessionNotesEditor } from '@/components/sessions/SessionNotesEditor'
import { BookmarkButton } from '@/components/sessions/BookmarkButton'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
function formatDuration(startedAt: string, endedAt: string): string {
  const diff = new Date(endedAt).getTime() - new Date(startedAt).getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h > 0) return `${h}h${String(m).padStart(2, '0')}`
  return `${m} min`
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
const STYLE_LABEL: Record<string, string> = {
  carnassiers: 'Carnassiers', carpe: 'Carpe', truite: 'Truite',
  feeder: 'Feeder', mer: 'Mer', autre: 'Autre',
}
const SEASON_GRADIENT: Record<string, string> = {
  printemps: 'from-emerald-900/60 to-[#0a0f14]',
  été:       'from-amber-900/60 to-[#0a0f14]',
  automne:   'from-orange-900/60 to-[#0a0f14]',
  hiver:     'from-blue-900/60 to-[#0a0f14]',
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase  = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: session, error } = await supabase
    .from('sessions')
    .select('*, spot:spot_id(id, nom, latitude, longitude)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !session) notFound()

  const isActive = session.ended_at === null

  // Captures de cette session
  const { data: catches } = await supabase
    .from('catches')
    .select('id, poids_kg, taille_cm, created_at, photo_url, species:species_id(nom_fr, image_url, rarete)')
    .eq('session_id', id)
    .order('created_at', { ascending: true })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  function photoUrl(path: string | null) {
    return path ? `${supabaseUrl}/storage/v1/object/public/catches/${path}` : null
  }

  type Spot = { id: string; nom: string; latitude: number | null; longitude: number | null } | null
  const spot = (Array.isArray(session.spot) ? session.spot[0] : session.spot) as Spot

  const heroGradient = SEASON_GRADIENT[session.season ?? ''] ?? 'from-slate-900/80 to-[#0a0f14]'
  const catchList = catches ?? []

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-28">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-[38vh] min-h-[220px] overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${heroGradient}`}
          style={{ backgroundImage: 'url(/backgrounds/species-aquatic.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${heroGradient} mix-blend-multiply`} />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0f14] to-transparent" />

        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 z-10">
          <Link
            href="/sessions"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/50 border border-white/15 text-white backdrop-blur-sm"
          >
            <ChevronLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            {isActive && (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Session active
              </span>
            )}
            <BookmarkButton sessionId={id} isBookmarked={session.is_bookmarked ?? false} />
          </div>
        </div>

        {/* Timer ou durée */}
        <div className="absolute bottom-8 left-6 right-6 z-10">
          {isActive ? (
            <>
              <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-1">Durée</p>
              <div className="text-4xl font-black text-white drop-shadow-lg">
                <SessionTimer startedAt={session.started_at} />
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-white/40 mb-1">{formatDate(session.started_at)}</p>
              <p className="text-2xl font-black text-white">
                {formatDuration(session.started_at, session.ended_at!)}
              </p>
              <p className="text-xs text-white/40 mt-0.5">
                {formatTime(session.started_at)} – {formatTime(session.ended_at!)}
              </p>
            </>
          )}
        </div>
      </section>

      {/* ── CONTENU ──────────────────────────────────────────── */}
      <div className="px-4 space-y-4 mt-4">

        {/* INFOS SESSION */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
          {spot && (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-cyan-400 shrink-0" />
              <p className="text-sm font-semibold text-white">{spot.nom}</p>
            </div>
          )}
          {!spot && !isActive && (
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-white/30 shrink-0" />
              <p className="text-sm text-white/50">{formatDate(session.started_at)}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {session.season && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/50 capitalize">
                {session.season}
              </span>
            )}
            {session.light_phase && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/50 capitalize">
                {session.light_phase}
              </span>
            )}
            {session.style_peche && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400/80">
                {STYLE_LABEL[session.style_peche] ?? session.style_peche}
              </span>
            )}
          </div>
        </div>

        {/* CAPTURES DE LA SESSION */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <Fish size={12} className="text-cyan-400" />
              <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">
                Captures {catchList.length > 0 ? `— ${catchList.length}` : ''}
              </p>
            </div>
            {isActive && (
              <Link
                href={`/aquarium/nouvelle`}
                className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Plus size={12} />
                Ajouter
              </Link>
            )}
          </div>

          {catchList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {catchList.map((c) => {
                type Species = { nom_fr: string; image_url: string | null; rarete: string | null }
                const sp = (Array.isArray(c.species) ? c.species[0] : c.species) as Species | null
                const img = photoUrl(c.photo_url) ?? sp?.image_url
                const rarity = sp?.rarete ?? 'commun'
                const badgeClass = RARETE_BADGE[rarity] ?? RARETE_BADGE.commun

                return (
                  <Link
                    key={c.id}
                    href={`/aquarium/${c.id}`}
                    className={`relative rounded-xl overflow-hidden border ${
                      rarity === 'mirage' ? 'border-pink-400/30' :
                      rarity === 'legendaire' ? 'border-amber-400/25' :
                      rarity === 'epique' ? 'border-purple-500/25' :
                      rarity === 'rare' ? 'border-blue-400/25' :
                      'border-white/10'
                    } bg-black/30`}
                  >
                    <div className="aspect-square relative bg-black/40">
                      {img ? (
                        <Image src={img} alt={sp?.nom_fr ?? 'Prise'} fill sizes="25vw" className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Fish size={20} className="text-white/15" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 to-transparent" />
                      <span className={`absolute top-1 right-1 text-[8px] font-bold px-1.5 py-0.5 rounded-md border backdrop-blur-sm ${badgeClass}`}>
                        {RARETE_LABEL[rarity] ?? rarity}
                      </span>
                    </div>
                    <div className="px-2 pt-1.5 pb-2">
                      <p className="text-[11px] font-semibold text-white truncate">{sp?.nom_fr ?? 'Inconnue'}</p>
                      <div className="flex items-center gap-1">
                        {c.taille_cm && <span className="text-[10px] text-cyan-400/80">{c.taille_cm} cm</span>}
                        {c.poids_kg && <span className="text-[10px] text-white/30">{c.poids_kg} kg</span>}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 text-center">
              <Fish size={24} className="text-white/15 mb-2" />
              <p className="text-xs text-white/30">
                {isActive ? 'Aucune capture pour l\'instant — va pêcher !' : 'Aucune capture enregistrée.'}
              </p>
              {isActive && (
                <Link
                  href="/aquarium/nouvelle"
                  className="mt-3 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold hover:bg-cyan-400/20 transition-colors"
                >
                  <Camera size={12} />
                  Ajouter une prise
                </Link>
              )}
            </div>
          )}
        </div>

        {/* STATS RÉSUMÉ (session terminée) */}
        {!isActive && catchList.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5">
            <StatCard label="Captures" value={String(catchList.length)} />
            <StatCard
              label="Espèces"
              value={String(new Set(catchList.map(c => {
                const sp = Array.isArray(c.species) ? c.species[0] : c.species
                return (sp as { nom_fr?: string } | null)?.nom_fr
              }).filter(Boolean)).size)}
            />
            <StatCard
              label="Plus lourde"
              value={(() => {
                const max = Math.max(...catchList.map(c => c.poids_kg ?? 0).filter(Boolean))
                return max > 0 ? `${max} kg` : '—'
              })()}
            />
          </div>
        )}

        {/* NOTES */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div className="flex items-center gap-1.5 mb-3">
            <FileText size={12} className="text-cyan-400" />
            <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Mes notes</p>
          </div>
          <SessionNotesEditor
            sessionId={id}
            initialNotes={session.notes}
            readonly={!isActive && session.editable_until != null && new Date() > new Date(session.editable_until)}
          />
          {!isActive && session.editable_until && new Date() < new Date(session.editable_until) && (
            <p className="text-[10px] text-white/20 mt-2">
              Modifiable jusqu'au {new Date(session.editable_until).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} à {new Date(session.editable_until).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>

        {/* CTA SESSION ACTIVE */}
        {isActive && (
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/capture"
                className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-semibold text-white hover:bg-white/8 transition-colors"
              >
                <Camera size={16} />
                Capture IA
              </Link>
              <Link
                href="/aquarium/nouvelle"
                className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-semibold text-white hover:bg-white/8 transition-colors"
              >
                <Plus size={16} />
                Saisie manuelle
              </Link>
            </div>
            <div className="flex justify-center pt-2">
              <EndSessionButton sessionId={id} />
            </div>
          </div>
        )}

        {/* Lien retour (session terminée) */}
        {!isActive && (
          <div className="flex justify-center pt-2">
            <Link
              href="/sessions"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white/50 hover:text-white hover:bg-white/8 transition-colors"
            >
              <ChevronLeft size={14} />
              Retour aux sessions
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Sous-composants ───────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[10px] text-white/30 mt-0.5">{label}</p>
    </div>
  )
}
