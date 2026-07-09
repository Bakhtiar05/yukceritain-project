'use client'

import React from 'react'
import { useCreateStoryDrawer } from '@/components/community/CreateStoryDrawerProvider'
import { useAuthModal } from '@/components/community/AuthModalProvider'

export default function EmptyStateButton({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { openDrawer } = useCreateStoryDrawer()
  const { openModal } = useAuthModal()

  const handleClick = () => {
    if (!isAuthenticated) {
      openModal()
      return
    }
    openDrawer()
  }

  return (
    <button
      onClick={handleClick}
      className="mt-6 inline-flex items-center gap-2 bg-[#2563EB] text-white text-[14px] font-semibold px-6 py-3 rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] hover:-translate-y-0.5 transition-all active:scale-95"
    >
      <span>✏️</span> Create Story
    </button>
  )
}
