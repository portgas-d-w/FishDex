'use client'

import { LogOut } from 'lucide-react'
import { signOut } from '@/app/actions/auth'

export function LogoutButton() {
  return (
    <div className="px-4 mt-6 mb-8">
      <form action={signOut}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl
            bg-red-500/10 border border-red-500/30 text-red-400
            hover:bg-red-500/15 hover:border-red-500/50 transition-all duration-200
            active:scale-[0.98] font-semibold text-sm"
        >
          <LogOut size={18} />
          Se déconnecter
        </button>
      </form>
    </div>
  )
}
