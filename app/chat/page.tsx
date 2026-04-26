import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import ChatClient from './ChatClient'

export default async function ChatPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile?.onboarding_complete) redirect('/onboarding')

  return (
    <AppShell>
      <ChatClient profile={profile} />
    </AppShell>
  )
}
