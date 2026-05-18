import Link from 'next/link'
import { Info, FileText, Shield, HelpCircle, ChevronRight, PlayCircle } from 'lucide-react'
import { Section } from './Section'
import { SettingItem } from './SettingItem'

const chevron = <ChevronRight size={16} className="text-slate-600" />

export function OtherSection() {
  return (
    <Section icon={<Info size={13} className="text-cyan-400" />} title="Autres">
      {/* TODO: supprimer ce bouton avant la V1 publique */}
      <Link href="/onboarding?preview=1">
        <SettingItem
          icon={<PlayCircle size={15} className="text-cyan-400" />}
          label="Revoir l'onboarding"
          subtitle="Prévisualisation — à supprimer en V1"
          control={<ChevronRight size={16} className="text-cyan-400/50" />}
        />
      </Link>
      <SettingItem
        icon={<FileText size={15} className="text-slate-400" />}
        label="Conditions d'utilisation"
        control={chevron}
      />
      <SettingItem
        icon={<Shield size={15} className="text-slate-400" />}
        label="Politique de confidentialité"
        control={chevron}
      />
      <SettingItem
        icon={<HelpCircle size={15} className="text-slate-400" />}
        label="Aide & Support"
        control={chevron}
        last
      />
    </Section>
  )
}
