import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile?.onboarding_complete) {
    redirect('/onboarding')
  }

  // Get today's symptom log
  const today = new Date().toISOString().split('T')[0]
  const { data: todayLog } = await supabase
    .from('symptom_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  return (
    <AppShell>
      <DashboardClient profile={profile} todayLog={todayLog} />
    </AppShell>
  )
}
