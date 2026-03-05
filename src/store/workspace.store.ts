import { create } from 'zustand'

interface WorkspaceState {
  activeSectionId: string | null
  isSidebarOpen: boolean
  isPromptPanelOpen: boolean
  promptHistory: string[]

  setActiveSectionId: (id: string | null) => void
  toggleSidebar: () => void
  togglePromptPanel: () => void
  addPromptHistory: (prompt: string) => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeSectionId: null,
  isSidebarOpen: true,
  isPromptPanelOpen: true,
  promptHistory: [],

  setActiveSectionId: (id) => set({ activeSectionId: id }),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  togglePromptPanel: () => set((s) => ({ isPromptPanelOpen: !s.isPromptPanelOpen })),
  addPromptHistory: (prompt) =>
    set((s) => ({ promptHistory: [prompt, ...s.promptHistory].slice(0, 20) })),
}))
