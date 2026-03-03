// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import type { Thesis } from '@/types/thesis.types'

interface DashboardViewProps {
  thesis: Thesis | null
  isLoading: boolean
}

export function DashboardView({ thesis, isLoading }: DashboardViewProps) {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}
