import { redirect } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getActiveSession } from '@/app/actions/sessions'
import { getUserSpots } from '@/app/actions/spots'
import { StartSessionFormFull } from '@/components/sessions/StartSessionFormFull'

export const metadata = { title: 'Nouvelle session — FishDex' }

export default async function NewSessionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Si session déjà active → rediriger
  const active = await getActiveSession()
  if (active) redirect('/sessions/active')

  const spots = await getUserSpots()

  // Contexte actuel (calculé côté serveur pour le card "FishDex prépare")
  const now = new Date()
  const month = now.getMonth() + 1
  const hour  = now.getHours()
  const season =
    [3, 4, 5].includes(month) ? 'Printemps' :
    [6, 7, 8].includes(month) ? 'Été' :
    [9, 10, 11].includes(month) ? 'Automne' : 'Hiver'
  const lightPhase =
    hour >= 5  && hour <= 7  ? 'Aube' :
    hour >= 8  && hour <= 11 ? 'Matin' :
    hour >= 12 && hour <= 14 ? 'Midi' :
    hour >= 15 && hour <= 17 ? 'Après-midi' :
    hour >= 18 && hour <= 20 ? 'Crépuscule' : 'Nuit'
  const dateLabel = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const timeLabel = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-[#0a0f14]">
      {/* Hero */}
      <section className="relative h-[28vh] min-h-[160px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/backgrounds/home-default.webp)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-[#0a0f14]" />

        <div className="absolute top-12 left-4 z-10">
          <Link
            href="/sessions"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/50 border border-white/15 text-white backdrop-blur-sm"
          >
            <ChevronLeft size={18} />
          </Link>
        </div>

        <div className="absolute bottom-6 left-6 right-6 z-10">
          <h1 className="text-2xl font-black text-white">Démarrer une session</h1>
          <p className="text-sm text-white/40 mt-0.5">Tous les champs sont optionnels</p>
        </div>
      </section>

      <div className="px-4 pb-32 space-y-4 mt-4">
        {/* Card contexte auto */}
        <div className="rounded-2xl bg-cyan-400/5 border border-cyan-400/15 p-4">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
            FishDex remplit pour toi
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'Date',    value: dateLabel.split(' ').slice(0, 2).join(' ') },
              { label: 'Heure',   value: timeLabel },
              { label: 'Saison',  value: season },
              { label: 'Lumière', value: lightPhase },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-[11px] font-semibold text-white leading-tight">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire client */}
        <StartSessionFormFull spots={spots} />
      </div>
    </div>
  )
}
