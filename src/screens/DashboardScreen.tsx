'use client'

import { DashboardView } from '@/views/dashboard/DashboardView'
import { useThesis } from '@/hooks/useThesis'

export function DashboardScreen() {
  const { thesis, isLoading } = useThesis()

  return <DashboardView thesis={thesis} isLoading={isLoading} />
}
