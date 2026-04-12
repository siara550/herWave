export interface Profile {
  id: string
  user_id: string
  name: string
  avatar_url: string | null
  cycle_length: number
  last_period_date: string
  symptoms_to_track: string[]
  notifications_enabled: boolean
  onboarding_complete: boolean
  created_at: string
  updated_at: string
}

export interface PeriodLog {
  id: string
  user_id: string
  start_date: string
  end_date: string | null
  created_at: string
}

export interface SymptomLog {
  id: string
  user_id: string
  date: string
  mood: number | null        // 1-5
  energy: number | null      // 1-5
  cramps: number | null      // 1-5
  bloating: number | null    // 1-5
  flow_intensity: number | null  // 1-5
  notes: string | null
  created_at: string
}

export type SymptomKey = 'mood' | 'energy' | 'cramps' | 'bloating' | 'flow_intensity'
