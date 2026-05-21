import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Fish, Thermometer } from 'lucide-react'

export type SessionCardData = {
  id: string
  title: string | null
  started_at: string
  ended_at: string | null
  season: string | null
  style_peche: string | null
  is_bookmarked: boolean
  is_retro?: boolean | null
  spot: { nom: string } | null
  notes: string | null
  ressenti: string | null
  photo_ambiance_url: string | null
  light_phase: string | null
  meteo_data: Record<string, unknown> | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

// Phase lunaire approximative basée sur la date
function getMoonPhase(iso: string): { label: string; symbol: string } {
  const date    = new Date(iso)
  const known   = new Date('2000-01-06') // nouvelle lune connue
  const synodic = 29.53058867
  const diff    = (date.getTime() - known.getTime()) / 86_400_000
  const phase   = ((diff % synodic) + synodic) % synodic

  if (phase < 1.85)  return { label: 'Nouvelle lune',    symbol: '🌑' }
  if (phase < 7.38)  return { label: 'Lune croissante',  symbol: '🌒' }
  if (phase < 11.08) return { label: 'Premier quartier', symbol: '🌓' }
  if (phase < 14.77) return { label: 'Lune gibbeuse',    symbol: '🌔' }
  if (phase < 16.61) return { label: 'Pleine lune',      symbol: '🌕' }
  if (phase < 23.15) return { label: 'Lune décroissante',symbol: '🌖' }
  if (phase < 25)    return { label: 'Dernier quartier', symbol: '🌗' }
  return               { label: 'Lune croissante',  symbol: '🌘' }
}

function getSessionIcon(session: SessionCardData): string {
  if (session.style_peche === 'Mouche')      return '🪰'
  if (session.style_peche === 'Carpe')       return '🌿'
  if (session.style_peche === 'Carnassiers') return '🎯'
  if (session.style_peche === 'Truite')      return '🏔️'
  if (session.season === 'hiver')     return '❄️'
  if (session.season === 'printemps') return '🌱'
  if (session.season === 'été')       return '☀️'
  if (session.season === 'automne')   return '🍂'
  return '🌿'
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

// ── Composant ─────────────────────────────────────────────────────────────────

export function SessionCard({
  session,
  catchCount,
}: {
  session: SessionCardData
  catchCount: number
}) {
  const spot   = Array.isArray(session.spot) ? session.spot[0] : session.spot
  const title  = session.title ?? spot?.nom ?? 'Session'
  const moon   = getMoonPhase(session.started_at)
  const sketch = getSessionIcon(session)

  const photoUrl = session.photo_ambiance_url
    ? `${SUPABASE_URL}/storage/v1/object/public/catches/${session.photo_ambiance_url}`
    : null

  const temp = session.meteo_data
    ? (session.meteo_data as { temp?: number }).temp
    : null

  return (
    <Link href={`/sessions/${session.id}`} className="block active:scale-[0.98] transition-transform">
      <div
        className="relative rounded-2xl overflow-hidden shadow-md"
        style={{
          backgroundImage: 'url(/backgrounds/sessions-card-notebook.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
        }}
      >
        {/* Légère teinte chaleureuse pour unifier */}
        <div className="absolute inset-0 bg-amber-950/8" />

        <div className="relative flex gap-0 min-h-[120px]">

          {/* ── Colonne gauche — photo ──────────────────────────────────────── */}
          <div className="w-[108px] shrink-0 p-3 pr-0 flex items-center justify-center">
            <div
              className="w-[90px] h-[90px] rounded-lg overflow-hidden shadow-[2px_3px_8px_rgba(0,0,0,0.35)]"
              style={{ transform: 'rotate(-1.5deg)' }}
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={title}
                  width={90}
                  height={90}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-3xl"
                  style={{ background: 'rgba(139,90,43,0.12)' }}
                >
                  {sketch}
                </div>
              )}
            </div>
          </div>

          {/* ── Colonne droite — contenu journal ───────────────────────────── */}
          <div className="flex-1 py-3 pr-3 pl-2 flex flex-col justify-between">

            {/* En-tête : titre + phase lunaire */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3
                  className="text-[18px] leading-tight text-stone-800 font-semibold truncate"
                  style={{ fontFamily: 'var(--font-handwriting)' }}
                >
                  {title}
                </h3>
                {session.notes && (
                  <p className="text-[11px] italic text-stone-500 mt-0.5 line-clamp-1">
                    {session.notes}
                  </p>
                )}
              </div>

              {/* Phase lunaire */}
              <div className="shrink-0 flex flex-col items-center gap-0.5 mt-0.5">
                <span className="text-[18px] leading-none">{moon.symbol}</span>
                <span className="text-[8px] text-stone-500 text-center leading-tight max-w-[44px]">
                  {moon.label}
                </span>
              </div>
            </div>

            {/* Méta */}
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
              <span className="flex items-center gap-1 text-[10px] text-stone-500">
                <Clock size={9} className="shrink-0" />
                {formatDate(session.started_at)}
                {session.ended_at && (
                  <span className="text-stone-400">
                    · {formatTime(session.started_at)} – {formatTime(session.ended_at)}
                  </span>
                )}
              </span>

              {temp != null && (
                <span className="flex items-center gap-1 text-[10px] text-stone-500">
                  <Thermometer size={9} className="shrink-0" />
                  {temp}°C
                </span>
              )}

              {spot?.nom && (
                <span className="flex items-center gap-1 text-[10px] text-stone-500">
                  <MapPin size={9} className="shrink-0" />
                  {spot.nom}
                </span>
              )}
            </div>

            {/* Pied : trait + catch count */}
            <div className="flex items-end justify-between mt-1.5 pt-1.5 border-t border-stone-300/60">
              <p className="text-[9px] italic text-stone-400 truncate flex-1 mr-2">
                {session.ressenti ? `"${session.ressenti}"` : sketch}
              </p>
              {catchCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-stone-600 shrink-0">
                  <Fish size={10} />
                  {catchCount} prise{catchCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
