import Link from 'next/link'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

const WA_PRO_URL = `https://api.whatsapp.com/send?phone=6282245101283&text=${encodeURIComponent('Halo, saya tertarik dengan Plan Pro SkripsiAI. Bisa bantu saya untuk berlangganan?')}`

const plans = [
  {
    name: 'Gratis',
    price: 'Rp 0',
    period: 'selamanya',
    description: 'Untuk mencoba dan mulai menulis',
    badge: null,
    cta: 'Mulai Gratis',
    ctaHref: '/register',
    ctaExternal: false,
    ctaVariant: 'outline' as const,
    features: [
      'Batas 5.000 kata per bulan',
      'Batas 3x export .docx',
      'Struktur skripsi standar',
      'AI writing assistant',
    ],
  },
  {
    name: 'Pro',
    price: 'Rp 49.000',
    period: 'per bulan',
    description: 'Untuk mahasiswa yang serius menyelesaikan skripsi',
    badge: 'Paling Populer',
    cta: 'Hubungi via WhatsApp',
    ctaHref: WA_PRO_URL,
    ctaExternal: true,
    ctaVariant: 'primary' as const,
    features: [
      'Kata tidak terbatas',
      'Export .docx tidak terbatas',
      'Riwayat revisi lengkap',
      'Prioritas dalam antrian AI',
      'Dukungan prioritas',
    ],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function PricingView() {
  return (
    <section id="harga" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="mb-4 text-sm font-medium uppercase tracking-widest text-blue-400">
            Harga
          </div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Mulai gratis, upgrade kapan saja
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              className={`relative rounded-xl border p-8 ${
                plan.badge
                  ? 'border-blue-500/50 bg-blue-600/5'
                  : 'border-white/8 bg-[#18181b]'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="mb-1 text-sm font-medium text-zinc-400">{plan.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-zinc-500">/{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-zinc-500">{plan.description}</p>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="h-4 w-4 shrink-0 text-blue-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                target={plan.ctaExternal ? '_blank' : undefined}
                rel={plan.ctaExternal ? 'noopener noreferrer' : undefined}
                className={`block w-full rounded-lg px-4 py-3 text-center text-sm font-medium transition-colors ${
                  plan.ctaVariant === 'primary'
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
