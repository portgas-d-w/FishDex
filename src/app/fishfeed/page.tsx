import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getFeed, checkFeedAccess } from '@/app/actions/fishfeed'
import { FeedList } from '@/components/fishfeed/FeedList'
import { Lock } from 'lucide-react'

export const metadata = { title: 'FishFeed — FishDex' }

export default async function FishFeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { hasAccess, sessionCount, required } = await checkFeedAccess()

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0a0f14] flex flex-col items-center justify-center px-6 text-center pb-28">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <Lock size={24} className="text-white/25" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">FishFeed</h1>
        <p className="text-white/50 text-sm leading-relaxed mb-4">
          Le fil communautaire se débloque après<br />
          <span className="text-white/70 font-semibold">{required} sessions terminées</span>.
        </p>
        <div className="w-48 h-1.5 rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full bg-cyan-400/60 transition-all"
            style={{ width: `${Math.min((sessionCount / required) * 100, 100)}%` }}
          />
        </div>
        <p className="text-[11px] text-white/25 mt-2">
          {sessionCount} / {required} sessions
        </p>
        <p className="text-[11px] text-white/20 mt-6 max-w-xs leading-relaxed">
          Le FishFeed est réservé aux pêcheurs qui utilisent activement l&apos;app
          pour garder une communauté authentique.
        </p>
      </div>
    )
  }

  const posts = await getFeed(20)

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-28">
      {/* Header */}
      <div className="px-4 pt-14 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">FishFeed</h1>
          <p className="text-sm text-white/40 mt-0.5">La communauté — sans algorithme</p>
        </div>
      </div>

      <FeedList initialPosts={posts} currentUserId={user.id} />
    </div>
  )
}
