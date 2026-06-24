'use client'

import { useRef, useCallback } from 'react'

const services = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2E86DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
        <rect x="8" y="2" width="8" height="4" rx="1"/>
        <path d="M12 11v6"/><path d="M9 14h6"/>
      </svg>
    ),
    title: 'Konseling Individual',
    desc: 'Sesi tatap muka virtual privat dengan psikolog berpengalaman. Jadwal fleksibel, sepenuhnya rahasia.',
    color: '#2E86DE',
    bgIcon: '#EBF4FF',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Komunitas Dukungan',
    desc: 'Bergabung dengan grup dukungan yang dipandu profesional. Berbagi cerita, saling menguatkan.',
    featured: true,
    badge: 'Terpopuler',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2E86DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Alat Self-Care',
    desc: 'Jurnal mood, meditasi terpandu, dan latihan mindfulness yang dirancang oleh para ahli.',
    color: '#2E86DE',
    bgIcon: '#EBF4FF',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2E86DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Bantuan Darurat 24/7',
    desc: 'Akses bantuan krisis kapan saja. Tim profesional siap membantu dalam situasi darurat.',
    color: '#2E86DE',
    bgIcon: '#EBF4FF',
  },
]

export default function ServicesSection() {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
  }, [])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = ''
  }, [])

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-neutral-900 mb-4">
            Layanan Kami
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto">
            Berbagai layanan kesehatan mental yang dirancang untuk kebutuhanmu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {services.map((svc) => (
            <div
              key={svc.title}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className={`card-tilt rounded-xl p-8 border cursor-default ${
                svc.featured
                  ? 'bg-gradient-to-br from-blue-500 to-blue-700 border-transparent text-white relative'
                  : 'bg-white border-neutral-200 shadow-sm hover:shadow-lg'
              }`}
            >
              {svc.badge && (
                <span className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                  {svc.badge}
                </span>
              )}
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${
                svc.featured ? 'bg-white/15' : 'bg-blue-50'
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
          ))}
        </div>
      </div>
    </section>
  )
}
