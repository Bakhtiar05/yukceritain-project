'use client'

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
]

export default function ServicesSection() {
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

        <div className="-mx-6 px-6 md:mx-0 md:px-0 pt-2 pb-6 md:pb-2 overflow-hidden relative">
          
          {/* Desktop View: Grid */}
          <div className="hidden md:block">
            <ScrollReveal 
              staggerChildren={0.12} 
              className="grid grid-cols-3 gap-5 max-w-5xl mx-auto w-full"
            >
              {services.map((svc) => (
                <ScrollRevealItem 
                  key={svc.title} 
                  variant="fade-up" 
                  className="w-full h-full"
                >
                  <ServiceCard svc={svc} />
                </ScrollRevealItem>
              ))}
            </ScrollReveal>
          </div>

          {/* Mobile View: CSS Marquee */}
          <ScrollReveal variant="fade-up" className="md:hidden flex overflow-hidden group pt-2">
            <div className="flex shrink-0 animate-marquee gap-4 pr-4 w-max hover:[animation-play-state:paused]">
              {[...services, ...services].map((svc, idx) => (
                <div key={idx} className="w-[85vw] max-w-[300px] shrink-0">
                  <ServiceCard svc={svc} />
                </div>
              ))}
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  )
}

function ServiceCard({ svc }: { svc: typeof services[0] }) {
  return (
    <div className="relative rounded-2xl p-7 md:p-8 border h-full cursor-default transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-card border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-slate-700">
      <div className="flex justify-between items-start mb-4 md:mb-5 gap-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 shrink-0">
          {svc.icon}
        </div>
        {svc.badge && (
          <span className="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full border border-blue-100 dark:border-blue-500/20 text-center leading-tight">
            {svc.badge}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
        {svc.title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {svc.desc}
      </p>
    </div>
  )
}
