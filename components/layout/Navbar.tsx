'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  variant?: 'default' | 'blog'
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navLinks = variant === 'blog'
    ? [
        { label: 'Layanan', href: '/#services' },
        { label: 'Cara Kerja', href: '/#how-it-works' },
        { label: 'Testimoni', href: '/#testimonials' },
        { label: 'FAQ', href: '/#faq' },
        { label: 'Cek Status', href: '/cek-status' },
        { label: 'Blog', href: '/blog', active: true },
      ]
    : [
        { label: 'Layanan', href: '#services' },
        { label: 'Cara Kerja', href: '#how-it-works' },
        { label: 'Testimoni', href: '#testimonials' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Cek Status', href: '/cek-status' },
        { label: 'Blog', href: '/blog' },
      ]

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 w-full z-[1000] transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/60 shadow-sm py-2 lg:py-3'
            : 'bg-white/40 backdrop-blur-sm border-b border-transparent py-4 lg:py-5'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 xl:px-12 flex items-center justify-between">
          
          {/* 1. Brand / Logo (Left) */}
          <div className="flex-1 flex justify-start items-center">
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 group focus:outline-none">
              <Image 
                src="/assets/logov2_yukceritain.png" 
                alt="YukceritaIN Logo" 
                width={200} 
                height={200} 
                className={`w-auto transition-all duration-300 group-hover:scale-105 ${scrolled ? 'h-[50px] sm:h-[60px] lg:h-[70px]' : 'h-[60px] sm:h-[70px] lg:h-[90px]'}`} 
                style={{ width: "auto" }} 
                priority
              />
            </Link>
          </div>

          {/* 2. Desktop & Tablet Navigation (Center) */}
          <nav className="hidden md:flex flex-none items-center justify-center gap-1 lg:gap-3 xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative px-3 lg:px-4 py-2 text-[0.85rem] lg:text-[0.95rem] font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  link.active
                    ? 'text-blue-700 bg-blue-50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]'
                    : 'text-neutral-600 hover:text-blue-600 hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 3. Actions (Right) */}
          <div className="flex-1 flex justify-end items-center gap-3 lg:gap-5">
            <Link 
              href="/admin/login" 
              className="hidden md:block text-[0.85rem] lg:text-[0.95rem] font-medium text-neutral-600 hover:text-blue-600 transition-colors px-2 focus:outline-none"
            >
              Masuk
            </Link>
            
            <Link 
              href="/konsultasi" 
              className="hidden md:flex relative items-center justify-center px-5 lg:px-6 py-2 lg:py-2.5 text-[0.85rem] lg:text-[0.95rem] font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-[0_4px_12px_rgba(46,134,222,0.2)] hover:shadow-[0_6px_16px_rgba(46,134,222,0.35)] transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              Mulai Konsultasi
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 -mr-2 text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle mobile menu"
            >
              {menuOpen ? (
                <X size={26} className="transition-transform duration-300 rotate-90" />
              ) : (
                <Menu size={26} className="transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Floating Mobile Drawer */}
      <div
        className={`fixed left-4 right-4 top-[84px] bg-white/95 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-3xl p-6 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] md:hidden z-[999] flex flex-col ${
          menuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}
      >
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-5 py-3.5 text-[1.05rem] font-semibold rounded-2xl transition-colors focus:outline-none ${
                link.active 
                  ? 'text-blue-700 bg-blue-50' 
                  : 'text-neutral-700 hover:bg-neutral-50 hover:text-blue-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="h-px bg-neutral-100 my-4"></div>
          
          <Link 
            href="/admin/login" 
            onClick={() => setMenuOpen(false)} 
            className="px-5 py-3.5 text-center text-[1.05rem] font-semibold text-neutral-700 hover:bg-neutral-50 rounded-2xl mb-2 transition-colors focus:outline-none"
          >
            Masuk
          </Link>
          
          <Link 
            href="/konsultasi" 
            onClick={() => setMenuOpen(false)} 
            className="px-5 py-4 text-center text-[1.05rem] font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-[0_4px_12px_rgba(46,134,222,0.25)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            Mulai Konsultasi
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Backdrop overlay to close when clicking outside */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/10 backdrop-blur-[2px] z-[998] md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
