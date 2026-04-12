import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import InsightsClient from './InsightsClient'
import { getCurrentPhase } from '@/lib/cycle'

export default async function InsightsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile?.onboarding_complete) redirect('/onboarding')

  const phaseInfo = getCurrentPhase(profile.last_period_date, profile.cycle_length)

  return (
    <AppShell>
      <InsightsClient profile={profile} phaseInfo={phaseInfo} />
    </AppShell>
  )
}
