import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const ADMIN_EMAIL = 'alexy101099@gmail.com'

export default async function FishFeedModerationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/')

  // Posts signalés
  const { data: flaggedPosts } = await supabase
    .from('posts')
    .select(`
      id, caption, type, created_at, report_count, is_public,
      author:profiles!user_id(username),
      catch:catches!catch_id(photo_url, species:species_id(nom_fr))
    `)
    .gt('report_count', 0)
    .order('report_count', { ascending: false })
    .limit(50)

  // Stats globales
  const { count: totalPosts } = await supabase
    .from('posts').select('id', { count: 'exact', head: true })

  const { count: hiddenPosts } = await supabase
    .from('posts').select('id', { count: 'exact', head: true }).eq('is_public', false)

  const { count: totalReactions } = await supabase
    .from('reactions').select('id', { count: 'exact', head: true })

  return (
    <div className="min-h-screen bg-[#0a0f14] px-4 pt-12 pb-32">
      <h1 className="text-2xl font-black text-white mb-1">Modération FishFeed</h1>
      <p className="text-white/40 text-sm mb-8">Signalements et statistiques</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Posts publiés', value: totalPosts ?? 0,    color: 'text-cyan-400'   },
          { label: 'Masqués',       value: hiddenPosts ?? 0,   color: 'text-red-400'    },
          { label: 'Réactions',     value: totalReactions ?? 0, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Posts signalés */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
          Posts signalés ({flaggedPosts?.length ?? 0})
        </p>
        {!flaggedPosts?.length ? (
          <p className="text-sm text-white/25 italic">Aucun signalement</p>
        ) : (
          <div className="space-y-3">
            {flaggedPosts.map(p => {
              const author = Array.isArray(p.author) ? p.author[0] : p.author
              const catchData = Array.isArray(p.catch) ? p.catch[0] : p.catch
              const rawSp = (catchData as {species:unknown}|null)?.species
              const sp = Array.isArray(rawSp) ? (rawSp[0] as {nom_fr:string}|undefined) ?? null : (rawSp as {nom_fr:string}|null)
              return (
                <div key={p.id} className={`rounded-xl border p-3 ${!p.is_public ? 'bg-red-400/5 border-red-400/15' : 'bg-white/4 border-white/8'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{(author as {username:string}|null)?.username ?? '?'}</p>
                      {!p.is_public && (
                        <span className="text-[9px] font-bold text-red-400 bg-red-400/10 border border-red-400/20 px-1.5 py-0.5 rounded-full">MASQUÉ</span>
                      )}
                    </div>
                    <span className={`text-xs font-bold ${p.report_count >= 3 ? 'text-red-400' : 'text-amber-400'}`}>
                      {p.report_count} signal.
                    </span>
                  </div>
                  {(sp as {nom_fr:string}|null)?.nom_fr && (
                    <p className="text-xs text-white/40">{(sp as {nom_fr:string}).nom_fr}</p>
                  )}
                  {p.caption && (
                    <p className="text-xs text-white/50 mt-1 italic">&ldquo;{p.caption}&rdquo;</p>
                  )}
                  <p className="text-[10px] text-white/20 mt-1.5">
                    {new Date(p.created_at).toLocaleDateString('fr-FR')} · {p.type}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
