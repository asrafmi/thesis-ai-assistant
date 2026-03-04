'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

interface TipTapEditorProps {
  content: Record<string, unknown> | null
  isActive: boolean
  onChange: (content: Record<string, unknown>) => void
}

const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] }

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
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      title={title}
      className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
        isActive
          ? 'bg-zinc-700 text-zinc-100'
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
      }`}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex items-center gap-0.5 mb-1.5 pb-1.5 border-b border-zinc-800/60">
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
      <span className="w-px h-3 bg-zinc-700 mx-1" />
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
    </div>
  )
}

export function TipTapEditor({ content, isActive, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content ?? EMPTY_DOC,
    editable: isActive,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getJSON() as Record<string, unknown>)
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[60px] text-sm leading-relaxed text-zinc-200',
      },
    },
  })

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
      {isActive && editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}
