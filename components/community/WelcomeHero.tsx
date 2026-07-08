'use client'

import React from 'react'
import { motion } from 'framer-motion'
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
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 350, damping: 30 } 
    },
  }

  return (
    <div className="w-full px-4 sm:px-6 pt-5 pb-3">
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative overflow-hidden rounded-[20px] group"
      >
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-card dark:to-primary/5" />
        
        {/* Floating Glowing Orbs */}
        <motion.div 
          animate={{
            x: [0, 20, -10, 0],
            y: [0, -15, 10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] rounded-full bg-primary/20 dark:bg-primary/15 blur-[60px] pointer-events-none"
        />
        <motion.div 
          animate={{
            x: [0, -20, 15, 0],
            y: [0, 20, -10, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[120%] rounded-full bg-indigo-500/15 dark:bg-indigo-500/20 blur-[70px] pointer-events-none"
        />

        {/* Glassmorphic Container Layer (Reduced Padding) */}
        <div className="relative z-10 w-full h-full bg-card/40 dark:bg-card/50 backdrop-blur-2xl border border-white/50 dark:border-white/10 px-5 sm:px-6 py-5 sm:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex-1 max-w-2xl"
          >
            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-[1.2] mb-2"
            >
              {t('welcomeHero.headline')}
            </motion.h1>
            
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
