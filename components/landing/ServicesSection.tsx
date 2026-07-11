'use client'

import React, { useRef } from 'react'
import ScrollReveal, { ScrollRevealItem } from '@/components/ui/ScrollReveal'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const services = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    title: 'Konseling Individu',
    desc: 'Tersedia secara Online (Google Meet) dari mana saja, atau sesi Offline (Tatap Muka) khusus di area Kota Serang.',
    featured: true,
    badge: 'Layanan Utama',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: '100% Kerahasiaan',
    desc: 'Ruang aman untuk setiap ceritamu. Identitas dan seluruh percakapan dijamin privasinya secara profesional.',
    featured: true,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: 'Sangat Terjangkau',
    desc: 'Hanya Rp20.000 per sesi (1 Jam). Kami hadir untuk memastikan kesehatan mental bisa diakses oleh siapa saja.',
  },
]

export default function ServicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.85
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section id="layanan" className="scroll-mt-24 pt-6 pb-12 md:pt-12 md:pb-20 bg-white dark:bg-background overflow-hidden">
      <div className="max-w-container mx-auto px-6">
        <ScrollReveal variant="fade-up" className="text-center mb-10 md:mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Layanan Kami</p>
          <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold text-neutral-900 dark:text-foreground mb-4">
            Layanan yang Dirancang Untukmu
          </h2>
          <p className="text-neutral-500 dark:text-muted-foreground max-w-lg mx-auto text-sm md:text-base lg:text-lg">
            Akses konseling profesional dengan cara yang mudah, terjangkau, dan sepenuhnya rahasia
          </p>
        </ScrollReveal>

        <ScrollReveal staggerChildren={0.12} className="max-w-[100vw] mx-auto md:max-w-5xl relative">
          <div 
            ref={scrollRef}
            className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar gap-4 md:gap-5 pb-4 md:pb-8 px-6 md:px-0 md:grid-cols-3 scroll-smooth"
          >
            {services.map((svc) => (
              <ScrollRevealItem 
                key={svc.title} 
                variant="fade-up" 
                className="w-[85vw] max-w-[320px] md:w-auto md:max-w-none shrink-0 snap-center h-full"
              >
                <ServiceCard svc={svc} />
              </ScrollRevealItem>
            ))}
          </div>

          {/* Navigation Buttons (Mobile) */}
          <div className="flex justify-center gap-3 mt-2 mb-6 md:hidden">
            <button 
              onClick={() => scroll('left')} 
              className="w-10 h-10 rounded-full border border-neutral-200 dark:border-slate-800 flex items-center justify-center text-neutral-600 dark:text-slate-400 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')} 
              className="w-10 h-10 rounded-full border border-neutral-200 dark:border-slate-800 flex items-center justify-center text-neutral-600 dark:text-slate-400 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function ServiceCard({ svc }: { svc: typeof services[0] }) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-card rounded-3xl p-6 md:p-8 border border-neutral-100 dark:border-border hover:border-blue-200 dark:hover:border-blue-800 shadow-sm hover:shadow-card transition-all duration-300 h-full flex flex-col min-h-[220px]">
      <div className="flex justify-between items-start mb-4 md:mb-5 gap-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 shrink-0">
          {svc.icon}
        </div>
        {svc.badge && (
          <span className="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-500/20 text-center leading-tight">
            {svc.badge}
          </span>
        )}
      </div>
      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="text-[1.15rem] font-bold text-neutral-900 dark:text-foreground mb-3">
          {svc.title}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-muted-foreground leading-relaxed flex-1">
          {svc.desc}
        </p>
      </div>
    </div>
  )
}
