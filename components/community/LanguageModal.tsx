'use client'

import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
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
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="fixed left-[50%] top-[50%] z-[101] w-[90%] max-w-md translate-x-[-50%] translate-y-[-50%] bg-card border border-border rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-6 outline-none"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-bold text-foreground">
                    Language
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Body */}
                <div className="space-y-3">
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
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
