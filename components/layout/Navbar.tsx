'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface NavbarProps {
  variant?: 'default' | 'blog'
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = variant === 'blog'
    ? [
        { label: 'Layanan', href: '/#services' },
        { label: 'Cara Kerja', href: '/#how-it-works' },
        { label: 'Testimoni', href: '/#testimonials' },
        { label: 'FAQ', href: '/#faq' },
        { label: 'Blog', href: '/blog', active: true },
      ]
    : [
        { label: 'Layanan', href: '#services' },
        { label: 'Cara Kerja', href: '#how-it-works' },
        { label: 'Testimoni', href: '#testimonials' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Blog', href: '/blog' },
      ]

  return (
    <header
      className={`navbar-glass fixed top-0 left-0 w-full z-[1000] transition-all duration-base ${scrolled ? 'scrolled' : ''}`}
    >
      <div className="max-w-container mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Image src="/assets/logo.png" alt="Akutemanmu" width={120} height={36} className="h-9 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-4 py-2 text-[0.92rem] font-medium rounded-lg transition-colors duration-fast ${
                link.active
                  ? 'text-blue-500 bg-blue-50'
                  : 'text-neutral-600 hover:text-blue-500 hover:bg-blue-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/admin/login" className="btn btn-ghost text-[0.92rem]">Masuk</Link>
          <Link href="/#services" className="btn btn-primary text-[0.88rem] px-6 py-2.5">Mulai Gratis</Link>
        </div>

        <button
          className={`hamburger md:hidden flex flex-col justify-center items-center w-10 h-10 bg-transparent cursor-pointer ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 top-[72px] bg-white z-[999] flex flex-col p-6 gap-2 transition-all duration-300 md:hidden ${
          menuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={`px-4 py-3 text-base font-medium rounded-lg ${
              link.active ? 'text-blue-500 bg-blue-50' : 'text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            {link.label}
          </Link>
        ))}
        <hr className="my-3 border-neutral-200" />
        <Link href="/admin/login" onClick={() => setMenuOpen(false)} className="btn btn-ghost justify-center">Masuk</Link>
        <Link href="/#services" onClick={() => setMenuOpen(false)} className="btn btn-primary justify-center">Mulai Gratis</Link>
      </div>
    </header>
  )
}
