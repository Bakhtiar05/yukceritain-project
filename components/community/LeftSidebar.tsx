'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Compass, PenSquare, User, Settings, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthModal } from './AuthModalProvider'
import ThemeToggle from './ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreateStoryDrawer } from './CreateStoryDrawerProvider'

export default function LeftSidebar() {
  const pathname = usePathname()
  const { openModal } = useAuthModal()
  const { openDrawer } = useCreateStoryDrawer()
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<{ display_name: string, username: string, avatar_url: string } | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    setMounted(true)
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
      {!isCollapsed && (
        <h4 className="text-[12px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-4 whitespace-nowrap overflow-hidden">{title}</h4>
      )}
      <div className="space-y-0.5 px-2">
        {items.map((item) => {
          const isActive = pathname === item.href
          
          const content = (
            <>
              {isActive && (
                <motion.div
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-blue-50/60 dark:bg-blue-500/10 rounded-[16px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-0 w-[3px] h-[20px] bg-blue-600 rounded-r-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              )}
              <div className={`relative z-10 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-2'} w-full`}>
                <item.icon className={`w-[20px] h-[20px] flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400'}`} strokeWidth={2} />
                {!isCollapsed && (
                  <span className={`text-[16px] whitespace-nowrap overflow-hidden ${isActive ? 'font-medium text-blue-700 dark:text-blue-400' : 'font-medium text-slate-600 dark:text-slate-300'}`}>
                    {item.name}
                  </span>
                )}
              </div>
            </>
          )

          const baseClasses = `relative flex items-center min-h-[48px] rounded-[16px] transition-colors duration-150 ease-out cursor-pointer ${
            isActive ? '' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
          }`

          return item.onClick ? (
            <button key={item.name} onClick={item.onClick} className={`w-full ${baseClasses}`} title={isCollapsed ? item.name : undefined}>
              {content}
            </button>
          ) : (
            <Link key={item.name} href={item.href} className={baseClasses} title={isCollapsed ? item.name : undefined}>
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )

  const communityItems = [
    { name: 'Community', href: '/community/for-you', icon: Home },
    { name: 'Explore', href: '/community/explore', icon: Compass },
    { 
      name: 'Write Story', 
      href: '#', 
      icon: PenSquare,
      onClick: () => {
        if (!profile) {
          openModal()
          return
        }
        openDrawer()
      }
    },
  ]

  const accountItems = profile ? [
    { name: 'Profile', href: '/community/profile', icon: User },
    { name: 'Settings', href: '/community/settings', icon: Settings },
  ] : []

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 88 : 300 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="hidden md:flex flex-col flex-shrink-0 bg-card rounded-[28px] shadow-sm border border-border my-4 sticky top-4 h-[calc(100vh-32px)] overflow-hidden transition-colors duration-300 relative"
    >
      {/* HEADER AREA */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center mt-8 mb-10' : 'justify-between px-6 mt-8 mb-10'}`}>
        <Link 
          href="/community/for-you" 
          className="flex-shrink-0 block"
          onClick={(e) => {
            if (isCollapsed) {
              e.preventDefault();
              setIsCollapsed(false);
            }
          }}
          title={isCollapsed ? "Expand Sidebar" : "Community Home"}
        >
          {isCollapsed ? (
            <Image
              src="/assets/logo-v10.png"
              alt="Logo"
              width={48}
              height={48}
              className="w-10 h-10 object-contain dark:brightness-0 dark:invert opacity-90 transition-transform hover:scale-105"
              priority
            />
          ) : (
            <Image
              src="/assets/logo-v10.png"
              alt="YukCeritain Logo"
              width={180}
              height={48}
              className="w-auto h-10 object-contain dark:brightness-0 dark:invert opacity-90"
              priority
            />
          )}
        </Link>
        
        {/* COLLAPSE TOGGLE BUTTON */}
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-[18px] h-[18px]" />
          </button>
        )}
      </div>

      {/* NAVIGATION SECTIONS */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {renderNavGroup('Community', communityItems)}
      </div>

      {/* FOOTER AREA */}
      <div className="mt-auto pt-4 pb-4 px-3 flex flex-col gap-2">
        {profile ? (
          <div className={`flex items-center ${isCollapsed ? 'flex-col gap-4' : 'justify-between'} p-2 rounded-[16px] hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-150 ease-out cursor-pointer mt-1`}>
            
            <Link 
              href="/community/profile"
              title={isCollapsed ? "Profile" : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} flex-1 min-w-0`}
            >
              <div className="relative flex-shrink-0">
                <img 
                  src={profile.avatar_url || 'https://api.dicebear.com/7.x/notionists/svg?seed=' + profile.username} 
                  alt={profile.display_name} 
                  className={`${isCollapsed ? 'w-10 h-10' : 'w-11 h-11'} rounded-full object-cover bg-slate-200 dark:bg-slate-800`} 
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] border-[2.5px] border-card rounded-full"></div>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-foreground truncate leading-tight">{profile.display_name}</p>
                  <p className="text-[13px] text-muted-foreground truncate leading-tight mt-[2px]">@{profile.username}</p>
                </div>
              )}
            </Link>

            {/* THEME TOGGLE BESIDE PROFILE */}
            {mounted && (
              <div className="flex-shrink-0">
                <ThemeToggle />
              </div>
            )}
          </div>
        ) : (
          <div className="px-1 pb-1 pt-2 w-full flex flex-col gap-4 items-center">
            {mounted && <ThemeToggle />}
            <button 
              onClick={openModal} 
              title={isCollapsed ? "Sign In" : undefined}
              className={`w-full flex justify-center items-center ${isCollapsed ? 'w-10 h-10 rounded-full mx-auto' : 'min-h-[48px] rounded-[16px]'} bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-150 ease-out`}
            >
              {isCollapsed ? (
                <User className="w-5 h-5" />
              ) : (
                <span className="text-[16px]">Sign In</span>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
