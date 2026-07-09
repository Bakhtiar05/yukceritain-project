'use client'

import React from 'react'
import Link from 'next/link'
import { User, Send } from 'lucide-react'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'
import { useCreateStoryDrawer } from './CreateStoryDrawerProvider'
import { useAuthModal } from './AuthModalProvider'

export default function StoryComposerLink({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const { t } = useCommunityLanguage()
  const { openDrawer } = useCreateStoryDrawer()
  const { openModal } = useAuthModal()

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
        <div className="relative z-10 flex-1 px-1 sm:px-2">
          <p className="text-[14.5px] sm:text-[15.5px] font-medium text-[#5C7796] dark:text-slate-400 leading-snug truncate">
            {t('composer.placeholder')}
          </p>
        </div>

        {/* Action button (Send Icon) */}
        <div className="relative z-10 flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-[16px] sm:rounded-[18px] bg-[#2563EB] dark:bg-primary flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:bg-[#1D4ED8] dark:group-hover:bg-primary/90 group-hover:shadow-blue-500/40 group-hover:-translate-y-[1px] transition-all duration-200">
            <Send className="w-[18px] h-[18px]" strokeWidth={2} />
        </div>
      </button>
    </div>
  )
}
