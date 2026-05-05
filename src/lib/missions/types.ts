export type MissionType = 'daily' | 'weekly' | 'special'

export type MissionCondition = {
  action: string
  rarity?: string
  weight_kg?: number
}

export type Mission = {
  id: string
  slug: string
  type: MissionType
  title: string
  description: string | null
  xp_reward: number
  target: number
  conditions: MissionCondition | null
}

export type UserMission = {
  id: string
  mission_id: string
  period_key: string
  progress: number
  completed_at: string | null
  expires_at: string | null
  mission: Mission
}

export type MissionWithProgress = Mission & {
  userMissionId: string
  progress: number
  completed: boolean
}
