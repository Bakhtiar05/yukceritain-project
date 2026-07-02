import React from 'react'
import LeftSidebar from '@/components/community/LeftSidebar'
import RightSidebar from '@/components/community/RightSidebar'
import BottomNav from '@/components/community/BottomNav'
import TopBar from '@/components/community/TopBar'
import AuthModalProvider from '@/components/community/AuthModalProvider'

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthModalProvider>
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row justify-center font-sans text-slate-900">
        
        {/* Desktop Left Sidebar */}
        <div className="hidden md:flex w-64 xl:w-72 flex-shrink-0 border-r border-slate-200 bg-white sticky top-0 h-screen overflow-y-auto">
          <LeftSidebar />
        </div>

        {/* Main Feed Column */}
        <div className="flex-1 w-full max-w-2xl min-h-screen flex flex-col bg-white border-x-0 md:border-x border-slate-200 relative">
          {/* Mobile Top Bar */}
          <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <TopBar />
          </div>
          
          <main className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
        </div>

        {/* Desktop Right Sidebar */}
        <div className="hidden lg:flex w-80 xl:w-96 flex-shrink-0 sticky top-0 h-screen overflow-y-auto px-6 py-8">
          <RightSidebar />
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-slate-200 safe-area-pb">
          <BottomNav />
        </div>

      </div>
    </AuthModalProvider>
  )
}
