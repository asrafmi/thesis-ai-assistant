# AI Thesis Workspace

## 1. Database Schema (ERD)

### Tech Stack Database
- **Backend:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (tabel `auth.users` otomatis)

---

### Tabel: `profiles`
Extend dari Supabase Auth.

| Kolom      | Tipe | Keterangan              |
|------------|------|-------------------------|
| id         | uuid | FK → auth.users         |
| full_name  | text |                         |
| plan       | enum | `free`, `pro`           |
| word_count | int  | Tracking limit freemium |

---

### Tabel: `theses`
Satu user bisa punya beberapa skripsi.

| Kolom         | Tipe      | Keterangan                    |
|---------------|-----------|-------------------------------|
| id            | uuid      | PK                            |
| user_id       | uuid      | FK → profiles                 |
| title         | text      |                               |
| university    | text      |                               |
| faculty       | text      |                               |
| supervisor    | text      | Nama dosen pembimbing         |
| year          | int       |                               |
| template_type | enum      | `quantitative`, `qualitative` |
| status        | enum      | `draft`, `complete`           |
| created_at    | timestamp |                               |
| updated_at    | timestamp |                               |

---

### Tabel: `sections`
Self-referential — menggantikan tabel chapters + sections terpisah.
Mendukung nesting unlimited (Bab → Subbab → Sub-subbab → dst).

| Kolom       | Tipe      | Keterangan                                |
|-------------|-----------|-------------------------------------------|
| id          | uuid      | PK                                        |
| thesis_id   | uuid      | FK → theses                               |
| parent_id   | uuid      | FK → sections (nullable, null = root/bab) |
| title       | text      | Judul section                             |
| content     | jsonb     | TipTap JSON (konten editable)             |
| level       | int       | 1=Bab, 2=Subbab, 3=Sub-subbab, dst       |
| order_index | int       | Urutan di antara sibling                  |
| created_at  | timestamp |                                           |
| updated_at  | timestamp |                                           |

**Catatan:**
- AI update content per section (tidak replace full dokumen)
- Query tree menggunakan `WITH RECURSIVE` PostgreSQL
- Numbering (1.1, 1.1.1, dst) dihitung dari struktur tree, bukan disimpan

**Contoh data:**
```
id  parent_id  level  title
A   null       1      Bab I Pendahuluan
B   A          2      1.1 Latar Belakang
C   B          3      1.1.1 Konteks Masalah
D   A          2      1.2 Rumusan Masalah
```

---

### Tabel: `revisions`
Snapshot history per section untuk undo/version control.

| Kolom      | Tipe      | Keterangan           |
|------------|-----------|----------------------|
| id         | uuid      | PK                   |
| section_id | uuid      | FK → sections        |
| content    | jsonb     | Snapshot TipTap JSON |
| source     | enum      | `ai`, `user`         |
| created_at | timestamp |                      |

**Catatan:** Disimpan per save (debounce 2-3 detik), bukan setiap keystroke.

---

### Tabel: `exports`
Tracking export untuk limit freemium.

| Kolom      | Tipe      | Keterangan           |
|------------|-----------|----------------------|
| id         | uuid      | PK                   |
| thesis_id  | uuid      | FK → theses          |
| user_id    | uuid      | FK → profiles        |
| file_url   | text      | Supabase Storage URL |
| created_at | timestamp |                      |

---

## 2. UI Layout Spec

### Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Logo | Thesis Title | Autosave | Export | User     │
├──────────┬───────────────────────┬──────────────────────────┤
│ SIDEBAR  │   AI PROMPT PANEL    │    EDITOR PANEL          │
│ [≡] [✕] │         [✕]          │                          │
│          │                      │  ┌────────────────────┐  │
│ ▼ Bab I  │  Section: 1.1        │  │                    │  │
│   1.1    │  ┌────────────────┐  │  │  # BAB I           │  │
│   1.2    │  │ Tulis prompt   │  │  │                    │  │
│   1.3    │  │ untuk bagian   │  │  │  ## 1.1 Latar      │  │
│ ▶ Bab II │  │ ini...         │  │  │  Belakang          │  │
│ ▶ Bab III│  └────────────────┘  │  │                    │  │
│          │  [Generate] [Clear]  │  │  Lorem ipsum...    │  │
│          │  ──────────────────  │  │                    │  │
│          │  ▼ History           │  └────────────────────┘  │
│          │  • "Buat latar..."   │                          │
│          │  • "Tambah data..."  │                          │
│ ◀ collapse  ◀ collapse          │                          │
└──────────┴───────────────────────┴──────────────────────────┘
         ↕ drag resize           ↕ drag resize
```

---

### Panel Spec

#### Header
- Logo
- Judul skripsi aktif (editable inline)
- Autosave indicator
- Tombol Export (.docx)
- User menu (plan badge, logout)

#### Sidebar (default ~220px, collapsible)
- Tree navigasi bab/subbab (expand/collapse per bab)
- Tombol `+` tambah section
- Drag-to-reorder section
- Collapse ke icon-only (tampil nomor bab saja)

#### AI Prompt Panel (default ~320px, collapsible)
- Indicator section yang sedang ditarget
- Textarea input prompt
- Tombol Generate + Clear
- History prompt sesi (klik untuk reuse)
- Collapse ke hidden (editor melebar mengisi ruang)

#### Editor Panel (sisa width, tidak bisa collapse)
- TipTap editor styled seperti dokumen skripsi
- Full scrollable
- Selalu visible

---

### Behavior

| Aksi | Hasil |
|------|-------|
| Klik section di sidebar | Editor scroll ke section tersebut |
| AI generate | Update content section yang ditarget, tidak ganggu section lain |
| Collapse sidebar | Editor + Prompt panel melebar |
| Collapse prompt panel | Editor melebar penuh |
| Drag resize handle | Panel melebar/menyempit sesuai drag |

---

### Library

| Kebutuhan | Library |
|-----------|---------|
| Resizable panels | `react-resizable-panels` |
| Rich text editor | `TipTap` |
| UI components | `shadcn/ui` + Tailwind CSS |

---

## 3. Tech Stack

### Architecture
Monolith fullstack — Next.js App Router sebagai satu-satunya server. Tidak ada backend terpisah.

---

### Stack Lengkap

| Kategori | Teknologi | Keterangan |
|----------|-----------|------------|
| **Framework** | Next.js (App Router) | Fullstack, SSR, Server Actions |
| **Styling** | Tailwind CSS | Utility-first |
| **UI Components** | shadcn/ui | Customizable, tema akademik elegan |
| **Database** | Supabase (PostgreSQL) | Data skripsi, sections, revisions |
| **Auth** | Supabase Auth | Email/password + OAuth |
| **Storage** | Supabase Storage | File export .docx |
| **Rich Text Editor** | TipTap OSS (MIT) | Editable thesis document |
| **Resizable Panels** | `react-resizable-panels` | 3-panel layout |
| **State Management** | Zustand | Client state (panel, active section) |
| **AI Provider** | Claude (Anthropic) | Generate & update konten skripsi |
| **Export** | `docx` (npm) | Generate file .docx |
| **Deployment** | Vercel | Hosting Next.js |

---

### Catatan Penting

- **TipTap** digunakan versi OSS (gratis, MIT) — tidak butuh TipTap Cloud
- **AI generate** dilakukan via Server Actions ke Anthropic API, bukan TipTap AI
- **Autosave** via debounce 2–3 detik → Supabase per section
- **Export .docx** diproses di server (Server Action), bukan client

---

## 4. Page Structure

### Routes

| Route | Halaman | Auth | Keterangan |
|-------|---------|------|------------|
| `/` | Landing Page | Public | Hero, fitur, pricing, CTA |
| `/login` | Login | Public | |
| `/register` | Register | Public | |
| `/onboarding` | Onboarding | Protected | Setup skripsi: judul, kampus, jenis, dosen |
| `/dashboard` | Dashboard | Protected | 1 thesis card + stats + tombol buka workspace |
| `/workspace` | Workspace | Protected | 3-panel editor utama |
| `/settings` | Settings | Protected | Profile, plan, ganti password |

### Catatan

- **1 skripsi per akun** untuk MVP — enforced di app logic
- `/workspace` tidak perlu `[thesisId]` — auto-load thesis milik user yang login
- `/onboarding` hanya muncul sekali setelah register pertama kali

### User Flow

```
Register ──→ /onboarding ──→ /workspace
Login ──────→ (ada thesis?) ──→ /workspace
                    ↓ tidak
               /onboarding
```

### Rules
- No any types
- No refactor unrelated files
- Keep components small
- Use existing folder structure