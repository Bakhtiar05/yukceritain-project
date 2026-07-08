'use client'

import { useEffect, useState } from 'react'
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
    <div className="flex flex-col items-center lg:items-start w-full">
      <span className="text-slate-800 text-[2rem] md:text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight">
        Ceritamu Layak
      </span>
      {/* Stable container height to prevent layout shift */}
      <div className="relative h-[40px] md:h-[56px] lg:h-[64px] w-full flex justify-center lg:justify-start mt-1 md:mt-3">
        <AnimatePresence>
          <motion.span
            key={index}
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -25, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute font-bold text-[2rem] md:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 pb-2 md:pb-3 lg:pb-4"
          >
            {dynamicWords[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

const TypewriterText = ({ text, delay = 50 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    const chars = Array.from(text);
    if (currentIndex < chars.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + chars[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return (
    <span>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-[2px] ml-[2px] -mb-[2px] h-[1em] bg-white opacity-70"
      />
    </span>
  );
};

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion()
  const [isMounted, setIsMounted] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)

  const messages = [
    'Ada yang sedang membebani pikiranmu hari ini?',
    'Yuk, Ceritain 🤗'
  ]

  useEffect(() => {
    setIsMounted(true)
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const chatText = messages[messageIndex]

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

  const imageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  }

  return (
    <section id="hero" className="relative w-full min-h-[90vh] md:min-h-[100vh] bg-[#F8FBFF] overflow-hidden flex flex-col justify-center pt-0 md:pt-[72px] pb-12 md:pb-0">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-[#2563EB]/[0.03] blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#3B82F6]/[0.04] blur-[120px]" />
      </div>



      {/* MOBILE & TABLET FULL-BLEED IMAGE (Visible < 1024px) */}
      <motion.div
        className="lg:hidden relative w-full h-[55vh] sm:h-[65vh] -mt-16 md:-mt-[72px] overflow-hidden z-0"
        initial="hidden"
        animate="visible"
        variants={imageVariants}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(/assets/latar-belakang.png)',
            backgroundPosition: '90% 30%', // Shifted to the right
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
          }}
          title="Counseling Session"
        />

        {/* MOBILE INTERACTIVE BUBBLE */}
        {isMounted && (
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute z-10 pointer-events-auto
                       top-[25%] left-[8%] sm:left-[15%]
                       bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] pl-5 pr-3 py-2 max-w-[210px]
                       rounded-[14px]
                       shadow-[0_10px_20px_-5px_rgba(29,78,216,0.3),inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.1)]
                       font-sans font-medium text-white text-[11px] leading-tight"
          >
            <TypewriterText text={chatText} />
          </motion.div>
        )}
      </motion.div>

      {/* FULL-WIDTH DESKTOP IMAGE */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
          style={{
            backgroundImage: 'url(/assets/latar-belakang.png)',
            backgroundPosition: 'right center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
          }}
          title="Counseling Session"
        />
      </div>

      {/* DESKTOP INTERACTIVE BUBBLE */}
      {isMounted && (
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="hidden lg:block absolute z-30 pointer-events-auto
                     top-[30%] right-[32%] xl:right-[35%]
                     bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] pl-6 pr-4 py-2.5 max-w-[220px]
                     rounded-2xl
                     shadow-[0_12px_25px_-5px_rgba(29,78,216,0.3),inset_2px_2px_3px_rgba(255,255,255,0.3),inset_-1px_-1px_3px_rgba(0,0,0,0.1)]
                     font-sans font-medium text-white text-[13px] leading-snug"
        >
          <TypewriterText text={chatText} />
        </motion.div>
      )}

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between flex-1 pb-16 lg:py-0">

        {/* LEFT COLUMN: TEXT & CTA */}
        <motion.div
          className="relative z-20 w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-4 md:-mt-8 lg:mt-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUpVariants}
            className="mb-5 md:mb-6 flex justify-center lg:justify-start w-full"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-full shadow-sm hover:bg-blue-100/50 transition-colors">
              <span className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] md:text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                GRATIS100
              </span>
              <span className="text-[11px] md:text-xs font-semibold text-blue-900 pr-1">
                Diskon 100% Konseling <span className="hidden sm:inline font-normal text-blue-700/80">· s/d 31 Agu 2026</span>
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className="mb-3 md:mb-8 w-full"
          >
            <DynamicTextSwap />
          </motion.div>

          <motion.p
            variants={fadeUpVariants}
            className="text-neutral-500 text-sm md:text-base lg:text-lg leading-relaxed mb-5 md:mb-10 max-w-[520px]"
          >
            Ruang aman untuk setiap ceritamu, Konseling <br />
            bersama konselor &amp; psikolog klinis profesional.
          </motion.p>

          <motion.div variants={fadeUpVariants} className="flex flex-row gap-3 md:gap-4 justify-center lg:justify-start w-full">
            <Link
              href="/konsultasi"
              className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold text-sm md:text-base shadow-[0_8px_30px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-all duration-300 hover:-translate-y-1 whitespace-nowrap"
            >
              Mulai Konseling
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#cara-kerja"
              className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-transparent border-2 border-[#BFDBFE] hover:border-[#2563EB] hover:bg-[#EFF6FF] text-[#2563EB] rounded-full font-bold text-sm md:text-base transition-all duration-300 hover:-translate-y-1 whitespace-nowrap"
            >
              Panduan Sesi
            </Link>
          </motion.div>

          <motion.div variants={fadeUpVariants} className="mt-4 md:mt-6 flex items-center justify-center lg:justify-start gap-1.5 text-xs md:text-sm text-neutral-500 font-medium">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mulai dari <span className="text-[#2563EB] font-extrabold text-sm md:text-base">Rp20.000</span> per sesi
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 lg:h-32 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
    </section>
  )
}
