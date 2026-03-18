import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <span>&larr;</span> Kembali ke Beranda
        </Link>

        <h1 className="text-3xl font-bold mb-2">Kebijakan Privasi</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Terakhir diperbarui: Maret 2026
        </p>

        <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-semibold">1. Pendahuluan</h2>
            <p>
              SkripsiAI memahami bahwa privasi adalah hal yang sangat penting bagi pengguna kami.
              Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan
              melindungi informasi pribadi Anda saat menggunakan layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Informasi yang Kami Kumpulkan</h2>
            <p>Kami mengumpulkan informasi berikut saat Anda menggunakan SkripsiAI:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm text-muted-foreground">
              <li>
                <strong>Informasi Akun:</strong> Nama lengkap, alamat email, dan kata sandi saat
                Anda mendaftar.
              </li>
              <li>
                <strong>Informasi Skripsi:</strong> Judul, universitas, fakultas, nama dosen
                pembimbing, dan konten skripsi yang Anda tulis di platform.
              </li>
              <li>
                <strong>Data Penggunaan:</strong> Informasi tentang bagaimana Anda menggunakan
                layanan, termasuk jumlah kata yang dihasilkan dan frekuensi ekspor.
              </li>
              <li>
                <strong>Informasi Teknis:</strong> Alamat IP, jenis browser, dan informasi perangkat
                untuk keperluan keamanan dan peningkatan layanan.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Penggunaan Informasi</h2>
            <p>Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm text-muted-foreground">
              <li>Menyediakan dan memelihara layanan SkripsiAI.</li>
              <li>Memproses permintaan pembuatan konten melalui AI.</li>
              <li>Mengelola akun dan preferensi Anda.</li>
              <li>Mengirimkan pembaruan dan informasi terkait layanan.</li>
              <li>Meningkatkan kualitas layanan dan pengalaman pengguna.</li>
              <li>Memenuhi kewajiban hukum yang berlaku.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Keamanan Data</h2>
            <p>
              Informasi Anda aman bersama kami. Anda dapat yakin bahwa informasi yang Anda kirimkan
              kepada kami tidak akan disalahgunakan, diselewengkan, atau dijual ke pihak ketiga
              mana pun. Kami hanya menggunakan informasi pribadi Anda untuk menyediakan layanan
              yang Anda minta. Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi
              data Anda, termasuk enkripsi dan penyimpanan aman melalui infrastruktur Supabase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Konten Skripsi Anda</h2>
            <p>
              Konten skripsi yang Anda tulis dan hasilkan melalui SkripsiAI adalah milik Anda.
              Kami tidak mengklaim kepemilikan atas konten yang Anda buat. Konten Anda disimpan
              di server kami semata-mata untuk menyediakan layanan kepada Anda dan tidak akan
              dibagikan kepada pihak ketiga tanpa persetujuan Anda.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. Penggunaan AI</h2>
            <p>
              SkripsiAI menggunakan layanan AI pihak ketiga (Anthropic Claude) untuk menghasilkan
              konten. Saat Anda menggunakan fitur pembuatan konten AI, instruksi dan konteks
              skripsi Anda dikirim ke penyedia AI untuk diproses. Kami tidak menyimpan data ini
              di luar sesi pemrosesan dan penyedia AI kami tunduk pada kebijakan privasi mereka
              sendiri.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">7. Cookie dan Teknologi Pelacakan</h2>
            <p>
              Kami menggunakan cookie yang diperlukan untuk otentikasi dan sesi pengguna. Kami
              tidak menggunakan cookie pelacakan pihak ketiga untuk tujuan periklanan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">8. Hak Anda</h2>
            <p>Anda memiliki hak untuk:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm text-muted-foreground">
              <li>Mengakses informasi pribadi yang kami simpan tentang Anda.</li>
              <li>Memperbarui atau memperbaiki informasi pribadi Anda.</li>
              <li>Meminta penghapusan akun dan data Anda.</li>
              <li>Berhenti berlangganan dari komunikasi pemasaran.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">9. Perubahan Kebijakan</h2>
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan
              dipublikasikan di halaman ini dengan tanggal pembaruan yang baru. Penggunaan
              berkelanjutan atas layanan kami setelah perubahan berarti Anda menerima kebijakan
              yang diperbarui.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">10. Hukum yang Berlaku</h2>
            <p>
              Kebijakan Privasi ini diatur oleh hukum yang berlaku di Indonesia.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">11. Hubungi Kami</h2>
            <p>
              Kami menyambut pertanyaan, komentar, dan kekhawatiran Anda tentang privasi atau
              informasi apa pun yang dikumpulkan dari Anda atau tentang Anda. Silakan kirimkan
              kepada kami umpan balik terkait privasi, atau masalah lainnya.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} SkripsiAI. Dibuat untuk mahasiswa Indonesia.
        </div>
      </div>
    </div>
  )
}
