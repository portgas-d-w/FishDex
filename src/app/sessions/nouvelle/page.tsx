import { redirect } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NewSessionForm } from '@/components/sessions/NewSessionForm'

export const metadata = { title: 'Nouvelle session — FishDex' }

export default async function NouvellePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Vérifier qu'il n'y a pas déjà une session active
  const { data: existing } = await supabase
    .from('sessions')
    .select('id')
    .eq('user_id', user.id)
    .is('ended_at', null)
    .maybeSingle()

  if (existing) redirect(`/sessions/${existing.id}`)

  // Spots existants pour l'autocomplete
  const { data: userSpots } = await supabase
    .from('spots')
    .select('id, nom, nb_visites')
    .eq('user_id', user.id)
    .order('nb_visites', { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-[#0a0f14]">
      {/* Header */}
      <div className="relative px-4 pt-12 pb-6">
        <Link
          href="/sessions"
          className="absolute top-12 left-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">Nouvelle <span className="text-cyan-400">Session</span></h1>
          <p className="text-sm text-white/40 mt-1">Prépare ta prochaine aventure</p>
        </div>
      </div>

      <div className="px-4 pb-28">
        <NewSessionForm spots={userSpots ?? []} />
      </div>
    </div>
  )
}
