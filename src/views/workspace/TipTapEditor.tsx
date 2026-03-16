'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useEffect, useRef, useCallback, useState } from 'react'
import { ImageIcon, Workflow } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DiagramGeneratorModal } from '@/components/DiagramGeneratorModal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface TipTapEditorProps {
  content: Record<string, unknown> | null
  isActive: boolean
  onChange: (content: Record<string, unknown>) => void
  sectionTitle?: string
}

const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] }

async function uploadImageToStorage(file: File): Promise<string | null> {
  const supabase = createClient()
  const ext = file.name.split('.').pop() ?? 'png'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('thesis-images').upload(path, file)
  if (error) return null
  const { data } = supabase.storage.from('thesis-images').getPublicUrl(path)
  return data.publicUrl
}

function ToolbarButton({
  onClick,
  isActive,
  title,
  children,
}: {
  onClick: () => void
  isActive: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            onClick()
          }}
          className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
            isActive
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {title}
      </TooltipContent>
    </Tooltip>
  )
}

function Toolbar({
  editor,
  onImageFile,
  onDiagram,
}: {
  editor: Editor
  onImageFile: (file: File) => void
  onDiagram: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-0.5 mb-1.5 pb-1.5 border-b border-border/60">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Cmd+B)"
        >
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Cmd+I)"
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <span className="line-through">S</span>
        </ToolbarButton>
        <span className="w-px h-3 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet list"
        >
          ≡
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered list"
        >
          1.
        </ToolbarButton>
        <span className="w-px h-3 bg-border mx-1" />
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          isActive={false}
          title="Insert image"
        >
          <ImageIcon size={12} />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onImageFile(file)
            e.target.value = ''
          }}
        />
        <ToolbarButton onClick={onDiagram} isActive={false} title="Generate diagram">
          <Workflow size={12} />
        </ToolbarButton>
      </div>
    </TooltipProvider>
  )
}

export function TipTapEditor({ content, isActive, onChange, sectionTitle }: TipTapEditorProps) {
  const editorRef = useRef<Editor | null>(null)
  const [diagramModalOpen, setDiagramModalOpen] = useState(false)

  const handleImageFile = useCallback(async (file: File) => {
    const url = await uploadImageToStorage(file)
    if (url && editorRef.current) {
      editorRef.current.chain().focus().setImage({ src: url }).run()
    }
  }, [])

  const handleInsertDiagram = useCallback((svgDataUrl: string) => {
    editorRef.current?.chain().focus().setImage({ src: svgDataUrl }).run()
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, HTMLAttributes: { class: 'max-w-full rounded my-2' } }),
    ],
    content: content ?? EMPTY_DOC,
    editable: isActive,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getJSON() as Record<string, unknown>)
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[60px] text-sm leading-relaxed text-foreground',
      },
      handlePaste(_view, event) {
        const items = Array.from(event.clipboardData?.items ?? [])
        const imageItem = items.find((item) => item.type.startsWith('image/'))
        if (!imageItem) return false
        const file = imageItem.getAsFile()
        if (!file) return false
        event.preventDefault()
        handleImageFile(file)
        return true
      },
      handleDrop(_view, event) {
        const items = Array.from(event.dataTransfer?.items ?? [])
        const imageItem = items.find((item) => item.type.startsWith('image/'))
        if (!imageItem) return false
        const file = imageItem.getAsFile()
        if (!file) return false
        event.preventDefault()
        handleImageFile(file)
        return true
      },
    },
  })

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  useEffect(() => {
    editor?.setEditable(isActive)
  }, [isActive, editor])

  useEffect(() => {
    if (!editor || !content) return
    const current = JSON.stringify(editor.getJSON())
    const incoming = JSON.stringify(content)
    if (current !== incoming) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div>
      {isActive && editor && (
        <Toolbar
          editor={editor}
          onImageFile={handleImageFile}
          onDiagram={() => setDiagramModalOpen(true)}
        />
      )}
      <EditorContent editor={editor} />
      <DiagramGeneratorModal
        open={diagramModalOpen}
        onClose={() => setDiagramModalOpen(false)}
        onInsert={handleInsertDiagram}
        sectionTitle={sectionTitle}
      />
    </div>
  )
}
