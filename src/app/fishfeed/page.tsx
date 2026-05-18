import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getFeed, checkFeedAccess } from '@/app/actions/fishfeed'
import { FeedList } from '@/components/fishfeed/FeedList'
import { CreatePostButton } from '@/components/fishfeed/CreatePostButton'
import { Lock } from 'lucide-react'

export const metadata = { title: 'FishFeed — FishDex' }

export default async function FishFeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { hasAccess } = await checkFeedAccess()

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0a0f14] flex flex-col items-center justify-center px-6 text-center pb-28">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <Lock size={24} className="text-white/25" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">FishFeed</h1>
        <p className="text-white/50 text-sm leading-relaxed">
          Enregistre ta première capture pour<br />
          accéder à la communauté.
        </p>
      </div>
    )
  }

  // Captures récentes pour le sélecteur de post
  const { data: rawCatches } = await supabase
    .from('catches')
    .select('id, created_at, photo_url, species:species_id(nom_fr)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const recentCatches = (rawCatches ?? []).map(c => {
    const sp = Array.isArray(c.species) ? c.species[0] : c.species
    return {
      id: c.id,
      created_at: c.created_at,
      photo_url: c.photo_url ?? null,
      species_nom: (sp as { nom_fr: string } | null)?.nom_fr ?? null,
    }
  })

  const posts = await getFeed(20)

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-28">
      {/* Header */}
      <div className="px-4 pt-14 pb-4">
        <h1 className="text-3xl font-black text-white">FishFeed</h1>
        <p className="text-sm text-white/40 mt-0.5">La communauté — sans algorithme</p>
      </div>

      <FeedList initialPosts={posts} currentUserId={user.id} />

      {/* FAB création */}
      <CreatePostButton recentCatches={recentCatches} />
    </div>
  )
}
