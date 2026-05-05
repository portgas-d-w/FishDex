// onboarding5.png — "Partage tes prises"
const POSTS = [
  {
    user: 'Maxime', level: 12, ago: 'Il y a 2h',
    fish: 'Brochet', latin: 'Esox lucius', weight: '6.2 kg', rarity: 'Rare', color: '#a855f7',
    likes: 128, comments: 24,
  },
  {
    user: 'LucasFishing', level: 8, ago: 'Il y a 9h',
    fish: 'Carpe miroir', latin: 'Cyprinus carpio', weight: '12.4 kg', rarity: 'Épique', color: '#f59e0b',
    likes: 96, comments: 18,
  },
  {
    user: 'FishingAddict', level: 5, ago: '1 j 4 h',
    fish: 'Perche', latin: 'Perca fluvialis', weight: '1.8 kg', rarity: 'Commun', color: '#22d3ee',
    likes: 72, comments: 11,
  },
]

function PostCard({ post, scale = 1 }: { post: typeof POSTS[0]; scale?: number }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(10,25,41,0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 pt-2.5 pb-2">
        <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-xs font-bold text-cyan-400">
          {post.user[0]}
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-white leading-none">{post.user}</p>
          <p className="text-[9px] text-slate-500 leading-none mt-0.5">Niveau {post.level}</p>
        </div>
        <span className="text-[9px] text-slate-500">{post.ago}</span>
      </div>

      {/* Photo simulée */}
      <div className="mx-2.5 rounded-xl overflow-hidden relative" style={{ height: 56 }}>
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 40% 40%, ${post.color}30 0%, rgba(5,13,23,0.95) 70%)` }} />
        <div className="absolute inset-0 flex items-center gap-2 px-2">
          <svg viewBox="0 0 40 28" className="w-12 h-8 shrink-0" fill="none">
            <ellipse cx="22" cy="14" rx="14" ry="9" fill={post.color} opacity="0.7" />
            <path d="M8 14 L0 6 L0 22 Z" fill={post.color} opacity="0.5" />
            <circle cx="32" cy="11" r="2" fill="rgba(5,13,23,0.9)" />
          </svg>
          <div>
            <p className="text-xs font-bold text-white leading-none">{post.fish}</p>
            <p className="text-sm font-black leading-tight" style={{ color: post.color }}>{post.weight}</p>
          </div>
          <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0"
            style={{ background: `${post.color}25`, color: post.color, border: `1px solid ${post.color}40` }}>
            {post.rarity}
          </span>
        </div>
      </div>

      {/* Likes */}
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <span>❤️</span> {post.likes}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <span>💬</span> {post.comments}
        </div>
      </div>
    </div>
  )
}

export function Screen5() {
  return (
    <div className="flex flex-col items-center justify-between h-full px-6 pt-10 pb-6">
      {/* Feed simulé — 3 cards empilées avec perspective */}
      <div className="flex-1 flex flex-col justify-center w-full gap-2 relative">
        {/* Badge "bientôt" */}
        <div className="absolute -top-2 right-0 z-10">
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/30">
            Bientôt disponible
          </span>
        </div>

        <div className="opacity-50 pointer-events-none" style={{ transform: 'translateY(4px) scale(0.95)', transformOrigin: 'top center' }}>
          <PostCard post={POSTS[2]} />
        </div>
        <div className="opacity-75 pointer-events-none" style={{ transform: 'translateY(2px) scale(0.975)', transformOrigin: 'top center' }}>
          <PostCard post={POSTS[1]} />
        </div>
        <div className="pointer-events-none">
          <PostCard post={POSTS[0]} />
        </div>

        {/* Bulles de commentaires flottantes */}
        <div className="absolute -right-2 top-1/3 bg-slate-800/80 border border-white/10 rounded-2xl rounded-tr-none px-2 py-1 text-[9px] text-slate-300">
          Super prise ! 🎣
        </div>
        <div className="absolute -left-2 bottom-1/4 bg-slate-800/80 border border-white/10 rounded-2xl rounded-tl-none px-2 py-1 text-[9px] text-slate-300">
          Belle prise ! 🔥
        </div>
      </div>

      {/* Texte */}
      <div className="text-center mt-4">
        <h1 className="text-4xl font-black leading-tight tracking-tight">
          <span className="text-cyan-400" style={{ textShadow: '0 0 20px rgba(34,211,238,0.5)' }}>Partage</span>
          <span className="text-white"> tes prises</span>
        </h1>
        <p className="text-slate-400 mt-3 text-base leading-relaxed">
          Publie tes captures et découvre<br />celles des autres pêcheurs
        </p>
      </div>
    </div>
  )
}
