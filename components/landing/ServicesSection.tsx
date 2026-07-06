'use client'

import { useEffect, useRef, useState } from 'react'
import ScrollReveal, { ScrollRevealItem } from '@/components/ui/ScrollReveal'

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
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Mudah via WhatsApp',
    desc: 'Tak perlu repot unduh aplikasi baru. Admin kami akan menghubungi dan memandu jadwal Anda langsung melalui WhatsApp.',
  },
]

export default function ServicesSection() {
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile || !scrollRef.current) return;
    
    let isDragging = false;
    
    // Basic auto-scroll logic
    const interval = setInterval(() => {
      if (isDragging) return;
      const el = scrollRef.current;
      if (el) {
        // If reached end, scroll to start, else scroll to next item
        const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 20;
        if (isAtEnd) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: el.clientWidth * 0.8, behavior: 'smooth' });
        }
      }
    }, 2500);

    // Pause on touch to let user swipe freely
    const el = scrollRef.current;
    const handleTouchStart = () => { isDragging = true; };
    const handleTouchEnd = () => { setTimeout(() => { isDragging = false; }, 1000); };
    
    if (el) {
      el.addEventListener('touchstart', handleTouchStart, { passive: true });
      el.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      clearInterval(interval);
      if (el) {
        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isMobile]);

  return (
    <section id="layanan" className="scroll-mt-24 pt-6 pb-12 md:pt-12 md:pb-20 bg-white overflow-hidden">
      <div className="max-w-container mx-auto px-6">
        <ScrollReveal variant="fade-up" className="text-center mb-10 md:mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Layanan Kami</p>
          <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold text-neutral-900 mb-4">
            Layanan yang Dirancang Untukmu
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto text-lg">
            Akses konseling profesional dengan cara yang mudah, terjangkau, dan sepenuhnya rahasia
          </p>
        </ScrollReveal>

        {/* Scrollable Container on Mobile */}
        <div 
          ref={scrollRef}
          className="overflow-x-auto md:overflow-visible -mx-6 px-6 md:mx-auto md:px-0 pb-6 md:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          <ScrollReveal 
            staggerChildren={0.12} 
            className="flex md:grid md:grid-cols-2 gap-5 max-w-3xl mx-auto w-max md:w-full"
          >
            {services.map((svc) => (
              <ScrollRevealItem 
                key={svc.title} 
                variant="fade-up" 
                className="w-[85vw] sm:w-[350px] md:w-auto flex-shrink-0 snap-center md:snap-none"
              >
                <div
                  className={`relative rounded-2xl p-7 md:p-8 border h-full cursor-default transition-all duration-300 hover:-translate-y-1 ${
                    svc.featured
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-transparent text-white shadow-[0_8px_30px_rgba(37,99,235,0.25)]'
                      : 'bg-white border-blue-200 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-blue-400'
                  }`}
                >
                  {svc.badge && (
                    <span className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                      {svc.badge}
                    </span>
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 md:mb-5 ${
                    svc.featured ? 'bg-white/15 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {svc.icon}
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${svc.featured ? 'text-white' : 'text-neutral-900'}`}>
                    {svc.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${svc.featured ? 'text-blue-100' : 'text-neutral-500'}`}>
                    {svc.desc}
                  </p>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
