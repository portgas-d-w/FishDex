'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Fish, Settings, HelpCircle, LogOut, User } from 'lucide-react'
import { signOut } from '@/app/actions/auth'
import { Avatar } from './Avatar'

type Props = {
  username: string
  email: string
  avatarUrl: string | null
}

type MenuItem = {
  icon: React.ElementType
  label: string
  href: string
  disabled?: boolean
}

const MENU_ITEMS: MenuItem[] = [
  { icon: User,     label: 'Mon profil',  href: '/profil',     disabled: false },
  { icon: Fish,     label: 'Mes prises',  href: '/aquarium',   disabled: false },
  { icon: Settings, label: 'Paramètres', href: '/parametres', disabled: false },
  { icon: HelpCircle, label: 'Aide & Support', href: '#',     disabled: true  },
]

export function UserMenu({ username, email, avatarUrl }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div className="relative" ref={ref}>
      {/* Bouton avatar */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menu utilisateur"
        className="rounded-full transition-transform duration-150 hover:scale-105 active:scale-95"
      >
        <Avatar username={username} avatarUrl={avatarUrl} size="sm" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-md shadow-2xl z-50 overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* En-tête user */}
          <div className="flex flex-col items-center gap-2 px-4 py-4 border-b border-white/5">
            <Avatar username={username} avatarUrl={avatarUrl} size="lg" />
            <div className="text-center">
              <p className="text-sm font-bold text-white">{username}</p>
              <p className="text-xs text-slate-400 truncate max-w-[180px]">{email}</p>
              <p className="text-xs text-cyan-400 font-medium mt-0.5">Niveau 1 — Débutant</p>
            </div>
          </div>

          {/* Items */}
          <div className="py-1.5">
            {MENU_ITEMS.map(({ icon: Icon, label, href, disabled }) =>
              disabled ? (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-2.5 text-slate-600 cursor-not-allowed select-none"
                >
                  <Icon size={15} />
                  <span className="text-sm">{label}</span>
                  <span className="ml-auto text-[10px] font-bold text-slate-700 bg-slate-800 px-1.5 py-0.5 rounded-full">Bientôt</span>
                </div>
              ) : (
                <Link
                  key={label}
                  href={href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Icon size={15} className="text-slate-400" />
                  <span className="text-sm">{label}</span>
                </Link>
              )
            )}
          </div>

          {/* Déconnexion */}
          <div className="border-t border-white/5 py-1.5">
            <form action={signOut}>
              <button
                type="submit"
                role="menuitem"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={15} />
                <span className="text-sm font-medium">Se déconnecter</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
