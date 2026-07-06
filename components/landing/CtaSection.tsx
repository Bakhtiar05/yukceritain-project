'use client'

import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function CtaSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-container mx-auto px-6">
        <ScrollReveal variant="scale">
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-3xl py-16 md:py-20 px-8 md:px-16 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-[-60px] right-[-60px] w-40 h-40 rounded-full bg-white/[0.08]" aria-hidden="true" />
            <div className="absolute bottom-[-30px] left-[10%] w-24 h-24 rounded-full bg-white/[0.05]" aria-hidden="true" />
            <div className="absolute top-[40%] left-[-40px] w-20 h-20 rounded-full bg-white/[0.06]" aria-hidden="true" />
            <div className="absolute bottom-[20%] right-[15%] w-16 h-16 rounded-full bg-white/[0.04]" aria-hidden="true" />

            <div className="relative z-10">
              <span className="text-4xl mb-5 block">🌱</span>

              <h2 className="text-[clamp(1.5rem,4vw,2.4rem)] font-extrabold text-white mb-5 max-w-2xl mx-auto leading-tight">
                Jangan Biarkan Beban Itu
                <br className="hidden md:block" /> Dipendam Sendirian
              </h2>

              <p className="text-blue-100 text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Ambil langkah pertamamu hari ini. Ceritakan keluh kesahmu di ruang yang aman, rahasia, dan terjangkau. Kami di sini untuk mendengarmu.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Link href="/konsultasi" className="btn btn-white btn-large">
                  Mulai Konseling — Rp20.000
                </Link>
              </div>

              <p className="text-blue-200 text-xs">
                1 jam konseling · 100% rahasia · Via WhatsApp · Tanpa komitmen
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
