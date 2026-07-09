'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'
import { useCreateStoryDrawer } from './CreateStoryDrawerProvider'
import { useAuthModal } from './AuthModalProvider'

const PROMPTS_EN = [
  "What's up today?....",
  "How's your day going?....",
  "Anything on your mind?....",
  "Got something to share?....",
  "What's happening today?....",
  "What's new with you?....",
  "How are things going?....",
  "What's going on?....",
  "What's on your mind right now?....",
  "Tell us what's up...."
]

const PROMPTS_ID = [
  "Ada cerita apa hari ini?....",
  "Gimana harimu hari ini?....",
  "Lagi kepikiran apa?....",
  "Mau cerita sesuatu?....",
  "Ada apa hari ini?....",
  "Ada kabar apa?....",
  "Gimana kabarmu belakangan?....",
  "Lagi ada apa?....",
  "Lagi kepikiran apa sekarang?....",
  "Coba ceritain, dong...."
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
    <div className="pt-1 px-4 md:px-0 mb-5">
      <button 
        onClick={handleClick}
        className="w-full relative flex items-center text-left gap-3 sm:gap-4 bg-[#F4F9FF] dark:bg-slate-800/40 rounded-[32px] border border-[#E5F0FF] dark:border-slate-700/60 p-2.5 sm:p-3 cursor-pointer transition-all duration-200 ease-out hover:scale-[1.015] hover:border-[#CFE4FF] dark:hover:border-slate-600 hover:shadow-sm active:scale-[0.98] group"
      >
        {/* Left Icon (Avatar Container) */}
        <div className="relative z-10 flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-700/50 flex items-center justify-center text-slate-500 dark:text-slate-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-600/50 transition-colors duration-200">
          <User className="w-5 h-5 sm:w-[22px] sm:h-[22px]" strokeWidth={2} />
        </div>

        {/* Title block */}
        <div className="relative z-10 flex-1 px-1 sm:px-2 overflow-hidden h-[24px] flex items-center">
          <AnimatePresence mode="popLayout">
            <motion.p
              key={promptIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute text-[14.5px] sm:text-[15.5px] font-medium text-[#5C7796] dark:text-slate-400 leading-snug truncate w-full"
            >
              {prompts[promptIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Action button (Send Icon) */}
        <div className="relative z-10 flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-[16px] sm:rounded-[18px] bg-[#2563EB] dark:bg-primary flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:bg-[#1D4ED8] dark:group-hover:bg-primary/90 group-hover:shadow-blue-500/40 group-hover:-translate-y-[1px] transition-all duration-200">
            <Send className="w-[18px] h-[18px]" strokeWidth={2} />
        </div>
      </button>
    </div>
  )
}
