import Link from 'next/link'
import Image from 'next/image'

type RecentCatch = {
  id: string
  date_capture: string
  created_at: string
  photo_url: string | null
  species: { nom_fr: string; image_url: string | null } | null
}

function dateRelative(iso: string): string {
  const now = new Date()
  const past = new Date(iso)
  const diffMs = now.getTime() - past.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Il y a 1 jour'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 14) return 'Il y a 1 semaine'
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
  if (diffDays < 60) return 'Il y a 1 mois'
  return `Il y a ${Math.floor(diffDays / 30)} mois`
}

export function RecentCatchCard({ catch: c }: { catch: RecentCatch }) {
  const imgSrc = c.photo_url
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catches/${c.photo_url}`
    : c.species?.image_url ?? '/fishes/placeholder.svg'

  return (
    <Link
      href={`/aquarium`}
      className="flex-shrink-0 w-36 sm:w-auto flex flex-col rounded-xl overflow-hidden
        bg-slate-900/40 border border-slate-800 hover:border-slate-600
        transition-colors group"
    >
      {/* Photo */}
      <div className="relative w-full aspect-square bg-slate-800">
        <Image
          src={imgSrc}
          alt={c.species?.nom_fr ?? 'Poisson'}
          fill
          sizes="(max-width: 640px) 144px, 200px"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Infos */}
      <div className="p-2.5 flex flex-col gap-0.5">
        <p className="text-xs font-semibold text-slate-100 truncate">
          {c.species?.nom_fr ?? 'Inconnu'}
        </p>
        <p className="text-[11px] text-slate-500">
          {dateRelative(c.created_at)}
        </p>
      </div>
    </Link>
  )
}
