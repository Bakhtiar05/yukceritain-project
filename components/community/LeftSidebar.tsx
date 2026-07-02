'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Compass, PenSquare, Calendar, User, Settings, LogOut, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthModal } from './AuthModalProvider'

export default function LeftSidebar() {
  const pathname = usePathname()
  const { openModal } = useAuthModal()
  // Add actual auth state check here if needed

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.reload()
  }

  const navItems = [
    { name: 'For You', href: '/community/for-you', icon: Home },
    { name: 'Explore', href: '/community/explore', icon: Compass },
    { name: 'Create Story', href: '/community/create', icon: PenSquare, action: true },
    { name: 'Booking', href: '/konsultasi', icon: Calendar, external: true },
    { name: 'Profile', href: '/community/profile', icon: User, requiresAuth: true },
  ]

  return (
    <div className="flex flex-col h-full w-full py-8 px-6">
      <Link href="/community/for-you" className="flex items-center space-x-2 mb-10 px-2">
        <Image
          src="/assets/logo-v4.png"
          alt="YukCeritain Logo"
          width={150}
          height={40}
          className="w-auto h-8 sm:h-9 object-contain"
          priority
        />
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl font-medium transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="text-[15px]">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="pt-6 border-t border-slate-100 space-y-2">
        <button className="flex items-center space-x-4 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 w-full transition-all">
          <Settings className="w-5 h-5 text-slate-400" />
          <span className="text-[15px]">Settings</span>
        </button>
        <Link href="/" className="flex items-center space-x-4 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 w-full transition-all">
          <Globe className="w-5 h-5 text-slate-400" />
          <span className="text-[15px]">Back to Website</span>
        </Link>
        <button onClick={handleLogout} className="flex items-center space-x-4 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 w-full transition-all">
          <LogOut className="w-5 h-5 text-red-400" />
          <span className="text-[15px]">Logout</span>
        </button>
      </div>
    </div>
  )
}
