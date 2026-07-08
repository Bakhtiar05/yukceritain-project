'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bell, Search, User } from 'lucide-react'
import { useAuthModal } from './AuthModalProvider'
import { createClient } from '@/lib/supabase/client'

export default function TopBar() {
  const { openModal } = useAuthModal()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session)
      })

      return () => subscription.unsubscribe()
    }
    checkAuth()
  }, [])

  return (
    <div className="md:hidden sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <Image
          src="/assets/logo-v4.png"
          alt="YukCeritain Logo"
          width={120}
          height={32}
          className="w-auto h-7 object-contain"
          priority
        />
      </div>

      <div className="flex items-center space-x-3">
        <button className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:bg-muted dark:hover:bg-muted rounded-full transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {isAuthenticated === false && (
          <button 
            onClick={openModal}
            className="text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-1.5 rounded-full transition-colors"
          >
            Login
          </button>
        )}
        
        {isAuthenticated === true && (
          <Link href="/community/profile" className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <User className="w-5 h-5" />
          </Link>
        )}
      </div>

    </div>
  )
}
