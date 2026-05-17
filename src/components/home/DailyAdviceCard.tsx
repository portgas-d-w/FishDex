import type { Context } from '@/lib/home/poetic-phrases'

const ADVICE: Record<string, string> = {
  'spring-dawn':      "Les carnassiers chassent avant le soleil. Heure de traque.",
  'spring-morning':   "Les poissons s'alimentent en surface. Bonne fenêtre.",
  'spring-midday':    "Ralentissement. Préfère les postes ombragés.",
  'spring-afternoon': "La magie dorée approche. Reste patient.",
  'spring-dusk':      "Les prédateurs sortent. Moment privilégié.",
  'spring-night':     "Nuit de carpe. Silence et patience.",
  'summer-dawn':      "Profite du frais. L'activité est maximale au lever.",
  'summer-morning':   "La chaleur monte. Cherche l'ombre des berges.",
  'summer-midday':    "Heure creuse. Repose-toi ou observe.",
  'summer-afternoon': "L'heure dorée approche. Les prédateurs s'éveillent.",
  'summer-dusk':      "Magic hour. Brochets et perches en chasse.",
  'summer-night':     "Nuit d'été. Carpes et silures actifs.",
  'autumn-dawn':      "Eau fraîche, poissons actifs. Belle heure.",
  'autumn-morning':   "Brochets et sandres en forme. Insiste.",
  'autumn-midday':    "Fenêtre stable. Profite-en.",
  'autumn-afternoon': "Lumière oblique. Heure des géants.",
  'autumn-dusk':      "Crépuscule court mais intense.",
  'autumn-night':     "Nuit fraîche. Carpes en quête de chaleur.",
  'winter-dawn':      "Eau froide, métabolisme lent. Ralentis l'approche.",
  'winter-morning':   "Cherche les postes ensoleillés. Poissons passifs.",
  'winter-midday':    "Meilleure heure de la journée en hiver.",
  'winter-afternoon': "Courte fenêtre. Saisis-la.",
  'winter-dusk':      "Nuit qui tombe vite. Chasse finale des brochets.",
  'winter-night':     "Nuit d'hiver. Carpes pélagiques en profondeur.",
}

export function DailyAdviceCard({ context }: { context: Context }) {
  const advice = ADVICE[`${context.season}-${context.light}`]
  if (!advice) return null

  return (
    <div className="rounded-2xl bg-white/4 border border-white/8 px-4 py-4">
      <p className="text-[10px] font-semibold tracking-widest text-white/30 mb-2">CONSEIL DU MOMENT</p>
      <p className="text-sm text-slate-400 leading-relaxed">{advice}</p>
    </div>
  )
}
