// PRESENTATION LAYER. pure JSX only. No hooks, no business logic.

import { useState, useRef, useEffect } from 'react';
import { BookOpen, X, MoreHorizontal, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { SectionTree } from '@/types/thesis.types';

interface SidebarViewProps {
  sections: SectionTree[];
  activeSectionId: string | null;
  onSelectSection: (id: string) => void;
  onToggle: () => void;
  onRenameSection: (sectionId: string, title: string) => void;
  onAddSection: (parentId: string | null, title: string, level: number) => void;
  onDeleteSection: (sectionId: string) => void;
}

interface SectionItemProps {
  section: SectionTree;
  activeSectionId: string | null;
  onSelectSection: (id: string) => void;
  onRenameSection: (sectionId: string, title: string) => void;
  onRequestAdd: (parentId: string | null, level: number, mode: 'sibling' | 'child') => void;
  onRequestDelete: (sectionId: string, title: string) => void;
}

function SectionItem({
  section,
  activeSectionId,
  onSelectSection,
  onRenameSection,
  onRequestAdd,
  onRequestDelete,
}: SectionItemProps) {
  const isActive = section.id === activeSectionId;
  const isChapter = section.level === 1;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.select();
  }, [isEditing]);

  function handleRenameConfirm() {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== section.title) {
      onRenameSection(section.id, trimmed);
    } else {
      setEditTitle(section.title);
    }
    setIsEditing(false);
  }

  return (
    <div>
      <div className='group relative flex items-center'>
        {isEditing ? (
          <input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRenameConfirm}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameConfirm();
              if (e.key === 'Escape') {
                setEditTitle(section.title);
                setIsEditing(false);
              }
            }}
            className={[
              'w-full rounded-md border border-primary bg-background text-foreground outline-none',
              isChapter
                ? 'px-3 py-1.5 mt-2 text-xs font-semibold'
                : 'py-1 pl-6 pr-3 text-xs font-normal',
            ].join(' ')}
          />
        ) : (
          <button
            type='button'
            onClick={() => onSelectSection(section.id)}
            className={[
              'w-full text-left rounded-md transition-colors',
              isChapter
                ? 'px-3 py-1.5 mt-2 text-xs font-semibold'
                : 'py-1 pl-6 pr-8 text-xs font-normal',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            ].join(' ')}
          >
            {section.title}
          </button>
        )}

        {!isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type='button'
                className={[
                  'absolute right-1 flex items-center justify-center rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity',
                  isChapter ? 'top-3.5' : 'top-1',
                  isActive
                    ? 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                ].join(' ')}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal size={12} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='text-xs min-w-37.5'>
              <DropdownMenuItem onClick={() => { setEditTitle(section.title); setIsEditing(true); }}>
                <Pencil size={12} className='mr-2' />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRequestAdd(section.parent_id, section.level, 'sibling')}>
                <Plus size={12} className='mr-2' />
                Tambah section setelah ini
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRequestAdd(section.id, section.level + 1, 'child')}>
                <Plus size={12} className='mr-2' />
                Tambah sub-section
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onRequestDelete(section.id, section.title)}
                className='text-destructive focus:text-destructive'
              >
                <Trash2 size={12} className='mr-2' />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {section.children.map((child) => (
        <SectionItem
          key={child.id}
          section={child}
          activeSectionId={activeSectionId}
          onSelectSection={onSelectSection}
          onRenameSection={onRenameSection}
          onRequestAdd={onRequestAdd}
          onRequestDelete={onRequestDelete}
        />
      ))}
    </div>
  );
}

export function SidebarView({
  sections,
  activeSectionId,
  onSelectSection,
  onToggle,
  onRenameSection,
  onAddSection,
  onDeleteSection,
}: SidebarViewProps) {
  const [addDialog, setAddDialog] = useState<{
    open: boolean;
    parentId: string | null;
    level: number;
    mode: 'bab' | 'sibling' | 'child';
  }>({ open: false, parentId: null, level: 1, mode: 'bab' });
  const [newTitle, setNewTitle] = useState('');

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    sectionId: string;
    title: string;
  } | null>(null);

  function openAddDialog(parentId: string | null, level: number, mode: 'bab' | 'sibling' | 'child') {
    setNewTitle('');
    setAddDialog({ open: true, parentId, level, mode });
  }

  function handleAddConfirm() {
    if (newTitle.trim()) {
      onAddSection(addDialog.parentId, newTitle.trim(), addDialog.level);
    }
    setAddDialog({ open: false, parentId: null, level: 1, mode: 'bab' });
  }

  function handleDeleteConfirm() {
    if (deleteDialog) {
      onDeleteSection(deleteDialog.sectionId);
      setDeleteDialog(null);
    }
  }

  const addDialogLabel =
    addDialog.mode === 'bab'
      ? 'Tambah Bab'
      : addDialog.mode === 'sibling'
        ? 'Tambah section setelah ini'
        : 'Tambah sub-section';

  return (
    <aside className='w-56 shrink-0 border-r border-border bg-background flex flex-col h-full'>
      <div className='flex items-center justify-between px-3 py-3 border-b border-border'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <BookOpen size={13} />
          <span className='text-xs font-medium uppercase tracking-wider'>Struktur</span>
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

      <div className='flex-1 overflow-y-auto p-2'>
        {sections.length === 0 ? (
          <p className='text-muted-foreground text-xs px-3 py-4'>Belum ada bagian.</p>
        ) : (
          sections.map((section) => (
            <SectionItem
              key={section.id}
              section={section}
              activeSectionId={activeSectionId}
              onSelectSection={onSelectSection}
              onRenameSection={onRenameSection}
              onRequestAdd={(parentId, level, mode) =>
                openAddDialog(parentId, level, mode)
              }
              onRequestDelete={(sectionId, title) =>
                setDeleteDialog({ open: true, sectionId, title })
              }
            />
          ))
        )}
      </div>

      <div className='px-2 py-2 border-t border-border'>
        <button
          type='button'
          onClick={() => openAddDialog(null, 1, 'bab')}
          className='flex w-full items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
        >
          <Plus size={12} />
          Tambah Bab
        </button>
      </div>

      {/* Add section dialog */}
      <Dialog
        open={addDialog.open}
        onOpenChange={(open) => setAddDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle className='text-sm'>{addDialogLabel}</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            placeholder='Judul section...'
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddConfirm();
            }}
            className='text-sm'
          />
          <DialogFooter className='gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setAddDialog((prev) => ({ ...prev, open: false }))}
            >
              Batal
            </Button>
            <Button size='sm' onClick={handleAddConfirm} disabled={!newTitle.trim()}>
              Tambah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteDialog?.open}
        onOpenChange={(open) => {
          if (!open) setDeleteDialog(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus section?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className='font-medium text-foreground'>&ldquo;{deleteDialog?.title}&rdquo;</span>{' '}
              dan semua sub-section di dalamnya akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
