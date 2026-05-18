import type { Metadata } from 'next'
import Image from 'next/image'
import { BetaSignupForm } from '@/components/beta/BetaSignupForm'

export const metadata: Metadata = {
  title: 'Rejoins la bêta — FishDex',
  description: 'Sois parmi les premiers à tester FishDex, le journal de pêche contemplatif.',
}

const FEATURES = [
  { emoji: '🐟', text: 'Identifie et collectionne tes prises' },
  { emoji: '📍', text: 'Géolocalise tes spots secrets' },
  { emoji: '📅', text: 'Revit tes plus belles sessions' },
]

export default function BetaPage() {
  return (
    <div className="min-h-screen bg-[#0a0f14]">

      {/* Hero */}
      <section className="relative h-[45vh] min-h-[260px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/backgrounds/home-default.webp)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#0a0f14]" />
        <div className="absolute bottom-8 left-6 right-6 z-10">
          <div className="flex items-center gap-3 mb-3">
            <Image src="/logo/icon-192.png" alt="FishDex" width={40} height={40} className="rounded-xl" />
            <span className="text-lg font-black text-white">FishDex</span>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight mb-2">
            Rejoins la bêta
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Sois parmi les 50 premiers pêcheurs<br />
            à découvrir FishDex en avant-première.
          </p>
        </div>
      </section>

      <div className="px-5 pb-32 space-y-6 mt-2">

        {/* Features */}
        <div className="rounded-2xl bg-white/5 border border-white/8 p-5 space-y-3">
          {FEATURES.map(f => (
            <div key={f.text} className="flex items-center gap-3">
              <span className="text-xl">{f.emoji}</span>
              <p className="text-sm text-white/70">{f.text}</p>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <div>
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4">
            Rejoindre la liste d&apos;attente
          </p>
          <BetaSignupForm />
        </div>

        {/* Footer note */}
        <p className="text-[11px] text-white/25 text-center leading-relaxed">
          Pas de spam. On te contacte uniquement pour t&apos;envoyer ton code d&apos;invitation.
        </p>
      </div>
    </div>
  )
}
