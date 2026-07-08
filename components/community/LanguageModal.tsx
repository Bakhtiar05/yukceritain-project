'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'

export default function LanguageModal({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}) {
  const { language, setLanguage } = useCommunityLanguage()

  const languages = [
    {
      id: 'id',
      label: '🇮🇩 Bahasa Indonesia',
      desc: 'Gunakan Bahasa Indonesia di seluruh Komunitas.',
    },
    {
      id: 'en',
      label: '🇺🇸 English',
      desc: 'Use English throughout the Community.',
    },
  ] as const

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] dark:bg-black/60"
          />
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-card rounded-[24px] shadow-xl border border-border overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <h2 className="text-[18px] font-bold text-foreground">
                  Language
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                {languages.map((lang) => {
                  const isSelected = language === lang.id

                  return (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setLanguage(lang.id)
                        setIsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-[16px] border text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-border hover:border-[#BFDBFE] hover:bg-[#EFF6FF] dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10'
                      }`}
                    >
                      <div>
                        <p className={`text-[15px] font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {lang.label}
                        </p>
                        <p className="text-[13px] text-muted-foreground mt-1">
                          {lang.desc}
                        </p>
                      </div>
                      
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-primary text-white' : 'bg-transparent'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

