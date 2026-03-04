'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

interface TipTapEditorProps {
  content: Record<string, unknown> | null
  isActive: boolean
  onChange: (content: Record<string, unknown>) => void
}

const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] }

export function TipTapEditor({ content, isActive, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content ?? EMPTY_DOC,
    editable: isActive,
    onUpdate({ editor }) {
      onChange(editor.getJSON() as Record<string, unknown>)
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[60px] text-sm leading-relaxed text-zinc-200',
      },
    },
  })

  // Keep editability in sync with active state
  useEffect(() => {
    editor?.setEditable(isActive)
  }, [isActive, editor])

  // Update content when AI generates new text
  useEffect(() => {
    if (!editor || !content) return
    const current = JSON.stringify(editor.getJSON())
    const incoming = JSON.stringify(content)
    if (current !== incoming) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return <EditorContent editor={editor} />
}
