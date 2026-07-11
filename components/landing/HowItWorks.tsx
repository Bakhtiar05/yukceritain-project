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
          <p className="text-neutral-500 dark:text-muted-foreground max-w-lg mx-auto text-sm md:text-base lg:text-lg">
            Tanpa alur rumit. Dari booking sampai konseling, semuanya dirancang agar kamu bisa mulai secepat mungkin.
          </p>
        </ScrollReveal>

        <ScrollReveal staggerChildren={0.15} className="max-w-[100vw] mx-auto md:max-w-none">
          <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6 pb-8 px-6 md:px-0 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <ScrollRevealItem key={step.num} variant="fade-up" className="w-[85vw] max-w-[320px] md:w-auto md:max-w-none shrink-0 snap-center">
                <div className="relative overflow-hidden bg-white dark:bg-card rounded-3xl p-6 md:p-8 border border-neutral-100 dark:border-border hover:border-blue-200 dark:hover:border-blue-800 shadow-sm hover:shadow-card transition-all duration-300 h-full flex flex-col min-h-[220px]">
                  {/* Giant transparent typography */}
                  <div className="absolute -right-2 -bottom-4 text-[120px] md:text-[140px] font-black text-slate-100 dark:text-slate-800/30 leading-none z-0 select-none pointer-events-none">
                    {step.num}
                  </div>
                  
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                        Langkah {step.num}
                      </span>
                    </div>
                    <h3 className="text-[1.15rem] font-bold text-neutral-900 dark:text-foreground mb-3">{step.title}</h3>
                    <p className="text-sm text-neutral-500 dark:text-muted-foreground leading-relaxed flex-1">{step.desc}</p>
                  </div>
                </div>
              </ScrollRevealItem>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
