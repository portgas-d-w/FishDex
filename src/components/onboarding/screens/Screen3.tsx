import Image from 'next/image'

export function Screen3() {
  return (
    <div className="relative h-full overflow-hidden">
      {/* Background : pêcheur de dos au lever de soleil brumeux */}
      <Image
        src="/backgrounds/onboarding-session.webp"
        alt="Pêcheur au lever de soleil"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />

      {/* Texte en bas */}
      <div className="absolute bottom-0 left-0 right-0 px-7 pb-10">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-cyan-400/80 mb-3">
          Sessions
        </p>
        <h1 className="text-4xl font-black text-white leading-tight tracking-tight mb-4">
          Reviens à tes plus<br />belles sorties.
        </h1>
        <p className="text-base text-white/60 leading-relaxed">
          Le carnet vivant de tes sessions —<br />
          chaque spot, chaque moment, chaque condition.
        </p>
      </div>
    </div>
  )
}
