'use client'

import { useState } from 'react'
import { Scale, Moon, Globe, SlidersHorizontal, ChevronRight } from 'lucide-react'
import { Section } from './Section'
import { SettingItem } from './SettingItem'
import { SegmentedControl } from './SegmentedControl'

const UNITS = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
]

const THEMES = [
  { value: 'dark', label: 'Sombre' },
  { value: 'light', label: 'Clair', disabled: true },
]

export function PreferencesSection() {
  const [unit, setUnit] = useState('kg')
  const [theme, setTheme] = useState('dark')

  return (
    <Section icon={<SlidersHorizontal size={13} className="text-cyan-400" />} title="Préférences">
      <SettingItem
        icon={<Scale size={15} className="text-slate-400" />}
        label="Unités"
        control={<SegmentedControl options={UNITS} value={unit} onChange={setUnit} />}
      />
      <SettingItem
        icon={<Moon size={15} className="text-slate-400" />}
        label="Thème"
        control={<SegmentedControl options={THEMES} value={theme} onChange={setTheme} />}
      />
      <SettingItem
        icon={<Globe size={15} className="text-slate-400" />}
        label="Langue"
        control={
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-slate-300 font-medium">Français</span>
            <ChevronRight size={14} className="text-slate-600" />
          </div>
        }
        last
      />
    </Section>
  )
}
