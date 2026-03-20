'use client'

import { useRouter } from 'next/navigation'
import { DashboardView } from '@/views/dashboard/DashboardView'
import { useTheses } from '@/hooks/useThesis'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { THESIS_LIMIT_FREE } from '@/lib/limits'

export function DashboardScreen() {
  const router = useRouter()
  const { theses, isLoading, removeThesis } = useTheses()
  const { profile } = useProfile()
  const { logout } = useAuth()

  const plan = profile?.plan ?? 'free'
  const canCreateThesis = plan === 'pro' || theses.length < THESIS_LIMIT_FREE

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
