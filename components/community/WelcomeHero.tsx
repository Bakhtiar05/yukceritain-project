'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { HeartHandshake, Sparkles, Feather } from 'lucide-react'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'

export default function WelcomeHero() {
  const { t } = useCommunityLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 0,
      icon: HeartHandshake,
      gradient: "from-[#1d4ed8] to-[#2563eb] dark:from-transparent dark:to-transparent",
      badge: t('welcomeHero.badge_1'),
      headline: t('welcomeHero.headline_1'),
      description: t('welcomeHero.description_1')
    },
    {
      id: 1,
      icon: Sparkles,
      gradient: "from-emerald-600 to-teal-500 dark:from-transparent dark:to-transparent",
      badge: t('welcomeHero.badge_2'),
      headline: t('welcomeHero.headline_2'),
      description: t('welcomeHero.description_2')
    },
    {
      id: 2,
      icon: Feather,
      gradient: "from-purple-600 to-indigo-500 dark:from-transparent dark:to-transparent",
      badge: t('welcomeHero.badge_3'),
      headline: t('welcomeHero.headline_3'),
      description: t('welcomeHero.description_3')
    }
  ]

  const activeSlide = slides[currentSlide]

  return (
    <div className="w-full px-4 sm:px-6 pt-5 pb-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, x: 20, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`relative overflow-hidden rounded-[24px] bg-gradient-to-br ${activeSlide.gradient} border-0 dark:border dark:border-border group shadow-lg dark:shadow-none min-h-[190px]`}
        >
          {/* Background Decorative Icon */}
          <div className="absolute right-1 top-1 sm:right-3 sm:top-3 pointer-events-none text-white/15 dark:text-primary/15 -rotate-12">
            <activeSlide.icon className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48" strokeWidth={1.5} />
          </div>

          <div className="relative z-10 w-full px-6 sm:px-8 py-8 flex flex-col items-start gap-4">
            
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex items-center gap-2 rounded-full bg-white/20 dark:bg-primary/10 px-4 py-1.5 text-xs font-semibold text-white dark:text-primary border border-white/20 dark:border-primary/20 tracking-wider w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white dark:bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white dark:bg-blue-500"></span>
              </span>
              {activeSlide.badge}
            </motion.div>

            <div className="max-w-2xl mt-2">
              <TypewriterHeadline 
                text={activeSlide.headline}
                onComplete={() => {
                  setCurrentSlide((prev) => (prev + 1) % slides.length)
                }}
                className="text-[28px] sm:text-4xl md:text-5xl font-bold tracking-tight text-white dark:text-foreground leading-[1.2] mb-4"
              />
              
              <TypewriterText 
                text={activeSlide.description}
                className="text-[15px] sm:text-[17px] text-blue-50 dark:text-muted-foreground font-medium leading-[1.6]"
              />
            </div>
            
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function TypewriterText({ text, className }: { text: string; className?: string }) {
  const characters = text.split('')
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03, // Speed of typewriter
        delayChildren: 0.4,    // Wait for headline to appear first
      }
    }
  }

  const charVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
  }

  return (
    <motion.p 
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {characters.map((char, index) => (
        <motion.span key={index} variants={charVariants}>
          {char}
        </motion.span>
      ))}
    </motion.p>
  )
}

function TypewriterHeadline({ text, className, onComplete }: { text: string, className?: string, onComplete: () => void }) {
  const [subIndex, setSubIndex] = useState(0)
  const [blink, setBlink] = useState(true)
  const prefersReducedMotion = useReducedMotion()
  
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (prefersReducedMotion) {
       const timeout = setTimeout(() => {
         onCompleteRef.current()
       }, 4000)
       return () => clearTimeout(timeout)
    }

    if (subIndex === text.length) {
      const timeout = setTimeout(() => {
        onCompleteRef.current()
      }, 3500) // Wait 3.5s before advancing to next slide
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + 1)
    }, Math.max(40, Math.random() * 80))

    return () => clearTimeout(timeout)
  }, [subIndex, text, prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) return
    const interval = setInterval(() => setBlink((b) => !b), 500)
    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    return <h1 className={className}>{text}</h1>
  }

  return (
    <h1 className={`relative ${className} whitespace-pre-wrap`}>
      {/* Invisible full text maintains the exact layout and height */}
      <span className="invisible select-none break-words" aria-hidden="true">{text}</span>
      
      {/* Absolute overlay types the text progressively */}
      <span className="absolute left-0 top-0 w-full h-full text-left break-words">
        {text.substring(0, subIndex)}
        <motion.span 
          animate={{ opacity: blink ? 1 : 0 }} 
          transition={{ duration: 0.1 }}
          className="inline-block w-[3px] h-[1.1em] bg-white dark:bg-primary ml-[2px] align-middle rounded-full -translate-y-[0.1em]"
        />
      </span>
    </h1>
  )
}
