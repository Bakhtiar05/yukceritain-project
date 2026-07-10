'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Home, HeartHandshake, Activity, BookOpen, Calendar, MoreHorizontal, MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/community/ThemeToggle'

interface NavbarProps {
  variant?: 'default' | 'blog'
  hideOnDesktop?: boolean
}

export default function Navbar({ variant = 'default', hideOnDesktop = false }: NavbarProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  interface NavLink {
    label: string
    href: string
    active?: boolean
    isFeature?: boolean
  }

  const navLinks: NavLink[] = variant === 'blog'
    ? [
        { label: 'Layanan', href: '/#layanan' },
        { label: 'Tentang Kami', href: '/about', active: pathname === '/about' },
        { label: 'Event', href: '/events' },
        { label: 'Blog', href: '/blog', active: true },
      ]
    : [
        { label: 'Layanan', href: '#layanan' },
        { label: 'Tentang Kami', href: '/about', active: pathname === '/about' },
        { label: 'Event', href: '/events' },
        { label: 'Blog', href: '/blog' },
      ]

  return (
    <>
      {!hideOnDesktop && (
        <header
          className={`hidden md:flex fixed inset-x-0 z-[1000] transition-all duration-500 justify-center w-full px-4 sm:px-6 lg:px-8 ${
            scrolled ? 'top-3 md:top-4' : 'top-4 md:top-6'
          }`}
        >
          <div
            className={`w-full max-w-container mx-auto flex items-center justify-between transition-all duration-500 ${
              scrolled
                ? 'bg-background/70 backdrop-blur-xl border border-border/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl md:rounded-full py-2 px-4 md:px-6 xl:px-8'
                : 'bg-background/40 backdrop-blur-md border border-border/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-2xl md:rounded-full py-3 md:py-3.5 px-4 md:px-6 xl:px-8'
            }`}
          >
            {/* Logo */}
            <div className="flex justify-start items-center mr-auto">
              <Link href="/" className="flex items-center gap-3 flex-shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
                <Image
                  src="/assets/logo-v4.png"
                  alt="YukceritaIN Logo"
                  width={200}
                  height={200}
                  className={`w-auto dark:brightness-0 dark:invert transition-all duration-300 group-hover:scale-105 ${scrolled ? 'h-[42px] sm:h-[48px] lg:h-[56px]' : 'h-[48px] sm:h-[56px] lg:h-[64px]'}`}
                  style={{ width: "auto" }}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex flex-none items-center justify-end gap-1 lg:gap-2 mr-4 lg:mr-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={
                    link.isFeature
                      ? `relative flex items-center justify-center px-4 py-2 text-[0.875rem] lg:text-[0.925rem] font-bold text-primary bg-primary/20 border-2 border-primary/40 rounded-full hover:bg-primary/30 hover:scale-105 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 shadow-sm mx-1`
                      : `relative px-3.5 lg:px-4 py-2 text-[0.875rem] lg:text-[0.925rem] font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                          link.active
                            ? 'text-primary bg-primary/10'
                            : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                        }`
                  }
                >
                  {link.isFeature && <span className="mr-1.5 text-base leading-none">🌿</span>}
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex justify-end items-center gap-3 lg:gap-4">
              <ThemeToggle />
              <Link
                href="/cek-status"
                className="text-[0.875rem] font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-full hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                Cek Status
              </Link>

              <Link
                href="/community"
                className="flex items-center justify-center px-5 lg:px-6 py-2.5 text-[0.875rem] lg:text-[0.925rem] font-semibold text-white bg-primary rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:bg-primary hover:shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                Yuk Ceritain
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Header */}
      {!hideOnDesktop && (
        <header
          className={`md:hidden fixed top-0 inset-x-0 z-[1000] transition-all duration-300 flex items-center justify-between px-5 py-3 ${
            scrolled || menuOpen ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'
          }`}
        >
          <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
            <Image
              src="/assets/logo-v4.png"
              alt="YukceritaIN Logo"
              width={150}
              height={40}
              className="w-auto h-[32px] dark:brightness-0 dark:invert"
              priority
            />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="p-1.5 -mr-1.5 text-foreground focus:outline-none rounded-full hover:bg-muted/20"
            >
              {menuOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
            </button>
          </div>
        </header>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-[998] bg-white dark:bg-card/95 dark:backdrop-blur-xl shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.5)] rounded-t-[32px] px-3 py-2 flex items-center justify-between pb-safe">
        <Link href="/" className="flex flex-col items-center justify-center w-1/5 py-1 gap-1 transition-colors">
          <Home size={22} className={pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
          <span className={`text-[9px] font-medium ${pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>Beranda</span>
        </Link>
        <Link href="/konsultasi" className="flex flex-col items-center justify-center w-1/5 py-1 gap-1 transition-colors">
          <MessageCircle size={22} className={pathname?.startsWith('/konsultasi') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
          <span className={`text-[9px] font-medium ${pathname?.startsWith('/konsultasi') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>Konseling</span>
        </Link>
        <Link href="/community" className="flex flex-col items-center justify-center w-1/5 py-1 gap-1 transition-colors group">
          <div className={`flex items-center justify-center w-[56px] h-[56px] -mt-8 rounded-full bg-white dark:bg-slate-800 shadow-lg shadow-blue-500/20 border-[6px] border-background transition-transform duration-300 group-hover:-translate-y-1`}>
            <Image src="/assets/navbar-bawah.png" alt="Yukceritain" width={32} height={32} className={`object-contain transition-all duration-300 ${pathname?.startsWith('/community') ? 'opacity-100 scale-105 drop-shadow-md' : 'opacity-80'}`} />
          </div>
          <span className={`text-[9px] font-medium ${pathname?.startsWith('/community') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>Yukceritain</span>
        </Link>
        <Link href="/events" className="flex flex-col items-center justify-center w-1/5 py-1 gap-1 transition-colors">
          <Calendar size={22} className={pathname?.startsWith('/events') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
          <span className={`text-[9px] font-medium ${pathname?.startsWith('/events') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>Event</span>
        </Link>
        <Link href="/blog" className="flex flex-col items-center justify-center w-1/5 py-1 gap-1 transition-colors">
          <BookOpen size={22} className={pathname?.startsWith('/blog') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
          <span className={`text-[9px] font-medium ${pathname?.startsWith('/blog') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>Blog</span>
        </Link>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed inset-x-0 top-0 bg-background/98 backdrop-blur-xl border-b border-border shadow-lg p-6 pt-24 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] md:hidden z-[999] flex flex-col ${
          menuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[80vh]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3.5 text-[1.05rem] font-semibold rounded-xl transition-colors focus:outline-none text-foreground hover:bg-accent hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          
          <div className="h-px bg-border my-2 mx-2" />
          
          <Link
            href="/cek-status"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3.5 text-[1.05rem] font-semibold rounded-xl transition-colors focus:outline-none text-foreground hover:bg-accent hover:text-primary"
          >
            Cek Status
          </Link>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[998] md:hidden transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
