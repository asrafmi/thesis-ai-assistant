'use client'

// PRESENTATION LAYER — JSX with local UI state only. No business logic.

import { useState } from 'react'
import { Sparkles, X, History, Loader2, BookOpen, Trash2, Search } from 'lucide-react'
import type { Reference } from '@/types/thesis.types'

interface PromptPanelViewProps {
  activeSectionId: string | null
  promptHistory: string[]
  isGenerating: boolean
  references: Reference[]
  isSearching: boolean
  isSearchEnabled: boolean
  searchError: string | null
  onGenerate: (prompt: string) => void
  onToggle: () => void
  onToggleSearch: () => void
  onDeleteReference: (refId: string) => void
}

export function PromptPanelView({
  activeSectionId,
  promptHistory,
  isGenerating,
  references,
  isSearching,
  isSearchEnabled,
  searchError,
  onGenerate,
  onToggle,
  onToggleSearch,
  onDeleteReference,
}: PromptPanelViewProps) {
  const [prompt, setPrompt] = useState('')
  const [showRefs, setShowRefs] = useState(false)

  const isBusy = isGenerating || isSearching

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim() || isBusy) return
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

        {/* Search toggle */}
        <button
          onClick={onToggleSearch}
          disabled={!activeSectionId}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors disabled:opacity-40 ${
            isSearchEnabled
              ? 'bg-blue-950 border border-blue-700 text-blue-300'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <BookOpen size={12} />
          <span>Cari Referensi</span>
          <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded ${isSearchEnabled ? 'bg-blue-700 text-blue-100' : 'bg-zinc-700 text-zinc-400'}`}>
            {isSearchEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e as unknown as React.FormEvent)
            }}
            disabled={!activeSectionId || isBusy}
            placeholder={activeSectionId ? 'Instruksi untuk bagian ini...' : 'Pilih bagian dulu'}
            rows={5}
            className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={!activeSectionId || !prompt.trim() || isBusy}
            className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? (
              <>
                <Search size={14} className="animate-pulse" />
                Mencari referensi...
              </>
            ) : isGenerating ? (
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

        {searchError && (
          <p className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
            Gagal cari referensi: {searchError}
          </p>
        )}

        {/* Saved references */}
        {references.length > 0 && (
          <div>
            <button
              onClick={() => setShowRefs((v) => !v)}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors mb-2 w-full"
            >
              <BookOpen size={12} />
              <span className="text-xs">Referensi Tersimpan</span>
              <span className="ml-1 text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-full">
                {references.length}
              </span>
              <span className="ml-auto text-[10px] text-zinc-600">{showRefs ? '▲' : '▼'}</span>
            </button>
            {showRefs && (
              <div className="flex flex-col gap-1">
                {references.map((ref) => (
                  <div
                    key={ref.id}
                    className="flex items-start gap-2 px-2 py-1.5 rounded bg-zinc-900 group"
                  >
                    <span className="text-[10px] text-zinc-600 shrink-0 mt-0.5">[{ref.citation_number}]</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-400 truncate" title={ref.title}>{ref.title}</p>
                      {(ref.authors || ref.year) && (
                        <p className="text-[10px] text-zinc-600">
                          {ref.authors ?? 'Anonim'}{ref.year ? `, ${ref.year}` : ''}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteReference(ref.id)}
                      className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Prompt history */}
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
