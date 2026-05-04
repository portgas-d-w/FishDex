import { Fish, MapPin, ChevronRight } from 'lucide-react'
import { Section } from './Section'
import { SettingItem } from './SettingItem'

type Props = {
  spotsCount: number
}

const chevron = <ChevronRight size={16} className="text-slate-600" />

export function FishingPreferencesSection({ spotsCount }: Props) {
  return (
    <Section icon={<Fish size={13} className="text-cyan-400" />} title="Préférences de pêche">
      <SettingItem
        icon={<Fish size={15} className="text-cyan-400" />}
        label="Type de pêche favori"
        subtitle="Carpe, Prédateur"
        control={chevron}
      />
      <SettingItem
        icon={<MapPin size={15} className="text-slate-400" />}
        label="Lieux de pêche favoris"
        subtitle={spotsCount > 0 ? `${spotsCount} lieu${spotsCount > 1 ? 'x' : ''} enregistré${spotsCount > 1 ? 's' : ''}` : 'Aucun lieu enregistré'}
        control={chevron}
        last
      />
    </Section>
  )
}
