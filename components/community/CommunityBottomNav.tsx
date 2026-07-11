'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  House,
  Search,
  Plus,
  HeartHandshake,
  CircleUser,
  X,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthModal } from './AuthModalProvider'
import { useCreateStoryDrawer } from './CreateStoryDrawerProvider'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'

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
  { id: 'explore',  label: 'Explore',     icon: Search,        href: '/community/explore' },
  { id: 'create',  label: 'Story',      icon: Plus,          href: '#', isPrimary: true },
  { id: 'counsel', label: 'Konseling',  icon: HeartHandshake, href: '/konsultasi' },
  { id: 'profile', label: 'Profile',   icon: CircleUser,    href: '/community/profile' },
]

export default function CommunityBottomNav({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const pathname    = usePathname()
  const router      = useRouter()
  const { openModal } = useAuthModal()
  const { openDrawer } = useCreateStoryDrawer()
  const { t } = useCommunityLanguage()
  const [tapped, setTapped] = useState<string | null>(null)

  const isActive = (item: typeof NAV_ITEMS[number]) => {
    if (item.id === 'home')    return pathname === '/community/for-you'
    if (item.id === 'explore')  return pathname?.startsWith('/community/explore')
    if (item.id === 'create')  return false
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
    
    if (item.id === 'create') {
      openDrawer()
      return
    }

    if (item.href.startsWith('http')) {
      window.location.href = item.href
    } else if (item.href !== '#') {
      router.push(item.href)
    }
  }

  return (
    /* Fixed bottom wrapper */
    <div className="md:hidden fixed bottom-0 inset-x-0 z-[998] pointer-events-none">
      <div className="pointer-events-auto">
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30, delay: 0.1 }}
          className="flex items-center justify-between h-[72px] px-2 bg-white dark:bg-background shadow-[0_-4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.2)]"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item)
            const Icon   = item.icon
            const bounce = tapped === item.id

            /* ── Primary "Create Story" button (FAB) ─── */
            if (item.isPrimary) {
              return (
                <button
                  key={item.id}
                  onClick={() => handleTap(item)}
                  className="flex flex-col items-center justify-center w-1/5 relative h-full"
                  aria-label={item.label}
                >
                  <motion.div
                    animate={bounce ? { scale: [1, 0.88, 1.05, 1] } : {}}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.30, ease: 'easeOut' }}
                    className="absolute -top-[24px] w-[56px] h-[56px] rounded-full bg-[#2563EB] dark:bg-primary flex items-center justify-center shadow-[0_8px_16px_rgba(37,99,235,0.24)] border-[4px] border-white dark:border-background"
                  >
                    <Icon size={28} strokeWidth={2.5} className="text-white" />
                  </motion.div>
                </button>
              )
            }

            /* ── Regular nav item ─────────────── */
            return (
              <button
                key={item.id}
                onClick={() => handleTap(item)}
                className="flex flex-col items-center justify-center gap-[4px] w-1/5 h-full relative"
                aria-label={item.label}
              >
                <motion.div
                  animate={bounce ? { scale: [1, 0.80, 1.08, 1] } : {}}
                  transition={{ duration: 0.30, ease: 'easeOut' }}
                  className="flex items-center justify-center"
                >
                  <Icon
                    size={24}
                    strokeWidth={active ? 2.5 : 1.75}
                    fill={active ? 'currentColor' : 'none'}
                    className={`transition-colors duration-200 ${active ? 'text-[#2563EB] dark:text-primary' : 'text-[#9CA3AF]'}`}
                  />
                </motion.div>
                <span className={`text-[10.5px] font-sans transition-colors duration-200 relative ${active ? 'text-[#2563EB] dark:text-primary font-semibold' : 'text-[#9CA3AF] font-normal'}`}>
                  {t(`bottomNav.${item.id}`) !== `bottomNav.${item.id}` ? t(`bottomNav.${item.id}`) : item.label}
                  {/* Dot Indicator */}
                  {active && (
                     <span className="absolute left-1/2 -bottom-[8px] w-1 h-1 -translate-x-1/2 rounded-full bg-[#2563EB] dark:bg-primary" />
                  )}
                </span>
              </button>
            )
          })}
        </motion.nav>
      </div>
    </div>
  )
}
