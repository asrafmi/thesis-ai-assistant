import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Setup Skripsimu',
    description:
      'Isi judul, nama kampus, fakultas, dan dosen pembimbing. Pilih jenis penelitian — kuantitatif atau kualitatif. Sistem menyiapkan template Bab I–V otomatis.',
  },
  {
    number: '02',
    title: 'Tulis dengan AI',
    description:
      'Pilih bagian yang ingin dikerjakan, tulis instruksi ke AI, dan biarkan AI menulis konten akademik untuk section tersebut. Kamu bisa edit langsung hasilnya.',
  },
  {
    number: '03',
    title: 'Export & Kumpulkan',
    description:
      'Saat skripsi siap, export ke .docx. File sudah rapi — heading aktif, daftar isi bisa diperbarui, nomor halaman benar. Langsung bisa dikumpulkan.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const stepVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function HowItWorksView() {
  return (
    <section id="cara-kerja" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="mb-4 text-sm font-medium uppercase tracking-widest text-blue-400">
            Cara Kerja
          </div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Cara kerjanya sederhana
          </h2>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="relative grid grid-cols-1 gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Connector line (desktop) */}
          <div className="absolute left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] top-6 hidden h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent md:block" />

          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className="relative flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/30 bg-blue-600/10 text-sm font-bold text-blue-400">
                {step.number}
              </div>
              <h3 className="mb-3 font-semibold text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
