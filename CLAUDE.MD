Berikut draft **claude.md** yang bisa kamu gunakan sebagai product brief awal.

---

# AI Thesis Workspace

## Product Brief v0.1

## 1. Vision

Membangun AI Academic Workspace yang membantu mahasiswa Indonesia menyelesaikan skripsi dengan lebih terstruktur, rapi, dan siap dikumpulkan tanpa ribet formatting.

Produk ini bukan pembuat skripsi instan.
Produk ini adalah asisten penulisan dan formatting yang membantu mahasiswa bekerja lebih cepat dan lebih terarah.

---

## 2. Problem Statement

Mahasiswa tingkat akhir menghadapi beberapa masalah utama:

* Bingung memulai penulisan
* Kesulitan menyusun struktur bab dan subbab
* Formatting skripsi sangat detail dan memakan waktu
* Revisi dosen sering mengubah struktur dokumen
* Daftar isi, heading, dan nomor halaman sering error
* Export ke Word tidak rapi dan perlu penyesuaian ulang

Pain terbesar bukan hanya menulis, tetapi menjaga struktur dan format sesuai standar kampus.

---

## 3. Target Market

### Primary Market (B2C)

* Mahasiswa tingkat akhir (S1/D4)
* Fokus awal: Indonesia
* Kampus negeri dan swasta

### Secondary Market

* Mahasiswa S2
* Mahasiswa politeknik/vokasi
* Konsultan akademik

---

## 4. Positioning

Bukan:

* AI pembuat skripsi otomatis
* Chatbot akademik
* Tool tanya jawab jurnal

Tapi:

> AI Writing & Formatting Workspace untuk Skripsi yang terstruktur dan siap dikumpulkan.

Produk ini membantu menyelesaikan skripsi secara sistematis, bukan sekadar menghasilkan teks.

---

## 5. Unique Value Proposition

### 1. Structured Academic Layout Engine

Dokumen langsung mengikuti struktur skripsi:

* Bab I, II, III, IV, V
* Subbab terorganisir
* Heading otomatis
* Penomoran konsisten
* Page break sesuai standar

### 2. Dual Workspace Experience

Tampilan dua panel:

* Panel kiri: Prompt / Instruction
* Panel kanan: Live document preview

Setiap instruksi langsung memperbarui dokumen di sisi kanan secara terstruktur.

### 3. Auto Formatting Ready-to-Submit

Hasil export:

* Format rapi
* Heading tersusun
* Daftar isi otomatis
* Nomor halaman benar
* Minim penyesuaian manual di Word

### 4. Fokus Workflow, Bukan Chat

Produk membantu:

* Mengembangkan bab per bab
* Menyusun latar belakang
* Menjaga konsistensi struktur
* Mengelola revisi

---

## 6. Core Features (MVP)

### 1. Structured Thesis Template

* Template skripsi standar Indonesia
* Struktur bab sudah tersedia
* Subbab dapat dikembangkan melalui prompt

### 2. Live Document Preview

* Dokumen tampil seperti format skripsi
* Heading dan subheading otomatis tersusun
* Perubahan langsung terlihat

### 3. Guided Writing Mode

* User memberi instruksi per bagian
* Sistem memperbarui bagian terkait tanpa merusak struktur lain

### 4. Export to Word

* File .docx
* Struktur heading aktif
* Page break antar bab
* Daftar isi bisa diperbarui otomatis di Word

---

## 7. Future Features (V2+)

* Template spesifik per kampus
* Mode revisi dosen (tracking perubahan)
* Reminder deadline
* Pengelolaan sitasi
* Template laporan magang dan proposal penelitian
* Mode skripsi kuantitatif / kualitatif terpisah

---

## 8. Business Model

### Freemium

* Batas jumlah kata
* Batas jumlah export

### Pro Plan (Subscription)

* Unlimited export
* Template kampus khusus
* Revisi mode
* Fitur lanjutan

Estimasi harga:
Rp 39.000 – Rp 79.000 per bulan

---

## 9. Monetization Strategy

1. Fokus niche mahasiswa tingkat akhir
2. Distribusi melalui:

   * TikTok edukasi
   * Instagram akademik
   * Kerjasama BEM / Himpunan
3. Referral program mahasiswa

---

## 10. Brand Direction

Tone:

* Akademik
* Supportive
* Profesional
* Bukan instan cheating tool

Value yang dijual:

* Efisiensi
* Struktur
* Kerapian
* Kepercayaan diri saat mengumpulkan

---

## 11. Long-Term Vision

Menjadi AI Academic Platform Indonesia yang mencakup:

* Skripsi
* Proposal penelitian
* Laporan magang
* Artikel ilmiah
* Dokumen administratif kampus

Mulai dari satu fokus:
AI Thesis Workspace untuk mahasiswa Indonesia.

---

## 12. Database Schema (ERD)

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