import { Lightbulb } from 'lucide-react'
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
    <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5">
      <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
        Conseil du jour
      </p>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb size={14} className="text-cyan-400" />
        </div>
        <p className="text-sm text-white/70 leading-relaxed">{advice}</p>
      </div>
    </div>
  )
}
