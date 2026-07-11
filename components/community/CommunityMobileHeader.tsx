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
    { href: '/', label: 'Konseling', icon: <Heart className="w-5 h-5" /> },
    { href: '/events', label: 'Event', icon: <Calendar className="w-5 h-5" /> },
    { href: '/blog', label: 'Artikel', icon: <FileText className="w-5 h-5" /> },
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
            src="/assets/logo-v13.webp" 
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
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeSidebar}
            />

            {/* Popup (Left Slide-Over) */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[80%] max-w-sm h-[85vh] max-h-[800px] bg-white dark:bg-background rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden border-none"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-2 bg-white dark:bg-background shrink-0">
                <Image 
                  src="/assets/logo-v13.webp" 
                  alt="YukceritaIN Logo" 
                  width={140} 
                  height={32} 
                  className="object-contain h-8 w-auto dark:brightness-0 dark:invert"
                  priority
                />
                <button
                  onClick={closeSidebar}
                  className="flex items-center justify-center text-[#9CA3AF] hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" strokeWidth={1.75} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-7 py-6 flex flex-col gap-6">
                <div className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">MENU UTAMA</div>
                
                <div className="flex flex-col gap-8">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeSidebar}
                        className="flex items-center gap-4 group"
                      >
                        <div className={`flex items-center justify-center transition-colors ${isActive ? 'text-[#2563EB] dark:text-primary' : 'text-[#4B5563] dark:text-[#9CA3AF] group-hover:text-foreground'}`}>
                          {React.cloneElement(link.icon as React.ReactElement<any>, { 
                            strokeWidth: isActive ? 2.5 : 1.75, 
                            fill: isActive ? 'currentColor' : 'none',
                            className: 'w-[24px] h-[24px]'
                          })}
                        </div>
                        <span className={`text-[16px] transition-colors ${isActive ? 'text-[#2563EB] dark:text-primary font-semibold' : 'text-[#4B5563] dark:text-[#9CA3AF] font-medium group-hover:text-foreground'}`}>
                          {link.label}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
