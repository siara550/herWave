import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import TrackerClient from './TrackerClient'

export default async function TrackerPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile?.onboarding_complete) redirect('/onboarding')

  // Get recent symptom logs (last 30 days)
  const { data: logs } = await supabase
    .from('symptom_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(30)

  // Get recent period logs
  const { data: periodLogs } = await supabase
    .from('period_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('start_date', { ascending: false })
    .limit(10)

  return (
    <AppShell>
      <TrackerClient
        userId={user.id}
        profile={profile}
        logs={logs || []}
        periodLogs={periodLogs || []}
      />
    </AppShell>
  )
}
