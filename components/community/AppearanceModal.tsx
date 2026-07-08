'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'

interface AppearanceModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function AppearanceModal({ isOpen, setIsOpen }: AppearanceModalProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const options = [
    {
      id: 'light',
      label: 'Light',
      desc: 'Use a bright interface.',
      icon: <Sun className="w-5 h-5 text-amber-500" />
    },
    {
      id: 'dark',
      label: 'Dark',
      desc: 'Reduce eye strain in low-light environments.',
      icon: <Moon className="w-5 h-5 text-indigo-400" />
    },
    {
      id: 'system',
      label: 'System',
      desc: 'Automatically match your device appearance.',
      icon: <Monitor className="w-5 h-5 text-muted-foreground" />
    }
  ]

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
                <h2 className="text-[18px] font-bold text-foreground">Appearance</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-[14px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    Theme
                  </h3>
                  <div className="space-y-3">
                    {options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setTheme(opt.id)}
                        className={`w-full flex items-start gap-4 p-4 rounded-[16px] border-2 text-left transition-all duration-200 ${
                          theme === opt.id
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10'
                            : 'border-slate-100 dark:border-[#27272A] hover:border-slate-200 dark:hover:border-[#3F3F46] hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {opt.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-[15px] font-semibold text-foreground flex items-center gap-2">
                            {opt.label}
                            {opt.id === 'system' && (
                              <span className="text-[11px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Recommended
                              </span>
                            )}
                          </p>
                          <p className="text-[13px] text-muted-foreground mt-0.5 leading-snug">
                            {opt.desc}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 mt-1">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                            theme === opt.id 
                              ? 'border-blue-500' 
                              : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {theme === opt.id && (
                              <motion.div 
                                layoutId="active-theme-indicator"
                                className="w-2 h-2 rounded-full bg-blue-500" 
                              />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
