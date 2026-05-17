'use client'

import { useState, useTransition } from 'react'
import { Calendar, Droplets } from 'lucide-react'
import { Section } from './Section'
import { SettingItem } from './SettingItem'
import { updateProfilePreference } from '@/app/actions/profiles'

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 disabled:opacity-50 ${
        checked ? 'bg-cyan-400' : 'bg-white/15'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  )
}

type Props = {
  suggestSession: boolean
  defaultRelease: boolean
}

export function SessionPreferencesSection({ suggestSession, defaultRelease }: Props) {
  const [suggest,  setSuggest]  = useState(suggestSession)
  const [release,  setRelease]  = useState(defaultRelease)
  const [isPending, startTransition] = useTransition()

  function toggle(field: 'suggest_session_on_capture' | 'default_release', current: boolean, setter: (v: boolean) => void) {
    setter(!current)
    startTransition(async () => { await updateProfilePreference(field, !current) })
  }

  return (
    <Section icon={<Calendar size={13} className="text-cyan-400" />} title="Sessions">
      <SettingItem
        icon={<Calendar size={15} className="text-cyan-400" />}
        label="Suggérer une session après une capture"
        subtitle="Un rappel discret si aucune session n'est active"
        control={
          <Toggle
            checked={suggest}
            disabled={isPending}
            onChange={() => toggle('suggest_session_on_capture', suggest, setSuggest)}
          />
        }
      />
      <SettingItem
        icon={<Droplets size={15} className="text-slate-400" />}
        label="Cocher « Relâché » par défaut"
        subtitle="No-kill activé automatiquement lors d'une capture"
        control={
          <Toggle
            checked={release}
            disabled={isPending}
            onChange={() => toggle('default_release', release, setRelease)}
          />
        }
        last
      />
    </Section>
  )
}
