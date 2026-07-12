'use client'

import React, { useRef } from 'react'
import ScrollReveal, { ScrollRevealItem } from '@/components/ui/ScrollReveal'
import { CalendarCheck, CreditCard, MessageCircle, HeartHandshake } from 'lucide-react'

const steps = [
  {
    num: '01',
    title: 'Booking Jadwal',
    desc: 'Pilih tanggal dan waktu yang nyaman untukmu. Proses booking mudah dan cepat, tanpa alur yang rumit.',
    icon: <CalendarCheck className="w-5 h-5" />,
  },
  {
    num: '02',
    title: 'Selesaikan Pembayaran',
    desc: 'Bayar hanya Rp20.000 per sesi (1 jam). Pembayaran aman dan instan melalui berbagai metode.',
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    num: '03',
    title: 'Konfirmasi via WhatsApp',
    desc: 'Admin kami akan segera menghubungimu melalui WhatsApp untuk memandu jadwal dan memberikan tautan Google Meet atau detail lokasi.',
    icon: <MessageCircle className="w-5 h-5" />,
  },
  {
    num: '04',
    title: 'Mulai Sesi Konseling',
    desc: 'Temui konselor atau psikolog Anda secara Online atau tatap muka. Ceritakan apa yang kamu rasakan di ruang yang 100% rahasia.',
    icon: <HeartHandshake className="w-5 h-5" />,
  },
]

export default function HowItWorks() {
  const [activeStep, setActiveStep] = React.useState('01')

  return (
    <section id="cara-kerja" className="scroll-mt-24 py-16 md:py-24 bg-white dark:bg-background overflow-hidden">
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

        <ScrollReveal staggerChildren={0.15} className="max-w-[100vw] mx-auto md:max-w-none relative">
          
          {/* Desktop Grid Layout */}
          <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-4 px-6 md:px-0">
            {steps.map((step) => (
              <ScrollRevealItem key={step.num} variant="fade-up" className="h-full">
                <div className="relative overflow-hidden bg-white dark:bg-card rounded-3xl p-6 md:p-8 border border-neutral-100 dark:border-border hover:border-blue-200 dark:hover:border-blue-800 shadow-sm hover:shadow-card transition-all duration-300 h-full flex flex-col min-h-[220px]">
                  <div className="absolute -right-2 -bottom-4 text-[120px] md:text-[140px] font-black text-slate-100 dark:text-slate-800/30 leading-none z-0 select-none pointer-events-none">
                    {step.num}
                  </div>
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 flex items-center justify-center shrink-0">
                        {step.icon}
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 px-3 py-1.5 rounded-full">
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

          {/* Mobile Accordion Layout */}
          <div className="flex flex-col gap-3 md:hidden px-6">
            {steps.map((step) => (
              <ScrollRevealItem key={step.num} variant="fade-up">
                <div 
                  onClick={() => setActiveStep(activeStep === step.num ? '' : step.num)}
                  className="bg-white dark:bg-card border border-neutral-100 dark:border-border rounded-2xl p-5 shadow-sm cursor-pointer transition-all duration-200 hover:border-blue-200"
                >
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 flex items-center justify-center shrink-0">
                        {step.icon}
                      </div>
                      <span className="font-bold text-neutral-900 dark:text-foreground">Langkah {step.num}</span>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${activeStep === step.num ? 'rotate-180' : ''}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${activeStep === step.num ? 'max-h-[300px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <h4 className="font-bold text-[1.05rem] text-blue-600 dark:text-blue-400 mb-2">{step.title}</h4>
                    <p className="text-sm text-neutral-500 dark:text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
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
