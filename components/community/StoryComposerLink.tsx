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
        className="w-full relative flex flex-col text-left bg-card rounded-2xl border border-border p-4 sm:p-5 cursor-pointer transition-all duration-200 ease-out hover:bg-muted/50 hover:shadow-sm active:scale-[0.98] group min-h-[130px] sm:min-h-[150px]"
      >
        {/* Top Section: Avatar & Animated Placeholder */}
        <div className="flex items-start gap-3 sm:gap-4 w-full h-full flex-1">
          {/* Avatar Container */}
          <div className="relative z-10 flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm border border-border">
            <User className="w-5 h-5 sm:w-[20px] sm:h-[20px]" strokeWidth={2.5} />
          </div>

          {/* Title block */}
          <div className="relative z-10 flex-1 px-1 overflow-hidden h-[32px] flex items-center mt-2 sm:mt-2.5">
            <AnimatePresence mode="popLayout">
              <motion.p
                key={promptIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute text-[15px] sm:text-[16px] font-medium text-slate-400 dark:text-slate-500 leading-snug truncate w-full"
              >
                {prompts[promptIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Section: Send / Write Action */}
        <div className="w-full flex justify-end mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <div className="relative z-10 flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 text-white font-medium text-sm shadow-sm shadow-blue-500/25 group-hover:bg-blue-700 group-hover:shadow-md transition-all duration-200">
            <span>{language === 'id' ? 'Tulis Cerita' : 'Write Story'}</span>
            <Send className="w-4 h-4 ml-0.5" strokeWidth={2.5} />
          </div>
        </div>
      </button>
    </div>
  )
}
