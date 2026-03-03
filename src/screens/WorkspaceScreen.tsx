'use client'

import { WorkspaceView } from '@/views/workspace/WorkspaceView'
import { useWorkspace } from '@/hooks/useWorkspace'

export function WorkspaceScreen() {
  const workspace = useWorkspace()

  return <WorkspaceView {...workspace} />
}
