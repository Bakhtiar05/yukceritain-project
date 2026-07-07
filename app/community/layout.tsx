import React from 'react'
import LeftSidebar from '@/components/community/LeftSidebar'
import RightSidebar from '@/components/community/RightSidebar'
import TopBar from '@/components/community/TopBar'
import AuthModalProvider from '@/components/community/AuthModalProvider'
import Navbar from '@/components/layout/Navbar'
import MobileHeader from '@/components/events/mobile/MobileHeader'

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthModalProvider>
      <Navbar hideOnDesktop={true} />
      <MobileHeader title="YukceritaIN Community" />
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        
        <div className="w-full max-w-[1600px] flex flex-col md:flex-row md:px-4 xl:px-8 gap-6 xl:gap-8">
          
          {/* Desktop Left Sidebar */}
          <div className="hidden md:flex w-72 xl:w-[300px] flex-shrink-0 bg-white rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-100/60 my-4 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            <LeftSidebar />
          </div>

          {/* Main Feed Column */}
          <div className="flex-1 w-full max-w-3xl min-h-screen flex flex-col bg-white md:rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-100/60 my-0 md:my-4 md:mt-24 relative">
            {/* Mobile Top Bar (Removed to maximize feed visibility) */}
            
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
