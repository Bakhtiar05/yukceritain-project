'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion, Variants, AnimatePresence } from 'framer-motion'

const dynamicWords = ["Didengar", "Dimengerti", "Divalidasi", "Dihargai"];

const DynamicTextSwap = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % dynamicWords.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center md:items-start w-full">
      <span className="text-slate-900 dark:text-foreground text-[2.5rem] md:text-6xl lg:text-[72px] font-extrabold leading-[1.1] tracking-tight text-center md:text-left block w-full">
        Ceritamu Layak
      </span>
      {/* Stable container height to prevent layout shift */}
      <div className="relative h-[50px] md:h-[72px] lg:h-[84px] w-full flex justify-center md:justify-start mt-1 md:mt-2">
        <AnimatePresence>
          <motion.span
            key={index}
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -25, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute w-full text-center md:text-left font-extrabold text-[2.5rem] md:text-6xl lg:text-[72px] bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 pb-2 md:pb-3 lg:pb-4 leading-[1.1] tracking-tight"
          >
            {dynamicWords[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion()
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    },
  }

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-[95dvh] md:min-h-[100vh] overflow-hidden flex flex-col justify-center pt-28 md:pt-[72px] pb-12 md:pb-0"
    >
      {/* --- BACKGROUND IMAGE & OVERLAYS --- */}
      <div className="absolute inset-0 z-0 bg-slate-50 dark:bg-background">
        {/* Desktop Image */}
        <Image
          src="/assets/latar-v2.webp"
          alt="Background Desktop"
          fill
          priority
          className="hidden md:block object-cover object-center transition-all duration-700 dark:brightness-[0.55] dark:contrast-[1.1] dark:saturate-[0.7] dark:hue-rotate-[5deg]"
        />
        {/* Mobile Image */}
        <div className="absolute bottom-0 left-0 right-0 h-[45vh] md:hidden">
          <Image
            src="/assets/latar-v3.webp"
            alt="Background Mobile"
            fill
            priority
            className="object-cover object-top transition-all duration-700 dark:brightness-[0.40] dark:contrast-[1.1] dark:saturate-[0.6] dark:hue-rotate-[10deg]"
          />
          {/* Fade out the top of the image so it blends into the text area above it */}
          <div className="absolute top-[-2px] left-0 right-0 h-48 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent dark:from-background dark:via-background/90" />
        </div>
        {/* Dark mode blueish tint overlay to make it feel like night time */}
        <div className="absolute inset-0 hidden dark:block bg-blue-900/20 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Soft gradient overlay for text readability on the left (Desktop Only) */}
      <div className="hidden md:block absolute inset-0 z-0 bg-gradient-to-r from-white/95 via-white/50 to-transparent dark:from-background/95 dark:via-background/70 dark:to-background/20 pointer-events-none w-full" />

      {/* Smooth transition gradient at the bottom to blend with the next section */}
      <div className="absolute bottom-[-2px] left-0 right-0 h-32 md:h-72 bg-gradient-to-t from-slate-50 from-25% via-slate-50/90 via-50% to-transparent dark:from-background dark:from-25% dark:via-background/90 dark:via-50% z-10 pointer-events-none" />

      {/* --- FOREGROUND CONTENT --- */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 h-full flex flex-col items-center md:items-start justify-start md:justify-center flex-1 pb-16 pt-0 md:pb-16 lg:py-0">

        {/* TEXT & CTA (Centered on Mobile, Left-Aligned on Desktop) */}
        <motion.div
          className="relative z-20 w-full max-w-3xl flex flex-col items-center md:items-start text-center md:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          <motion.div
            variants={fadeUpVariants}
            className="mb-2 md:mb-4 flex justify-center md:justify-start w-full mt-0 lg:mt-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 dark:bg-card backdrop-blur-sm border border-blue-100/60 dark:border-border rounded-full shadow-sm hover:bg-blue-100/40 dark:hover:bg-slate-800 transition-colors">
              <span className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] md:text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                GRATIS100
              </span>
              <span className="text-[11px] md:text-xs font-semibold text-blue-900/80 dark:text-foreground pr-1">
                Klaim Sesi Gratis Pertamamu
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className="mb-3 md:mb-6 w-full"
          >
            <DynamicTextSwap />
          </motion.div>

          <motion.p
            variants={fadeUpVariants}
            className="text-slate-600 dark:text-slate-300 text-sm md:text-[17px] lg:text-[18px] leading-[1.7] mb-4 md:mb-8 w-full max-w-[480px] font-medium text-center md:text-left"
          >
            Ruang aman untuk setiap ceritamu. Konseling bersama konselor &amp; psikolog klinis profesional.
          </motion.p>

          {/* Social Proof (Moved Above CTA) */}
          <motion.div variants={fadeUpVariants} className="mb-6 md:mb-10 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 w-full">
            <div className="flex items-center -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 overflow-hidden shadow-sm">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center md:items-start gap-1 md:gap-0.5 text-center md:text-left">
              <div className="flex items-center gap-1 mb-0.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-white ml-1">4.9/5</span>
              </div>
              <span className="text-[11px] md:text-xs text-slate-600 dark:text-slate-300 font-medium">Bergabung dengan 10.000+ orang yang sudah bercerita</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={fadeUpVariants} className="flex flex-row items-center gap-3 md:gap-4 justify-center md:justify-start w-full">
            <Link
              href="/konsultasi"
              className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-5 md:px-7 py-3 md:py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm md:text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 whitespace-nowrap"
            >
              Mulai Konseling
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#cara-kerja"
              className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-5 md:px-7 py-3 md:py-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-blue-200 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-300 rounded-full font-bold text-sm md:text-base transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
            >
              Panduan
            </Link>
          </motion.div>

          {/* Pricing Info (Moved Below CTA) */}
          <motion.div variants={fadeUpVariants} className="mt-3 md:mt-4 flex flex-col items-center md:items-start justify-center md:justify-start w-full">
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs md:text-sm text-slate-500 dark:text-slate-300 font-medium w-full md:w-auto">
              <svg className="w-4 h-4 text-emerald-500 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mulai dari <span className="text-blue-600 dark:text-blue-300 font-bold">Rp20.000</span> per sesi
            </div>
          </motion.div>
        </motion.div>

        {/* FLOATING TRUST CARDS (DESKTOP) */}
        {isMounted && [
          {
            id: 1,
            icon: "🔒",
            title: "Privacy Protected",
            description: "Your conversations remain completely confidential.",
            position: "top-[15%] lg:right-[8%] xl:right-[12%]",
            delay: 0.8,
            duration: 5.5
          },
          {
            id: 2,
            icon: "👩‍⚕️",
            title: "Professional Counselors",
            description: "Guidance from licensed psychologists.",
            position: "top-[45%] lg:right-[1%] xl:right-[4%]",
            delay: 1.1,
            duration: 6.2
          },
          {
            id: 3,
            icon: "💬",
            title: "Judgment-Free Space",
            description: "Share your story safely without fear of being judged.",
            position: "bottom-[12%] lg:right-[12%] xl:right-[18%]",
            delay: 1.4,
            duration: 5.8
          }
        ].map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: card.delay, ease: "easeOut" }}
            className={`absolute z-30 pointer-events-auto ${card.position} hidden lg:block`}
          >
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [0, -12, 0] }}
              transition={{
                repeat: Infinity,
                duration: card.duration,
                ease: "easeInOut",
                delay: card.delay
              }}
              whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(30,58,138,0.15)"
              }}
              className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-[20px] shadow-2xl shadow-blue-900/5 p-4 md:p-5 w-[190px] xl:w-[210px] flex flex-col gap-2 transition-all duration-300 cursor-default"
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[22px] leading-none">{card.icon}</span>
                <h4 className="font-bold text-slate-800 dark:text-foreground text-xs md:text-sm leading-tight">{card.title}</h4>
              </div>
              <p className="font-medium text-slate-500 dark:text-slate-400 text-[10px] md:text-xs leading-relaxed">{card.description}</p>
            </motion.div>
          </motion.div>
        ))}

      </div>
    </section>
  )
}
