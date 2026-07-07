'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Bookmark } from 'lucide-react'

export default function CommunityMobileHeader() {
  const router = useRouter()

  return (
    <header className="community-mobile-header md:hidden">
      {/* Left — Back Button */}
      <button
        onClick={() => router.back()}
        aria-label="Kembali"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F3F4F6] hover:bg-[#E9EAEC] text-[#374151] transition-colors active:scale-95 flex-shrink-0"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2.2} />
      </button>

      {/* Center — Title + Subtitle */}
      <div className="flex flex-col items-center flex-1 px-3">
        <span className="text-[17px] font-bold text-[#111827] leading-tight tracking-tight">
          YukceritaIN Community
        </span>
        <span className="text-[11.5px] font-medium text-[#9CA3AF] leading-tight mt-0.5">
          Safe Anonymous Space
        </span>
      </div>

      {/* Right — Bookmark Button */}
      <button
        aria-label="Bookmark"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-transparent border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#6B7280] transition-colors active:scale-95 flex-shrink-0"
      >
        <Bookmark className="w-[18px] h-[18px]" strokeWidth={1.8} />
      </button>
    </header>
  )
}
