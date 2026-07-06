'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'

const faqs = [
  {
    q: 'Berapa biaya untuk satu sesi konseling?',
    a: 'Hanya Rp20.000 per sesi dengan durasi 1 jam penuh. Tidak ada biaya tersembunyi, tidak ada komitmen jangka panjang. Kami percaya kesehatan mental harus bisa diakses oleh semua orang tanpa dibatasi biaya.',
  },
  {
    q: 'Bagaimana proses konseling di YukceritaIN?',
    a: 'Prosesnya sangat mudah: (1) Booking jadwal yang kamu inginkan, (2) Selesaikan pembayaran Rp20.000, dan (3) Konselor atau psikolog klinis kami akan langsung menyapamu secara privat melalui WhatsApp. Tanpa alur yang rumit.',
  },
  {
    q: 'Apakah data dan percakapan saya terjamin kerahasiaannya?',
    a: 'Absolut. Kerahasiaan adalah prioritas utama kami. Semua percakapan dan data pribadimu dilindungi 100%. Konseling dilakukan secara privat 1-on-1 melalui WhatsApp, dan kami tidak pernah membagikan informasi penggunamu kepada siapa pun.',
  },
  {
    q: 'Siapa yang akan menjadi konselor saya?',
    a: 'Kamu akan ditangani oleh konselor atau psikolog klinis profesional yang berpengalaman. Semua tenaga ahli kami telah melalui proses seleksi dan verifikasi ketat untuk memastikan kualitas layanan terbaik untukmu.',
  },
  {
    q: 'Apakah saya perlu download aplikasi khusus?',
    a: 'Tidak perlu. Semua sesi konseling dilakukan melalui WhatsApp yang sudah kamu miliki. Cukup booking dan bayar melalui website kami, lalu konselor akan menghubungimu langsung di WhatsApp.',
  },
  {
    q: 'Bisakah saya mengganti konselor jika tidak cocok?',
    a: 'Tentu. Kenyamananmu adalah yang paling penting bagi kami. Kamu bebas mengganti konselor kapan saja tanpa biaya tambahan. Tim kami juga siap membantu merekomendasikan konselor yang sesuai dengan kebutuhanmu.',
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section id="faq" className="scroll-mt-24 py-12 md:py-20 bg-neutral-50">
      <div className="max-w-container mx-auto px-6">
        <ScrollReveal variant="fade-up" className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold text-neutral-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto text-lg">
            Temukan jawaban untuk pertanyaanmu tentang layanan konseling kami
          </p>
        </ScrollReveal>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} variant="fade-up" delay={i * 0.05}>
              <div className={`bg-white rounded-2xl border transition-all duration-300 ${openIndex === i ? 'border-blue-100 shadow-card' : 'border-neutral-100 shadow-sm'}`}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between p-6 text-left gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
                  aria-expanded={openIndex === i}
                >
                  <span className="text-[0.95rem] font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openIndex === i ? 'bg-blue-600 text-white rotate-180' : 'bg-neutral-100 text-neutral-400'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-neutral-500">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
