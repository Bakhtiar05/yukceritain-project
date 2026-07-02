import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StoryComposer from '@/components/community/StoryComposer'

export const dynamic = 'force-dynamic'

export default async function CreateStoryPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // We still render it even if not authenticated, because the StoryComposer 
  // will intercept the click and show the AuthModal.
  // But generally, a dedicated route could redirect if unauth.
  // Let's just let the composer handle it for consistency.
  
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 md:top-0 z-30 flex items-center">
        <a href="/community/for-you" className="flex items-center text-slate-500 hover:text-slate-900 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span className="font-medium">Back</span>
        </a>
        <h2 className="ml-4 font-bold text-slate-900">Create Story</h2>
      </div>

      <div className="bg-white border-b border-slate-200">
        <StoryComposer isAuthenticated={!!session} />
      </div>
      
      <div className="p-8 text-center text-slate-500 text-sm">
        Share what's on your mind. You can choose to post anonymously to protect your privacy.
      </div>
    </div>
  )
}
