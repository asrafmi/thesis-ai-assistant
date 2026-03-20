'use client'

import { useRouter } from 'next/navigation'
import { DashboardView } from '@/views/dashboard/DashboardView'
import { useTheses } from '@/hooks/useThesis'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { THESIS_LIMIT_FREE, THESIS_LIMIT_STARTER, THESIS_LIMIT_FULL } from '@/lib/limits'

export function DashboardScreen() {
  const router = useRouter()
  const { theses, isLoading, removeThesis } = useTheses()
  const { profile } = useProfile()
  const { logout } = useAuth()

  const plan = profile?.plan ?? 'free'
  const thesisLimit = plan === 'full' ? THESIS_LIMIT_FULL
    : plan === 'starter' ? THESIS_LIMIT_STARTER
    : THESIS_LIMIT_FREE
  const canCreateThesis = theses.length < thesisLimit

  return (
    <DashboardView
      theses={theses}
      isLoading={isLoading}
      plan={plan}
      canCreateThesis={canCreateThesis}
      onOpenThesis={(id) => router.push(`/workspace?thesisId=${id}`)}
      onCreateThesis={() => router.push('/thesis/new')}
      onDeleteThesis={removeThesis}
      onLogout={logout}
      onSettings={() => router.push('/settings')}
    />
  )
}
