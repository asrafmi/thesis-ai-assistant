'use client'

// PRESENTATION LAYER — JSX with local UI state only. No business logic.

import { useState } from 'react';
import {
  Sparkles,
  X,
  History,
  Loader2,
  BookOpen,
  Trash2,
  Search,
} from 'lucide-react';
import type { Reference, ReferenceStyle } from '@/types/thesis.types';
import type { UsageData } from '@/lib/limits';

interface PromptPanelViewProps {
  activeSectionId: string | null;
  promptHistory: string[];
  isGenerating: boolean;
  references: Reference[];
  isSearching: boolean;
  isSearchEnabled: boolean;
  searchError: string | null;
  usage: UsageData | null;
  onGenerate: (prompt: string) => void;
  referenceStyle: ReferenceStyle;
  onToggle: () => void;
  onToggleSearch: () => void;
  onDeleteReference: (refId: string) => void;
  onChangeReferenceStyle: (style: ReferenceStyle) => void;
}

export function PromptPanelView({
  activeSectionId,
  promptHistory,
  isGenerating,
  references,
  isSearching,
  isSearchEnabled,
  searchError,
  usage,
  referenceStyle,
  onGenerate,
  onToggle,
  onToggleSearch,
  onDeleteReference,
  onChangeReferenceStyle,
}: PromptPanelViewProps) {
  const [prompt, setPrompt] = useState('');
  const [showRefs, setShowRefs] = useState(false);

  const isBusy = isGenerating || isSearching;

  const isWordLimitReached =
    usage?.plan === 'free' && usage.wordCount >= usage.wordLimit;
  const isExportLimitReached =
    usage != null && usage.exportLimit !== Infinity && usage.exportCount >= usage.exportLimit;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || isBusy) return;
    onGenerate(prompt.trim());
    setPrompt('');
  }

  return (
    <div className='w-80 shrink-0 border-r border-border bg-background flex flex-col h-full'>
      <div className='flex items-center justify-between px-4 py-3 border-b border-border'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <Sparkles size={13} />
          <span className='text-xs font-medium uppercase tracking-wider'>
            AI Prompt
          </span>
        </div>

        <button
          type='button'
          onClick={onToggle}
          className='text-muted-foreground/70 hover:text-foreground transition-colors'
          title='Tutup'
        >
          <X size={14} />
        </button>
      </div>

      <div className='flex-1 flex flex-col gap-4 p-4 overflow-y-auto'>
        {!activeSectionId && (
          <p className='text-xs text-muted-foreground text-center mt-4'>
            Pilih bagian di sidebar untuk mulai menulis.
          </p>
        )}

        {/* Reference style selector */}
        <div className='flex flex-col gap-1.5'>
          <span className='text-[10px] text-muted-foreground uppercase tracking-wider'>Format Referensi</span>
          <div className='flex gap-1'>
            {(['apa', 'ieee', 'mendeley'] as ReferenceStyle[]).map((s) => (
              <button
                key={s}
                type='button'
                onClick={() => onChangeReferenceStyle(s)}
                className={[
                  'flex-1 rounded px-2 py-1 text-[11px] font-medium transition-colors border',
                  referenceStyle === s
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'bg-muted border-border text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Search toggle */}
        <button
          type='button'
          onClick={onToggleSearch}
          disabled={!activeSectionId}
          className={[
            'flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors disabled:opacity-40',
            isSearchEnabled
              ? 'bg-primary/10 border border-primary/30 text-primary'
              : 'bg-muted border border-border text-muted-foreground hover:text-foreground',
          ].join(' ')}
        >
          <BookOpen size={12} />
          <span>Cari Referensi</span>

          <span
            className={[
              'ml-auto text-[10px] px-1.5 py-0.5 rounded',
              isSearchEnabled
                ? 'bg-primary/25 text-primary'
                : 'bg-muted-foreground/15 text-muted-foreground',
            ].join(' ')}
          >
            {isSearchEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
            disabled={!activeSectionId || isBusy}
            placeholder={
              activeSectionId
                ? 'Instruksi untuk bagian ini...'
                : 'Pilih bagian dulu'
            }
            rows={5}
            className={[
              'w-full resize-none rounded-md border px-3 py-2 text-sm',
              'bg-muted text-foreground placeholder:text-muted-foreground/70',
              'border-border focus:border-primary focus:outline-none disabled:opacity-40',
            ].join(' ')}
          />

          <button
            type='submit'
            disabled={!activeSectionId || !prompt.trim() || isBusy}
            className='flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
          >
            {isSearching ? (
              <>
                <Search size={14} className='animate-pulse' />
                Mencari referensi...
              </>
            ) : isGenerating ? (
              <>
                <Loader2 size={14} className='animate-spin' />
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
          <p className='text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2'>
            Gagal cari referensi: {searchError}
          </p>
        )}

        {/* Saved references */}
        {references.length > 0 && (
          <div>
            <button
              type='button'
              onClick={() => setShowRefs((v) => !v)}
              className='flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mb-2 w-full'
            >
              <BookOpen size={12} />
              <span className='text-xs'>Referensi Tersimpan</span>

              <span className='ml-1 text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full'>
                {references.length}
              </span>

              <span className='ml-auto text-[10px] text-muted-foreground/70'>
                {showRefs ? '▲' : '▼'}
              </span>
            </button>

            {showRefs && (
              <div className='flex flex-col gap-1'>
                {references.map((ref) => (
                  <div
                    key={ref.id}
                    className='flex items-start gap-2 px-2 py-1.5 rounded bg-muted/60 group'
                  >
                    <span className='text-[10px] text-muted-foreground/70 shrink-0 mt-0.5'>
                      [{ref.citation_number}]
                    </span>

                    <div className='flex-1 min-w-0'>
                      <p
                        className='text-xs text-muted-foreground truncate'
                        title={ref.title}
                      >
                        {ref.title}
                      </p>

                      {(ref.authors || ref.year) && (
                        <p className='text-[10px] text-muted-foreground/70'>
                          {ref.authors ?? 'Anonim'}
                          {ref.year ? `, ${ref.year}` : ''}
                        </p>
                      )}
                    </div>

                    <button
                      type='button'
                      onClick={() => onDeleteReference(ref.id)}
                      className='text-muted-foreground/60 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 shrink-0'
                      title='Hapus referensi'
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
            <div className='flex items-center gap-1.5 text-muted-foreground/70 mb-2'>
              <History size={12} />
              <span className='text-xs'>Riwayat</span>
            </div>

            <div className='flex flex-col gap-1'>
              {promptHistory.map((item, i) => (
                <button
                  key={i}
                  type='button'
                  onClick={() => setPrompt(item)}
                  className='text-left text-xs text-muted-foreground hover:text-foreground truncate px-2 py-1 rounded hover:bg-muted transition-colors'
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Usage stats — show for plans with limits */}
      {usage && (usage.plan === 'free' || usage.exportLimit !== Infinity || usage.diagramLimit !== Infinity) && (
        <div className='px-4 py-3 border-t border-border flex flex-col gap-2.5'>
          {/* Word usage — free plan only */}
          {usage.plan === 'free' && (
            <div className='flex flex-col gap-1'>
              <div className='flex items-center justify-between'>
                <span className='text-[10px] text-muted-foreground uppercase tracking-wider'>
                  Kata bulan ini
                </span>
                <span
                  className={[
                    'text-[10px] font-medium tabular-nums',
                    isWordLimitReached ? 'text-destructive' : 'text-muted-foreground',
                  ].join(' ')}
                >
                  {usage.wordCount.toLocaleString()} / {usage.wordLimit.toLocaleString()}
                </span>
              </div>
              <div className='h-1 rounded-full bg-muted overflow-hidden'>
                <div
                  className={[
                    'h-full rounded-full transition-all',
                    isWordLimitReached ? 'bg-destructive' : 'bg-primary',
                  ].join(' ')}
                  style={{ width: `${Math.min((usage.wordCount / usage.wordLimit) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Diagram usage — plans with diagram limits */}
          {usage.diagramLimit !== Infinity && (
            <div className='flex items-center justify-between'>
              <span className='text-[10px] text-muted-foreground uppercase tracking-wider'>
                Sisa diagram
              </span>
              <span
                className={[
                  'text-[10px] font-medium',
                  usage.diagramCount >= usage.diagramLimit ? 'text-destructive' : 'text-muted-foreground',
                ].join(' ')}
              >
                {usage.diagramCount >= usage.diagramLimit
                  ? 'Habis — upgrade paket'
                  : `${usage.diagramLimit - usage.diagramCount} / ${usage.diagramLimit}`}
              </span>
            </div>
          )}

          {/* Export usage — plans with export limits */}
          {usage.exportLimit !== Infinity && (
            <div className='flex items-center justify-between'>
              <span className='text-[10px] text-muted-foreground uppercase tracking-wider'>
                Sisa export
              </span>
              <span
                className={[
                  'text-[10px] font-medium',
                  isExportLimitReached ? 'text-destructive' : 'text-muted-foreground',
                ].join(' ')}
              >
                {isExportLimitReached
                  ? 'Habis — upgrade paket'
                  : `${usage.exportLimit - usage.exportCount} / ${usage.exportLimit}`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
