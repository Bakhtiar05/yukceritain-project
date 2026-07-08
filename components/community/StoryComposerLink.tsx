'use client'

import React from 'react'
import Link from 'next/link'
import { User, Send } from 'lucide-react'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'

export default function StoryComposerLink() {
  const { t } = useCommunityLanguage()

  return (
    <div className="pt-1 px-4 md:px-0 mb-5">
      <Link 
        href="/community/create"
        className="relative flex items-center gap-5 bg-white dark:bg-[#1E2430] rounded-[32px] border border-slate-200 dark:border-slate-800/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 cursor-pointer transition-all duration-200 ease-out hover:scale-[1.015] hover:-translate-y-[2px] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] active:scale-[0.98] group"
      >
        {/* Left Icon (Avatar Container) */}
        <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-600 dark:text-[#E2E8F0] transition-colors duration-200 group-hover:bg-slate-200 dark:group-hover:bg-slate-700">
          <User className="w-6 h-6" strokeWidth={1.8} />
        </div>

        {/* Title block */}
        <div className="relative z-10 flex-1">
          <h2 className="text-[20px] md:text-[22px] font-semibold text-slate-800 dark:text-white tracking-tight leading-tight transition-colors duration-200">
            {t('composer.shareYourStory')}
          </h2>
          <p className="hidden sm:block text-[14.5px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
            {t('composer.shareSubtitle')}
          </p>
        </div>

        {/* Action button (Send Icon) */}
        <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-slate-100 dark:group-hover:bg-slate-800/80 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-all duration-200">
            <Send className="w-[20px] h-[20px] ml-0.5" strokeWidth={2} />
        </div>
      </Link>
    </div>
  )
}
