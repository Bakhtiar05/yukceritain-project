'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'

export default function CommunityMobileHeader() {
  const router = useRouter()
  const pathname = usePathname()

  if (
    pathname?.includes('/community/post/') || 
    pathname?.includes('/community/create') ||
    pathname?.includes('/community/profile') ||
    pathname?.includes('/community/user')
  ) {
    return null
  }

  return (
    <header className="community-mobile-header md:hidden">
      {/* Left — Back Button */}
      <button
        onClick={() => router.back()}
        aria-label="Kembali"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-muted text-muted-foreground transition-colors active:scale-95 flex-shrink-0"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2.2} />
      </button>

      {/* Center — Logo */}
      <div className="flex flex-col items-center justify-center flex-1 px-3">
        <Image 
          src="/assets/logo-v4.png" 
          alt="YukceritaIN Logo" 
          width={130} 
          height={32} 
          className="object-contain h-8 w-auto dark:brightness-0 dark:invert"
          priority
        />
      </div>
      
      {/* Right placeholder to keep center alignment */}
      <div className="w-10 h-10 flex-shrink-0" />
    </header>
  )
}
