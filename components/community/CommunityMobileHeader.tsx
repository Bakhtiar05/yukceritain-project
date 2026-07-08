'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, Bookmark } from 'lucide-react'

export default function CommunityMobileHeader() {
  const router = useRouter()
  const pathname = usePathname()

  if (pathname?.includes('/community/post/')) {
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

      {/* Center — Title + Subtitle */}
      <div className="flex flex-col items-center flex-1 px-3">
        <span className="text-[17px] font-bold text-foreground leading-tight tracking-tight">
          YukceritaIN Community
        </span>
        <span className="text-[11.5px] font-medium text-muted-foreground leading-tight mt-0.5">
          Safe Anonymous Space
        </span>
      </div>
      
      {/* Right placeholder to keep center alignment */}
      <div className="w-10 h-10 flex-shrink-0" />
    </header>
  )
}
