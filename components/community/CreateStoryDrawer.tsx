'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useCreateStoryDrawer } from './CreateStoryDrawerProvider'
import StoryComposer from './StoryComposer'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'

export default function CreateStoryDrawer({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { isOpen, closeDrawer } = useCreateStoryDrawer()
  const { t } = useCommunityLanguage()

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end items-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Drawer from Right */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-[85vh] max-h-[800px] bg-card rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-border bg-card z-10 shrink-0">
              <h2 className="text-lg font-bold flex items-center gap-2">
                {t('composer.createStory')}
              </h2>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/20 text-muted-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content (Composer) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col">
              <StoryComposer isAuthenticated={isAuthenticated} onStoryCreated={closeDrawer} />
              
              <div className="mt-6 text-center text-muted-foreground text-[13px]">
                {t('composer.privacyNote')}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
