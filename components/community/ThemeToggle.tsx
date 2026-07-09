'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
  }

  const currentTheme = theme || 'system'

  const toggleTheme = () => {
    if (currentTheme === 'light') setTheme('dark')
    else if (currentTheme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const Icon = currentTheme === 'light' ? Sun : currentTheme === 'dark' ? Moon : Monitor
  const label = currentTheme === 'light' ? 'Terang' : currentTheme === 'dark' ? 'Gelap' : 'Sistem'

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-foreground transition-all duration-300 overflow-hidden group shadow-sm hover:shadow-md"
      title={`Tema: ${label}`}
      aria-label="Ganti Tema"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentTheme}
          initial={{ y: 20, opacity: 0, scale: 0.8, rotate: -45 }}
          animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, scale: 0.8, rotate: 45 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute flex items-center justify-center"
        >
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.2} />
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
