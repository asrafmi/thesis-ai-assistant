'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { generateDiagramAction } from '@/actions/diagram.actions'
import { Code2, Image as ImageIcon } from 'lucide-react'

interface DiagramGeneratorModalProps {
  open: boolean
  onClose: () => void
  onInsert: (svgString: string) => void
  sectionTitle?: string
}

function DiagramSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-4 px-8 animate-pulse">
      <div className="h-10 w-48 rounded bg-gray-200" />
      <div className="h-4 w-4 rounded-full bg-gray-200" />
      <div className="h-10 w-56 rounded bg-gray-200" />
      <div className="h-4 w-4 rounded-full bg-gray-200" />
      <div className="h-10 w-52 rounded bg-gray-200" />
      <div className="h-4 w-4 rounded-full bg-gray-200" />
      <div className="h-10 w-48 rounded bg-gray-200" />
      <div className="h-4 w-4 rounded-full bg-gray-200" />
      <div className="h-10 w-44 rounded bg-gray-200" />
    </div>
  )
}

export function DiagramGeneratorModal({
  open,
  onClose,
  onInsert,
  sectionTitle,
}: DiagramGeneratorModalProps) {
  const [prompt, setPrompt] = useState('')
  const [mermaidCode, setMermaidCode] = useState('')
  const [svgOutput, setSvgOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRendering, setIsRendering] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [error, setError] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      setPrompt('')
      setMermaidCode('')
      setSvgOutput('')
      setError('')
      setShowCode(false)
    }
  }, [open])

  useEffect(() => {
    if (!mermaidCode) return

    async function renderMermaid() {
      setIsRendering(true)
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' })
        const id = `mermaid-${Date.now()}`
        const { svg } = await mermaid.render(id, mermaidCode)
        setSvgOutput(svg)
        setError('')
      } catch {
        setError('Diagram tidak valid. Coba generate ulang.')
        setSvgOutput('')
      } finally {
        setIsRendering(false)
      }
    }

    renderMermaid()
  }, [mermaidCode])

  async function handleGenerate() {
    if (!prompt.trim()) return
    setIsLoading(true)
    setError('')
    setSvgOutput('')
    setMermaidCode('')

    const result = await generateDiagramAction({ prompt, sectionTitle })

    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setMermaidCode(result.data)
    }

    setIsLoading(false)
  }

  async function handleInsert() {
    if (!svgOutput) return

    // Convert SVG → PNG via canvas so the exported .docx can embed it
    const svgBase64 = btoa(new TextEncoder().encode(svgOutput).reduce((acc, b) => acc + String.fromCharCode(b), ''))
    const svgDataUrl = `data:image/svg+xml;base64,${svgBase64}`

    // Parse viewBox to get actual SVG dimensions
    const viewBoxMatch = svgOutput.match(/viewBox="[^"]*\s+([\d.]+)\s+([\d.]+)"/)
    const svgW = viewBoxMatch ? parseFloat(viewBoxMatch[1]) : 800
    const svgH = viewBoxMatch ? parseFloat(viewBoxMatch[2]) : 600
    const scale = 2 // 2x for crisp quality

    await new Promise<void>((resolve) => {
      const img = new window.Image()
      img.onload = () => {
        const w = svgW * scale
        const h = svgH * scale
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)
        ctx.drawImage(img, 0, 0, w, h)
        const pngDataUrl = canvas.toDataURL('image/png')
        onInsert(pngDataUrl)
        resolve()
      }
      img.onerror = () => {
        onInsert(svgDataUrl)
        resolve()
      }
      img.src = svgDataUrl
    })

    onClose()
  }

  const hasResult = !!svgOutput
  const showPreviewArea = isLoading || isRendering || svgOutput || error || mermaidCode

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Generate Diagram</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 flex-1 overflow-hidden">
          <Textarea
            placeholder="Deskripsikan diagram yang kamu inginkan... contoh: diagram alir metodologi penelitian kuantitatif dengan 5 tahap"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="resize-none text-sm focus-visible:ring-0 focus-visible:border-ring"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate()
            }}
          />

          {showPreviewArea && (
            <div className="flex-1 overflow-hidden flex flex-col gap-2 min-h-0">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Preview</span>
                {mermaidCode && !isLoading && !isRendering && (
                  <button
                    type="button"
                    onClick={() => setShowCode((v) => !v)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCode ? (
                      <>
                        <ImageIcon size={12} />
                        Lihat Diagram
                      </>
                    ) : (
                      <>
                        <Code2 size={12} />
                        Lihat Code
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-auto rounded-md border border-border bg-white dark:bg-white min-h-[200px] p-4">
                {isLoading || isRendering ? (
                  <DiagramSkeleton />
                ) : error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : showCode ? (
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                    {mermaidCode}
                  </pre>
                ) : svgOutput ? (
                  <div
                    ref={previewRef}
                    className="flex justify-center"
                    dangerouslySetInnerHTML={{ __html: svgOutput }}
                  />
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isLoading || isRendering || !prompt.trim()}
            size="sm"
            variant={hasResult ? 'outline' : 'default'}
          >
            {isLoading ? 'Generating...' : hasResult ? 'Regenerate' : 'Generate'}
          </Button>
          {svgOutput && (
            <Button size="sm" onClick={handleInsert}>
              Insert ke Editor
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
