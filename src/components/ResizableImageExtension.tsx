'use client'

import { Node, mergeAttributes } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from '@tiptap/react'
import { useRef, useState, useCallback, useEffect } from 'react'
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

type Align = 'left' | 'center' | 'right'

// ─── Align Toolbar ───────────────────────────────────────────────────────────

function AlignToolbar({
  align,
  onChange,
}: {
  align: Align
  onChange: (a: Align) => void
}) {
  const options: { value: Align; icon: React.ReactNode; label: string }[] = [
    { value: 'left', icon: <AlignLeft size={11} />, label: 'Rata kiri' },
    { value: 'center', icon: <AlignCenter size={11} />, label: 'Rata tengah' },
    { value: 'right', icon: <AlignRight size={11} />, label: 'Rata kanan' },
  ]

  return (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-gray-900 rounded-md px-1 py-0.5 shadow-md z-10">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          title={opt.label}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onChange(opt.value)
          }}
          className={`p-1 rounded transition-colors ${
            align === opt.value
              ? 'bg-blue-500 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  )
}

// ─── Node View Component ─────────────────────────────────────────────────────

function ResizableImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const { src, alt, width, align } = node.attrs as {
    src: string
    alt: string
    width: number | null
    align: Align
  }
  const imgRef = useRef<HTMLImageElement>(null)
  const startX = useRef(0)
  const startWidth = useRef(0)
  const [isResizing, setIsResizing] = useState(false)

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      startX.current = e.clientX
      startWidth.current = imgRef.current?.offsetWidth ?? width ?? 400

      setIsResizing(true)

      const onMouseMove = (ev: MouseEvent) => {
        const delta = ev.clientX - startX.current
        const newWidth = Math.max(80, Math.min(startWidth.current + delta, 900))
        updateAttributes({ width: Math.round(newWidth) })
      }

      const onMouseUp = () => {
        setIsResizing(false)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    },
    [width, updateAttributes],
  )

  useEffect(() => {
    if (!isResizing) return
    document.body.style.userSelect = 'none'
    return () => {
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  const justifyMap: Record<Align, string> = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  }

  return (
    <NodeViewWrapper
      style={{ display: 'flex', justifyContent: justifyMap[align ?? 'center'], width: '100%' }}
      className="my-2"
      data-drag-handle
    >
      <div className="relative inline-block group">
        {selected && !isResizing && (
          <AlignToolbar
            align={align ?? 'center'}
            onChange={(a) => updateAttributes({ align: a })}
          />
        )}

        <img
          ref={imgRef}
          src={src}
          alt={alt ?? ''}
          style={{
            width: `${width ?? 400}px`,
            display: 'block',
            outline: selected ? '2px solid #3b82f6' : 'none',
            outlineOffset: '2px',
          }}
          className="rounded max-w-full"
          draggable={false}
        />

        {/* Resize handle — bottom-right corner */}
        <div
          onMouseDown={onMouseDown}
          className={`absolute bottom-0 right-0 w-3 h-3 cursor-se-resize transition-opacity ${
            selected || isResizing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          title="Drag to resize"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" className="fill-blue-500 drop-shadow-sm">
            <rect x="0" y="8" width="3" height="3" rx="0.5" />
            <rect x="4" y="8" width="3" height="3" rx="0.5" />
            <rect x="8" y="8" width="3" height="3" rx="0.5" />
            <rect x="8" y="4" width="3" height="3" rx="0.5" />
            <rect x="8" y="0" width="3" height="3" rx="0.5" />
          </svg>
        </div>

        {/* Width label while resizing */}
        {isResizing && width && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none">
            {width}px
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

// ─── TipTap Extension ────────────────────────────────────────────────────────

export const ResizableImage = Node.create({
  name: 'image',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el) => el.getAttribute('src'),
        renderHTML: (attrs) => ({ src: attrs.src }),
      },
      alt: {
        default: null,
        parseHTML: (el) => el.getAttribute('alt'),
        renderHTML: (attrs) => ({ alt: attrs.alt }),
      },
      title: {
        default: null,
        parseHTML: (el) => el.getAttribute('title'),
        renderHTML: (attrs) => ({ title: attrs.title }),
      },
      width: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-width') ? Number(el.getAttribute('data-width')) : null,
        renderHTML: (attrs) => attrs.width ? { 'data-width': attrs.width } : {},
      },
      align: {
        default: 'center',
        parseHTML: (el) => el.getAttribute('data-align') ?? 'center',
        renderHTML: (attrs) => ({ 'data-align': attrs.align ?? 'center' }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView)
  },
})
