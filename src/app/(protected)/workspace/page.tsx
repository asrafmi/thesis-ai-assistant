import { Suspense } from 'react'
import { WorkspaceScreen } from '@/screens/WorkspaceScreen'

export default function Page() {
  return (
    <Suspense>
      <WorkspaceScreen />
    </Suspense>
  )
}
