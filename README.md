# SkripsiAI

AI Writing & Formatting Workspace untuk Skripsi Indonesia.

## Getting Started

Copy environment variables dan isi dengan credentials Supabase:

```bash
cp .env.local.example .env.local
```

Jalankan development server:

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## Database Migrations

Migrations dikelola menggunakan Supabase CLI. File migration ada di `supabase/migrations/`.

### Menjalankan migration ke Supabase

Setelah pull kode terbaru, push semua migration yang belum diapply:

```bash
pnpm db:push
```

Setelah push, sync TypeScript types agar sesuai dengan schema terbaru:

```bash
pnpm db:types
```

### Membuat migration file baru

Saat ada perubahan schema (tambah kolom, tabel baru, dll.), buat file migration baru:

```bash
pnpm db:new nama_migration
```

Contoh:

```bash
pnpm db:new add_email_to_profiles
```

Perintah ini membuat file baru di `supabase/migrations/<timestamp>_nama_migration.sql`. Edit file tersebut dengan SQL yang diinginkan, lalu jalankan:

```bash
pnpm db:push    # apply ke Supabase
pnpm db:types   # sync TypeScript types
```

### Aturan penting

- **Jangan edit `src/types/database.types.ts` secara manual** — file ini di-generate otomatis oleh `pnpm db:types`.
- Semua type domain (`Plan`, `TemplateType`, dll.) di-re-export dari `src/types/thesis.types.ts`.
- Setiap perubahan schema harus lewat migration file baru, bukan edit migration yang sudah ada.

---

## Scripts

| Script | Keterangan |
|--------|-----------|
| `pnpm dev` | Jalankan development server |
| `pnpm build` | Build production |
| `pnpm db:new <nama>` | Buat migration file baru |
| `pnpm db:push` | Push migrations ke Supabase |
| `pnpm db:types` | Sync TypeScript types dari Supabase |
