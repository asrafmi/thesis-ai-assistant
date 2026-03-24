'use client'

import { useSearchParams } from 'next/navigation'
import { WorkspaceView } from '@/views/workspace/WorkspaceView'
import { useWorkspace } from '@/hooks/useWorkspace'

export function WorkspaceScreen() {
  const searchParams = useSearchParams()
  const thesisId = searchParams.get('thesisId') ?? undefined
  const workspace = useWorkspace(thesisId)

  return <WorkspaceView {...workspace} />
}
