'use client'

import React from 'react'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'
import StoryComposer from '@/components/community/StoryComposer'

export default function CreateStoryClient({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { t } = useCommunityLanguage()

  return (
    <div className="w-full bg-background min-h-screen">
      {/* ── Sticky Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-card/92 backdrop-blur-xl border-b border-border md:hidden">
        <div className="h-16 flex items-center justify-between px-3">
          {/* Back */}
          <a
            href="/community/for-you"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted text-muted-foreground transition-colors active:scale-95 flex-shrink-0"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          </a>

          {/* Center */}
          <div className="flex flex-col items-center flex-1 px-3">
            <span className="text-[17px] font-bold text-foreground leading-tight tracking-tight text-center">
              {t('composer.createStory')}
            </span>
          </div>

          {/* Right placeholder to keep center alignment */}
          <div className="w-10 h-10 flex-shrink-0" />
        </div>
      </header>

      {/* Desktop Header/Back */}
      <div className="hidden md:flex bg-card border-b border-border px-4 py-3 sticky top-0 md:top-0 z-30 items-center">
        <a href="/community/for-you" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span className="font-medium">{t('composer.back')}</span>
        </a>
        <h2 className="ml-4 font-bold text-foreground">{t('composer.createStory')}</h2>
      </div>

      <div className="bg-background pt-4 md:pt-0">
        <StoryComposer isAuthenticated={isAuthenticated} />
      </div>
      
      <div className="p-8 text-center text-muted-foreground text-sm">
        {t('composer.privacyNote')}
      </div>
    </div>
  )
}
