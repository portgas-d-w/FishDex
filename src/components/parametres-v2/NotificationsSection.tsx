'use client'

import { useState } from 'react'
import { Bell, Fish, Heart, Trophy } from 'lucide-react'
import { Section } from './Section'
import { SettingItem } from './SettingItem'
import { ToggleSwitch } from './ToggleSwitch'

export function NotificationsSection() {
  const [prises, setPrises] = useState(true)
  const [likes, setLikes] = useState(true)
  const [missions, setMissions] = useState(true)

  return (
    <Section icon={<Bell size={13} className="text-cyan-400" />} title="Notifications">
      <SettingItem
        icon={<Fish size={15} className="text-cyan-400" />}
        label="Nouvelles prises"
        subtitle="Être notifié des nouvelles prises"
        control={<ToggleSwitch checked={prises} onChange={setPrises} label="Nouvelles prises" />}
      />
      <SettingItem
        icon={<Heart size={15} className="text-slate-400" />}
        label="Mentions J'aime"
        subtitle="Être notifié des likes sur tes publications"
        control={<ToggleSwitch checked={likes} onChange={setLikes} label="Mentions J'aime" />}
      />
      <SettingItem
        icon={<Trophy size={15} className="text-amber-400" />}
        label="Missions & Badges"
        subtitle="Être notifié de tes progrès et récompenses"
        control={<ToggleSwitch checked={missions} onChange={setMissions} label="Missions & Badges" />}
        last
      />
    </Section>
  )
}
