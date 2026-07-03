'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Compass, Plus, Calendar, User } from 'lucide-react'
import { useAuthModal } from './AuthModalProvider'
import { createClient } from '@/lib/supabase/client'

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { openModal } = useAuthModal()

  const navItems = [
    { name: 'Beranda', href: '/community/for-you', icon: Home },
    { name: 'Eksplor', href: '/community/explore', icon: Compass },
    { name: 'Tulis', href: '/community/create', icon: Plus, isAction: true },
    { name: 'Konseling', href: '/konsultasi', icon: Calendar },
    { name: 'Profil', href: '/community/profile', icon: User },
  ]

  return (
    <div className="flex items-center justify-around h-16 px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href

        if (item.isAction) {
          return (
            <button
              key={item.name}
              onClick={async () => {
                const supabase = createClient()
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) {
                  openModal()
                } else {
                  router.push(item.href)
                }
              }}
              className="flex items-center justify-center -mt-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
              <item.icon className="w-7 h-7" />
            </button>
          )
        }

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center w-16 h-full space-y-1 ${
              isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <item.icon className={`w-6 h-6 ${isActive ? 'fill-blue-50' : ''}`} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
