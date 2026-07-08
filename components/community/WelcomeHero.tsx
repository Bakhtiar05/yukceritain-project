'use client'

import React, { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'

export default function WelcomeHero() {
  const { t } = useCommunityLanguage()

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring' as const, stiffness: 350, damping: 30 } 
    },
  }

  return (
    <div className="w-full px-4 sm:px-6 pt-5 pb-3">
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative overflow-hidden rounded-[24px] bg-transparent border border-border group"
      >
        <div className="relative z-10 w-full px-5 sm:px-7 py-6 sm:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex-1 max-w-2xl"
          >
            {/* Looping Typewriter Headline */}
            <motion.div variants={itemVariants}>
              <LoopingTypewriterHeadline 
                sentences={[
                  t('welcomeHero.headline_1'),
                  t('welcomeHero.headline_2'),
                  t('welcomeHero.headline_3')
                ]}
                className="text-[21px] min-[360px]:text-[23px] sm:text-3xl font-bold tracking-tight text-foreground leading-[1.2] mb-2 whitespace-nowrap sm:whitespace-normal"
              />
            </motion.div>
            
            {/* Typewriter Description */}
            <TypewriterText 
              text={t('welcomeHero.description')}
              className="text-sm sm:text-base text-muted-foreground font-medium"
            />
          </motion.div>
        </div>
      </motion.div>
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

function LoopingTypewriterHeadline({ sentences, className }: { sentences: string[], className?: string }) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [reverse, setReverse] = useState(false)
  const [blink, setBlink] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  const longestSentence = sentences.reduce((a, b) => a.length > b.length ? a : b, '')

  useEffect(() => {
    if (prefersReducedMotion) return

    if (subIndex === sentences[index].length + 1 && !reverse) {
      setBlink(false)
      const timeout = setTimeout(() => {
        setReverse(true)
      }, 2000)
      return () => clearTimeout(timeout)
    }

    if (subIndex === 0 && reverse) {
      setReverse(false)
      setIndex((prev) => (prev + 1) % sentences.length)
      return
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1))
    }, Math.max(reverse ? 25 : 50, Math.random() * (reverse ? 35 : 80)))

    return () => clearTimeout(timeout)
  }, [subIndex, index, reverse, sentences, prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) return
    const interval = setInterval(() => setBlink((b) => !b), 500)
    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    return <h1 className={className}>{sentences[0]}</h1>
  }

  return (
    <h1 className={`relative ${className}`}>
      <span className="invisible select-none break-words" aria-hidden="true">{longestSentence}</span>
      <span className="absolute left-0 top-0 w-full h-full text-left break-words">
        {sentences[index].substring(0, subIndex)}
        <motion.span 
          animate={{ opacity: blink ? 1 : 0 }} 
          transition={{ duration: 0.1 }}
          className="inline-block w-[3px] h-[1.1em] bg-primary ml-1 align-middle rounded-full -translate-y-[0.1em]"
        />
      </span>
    </h1>
  )
}
