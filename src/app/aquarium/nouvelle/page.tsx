import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CatchForm } from './CatchForm'

export const metadata = {
  title: 'Nouvelle prise — Aquarium',
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function NouvellePrisePage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: species } = await supabase
    .from('species')
    .select('id, nom_fr, categorie')
    .order('categorie')
    .order('nom_fr')

  const today = new Date().toISOString().split('T')[0]
  const params = await searchParams
  const rawPhoto = params.photo
  const photoPath = typeof rawPhoto === 'string' && rawPhoto.startsWith(`${user.id}/`)
    ? rawPhoto
    : null

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-400">Nouvelle prise</h1>
          <p className="text-slate-400 mt-2">Enregistre ta capture dans l&apos;aquarium</p>
        </div>
        <CatchForm species={species ?? []} today={today} photoPath={photoPath} />
      </div>
    </div>
  )
}
