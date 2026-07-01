'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Home, HeartHandshake, Activity, BookOpen, MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface NavbarProps {
  variant?: 'default' | 'blog'
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
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

  const navLinks = variant === 'blog'
    ? [
        { label: 'Layanan', href: '/#layanan' },
        { label: 'Cara Kerja', href: '/#cara-kerja' },
        { label: 'Testimoni', href: '/#testimoni' },
        { label: 'FAQ', href: '/#faq' },
        { label: 'Blog', href: '/blog', active: true },
      ]
    : [
        { label: 'Layanan', href: '#layanan' },
        { label: 'Cara Kerja', href: '#cara-kerja' },
        { label: 'Testimoni', href: '#testimoni' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Blog', href: '/blog' },
      ]

  return (
    <>
      <header
        className={`fixed inset-x-0 z-[1000] transition-all duration-500 flex justify-center w-full px-4 sm:px-6 lg:px-8 ${
          scrolled ? 'top-3 md:top-4' : 'top-4 md:top-6'
        }`}
      >
        <div
          className={`w-full max-w-container mx-auto flex items-center justify-between transition-all duration-500 ${
            scrolled
              ? 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl md:rounded-full py-2 px-4 md:px-6 xl:px-8'
              : 'bg-white/40 backdrop-blur-md border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-2xl md:rounded-full py-3 md:py-3.5 px-4 md:px-6 xl:px-8'
          }`}
        >
          {/* Logo */}
          <div className="flex-1 flex justify-start items-center">
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
              <Image
                src="/assets/logov2_yukceritain.png"
                alt="YukceritaIN Logo"
                width={200}
                height={200}
                className={`w-auto transition-all duration-300 group-hover:scale-105 ${scrolled ? 'h-[42px] sm:h-[48px] lg:h-[56px]' : 'h-[48px] sm:h-[56px] lg:h-[64px]'}`}
                style={{ width: "auto" }}
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-none items-center justify-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative px-3.5 lg:px-4 py-2 text-[0.875rem] lg:text-[0.925rem] font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                  link.active
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex-1 hidden md:flex justify-end items-center gap-3 lg:gap-4">
            <Link
              href="/cek-status"
              className="text-[0.875rem] font-medium text-neutral-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-full hover:bg-blue-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            >
              Cek Status
            </Link>

            <Link
              href="/konsultasi"
              className="flex items-center justify-center px-5 lg:px-6 py-2.5 text-[0.875rem] lg:text-[0.925rem] font-semibold text-white bg-blue-600 rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:bg-blue-700 hover:shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            >
              Mulai Konseling
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-4 inset-x-4 z-[998] bg-white/85 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[24px] px-2 py-2 flex items-center justify-between pb-safe">
        <Link href="/konsultasi" className="flex flex-col items-center justify-center w-1/5 py-1 gap-1 text-neutral-500 hover:text-blue-600 transition-colors">
          <HeartHandshake size={22} className={pathname === '/konsultasi' ? 'text-blue-600' : ''} />
          <span className={`text-[10px] font-medium ${pathname === '/konsultasi' ? 'text-blue-600' : ''}`}>Konseling</span>
        </Link>
        <Link href="/cek-status" className="flex flex-col items-center justify-center w-1/5 py-1 gap-1 text-neutral-500 hover:text-blue-600 transition-colors">
          <Activity size={22} className={pathname === '/cek-status' ? 'text-blue-600' : ''} />
          <span className={`text-[10px] font-medium ${pathname === '/cek-status' ? 'text-blue-600' : ''}`}>Status</span>
        </Link>
        <Link href="/" className="flex flex-col items-center justify-center w-1/5 py-1 gap-1 text-neutral-500 hover:text-blue-600 transition-colors group">
          <div className={`flex items-center justify-center w-[56px] h-[56px] -mt-8 rounded-full bg-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] border-2 ${pathname === '/' ? 'border-blue-50' : 'border-neutral-50'} transition-transform duration-300 group-hover:-translate-y-1`}>
            <Image src="/assets/navbar-bawah.png" alt="Beranda" width={36} height={36} className={`object-contain transition-all duration-300 ${pathname === '/' ? 'opacity-100 scale-105 drop-shadow-md' : 'opacity-80'}`} />
          </div>
          <span className={`text-[10px] font-medium ${pathname === '/' ? 'text-blue-600' : ''}`}>Beranda</span>
        </Link>
        <Link href="/blog" className="flex flex-col items-center justify-center w-1/5 py-1 gap-1 text-neutral-500 hover:text-blue-600 transition-colors">
          <BookOpen size={22} className={pathname?.startsWith('/blog') ? 'text-blue-600' : ''} />
          <span className={`text-[10px] font-medium ${pathname?.startsWith('/blog') ? 'text-blue-600' : ''}`}>Blog</span>
        </Link>
        <button onClick={() => setMenuOpen(true)} className="flex flex-col items-center justify-center w-1/5 py-1 gap-1 text-neutral-500 hover:text-blue-600 transition-colors">
          <MoreHorizontal size={22} className={menuOpen ? 'text-blue-600' : ''} />
          <span className={`text-[10px] font-medium ${menuOpen ? 'text-blue-600' : ''}`}>Lainnya</span>
        </button>
      </nav>

      {/* Mobile Drawer (Bottom Sheet) */}
      <div
        className={`fixed inset-x-0 bottom-0 bg-white/95 backdrop-blur-2xl border-t border-neutral-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-[32px] p-6 pb-28 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] md:hidden z-[1000] flex flex-col ${
          menuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-neutral-800">Menu Lainnya</h3>
          <button onClick={() => setMenuOpen(false)} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh]">
          {navLinks.map((link) => (
            link.label !== 'Blog' && (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3.5 text-[1rem] font-semibold rounded-xl transition-colors focus:outline-none text-neutral-700 hover:bg-neutral-50 hover:text-blue-600"
              >
                {link.label}
              </Link>
            )
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-[999] md:hidden transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
