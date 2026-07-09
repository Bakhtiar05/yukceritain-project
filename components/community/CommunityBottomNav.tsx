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
          className="flex items-center justify-between h-[76px] px-6 pb-1 bg-card/95 backdrop-blur-xl rounded-t-[24px] border-t border-border shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
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
                    animate={bounce ? { scale: [1, 0.88, 1.05, 1] } : {}}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.30, ease: 'easeOut' }}
                    className="relative w-[48px] h-[48px] -mt-6 rounded-full bg-gradient-to-br from-primary via-blue-500 to-indigo-500 flex items-center justify-center shadow-[0_8px_24px_hsl(var(--primary)_/_0.15)] border-[3px] border-background before:absolute before:inset-0 before:rounded-full before:border before:border-white/20"
                  >
                    <Icon size={24} strokeWidth={2} className="text-white drop-shadow-sm" />
                  </motion.div>
                  <span className={`text-[10px] font-semibold mt-0.5 ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                    {t(`bottomNav.${item.id}`) !== `bottomNav.${item.id}` ? t(`bottomNav.${item.id}`) : item.label}
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
                      ? 'bg-primary/10 shadow-[0_2px_8px_hsl(var(--primary)_/_0.12)]'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2 : 1.75}
                    className={`transition-colors duration-200 ${active ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                </motion.div>
                <span className={`text-[10px] font-semibold transition-colors duration-200 ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                  {t(`bottomNav.${item.id}`) !== `bottomNav.${item.id}` ? t(`bottomNav.${item.id}`) : item.label}
                </span>
              </button>
            )
          })}
        </motion.nav>
      </div>
    </div>
  )
}
