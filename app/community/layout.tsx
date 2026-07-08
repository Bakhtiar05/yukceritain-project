import React from 'react'
import LeftSidebar from '@/components/community/LeftSidebar'
import RightSidebar from '@/components/community/RightSidebar'
import AuthModalProvider from '@/components/community/AuthModalProvider'
import CommunityMobileHeader from '@/components/community/CommunityMobileHeader'
import CommunityBottomNav from '@/components/community/CommunityBottomNav'
import { createClient } from '@/lib/supabase/server'

export default async function CommunityLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  return (
    <AuthModalProvider>
      {/* Premium floating bottom nav — community only */}
      <CommunityBottomNav isAuthenticated={isAuthenticated} />

      {/* Premium mobile header — only on mobile */}
      <CommunityMobileHeader />

      <div className="min-h-screen bg-background flex justify-center font-sans text-foreground selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-300">
        <div className="w-full max-w-[1600px] flex flex-col md:flex-row md:px-4 xl:px-8 gap-6 xl:gap-8">

          {/* Desktop Left Sidebar */}
          <div className="hidden md:flex w-72 xl:w-[300px] flex-shrink-0 bg-card rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.02)] border border-border my-4 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar transition-colors duration-300">
            <LeftSidebar />
          </div>

          {/* Main Feed Column */}
          <div className="flex-1 w-full max-w-3xl min-h-screen flex flex-col bg-card md:bg-transparent md:dark:bg-transparent md:rounded-3xl my-0 md:my-4 md:mt-24 relative transition-colors duration-300">
            <main className="flex-1 pb-28 md:pb-0">
              {children}
            </main>
          </div>

          {/* Desktop Right Sidebar */}
          <div className="hidden lg:flex w-80 xl:w-[340px] flex-shrink-0 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar py-4">
            <RightSidebar />
          </div>

        </div>
      </div>
    </AuthModalProvider>
  )
}
