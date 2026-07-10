'use client'

import ScrollReveal, { ScrollRevealItem } from '@/components/ui/ScrollReveal'

const steps = [
  {
    num: '01',
    title: 'Booking Jadwal',
    desc: 'Pilih tanggal dan waktu yang nyaman untukmu. Proses booking mudah dan cepat, tanpa alur yang rumit.',
    icon: '📅',
  },
  {
    num: '02',
    title: 'Selesaikan Pembayaran',
    desc: 'Bayar hanya Rp20.000 per sesi (1 jam). Pembayaran aman dan instan melalui berbagai metode.',
    icon: '💳',
  },
  {
    num: '03',
    title: 'Konfirmasi via WhatsApp',
    desc: 'Admin kami akan segera menghubungimu melalui WhatsApp untuk memandu jadwal dan memberikan tautan Google Meet atau detail lokasi.',
    icon: '💬',
  },
  {
    num: '04',
    title: 'Mulai Sesi Konseling',
    desc: 'Temui konselor atau psikolog Anda secara Online atau tatap muka. Ceritakan apa yang kamu rasakan di ruang yang 100% rahasia.',
    icon: '🌱',
  },
]

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="scroll-mt-24 py-12 md:py-20 bg-neutral-50 dark:bg-background">
      <div className="max-w-container mx-auto px-6">
        <ScrollReveal variant="fade-up" className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Panduan Sesi</p>
          <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold text-neutral-900 dark:text-foreground mb-4">
            Semudah 4 Langkah
          </h2>
          <p className="text-neutral-500 dark:text-muted-foreground max-w-lg mx-auto text-lg">
            Tanpa alur rumit. Dari booking sampai konseling, semuanya dirancang agar kamu bisa mulai secepat mungkin.
          </p>
        </ScrollReveal>

        <ScrollReveal staggerChildren={0.15} className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 md:left-8 top-12 bottom-12 w-px bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200 hidden md:block" aria-hidden="true" />

            <div className="space-y-6">
              {steps.map((step) => (
                <ScrollRevealItem key={step.num} variant="fade-up">
                  <div className="relative flex gap-5 md:gap-8 items-start group">
                    {/* Step number circle */}
                    <div className="relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-card border-2 border-blue-100 group-hover:border-blue-400 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                      <span className="text-2xl">{step.icon}</span>
                    </div>

                    {/* Content card */}
                    <div className="flex-1 bg-white dark:bg-card rounded-2xl p-6 md:p-8 border border-neutral-100 dark:border-border group-hover:border-blue-100 shadow-sm group-hover:shadow-card transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                          Langkah {step.num}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-neutral-500 dark:text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </ScrollRevealItem>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
