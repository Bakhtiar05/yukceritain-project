'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

function useCountUp(target: number, suffix: string, duration = 1800) {
  const [display, setDisplay] = useState('0' + suffix)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const value = Math.round(eased * target)
            setDisplay(value.toLocaleString('id-ID') + suffix)
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix, duration])

  return { ref, display }
}

export default function HeroSection() {
  const stat1 = useCountUp(50, 'K+')
  const stat2 = useCountUp(200, '+')

  return (
    <section id="hero" className="relative pt-[72px] bg-white overflow-hidden">
      <div className="max-w-container mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-500 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-dot" />
            Dipercaya oleh 50.000+ pengguna
          </div>

          <h1 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.1] tracking-tight text-neutral-900 mb-4">
            Kesehatan Mentalmu<br />
            <span className="gradient-text">Adalah Prioritas</span>
          </h1>

          <p className="text-neutral-500 text-lg leading-relaxed mb-8 max-w-md">
            Terhubung dengan psikolog profesional untuk konseling online yang aman, nyaman, dan terjangkau. Kapan saja, di mana saja.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            <Link href="#services" className="btn btn-primary btn-large">Mulai Konseling</Link>
            <Link href="#how-it-works" className="btn btn-outline btn-large">Pelajari Lebih Lanjut</Link>
          </div>

          {/* Trust Stats */}
          <div className="flex flex-wrap gap-8">
            <div>
              <span ref={stat1.ref} className="text-2xl font-bold text-neutral-900">{stat1.display}</span>
              <p className="text-xs text-neutral-400 mt-0.5">Pengguna Aktif</p>
            </div>
            <div className="w-px bg-neutral-200" />
            <div>
              <span ref={stat2.ref} className="text-2xl font-bold text-neutral-900">{stat2.display}</span>
              <p className="text-xs text-neutral-400 mt-0.5">Psikolog Bersertifikat</p>
            </div>
            <div className="w-px bg-neutral-200" />
            <div>
              <span className="text-2xl font-bold text-neutral-900">4.9★</span>
              <p className="text-xs text-neutral-400 mt-0.5">Rating Platform</p>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative hidden lg:block">
          <Image src="/assets/hero_illustration.png" alt="Ilustrasi kesehatan mental" width={520} height={480} className="w-full h-auto" priority />

          {/* Floating Card 1 */}
          <div className="absolute top-8 -right-2 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 animate-float-1">
            <span className="text-2xl">😌</span>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Sesi Pertama</p>
              <p className="text-xs text-neutral-400">Gratis untuk semua</p>
            </div>
          </div>

          {/* Floating Card 2 */}
          <div className="absolute bottom-12 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 animate-float-2">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-sm font-semibold text-neutral-900">100% Rahasia</p>
              <p className="text-xs text-neutral-400">Data terlindungi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,20 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#F0F7FF" />
        </svg>
      </div>
    </section>
  )
}
