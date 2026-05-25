import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProGate } from '@/components/billing/ProGate'
import { SpotsMapLoader } from './SpotsMapLoader'

export const metadata = { title: 'Carte des spots — FishDex' }

export default async function MapPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#0a0f14] flex flex-col">
      <div className="sticky top-0 z-20 bg-[#0a0f14]/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <Link href="/sessions" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white">
          <ChevronLeft size={18} />
        </Link>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-amber-400" />
          <h1 className="text-lg font-bold text-white">Carte des spots</h1>
        </div>
      </div>

      <ProGate requiredTier="legende">
        <MapContent userId={user.id} />
      </ProGate>
    </div>
  )
}

async function MapContent({ userId }: { userId: string }) {
  const supabase = await createClient()

  const { data: spots } = await supabase
    .from('spots')
    .select('*')
    .eq('user_id', userId)
    .order('nb_visites', { ascending: false })

  const spotsData = spots ?? []

  // Enrichir avec le nb de captures par spot
  const spotIds = spotsData.map(s => s.id)
  let catchCounts: Record<string, number> = {}
  let lastVisits: Record<string, string | null> = {}

  if (spotIds.length > 0) {
    const { data: sessions } = await supabase
      .from('sessions')
      .select('id, spot_id, started_at')
      .in('spot_id', spotIds)
      .eq('user_id', userId)

    const sessionIds = (sessions ?? []).map(s => s.id)
    for (const s of sessions ?? []) {
      if (!s.spot_id) continue
      if (!lastVisits[s.spot_id] || s.started_at > lastVisits[s.spot_id]!) {
        lastVisits[s.spot_id] = s.started_at
      }
    }

    if (sessionIds.length > 0) {
      const { data: catchRows } = await supabase
        .from('catches')
        .select('session_id')
        .in('session_id', sessionIds)

      for (const c of catchRows ?? []) {
        if (!c.session_id) continue
        const session = (sessions ?? []).find(s => s.id === c.session_id)
        if (session?.spot_id) {
          catchCounts[session.spot_id] = (catchCounts[session.spot_id] ?? 0) + 1
        }
      }
    }
  }

  const spotsWithStats = spotsData.map(s => ({
    ...s,
    catchCount: catchCounts[s.id] ?? 0,
    lastVisit: lastVisits[s.id] ?? null,
  }))

  const spotsWithCoords = spotsWithStats.filter(s => s.latitude && s.longitude)
  const spotsWithoutCoords = spotsWithStats.filter(s => !s.latitude || !s.longitude)

  return (
    <div className="flex flex-col flex-1 px-4 pb-32 pt-4 gap-4">
      {spotsData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-16">
          <MapPin size={40} className="text-white/15" />
          <p className="text-sm text-white/40">Aucun spot enregistré</p>
          <p className="text-xs text-white/25">Crée des spots lors de tes sessions pour les voir ici</p>
        </div>
      ) : (
        <>
          {/* Carte */}
          <div className="h-[55vh] rounded-2xl overflow-hidden border border-white/8">
            {spotsWithCoords.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 bg-white/5">
                <MapPin size={32} className="text-white/20" />
                <p className="text-sm text-white/40 text-center px-8">
                  Aucun spot avec coordonnées GPS.<br />
                  Active la géolocalisation lors de tes sessions.
                </p>
              </div>
            ) : (
              <SpotsMapLoader spots={spotsWithStats} />
            )}
          </div>

          {/* Liste */}
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-widest text-white/40 uppercase px-1">
              {spotsData.length} spot{spotsData.length > 1 ? 's' : ''}
            </p>
            {spotsWithStats.map(spot => (
              <Link key={spot.id} href={`/map/${spot.id}`} className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/8 p-4 active:bg-white/8 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${spot.latitude ? 'bg-cyan-400' : 'bg-white/20'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{spot.nom}</p>
                  <p className="text-xs text-white/40">
                    {spot.nb_visites} session{spot.nb_visites !== 1 ? 's' : ''}
                    {spot.catchCount > 0 && ` · ${spot.catchCount} capture${spot.catchCount !== 1 ? 's' : ''}`}
                  </p>
                </div>
                <ChevronRight size={14} className="text-white/20 flex-shrink-0" />
              </Link>
            ))}
          </div>

          {spotsWithoutCoords.length > 0 && (
            <p className="text-xs text-white/25 text-center pb-2">
              {spotsWithoutCoords.length} spot{spotsWithoutCoords.length > 1 ? 's' : ''} sans coordonnées GPS — active la géoloc lors de tes prochaines sessions
            </p>
          )}
        </>
      )}
    </div>
  )
}
