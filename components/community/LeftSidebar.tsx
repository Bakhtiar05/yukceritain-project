'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Compass, PenSquare, Calendar, User, Settings, LogOut, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthModal } from './AuthModalProvider'

export default function LeftSidebar() {
  const pathname = usePathname()
  const { openModal } = useAuthModal()
  const [profile, setProfile] = useState<{ display_name: string, username: string, avatar_url: string } | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (data) setProfile(data)
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.reload()
  }

  const renderNavGroup = (title: string, items: {name: string, href: string, icon: any, onClick?: () => void}[]) => (
    <div className="mb-6">
      <h4 className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-wider mb-3 px-4">{title}</h4>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href
          return item.onClick ? (
            <button
              key={item.name}
              onClick={item.onClick}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium transition-all group relative ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700' 
                  : 'text-muted-foreground hover:bg-muted dark:hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 dark:text-muted-foreground group-hover:text-blue-500'}`} />
              <span className="text-[15px]">{item.name}</span>
            </button>
          ) : (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium transition-all group relative overflow-hidden ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-500/10/80 text-blue-700' 
                  : 'text-muted-foreground hover:bg-muted dark:hover:bg-muted hover:text-foreground'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2/3 w-1 bg-blue-600 rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
              )}
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 dark:text-muted-foreground group-hover:text-blue-500'}`} />
              <span className="text-[15px]">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )

  const communityItems = [
    { name: 'Untukmu', href: '/community/for-you', icon: Home },
    { name: 'Eksplor', href: '/community/explore', icon: Compass },
    { name: 'Tulis Cerita', href: '/community/create', icon: PenSquare },
  ]

  const servicesItems = [
    { name: 'Konseling', href: '/konsultasi', icon: Calendar },
    { name: 'Kembali ke Web', href: '/', icon: Globe },
  ]

  const accountItems = profile ? [
    { name: 'Profil', href: '/community/profile', icon: User },
    { name: 'Pengaturan', href: '/community/settings', icon: Settings },
  ] : []

  return (
    <div className="flex flex-col h-full w-full py-8 px-4 lg:px-6 relative">
      <Link href="/community/for-you" className="flex items-center space-x-2 mb-10 px-4 group">
        <Image
          src="/assets/logo-v4.png"
          alt="YukCeritain Logo"
          width={180}
          height={48}
          className="w-auto h-10 sm:h-11 object-contain transition-transform group-hover:scale-[1.02] dark:brightness-0 dark:invert"
          priority
        />
      </Link>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {renderNavGroup('Komunitas', communityItems)}
        {renderNavGroup('Layanan', servicesItems)}
        {profile && renderNavGroup('Akun', accountItems)}
        
        {profile && (
          <div className="px-4 mt-2">
            <button 
              onClick={handleLogout} 
              className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 rounded-xl font-medium text-red-500 border border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 dark:bg-red-900/20 hover:border-red-300 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[14px]">Keluar</span>
            </button>
          </div>
        )}
      </div>

      <div className="pt-6 mt-4 border-t border-border/80">
        {profile ? (
          <div className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-muted dark:hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border group">
            <div className="relative">
              <img src={profile.avatar_url || 'https://api.dicebear.com/7.x/notionists/svg?seed=' + profile.username} alt={profile.display_name} className="w-10 h-10 rounded-full object-cover bg-muted ring-2 ring-background shadow-sm" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate group-hover:text-blue-600 transition-colors">{profile.display_name}</p>
              <p className="text-xs text-muted-foreground truncate font-medium">@{profile.username}</p>
            </div>
          </div>
        ) : (
          <button onClick={openModal} className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl font-semibold transition-all shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5">
            Masuk untuk Bergabung
          </button>
        )}
      </div>
    </div>
  )
}
