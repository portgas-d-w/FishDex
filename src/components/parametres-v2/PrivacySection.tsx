'use client'

import { useState, useTransition } from 'react'
import { Shield, Lock, MapPin, Brain } from 'lucide-react'
import { Section } from './Section'
import { SettingItem } from './SettingItem'
import { SegmentedControl } from './SegmentedControl'
import { ToggleSwitch } from './ToggleSwitch'
import { updateProfilePreference } from '@/app/actions/profiles'

const VISIBILITY = [
  { value: 'private', label: 'Privé' },
  { value: 'public',  label: 'Public' },
]

type Props = {
  aiDataConsent: boolean
}

export function PrivacySection({ aiDataConsent }: Props) {
  const [visibility, setVisibility] = useState('public')
  const [locationSharing, setLocationSharing] = useState(true)
  const [aiConsent, setAiConsent] = useState(aiDataConsent)
  const [isPending, startTransition] = useTransition()

  function toggleAiConsent() {
    const next = !aiConsent
    setAiConsent(next)
    startTransition(async () => {
      await updateProfilePreference('ai_data_consent', next)
    })
  }

  return (
    <Section icon={<Shield size={13} className="text-cyan-400" />} title="Confidentialité">
      <SettingItem
        icon={<Lock size={15} className="text-slate-400" />}
        label="Compte"
        control={<SegmentedControl options={VISIBILITY} value={visibility} onChange={setVisibility} />}
      />
      <SettingItem
        icon={<MapPin size={15} className="text-slate-400" />}
        label="Partage de localisation"
        subtitle="Autoriser le partage de vos spot de pêche"
        control={<ToggleSwitch checked={locationSharing} onChange={setLocationSharing} label="Partage de localisation" />}
      />
      <SettingItem
        icon={<Brain size={15} className="text-slate-400" />}
        label="Contribuer à la reconnaissance d'espèces"
        subtitle="Tes photos validées aident à entraîner notre futur système IA. Aucune photo partagée publiquement."
        control={
          <ToggleSwitch
            checked={aiConsent}
            onChange={() => !isPending && toggleAiConsent()}
            label="Contribuer à l'IA"
          />
        }
        last
      />
    </Section>
  )
}
