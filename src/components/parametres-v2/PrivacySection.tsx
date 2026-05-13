'use client'

import { useState } from 'react'
import { Shield, Lock, MapPin } from 'lucide-react'
import { Section } from './Section'
import { SettingItem } from './SettingItem'
import { SegmentedControl } from './SegmentedControl'
import { ToggleSwitch } from './ToggleSwitch'

const VISIBILITY = [
  { value: 'private', label: 'Privé' },
  { value: 'public',  label: 'Public' },
]

export function PrivacySection() {
  const [visibility, setVisibility] = useState('public')
  const [locationSharing, setLocationSharing] = useState(true)

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
        last
      />
    </Section>
  )
}
