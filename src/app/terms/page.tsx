import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <span>&larr;</span> Kembali ke Beranda
        </Link>

        <h1 className="text-3xl font-bold mb-2">Syarat & Ketentuan</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Terakhir diperbarui: Maret 2026
        </p>

        <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-semibold">1. Ketentuan Penggunaan</h2>
            <p>
              SkripsiAI ditawarkan kepada Anda, pengguna, dengan syarat penerimaan Anda terhadap
              ketentuan, kondisi, dan pemberitahuan yang terkandung atau dirujuk di sini beserta
              ketentuan dan kondisi tambahan, perjanjian, dan pemberitahuan yang mungkin berlaku
              untuk halaman atau bagian mana pun dari Situs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Gambaran Umum</h2>
            <p>
              Penggunaan Anda atas Situs ini merupakan persetujuan Anda terhadap semua syarat,
              ketentuan, dan pemberitahuan. Harap baca dengan seksama. Dengan menggunakan Situs
              ini, Anda menyetujui Syarat dan Ketentuan ini, serta semua ketentuan, pedoman, atau
              aturan lain yang berlaku untuk bagian mana pun dari Situs ini, tanpa batasan atau
              kualifikasi. Jika Anda tidak menyetujui Syarat dan Ketentuan ini, Anda harus segera
              keluar dari Situs dan menghentikan penggunaan informasi atau produk dari Situs ini.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Modifikasi Situs dan Syarat & Ketentuan</h2>
            <p>
              SkripsiAI berhak untuk mengubah, memodifikasi, memperbarui, atau menghentikan
              syarat, ketentuan, dan pemberitahuan di mana Situs ini ditawarkan serta tautan,
              konten, informasi, harga, dan materi lainnya yang ditawarkan melalui Situs ini
              kapan saja dan dari waktu ke waktu tanpa pemberitahuan atau kewajiban lebih lanjut
              kepada Anda kecuali sebagaimana yang ditentukan di dalamnya. Kami berhak menyesuaikan
              harga dari waktu ke waktu. Dengan terus menggunakan Situs setelah modifikasi, perubahan,
              atau pembaruan tersebut, Anda setuju untuk terikat oleh modifikasi, perubahan, atau
              pembaruan tersebut.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Hak Cipta</h2>
            <p>
              Situs ini dimiliki dan dioperasikan oleh SkripsiAI. Kecuali ditentukan lain, semua
              materi di Situs ini, merek dagang, merek layanan, dan logo adalah milik SkripsiAI
              dan dilindungi oleh undang-undang hak cipta Indonesia dan di seluruh dunia oleh
              undang-undang hak cipta yang berlaku. Tidak ada materi yang diterbitkan oleh SkripsiAI
              di Situs ini, baik secara keseluruhan maupun sebagian, boleh disalin, direproduksi,
              dimodifikasi, diterbitkan ulang, diunggah, diposting, ditransmisikan, atau
              didistribusikan dalam bentuk apa pun atau dengan cara apa pun tanpa izin tertulis
              terlebih dahulu dari SkripsiAI.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Pendaftaran Akun</h2>
            <p>
              Anda perlu mendaftar di Situs ini untuk menggunakan layanan dengan memasukkan email
              dan kata sandi Anda. Anda akan mendapatkan manfaat seperti pembaruan dan penawaran
              khusus dengan mendaftar. Anda akan diminta untuk memberikan informasi yang akurat
              dan terkini pada semua formulir pendaftaran di Situs ini. Anda bertanggung jawab
              penuh untuk menjaga kerahasiaan nama pengguna dan kata sandi yang Anda pilih atau
              yang dipilih oleh administrator web Anda atas nama Anda, untuk mengakses Situs ini
              serta semua aktivitas yang terjadi di bawah nama pengguna/kata sandi Anda. Anda tidak
              akan menyalahgunakan atau membagikan nama pengguna atau kata sandi Anda, salah
              mengartikan identitas atau afiliasi Anda dengan entitas, meniru identitas orang atau
              entitas mana pun, atau salah menyatakan asal materi apa pun yang Anda temui melalui
              Situs ini.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. Komunikasi Elektronik</h2>
            <p>
              Anda setuju bahwa SkripsiAI dapat mengirimkan email elektronik kepada Anda untuk
              tujuan memberi tahu Anda tentang perubahan atau penambahan pada Situs ini, tentang
              produk atau layanan SkripsiAI, atau untuk tujuan lain yang kami anggap sesuai. Jika
              Anda ingin berhenti berlangganan dari newsletter kami, silakan klik
              &quot;Berhenti Berlangganan&quot; di halaman akun Anda.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">7. Deskripsi Layanan</h2>
            <p>
              Kami selalu berusaha menampilkan informasi dan deskripsi layanan yang muncul di
              Situs seakurat mungkin. Namun, kami tidak dapat menjamin bahwa semua deskripsi
              layanan sepenuhnya akurat, lengkap, terkini, atau bebas dari kesalahan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">8. Langganan & Pembayaran</h2>
            <p>
              SkripsiAI menawarkan paket langganan berbayar (Pro) dengan periode 3 bulan dan 6 bulan.
              Dengan berlangganan, Anda menyetujui hal-hal berikut:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm text-muted-foreground">
              <li>
                Pembayaran diproses melalui penyedia layanan pembayaran pihak ketiga yang kami tunjuk.
              </li>
              <li>
                Akses Pro akan aktif segera setelah pembayaran berhasil dikonfirmasi dan berlaku
                sesuai periode langganan yang dipilih.
              </li>
              <li>
                Apabila pembayaran gagal atau tidak dapat diproses, akses Pro tidak akan diaktifkan
                hingga pembayaran berhasil diselesaikan.
              </li>
              <li>
                Setelah periode langganan berakhir, akun Anda akan otomatis kembali ke paket Free
                kecuali Anda memperpanjang langganan.
              </li>
              <li>
                SkripsiAI berhak mengubah harga langganan dengan pemberitahuan sebelumnya. Perubahan
                harga tidak berlaku untuk periode langganan yang sedang berjalan.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">9. Kebijakan Pengembalian Dana</h2>
            <p>
              Layanan SkripsiAI merupakan produk digital yang langsung dapat digunakan setelah
              pembayaran dikonfirmasi. Oleh karena itu, semua pembayaran bersifat final dan tidak
              dapat dikembalikan (non-refundable). Dengan melakukan pembayaran, Anda memahami dan
              menyetujui bahwa tidak ada pengembalian dana dalam kondisi apa pun, termasuk namun
              tidak terbatas pada ketidakpuasan terhadap layanan, pembatalan langganan sebelum
              periode berakhir, atau pelanggaran Syarat dan Ketentuan yang mengakibatkan penangguhan
              akun.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">10. Larangan Penggunaan</h2>
            <p>
              Anda dilarang menggunakan SkripsiAI untuk tujuan berikut:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm text-muted-foreground">
              <li>
                <strong>Plagiarisme:</strong> Menyalin atau mengklaim hasil AI sebagai karya
                sepenuhnya milik Anda tanpa proses penyuntingan, validasi, dan kontribusi intelektual
                yang memadai.
              </li>
              <li>
                <strong>Kecurangan Akademik:</strong> Menggunakan layanan untuk menyelesaikan tugas
                akademik dengan cara yang melanggar kebijakan integritas akademik institusi Anda.
              </li>
              <li>
                <strong>Penyalahgunaan AI:</strong> Menghasilkan konten yang menyesatkan, memalsukan
                data penelitian, atau membuat referensi fiktif.
              </li>
              <li>
                <strong>Aktivitas Ilegal:</strong> Menggunakan layanan untuk tujuan yang melanggar
                hukum yang berlaku di Indonesia.
              </li>
            </ul>
            <p>
              SkripsiAI dirancang sebagai alat bantu penulisan, bukan pengganti proses berpikir
              akademik. Pengguna bertanggung jawab penuh atas penggunaan konten yang dihasilkan
              dan wajib memastikan kepatuhan terhadap kebijakan integritas akademik institusi
              masing-masing. SkripsiAI berhak menangguhkan atau menghentikan akun yang melanggar
              ketentuan ini tanpa pengembalian dana.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">11. Lisensi Penggunaan</h2>
            <p>
              SkripsiAI memberikan Anda hak untuk mengakses dan menggunakan platform perangkat
              lunak semata-mata untuk keperluan penulisan skripsi Anda. Hak ini bersifat
              non-eksklusif, tidak dapat dipindahtangankan, dan dibatasi oleh serta tunduk pada
              Perjanjian ini. Anda tidak boleh: (a) memodifikasi, mengadaptasi, mendekompilasi,
              membongkar, atau merekayasa balik komponen apa pun dari platform; (b) membuat karya
              turunan berdasarkan komponen apa pun dari platform; (c) mengizinkan pihak ketiga
              untuk menggunakan atau memiliki akses ke komponen apa pun dari platform atau
              dokumentasinya.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">12. Ganti Rugi</h2>
            <p>
              Anda setuju untuk mengganti rugi, membela, dan membebaskan SkripsiAI dari dan
              terhadap semua klaim pihak ketiga, kewajiban, kerusakan, kerugian, atau biaya
              (termasuk biaya pengacara yang wajar dan biaya) yang timbul dari, berdasarkan,
              atau sehubungan dengan akses dan/atau penggunaan Anda atas Situs ini.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">13. Penafian</h2>
            <p>
              SkripsiAI tidak bertanggung jawab atas akurasi, kebenaran, ketepatan waktu, atau
              konten materi yang disediakan di Situs ini. Anda tidak boleh berasumsi bahwa materi
              di Situs ini terus diperbarui atau mengandung informasi terkini. SkripsiAI tidak
              bertanggung jawab untuk menyediakan konten atau materi dari Situs yang telah
              kedaluwarsa atau telah dihapus.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">14. Hukum yang Berlaku</h2>
            <p>
              Syarat dan Ketentuan ini diatur oleh hukum yang berlaku di Indonesia.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">15. Pertanyaan dan Umpan Balik</h2>
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
