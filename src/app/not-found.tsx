import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#0a0f14]">
      <p className="text-5xl mb-6">🐟</p>
      <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
        404
      </p>
      <h2 className="text-xl font-semibold text-white mb-2">
        Cette page nage ailleurs
      </h2>
      <p className="text-sm text-white/50 mb-8 max-w-xs leading-relaxed">
        La rivière a peut-être changé de cours.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition-colors active:scale-95"
      >
        Retour au Spot
      </Link>
    </div>
  )
}
