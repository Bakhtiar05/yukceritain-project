'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  House,
  Search,
  PenLine,
  HeartHandshake,
  CircleUser,
  X,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthModal } from './AuthModalProvider'

/* ── Nav items ─────────────────────────────────────────── */
type NavItem = {
  id: string
  label: string
  icon: React.ElementType
  href: string
  isPrimary?: boolean
  external?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',    label: 'Home',       icon: House,         href: '/community/for-you' },
  { id: 'search',  label: 'Search',     icon: Search,        href: '/community/explore' },
  { id: 'create',  label: 'Story',      icon: PenLine,       href: '/community/create', isPrimary: true },
  { id: 'counsel', label: 'Konseling',  icon: HeartHandshake, href: '/' },
  { id: 'profile', label: 'Profile',   icon: CircleUser,    href: '/community/profile' },
]

export default function CommunityBottomNav({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const pathname    = usePathname()
  const router      = useRouter()
  const { openModal } = useAuthModal()
  const [tapped, setTapped] = useState<string | null>(null)

  const isActive = (item: typeof NAV_ITEMS[number]) => {
    if (item.id === 'home')    return pathname === '/community/for-you'
    if (item.id === 'search')  return pathname?.startsWith('/community/explore')
    if (item.id === 'create')  return pathname?.startsWith('/community/create')
    if (item.id === 'counsel') return false
    if (item.id === 'profile') return pathname?.startsWith('/community/profile')
    return false
  }

  const handleTap = (item: typeof NAV_ITEMS[number]) => {
    setTapped(item.id)
    setTimeout(() => setTapped(null), 350)

    if (item.id === 'profile' && !isAuthenticated) {
      openModal()
      return
    }

    if (item.href.startsWith('http')) {
      window.location.href = item.href
    } else {
      router.push(item.href)
    }
  }

  return (
    /* Floating wrapper */
    <div className="md:hidden fixed bottom-0 inset-x-0 z-[998] pointer-events-none">
      <div className="pointer-events-auto mx-4 mb-4">
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30, delay: 0.1 }}
          className="flex items-center justify-between h-[72px] px-5 bg-white/95 backdrop-blur-xl rounded-[24px] border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)]"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item)
            const Icon   = item.icon
            const bounce = tapped === item.id

            /* ── Primary "Create Story" button ─── */
            if (item.isPrimary) {
              return (
                <button
                  key={item.id}
                  onClick={() => handleTap(item)}
                  className="flex flex-col items-center justify-center gap-1 w-1/5"
                  aria-label={item.label}
                >
                  <motion.div
                    animate={bounce ? { scale: [1, 0.85, 1.1, 1] } : {}}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-14 h-14 -mt-8 rounded-full bg-[#2563EB] flex items-center justify-center shadow-[0_6px_20px_rgba(37,99,235,0.40)] border-4 border-white"
                  >
                    <Icon size={22} strokeWidth={2} className="text-white" />
                  </motion.div>
                  <span className={`text-[10px] font-semibold mt-0.5 ${active ? 'text-[#2563EB]' : 'text-[#9CA3AF]'}`}>
                    {item.label}
                  </span>
                </button>
              )
            }

            /* ── Regular nav item ─────────────── */
            return (
              <button
                key={item.id}
                onClick={() => handleTap(item)}
                className="flex flex-col items-center justify-center gap-1 w-1/5"
                aria-label={item.label}
              >
                <motion.div
                  animate={bounce ? { scale: [1, 0.80, 1.08, 1] } : {}}
                  transition={{ duration: 0.30, ease: 'easeOut' }}
                  className={`w-10 h-10 flex items-center justify-center rounded-[12px] transition-all duration-200 ${
                    active
                      ? 'bg-[#EFF6FF] shadow-[0_2px_8px_rgba(37,99,235,0.12)]'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.2 : 1.8}
                    className={`transition-colors duration-200 ${active ? 'text-[#2563EB]' : 'text-[#9CA3AF]'}`}
                  />
                </motion.div>
                <span className={`text-[10px] font-semibold transition-colors duration-200 ${active ? 'text-[#2563EB]' : 'text-[#9CA3AF]'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </motion.nav>
      </div>
    </div>
  )
}
