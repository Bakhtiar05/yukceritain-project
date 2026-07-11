'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Heart, Calendar, FileText, Info } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'

export default function CommunityMobileHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (
    pathname?.includes('/community/post/') || 
    pathname?.includes('/community/create') ||
    pathname?.includes('/community/profile') ||
    pathname?.includes('/community/user')
  ) {
    return null
  }

  const closeSidebar = () => setIsSidebarOpen(false)

  const navLinks = [
    { href: '/booking', label: 'Konseling', icon: <Heart className="w-5 h-5" /> },
    { href: '/events', label: 'Event', icon: <Calendar className="w-5 h-5" /> },
    { href: '/blog', label: 'Blog', icon: <FileText className="w-5 h-5" /> },
    { href: '/about', label: 'About Us', icon: <Info className="w-5 h-5" /> },
  ]

  return (
    <>
      <header className="community-mobile-header md:hidden">
        {/* Left — Hamburger Menu */}
        <div className="flex-1 flex justify-start">
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Menu"
            className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-colors active:scale-95 flex-shrink-0"
          >
            <Menu className="w-6 h-6" strokeWidth={2.2} />
          </button>
        </div>

        {/* Center — Logo */}
        <div className="flex flex-col items-center justify-center flex-shrink-0 px-3 relative h-full">
          <Image 
            src="/assets/logo-v11.png" 
            alt="YukceritaIN Logo" 
            width={160} 
            height={40} 
            className="object-contain h-10 w-auto mt-1.5 dark:brightness-0 dark:invert"
            priority
          />
        </div>
        
        {/* Right — Theme Toggle */}
        <div className="flex-1 flex justify-end">
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Navigation Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[9999] flex justify-start items-center p-4 sm:p-6 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={closeSidebar}
            />

            {/* Popup (Left Slide-Over) */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[80%] max-w-sm h-[85vh] max-h-[800px] bg-card rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden border border-border"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card shrink-0">
                <Image 
                  src="/assets/logo-v11.png" 
                  alt="YukceritaIN Logo" 
                  width={140} 
                  height={32} 
                  className="object-contain h-8 w-auto dark:brightness-0 dark:invert"
                  priority
                />
                <button
                  onClick={closeSidebar}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/20 text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-3">
                <div className="text-sm font-semibold text-muted-foreground mb-2 px-2">Menu Utama</div>
                
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeSidebar}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-primary/5 active:bg-primary/10 text-foreground transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                      {link.icon}
                    </div>
                    <span className="font-semibold text-[15px]">{link.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
