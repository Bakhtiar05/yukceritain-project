'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'
import { useCreateStoryDrawer } from './CreateStoryDrawerProvider'
import { useAuthModal } from './AuthModalProvider'

const PROMPTS_EN = [
  "What's up today?",
  "How's your day going?",
  "Anything on your mind?",
  "Got something to share?",
  "What's happening today?",
  "What's new with you?",
  "How are things going?",
  "What's going on?",
  "What's on your mind right now?",
  "Tell us what's up"
]

const PROMPTS_ID = [
  "Ada cerita apa hari ini?",
  "Gimana harimu hari ini?",
  "Lagi kepikiran apa?",
  "Mau cerita sesuatu?",
  "Ada apa hari ini?",
  "Ada kabar apa?",
  "Gimana kabarmu belakangan?",
  "Lagi ada apa?",
  "Lagi kepikiran apa sekarang?",
  "Coba ceritain, dong"
]

export default function StoryComposerLink({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const { language } = useCommunityLanguage()
  const { openDrawer } = useCreateStoryDrawer()
  const { openModal } = useAuthModal()
  
  const [promptIndex, setPromptIndex] = useState(0)

  const prompts = language === 'id' ? PROMPTS_ID : PROMPTS_EN

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % prompts.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [prompts.length])

  const handleClick = () => {
    if (!isAuthenticated) {
      openModal()
      return
    }
    openDrawer()
  }

  return (
    <div className="pt-1 px-4 mb-5">
      <button 
        onClick={handleClick}
        className="w-full relative flex items-center text-left gap-3 sm:gap-4 bg-card rounded-full border border-border p-3 sm:p-4 cursor-pointer transition-all duration-200 ease-out hover:bg-muted/50 hover:shadow-sm active:scale-[0.98] group"
      >
        {/* Left Icon (Avatar Container) */}
        <div className="relative z-10 flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm border border-border">
          <User className="w-5 h-5 sm:w-[20px] sm:h-[20px]" strokeWidth={2.5} />
        </div>

        {/* Title block */}
        <div className="relative z-10 flex-1 px-1 overflow-hidden h-[24px] flex items-center">
          <AnimatePresence mode="popLayout">
            <motion.p
              key={promptIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute text-[14px] sm:text-[15px] font-medium text-slate-500 dark:text-slate-400 leading-snug truncate w-full"
            >
              {prompts[promptIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Action button (Send Icon) */}
        <div className="relative z-10 flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:bg-blue-700 group-hover:shadow-blue-500/40 transition-all duration-200">
            <Send className="w-[18px] h-[18px] ml-0.5" strokeWidth={2.5} />
        </div>
      </button>
    </div>
  )
}
