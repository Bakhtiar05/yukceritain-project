'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, Variants, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'

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
    <div className="flex flex-col items-center w-full">
      <span className="text-slate-800 dark:text-foreground text-[2rem] md:text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight text-center">
        Ceritamu Layak
      </span>
      {/* Stable container height to prevent layout shift */}
      <div className="relative h-[40px] md:h-[56px] lg:h-[64px] w-full flex justify-center mt-1 md:mt-3">
        <AnimatePresence>
          <motion.span
            key={index}
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -25, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute font-bold text-[2rem] md:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 pb-2 md:pb-3 lg:pb-4 text-center"
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

  // Scroll parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Mouse parallax effects (Max movement 6px, smooth)
  const mouseX = useSpring(0, { stiffness: 40, damping: 25 })
  const mouseY = useSpring(0, { stiffness: 40, damping: 25 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12 // Max movement 6px (-6px to +6px)
      const y = (e.clientY / window.innerHeight - 0.5) * 12
      mouseX.set(x)
      mouseY.set(y)
    }
    if (!prefersReducedMotion && isMounted) {
      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [mouseX, mouseY, prefersReducedMotion, isMounted])

  return (
    <section 
      id="hero" 
      ref={containerRef}
      className="relative w-full min-h-[90vh] md:min-h-[100vh] bg-white dark:bg-background overflow-hidden flex flex-col justify-center pt-0 md:pt-[72px] pb-12 md:pb-0"
    >
      {/* --- PREMIUM BACKGROUND ENHANCEMENT --- */}
      
      {/* 1. Ambient radial glow behind the headline */}
      <motion.div 
        className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full pointer-events-none z-0"
        style={prefersReducedMotion ? {} : { x: mouseX, y: mouseY, opacity: opacityFade }}
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-[100px]" />
      </motion.div>

      {/* 7. Preserve Existing Grid (3-5% opacity) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] text-black dark:text-white" 
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 90%)'
        }} 
      />

      {/* 3. Mesh Gradient */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={prefersReducedMotion ? {} : { x: mouseX, y: mouseY, opacity: opacityFade }}
      >
        <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.03)_0%,rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(circle,rgba(37,99,235,0.05)_0%,transparent_70%)] blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.02)_0%,rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_70%)] blur-[150px]" />
      </motion.div>

      {/* 2. Abstract Organic Blobs */}
      {!prefersReducedMotion && isMounted && (
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          style={{ y: bgY, opacity: opacityFade }}
        >
          {/* Top Left - Large, 10-15% opacity */}
          <motion.div
            animate={{
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.05, 1, 1.05, 1],
            }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-5%] left-[-5%] w-[45vw] max-w-[500px] aspect-square rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-[#DBEAFE] dark:bg-blue-900/20 opacity-[0.12] dark:opacity-30 blur-[80px]"
          />
          {/* Bottom Right - Medium, 10% opacity */}
          <motion.div
            animate={{
              rotate: [360, 270, 180, 90, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[5%] right-[5%] w-[35vw] max-w-[400px] aspect-square rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-[#BFDBFE] dark:bg-indigo-900/20 opacity-[0.10] dark:opacity-30 blur-[90px]"
          />
        </motion.div>
      )}



      {/* 5. Soft Edge Vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none shadow-[inset_0_0_120px_50px_#FFFFFF] dark:shadow-[inset_0_0_120px_50px_#1D1F24] mix-blend-normal opacity-80" />

      {/* 8. Noise Layer for texture and banding prevention */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.015] mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* --- FOREGROUND CONTENT --- */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 h-full flex flex-col items-center justify-center flex-1 pb-16 lg:py-0">
        
        {/* CENTERED TEXT & CTA */}
        <motion.div
          className="relative z-20 w-full max-w-3xl flex flex-col items-center text-center mt-4 md:mt-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUpVariants}
            className="mb-5 md:mb-6 flex justify-center w-full mt-4 lg:mt-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 dark:bg-card backdrop-blur-sm border border-blue-100/60 dark:border-border rounded-full shadow-sm hover:bg-blue-100/40 dark:hover:bg-slate-800 transition-colors">
              <span className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] md:text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                GRATIS100
              </span>
              <span className="text-[11px] md:text-xs font-semibold text-blue-900/80 dark:text-foreground pr-1">
                Diskon 100% Konseling <span className="hidden sm:inline font-normal text-blue-700/60 dark:text-muted-foreground">· s/d 31 Agu 2026</span>
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
            className="text-slate-500 dark:text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed mb-5 md:mb-10 max-w-[600px]"
          >
            Ruang aman untuk setiap ceritamu. Konseling <br className="hidden md:block" />
            bersama konselor &amp; psikolog klinis profesional.
          </motion.p>

          <motion.div variants={fadeUpVariants} className="flex flex-row gap-3 md:gap-4 justify-center w-full">
            <Link
              href="/konsultasi"
              className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm md:text-base shadow-[0_8px_30px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-all duration-300 hover:-translate-y-1 whitespace-nowrap"
            >
              Mulai Konseling
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#cara-kerja"
              className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-transparent border border-slate-200 dark:border-border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-foreground rounded-full font-bold text-sm md:text-base transition-all duration-300 hover:-translate-y-1 whitespace-nowrap"
            >
              Panduan Sesi
            </Link>
          </motion.div>

          <motion.div variants={fadeUpVariants} className="mt-4 md:mt-6 flex items-center justify-center gap-1.5 text-xs md:text-sm text-slate-400 font-medium">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mulai dari <span className="text-blue-500 font-extrabold text-sm md:text-base">Rp20.000</span> per sesi
          </motion.div>
        </motion.div>

        {/* FLOATING TRUST CARDS (DESKTOP) */}
        {isMounted && [
          {
            id: 1,
            icon: "🔒",
            title: "Privacy Protected",
            description: "Your conversations remain completely confidential.",
            position: "top-[25%] lg:left-[-2%] xl:left-[2%]",
            delay: 0.8,
            duration: 5.5
          },
          {
            id: 2,
            icon: "👩‍⚕️",
            title: "Professional Counselors",
            description: "Guidance from experienced counselors and licensed psychologists.",
            position: "top-[15%] lg:right-[-2%] xl:right-[2%]",
            delay: 1.1,
            duration: 6.2
          },
          {
            id: 3,
            icon: "💬",
            title: "Judgment-Free Space",
            description: "Share your story safely without fear of being judged.",
            position: "bottom-[25%] lg:right-[2%] xl:right-[8%]",
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
                boxShadow: "0 10px 30px -5px rgba(0,0,0,0.05)"
              }}
              className="bg-white dark:bg-card border border-slate-200/60 dark:border-border rounded-[20px] shadow-sm p-3 md:p-4 w-[200px] xl:w-[220px] flex flex-col gap-1.5 transition-colors duration-300 cursor-default"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl leading-none">{card.icon}</span>
                <h4 className="font-bold text-slate-800 dark:text-foreground text-xs md:text-sm leading-tight">{card.title}</h4>
              </div>
              <p className="text-slate-500 dark:text-muted-foreground text-[10px] md:text-[11px] leading-relaxed">{card.description}</p>
            </motion.div>
          </motion.div>
        ))}



      </div>

      {/* Gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 lg:h-32 bg-gradient-to-b from-transparent to-white dark:to-background pointer-events-none z-10" />
    </section>
  )
}
