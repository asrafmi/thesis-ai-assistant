// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

interface PromptPanelViewProps {
  activeSectionId: string | null
  promptHistory: string[]
  isGenerating: boolean
  onGenerate: (prompt: string) => void
  onToggle: () => void
}

export function PromptPanelView({
  activeSectionId,
  promptHistory,
  isGenerating,
  onGenerate,
  onToggle,
}: PromptPanelViewProps) {
  return (
    <div className="w-80 border-r">
      <div>Prompt Panel</div>
    </div>
  )
}
