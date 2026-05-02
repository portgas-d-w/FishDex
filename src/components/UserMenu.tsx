'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { signOut } from '@/app/actions/auth'

type Props = {
  username: string
  avatarUrl: string | null
}

export function UserMenu({ username, avatarUrl }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const initials = username.slice(0, 2).toUpperCase()

  return (
    <div className="relative" ref={ref}>
      {/* Bouton avatar */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Menu utilisateur"
        className="w-9 h-9 rounded-full bg-teal-800 hover:bg-teal-700 border border-teal-600/50 text-teal-200 text-sm font-bold flex items-center justify-center transition-colors overflow-hidden"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {/* Menu déroulant */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50">
          {/* Pseudo */}
          <div className="px-3 py-2 border-b border-slate-800">
            <p className="text-sm font-medium text-slate-200 truncate">{username}</p>
          </div>

          <Link
            href="/profil"
            onClick={() => setOpen(false)}
            className="flex items-center px-3 py-2 text-sm text-slate-300 hover:text-teal-400 hover:bg-slate-800 transition-colors"
          >
            Mon profil
          </Link>

          <Link
            href="/parametres"
            onClick={() => setOpen(false)}
            className="flex items-center px-3 py-2 text-sm text-slate-300 hover:text-teal-400 hover:bg-slate-800 transition-colors"
          >
            Paramètres
          </Link>

          <div className="border-t border-slate-800 mt-1 pt-1">
            <form action={signOut}>
              <button
                type="submit"
                className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
