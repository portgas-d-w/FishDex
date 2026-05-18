import Image from 'next/image'

export function Screen2() {
  return (
    <div className="relative h-full overflow-hidden">
      {/* Background : pêcheuse avec carpe au lever de soleil */}
      <Image
        src="/backgrounds/onboarding-capture.webp"
        alt="Prise contemplative"
        fill
        sizes="100vw"
        className="object-cover object-top"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />

      {/* Texte en bas */}
      <div className="absolute bottom-0 left-0 right-0 px-7 pb-52">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-cyan-400/80 mb-3">
          Capture
        </p>
        <h1 className="text-4xl font-black text-white leading-tight tracking-tight mb-4">
          Chaque prise devient<br />un souvenir.
        </h1>
        <p className="text-base text-white/60 leading-relaxed">
          Photographie, géolocalise, note le moment.<br />
          Rien ne se perd.
        </p>
      </div>
    </div>
  )
}
