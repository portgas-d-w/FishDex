import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SessionEditForm } from '@/components/sessions/SessionEditForm'

export const metadata = { title: 'Modifier la session — FishDex' }

export default async function EditSessionPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: session, error } = await supabase
    .from('sessions').select('*').eq('id', id).eq('user_id', user.id).single()
  if (error || !session) notFound()

  // Vérifier que la fenêtre d'édition est encore ouverte
  if (session.ended_at && session.editable_until) {
    if (new Date() > new Date(session.editable_until)) redirect(`/sessions/${id}`)
  }
  // Session encore active → autoriser les modifs
  // Session sans editable_until → ne devrait pas arriver mais on autorise

  // Calcul du temps restant
  let hoursLeft: number | null = null
  if (session.editable_until) {
    const diff = new Date(session.editable_until).getTime() - Date.now()
    hoursLeft = Math.max(0, Math.floor(diff / 3_600_000))
  }

  let spotNom: string | null = null
  if (session.spot_id) {
    const { data: spot } = await supabase.from('spots').select('nom').eq('id', session.spot_id).single()
    spotNom = (spot as { nom: string } | null)?.nom ?? null
  }

  return (
    <div className="min-h-screen bg-[#0a0f14]">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <Link href={`/sessions/${id}`} className="inline-flex items-center gap-1.5 text-white/40 hover:text-white transition-colors mb-4 text-sm">
          <ChevronLeft size={16} />
          Retour
        </Link>
        <h1 className="text-2xl font-black text-white">Modifier la session</h1>

        {hoursLeft !== null && (
          <div className="flex items-center gap-2 mt-3 rounded-xl bg-amber-400/8 border border-amber-400/15 px-3 py-2.5">
            <Clock size={13} className="text-amber-400 shrink-0" />
            <p className="text-xs text-amber-400/80">
              Tu peux modifier cette session pendant encore <strong>{hoursLeft}h</strong>.
            </p>
          </div>
        )}
      </div>

      <div className="px-4 pb-28">
        <SessionEditForm
          sessionId={id}
          userId={user.id}
          initialTitle={session.title}
          initialNotes={session.notes}
          initialRessenti={session.ressenti}
          initialPhotoUrl={session.photo_ambiance_url}
          spotNom={spotNom}
        />
      </div>
    </div>
  )
}
