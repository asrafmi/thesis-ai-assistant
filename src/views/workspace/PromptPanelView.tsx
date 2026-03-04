'use client'

// PRESENTATION LAYER — JSX with local UI state only. No business logic.

import { useState } from 'react'
import { Sparkles, X, History, Loader2 } from 'lucide-react'

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
  const [prompt, setPrompt] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return
    onGenerate(prompt.trim())
    setPrompt('')
  }

  return (
    <div className="w-80 shrink-0 border-r border-zinc-800 bg-zinc-950 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-500">
          <Sparkles size={13} />
          <span className="text-xs font-medium uppercase tracking-wider">AI Prompt</span>
        </div>
        <button onClick={onToggle} className="text-zinc-600 hover:text-zinc-300 transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto">
        {!activeSectionId && (
          <p className="text-xs text-zinc-500 text-center mt-4">
            Pilih bagian di sidebar untuk mulai menulis.
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e as unknown as React.FormEvent)
            }}
            disabled={!activeSectionId || isGenerating}
            placeholder={activeSectionId ? 'Instruksi untuk bagian ini...' : 'Pilih bagian dulu'}
            rows={5}
            className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={!activeSectionId || !prompt.trim() || isGenerating}
            className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate
              </>
            )}
          </button>
        </form>

        {promptHistory.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-zinc-600 mb-2">
              <History size={12} />
              <span className="text-xs">Riwayat</span>
            </div>
            <div className="flex flex-col gap-1">
              {promptHistory.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(item)}
                  className="text-left text-xs text-zinc-500 hover:text-zinc-300 truncate px-2 py-1 rounded hover:bg-zinc-800 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
