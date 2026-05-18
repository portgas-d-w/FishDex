import Image from 'next/image'

export function Screen1() {
  return (
    <div className="relative h-full overflow-hidden">
      {/* Background : lac brumeux à l'aube */}
      <Image
        src="/backgrounds/home-aube-canne.webp"
        alt="Lac brumeux à l'aube"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/85" />

      {/* Contenu */}
      <div className="relative h-full flex flex-col">
        {/* Logo centré en haut */}
        <div className="flex flex-col items-center pt-20 gap-3">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <Image src="/logo/icon-192.png" alt="FishDex" width={64} height={64} priority />
          </div>
          <span className="text-base font-black text-white/80 tracking-wide">FishDex</span>
        </div>

        {/* Texte en bas */}
        <div className="mt-auto px-7 pb-10">
          <h1 className="text-4xl font-black text-white leading-tight tracking-tight mb-4">
            Préserve tes moments<br />de pêche.
          </h1>
          <p className="text-base text-white/65 leading-relaxed">
            Une encyclopédie vivante de tes aventures —<br />
            chaque sortie, chaque prise, chaque instant.
          </p>
        </div>
      </div>
    </div>
  )
}
