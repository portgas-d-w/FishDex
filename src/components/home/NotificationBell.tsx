import { Bell } from 'lucide-react'

export function NotificationBell() {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
      <Bell size={18} className="text-white/80" />
    </div>
  )
}
