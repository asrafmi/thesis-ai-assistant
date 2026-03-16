# AI Diagram Generation Feature — Implementation Journal

## Overview

This document covers the full implementation journey of the AI Diagram Generator feature in the AI Thesis Workspace app.

**Feature summary:** Users can generate diagrams from natural language prompts. Claude API produces Mermaid.js syntax, which is rendered as SVG in the browser, converted to PNG via HTML Canvas, uploaded to Supabase Storage, and inserted into the TipTap editor as an image node. On export, the image is fetched by URL, processed with `sharp`, and embedded in the `.docx` output via `ImageRun`.

**Stack involved:**
- Next.js App Router (Server Actions)
- TipTap editor (custom Node extension)
- Supabase (PostgreSQL + Storage)
- Claude API (Anthropic)
- Mermaid.js (dynamic import, browser-side)
- `sharp` (server-side image metadata)
- `docx` npm library (`.docx` export)

---

## Architecture & Flow

### End-to-end pipeline

```
User clicks [Diagram] in TipTap toolbar
        ↓
DiagramGeneratorModal opens
        ↓
User types natural language prompt (e.g. "Flowchart for thesis methodology")
        ↓
generateDiagramAction (Server Action)
  → calls Claude API
  → system prompt: "output only valid Mermaid syntax, no markdown fences"
  → returns raw Mermaid string
        ↓
Mermaid.js (dynamic import, browser-only)
  → mermaid.render() → SVG string
        ↓
SVG preview displayed in modal
        ↓
User clicks "Insert"
        ↓
handleInsert:
  1. Parse viewBox from SVG to get real dimensions
  2. Create <img src="data:image/svg+xml;base64,..."> at 2x scale on HTML Canvas
  3. canvas.toDataURL('image/png') → PNG data URL
  4. Upload PNG data URL to Supabase Storage → get public URL
  5. editor.commands.insertContent({
       type: 'image',
       attrs: { src: publicUrl, width: 400, align: 'center' }
     })
        ↓
TipTap onUpdate → onChange → updateSectionContent (in useSections)
  → debounce 2-3s → updateSectionContentAction (Server Action) → Supabase DB
        ↓
On export:
  flushPendingSave() → exportThesisDocxAction → fetch sections from DB
  → buildDocxFromThesis → fetchImageBuffer(url) → sharp metadata
  → ImageRun({ data: buffer, width, height }) embedded in .docx
```

---

## Key Files

| File | Role |
|------|------|
| `src/actions/diagram.actions.ts` | Server Action — calls Claude API, returns Mermaid syntax string |
| `src/components/DiagramGeneratorModal.tsx` | Modal UI — prompt input, SVG preview, canvas PNG conversion, Supabase upload, insertContent |
| `src/components/ResizableImageExtension.tsx` | Custom TipTap Node extension — resizable, alignable image node with ReactNodeViewRenderer |
| `src/views/workspace/TipTapEditor.tsx` | Toolbar button integration, handleInsertDiagram wired to modal |
| `src/services/docx.service.ts` | Image embed in `.docx` via `ImageRun` + `sharp` for metadata |
| `src/hooks/useSections.ts` | Debounce save logic, `flushPendingSave` for pre-export flush |
| `src/hooks/useWorkspace.ts` | Calls `flushPendingSave` before triggering export |

---

## ResizableImageExtension Details

The built-in `@tiptap/extension-image` was replaced with a custom Node extension to support resizing and alignment directly in the editor.

### Node definition
- `name: 'image'` (replaces the default extension)
- `group: 'block'`
- `atom: true`
- `draggable: true`
- `selectable: true`
- Rendered via `ReactNodeViewRenderer` with a `ResizableImageView` React component

### ResizableImageView component
- Drag resize handle at the bottom-right corner using `mousedown` / `mousemove` / `mouseup` events
- `AlignToolbar` (left / center / right buttons) visible when the node is selected
- Width label shown during active resize
- Updates node attrs via `updateAttributes` from `NodeViewProps`

### Attributes — critical serialization pattern

Each attribute must define its own `parseHTML` and `renderHTML` so TipTap can correctly serialize attrs to JSONB and restore them from HTML:

```ts
addAttributes() {
  return {
    src: {
      default: null,
      parseHTML: el => el.getAttribute('src'),
      renderHTML: attrs => ({ src: attrs.src }),
    },
    width: {
      default: 400,
      parseHTML: el => el.getAttribute('data-width'),
      renderHTML: attrs => ({ 'data-width': attrs.width }),
    },
    align: {
      default: 'center',
      parseHTML: el => el.getAttribute('data-align'),
      renderHTML: attrs => ({ 'data-align': attrs.align }),
    },
    alt: {
      default: null,
      parseHTML: el => el.getAttribute('alt'),
      renderHTML: attrs => ({ alt: attrs.alt }),
    },
    title: {
      default: null,
      parseHTML: el => el.getAttribute('title'),
      renderHTML: attrs => ({ title: attrs.title }),
    },
  }
}
```

Omitting per-attribute `parseHTML`/`renderHTML` causes attrs to be lost on JSON round-trip.

---

## Problems Encountered & Solutions

### Problem 1: `setImage is not a function`

**Cause:** The custom extension does not expose the `setImage` command from `@tiptap/extension-image` — that command belongs to the stock extension, not a custom one.

**Fix:** Use `editor.commands.insertContent({ type: 'image', attrs: { ... } })` instead of `editor.chain().focus().setImage(...)`.

---

### Problem 2: TypeScript errors in NodeViewRenderer

**Cause:** Imported `NodeViewRendererProps` (incorrect type) instead of `NodeViewProps`.

**Fix:** Import `NodeViewProps` from `'@tiptap/react'`.

```ts
import { NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
```

---

### Problem 3: Image attrs not saved to DB

**Cause:** `addAttributes()` defined attributes without per-attribute `parseHTML`/`renderHTML`. TipTap serialized only the node type with an empty `attrs: {}` object.

**Fix:** Add `parseHTML` and `renderHTML` to every attribute in `addAttributes()` (see pattern above).

---

### Problem 4: `Cannot access src on server` — Next.js Client Reference error

**Cause:** `data:image/png;base64,...` strings are large. When passed as a return value or argument through a Next.js Server Action, the serialization layer treats them as oversized client references and throws.

**Fix:** Upload the PNG data URL to Supabase Storage on the client before touching any Server Action. Pass only the short public URL string through the Server Action boundary.

```ts
// In DiagramGeneratorModal (client component)
const { data } = await supabase.storage
  .from('diagrams')
  .upload(`${userId}/${Date.now()}.png`, blob)
const publicUrl = supabase.storage.from('diagrams').getPublicUrl(data.path).data.publicUrl
// Now safe to pass publicUrl to any Server Action
```

---

### Problem 5: SVG fallback failure in canvas conversion

**Cause:** Original code used `URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml' }))`. This failed silently in some browser contexts (CORS, blob URL restrictions in certain environments).

**Fix:** Convert SVG to a `data:image/svg+xml;base64,...` URL directly and assign to `img.src`. More universally reliable.

```ts
const base64 = btoa(unescape(encodeURIComponent(svgString)))
img.src = `data:image/svg+xml;base64,${base64}`
```

---

### Problem 6: Blurry rendered diagram

**Cause:** Mermaid renders SVGs with `width="100%"` and `height="100%"`. When drawn onto a canvas using these values, the canvas defaulted to a small pixel size (e.g., 300×150), producing a blurry PNG.

**Fix:** Parse the `viewBox` attribute from the SVG to extract the actual intrinsic dimensions, then render at 2x scale for retina quality.

```ts
const viewBox = svgEl.getAttribute('viewBox') // "0 0 800 400"
const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number)
const scale = 2
canvas.width = vbWidth * scale
canvas.height = vbHeight * scale
ctx.scale(scale, scale)
ctx.drawImage(img, 0, 0, vbWidth, vbHeight)
```

---

### Problem 7 (UNRESOLVED): `setContent` useEffect overwrites inserted image

**Cause:** `TipTapEditor` has a `useEffect` that calls `editor.commands.setContent(content)` whenever the `content` prop changes. The sequence is:

1. `insertContent(imageNode)` fires
2. TipTap `onUpdate` fires → `onChange(json)` → `updateSectionContent(id, json)` in `useSections`
3. The state update causes a re-render of the parent
4. `content` prop to `TipTapEditor` changes (because state updated)
5. `useEffect` fires → `editor.commands.setContent(content)` — but `content` here is the value from React state, which may still be the pre-insert snapshot
6. A second `onUpdate` fires with the overwritten (no-image) content
7. This second update races with or replaces the pending debounce save

**Attempted fix 1:** `isLocalChange` ref (boolean flag) — insufficient because React StrictMode double-invokes effects, causing the flag to flip back.

**Attempted fix 2:** `localChangeCount` ref (integer counter, decrement in effect) — still insufficient under StrictMode double-invocation.

**Attempted fix 3:** Direct save via `updateSectionContentAction(sectionId, json)` immediately after `insertContent`, bypassing the debounce — still not working because the second `onUpdate` triggers another save with stale content that arrives at the server after the direct save.

**Current status: UNRESOLVED.** Image is visible in the editor but attrs are stripped before reaching the DB.

---

### Problem 8: Image nodes in DB have empty attrs

**Observed symptoms:**
- `editor.getJSON()` immediately after insert shows correct node with `src`, `width`, `align` attrs
- `useSections.updateSectionContent` receives correct content with image attrs
- Server Action receives the content — `hasImage: true` confirmed — but the image node in DB has `attrs: {}`

**Current hypothesis:** The `useEffect` setContent race (Problem 7) causes a second `onUpdate` with stale content (pre-insert, no image) to fire and reach the debounce save buffer after the correct content, overwriting it before the debounce timer fires.

---

## Current State

| Capability | Status |
|---|---|
| Diagram generation via Claude API | Working |
| SVG preview in modal | Working |
| Canvas SVG → PNG conversion | Working |
| Upload PNG to Supabase Storage | Working |
| Insert image into TipTap editor | Working (visible) |
| Resize and align in editor | Working |
| Persist image node with attrs to DB | **FAILING** — attrs stripped |
| Export image to `.docx` | **FAILING** — depends on DB persistence |

---

## Recommended Next Steps

The root cause of the persistence failure is the `setContent` useEffect in `TipTapEditor` conflicting with local edits. Two viable approaches:

### Option 1: Add `key={section.id}` to TipTapEditor (simpler)

Mount a fresh editor instance on every section switch. This eliminates the need for the `setContent` useEffect entirely — each editor instance is initialized once with its section's content and never externally overwritten.

```tsx
// In EditorView.tsx
<TipTapEditor
  key={activeSection.id}
  content={activeSection.content}
  onChange={handleChange}
/>
```

**Trade-off:** Editor loses focus and scroll position when the user switches sections. Acceptable for most thesis editing patterns.

### Option 2: Version-tagged content prop (more robust)

Pass a `contentVersion` or `contentSource` alongside the `content` prop. In the `useEffect`, skip `setContent` if the version matches the local version (i.e., change originated from this editor instance).

```tsx
// Parent passes:
<TipTapEditor
  content={content}
  contentSource={contentSource} // 'ai' | 'local' | 'remote'
  onChange={handleChange}
/>

// useEffect in TipTapEditor:
useEffect(() => {
  if (contentSource === 'local') return // skip — originated here
  editor.commands.setContent(content)
}, [content, contentSource])
```

**Trade-off:** Requires propagating source metadata through the state management chain (`useSections` → `useWorkspace` → `EditorView` → `TipTapEditor`). More invasive but fully correct.

**Recommendation:** Start with Option 1. If section-switch UX (lost focus/scroll) becomes a user complaint, migrate to Option 2.
