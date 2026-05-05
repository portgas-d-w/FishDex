import Link from 'next/link'
import { Settings, UserCircle, Share2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'

type Props = {
  memberSince: string
}

function formatSince(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

export function ProfilHeader({ memberSince: _memberSince }: Props) {
  return (
    <PageHeader
      leftAction={
        <Link
          href="/parametres"
          aria-label="Paramètres"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-slate-300 hover:text-white transition-colors"
        >
          <Settings size={18} />
        </Link>
      }
      icon={<UserCircle size={16} className="text-cyan-400" />}
      title="Mon Profil"
      rightAction={
        <button
          aria-label="Partager le profil"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-slate-300 hover:text-white transition-colors"
        >
          <Share2 size={18} />
        </button>
      }
    />
  )
}
