import { BookOpen, Sparkles, Eye, FileDown } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: BookOpen,
    title: 'Structured Layout Engine',
    description:
      'Dokumen otomatis mengikuti struktur skripsi standar — Bab I–V, heading tersusun, penomoran konsisten, page break sesuai standar.',
  },
  {
    icon: Sparkles,
    title: 'AI Writing Assistant',
    description:
      'Instruksikan AI per bagian. AI hanya update section yang ditarget — tidak merusak bagian yang sudah kamu tulis manual.',
  },
  {
    icon: Eye,
    title: 'Live Document Preview',
    description:
      'Edit langsung di dokumen atau biarkan AI yang menulis. Perubahan terlihat real-time seperti dokumen skripsi asli.',
  },
  {
    icon: FileDown,
    title: 'Export Siap Kumpul',
    description:
      'Export ke .docx dengan heading aktif, daftar isi otomatis, dan nomor halaman yang benar. Minim penyesuaian manual.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function FeaturesView() {
  return (
    <section id="features" className="px-6 py-24">
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
            Fitur
          </div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Semua yang kamu butuhkan
            <br />
            <span className="text-zinc-400">untuk menyelesaikan skripsi</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="group rounded-xl border border-white/8 bg-[#18181b] p-6 transition-colors hover:border-blue-500/30 hover:bg-blue-500/5"
              >
                <div className="mb-4 inline-flex rounded-lg bg-blue-600/10 p-2.5">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
