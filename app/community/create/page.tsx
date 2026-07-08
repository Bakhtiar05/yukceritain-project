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
    <div className="w-full bg-background min-h-screen">
      {/* ── Sticky Header (Same as Story Community Discussion) ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-card/92 backdrop-blur-xl border-b border-border md:hidden">
        <div className="h-16 flex items-center justify-between px-3">
          {/* Back */}
          <a
            href="/community/for-you"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted text-muted-foreground transition-colors active:scale-95 flex-shrink-0"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          </a>

          {/* Center */}
          <div className="flex flex-col items-center flex-1 px-3">
            <span className="text-[17px] font-bold text-foreground leading-tight tracking-tight text-center">
              Create Story
            </span>
          </div>

          {/* Right placeholder to keep center alignment */}
          <div className="w-10 h-10 flex-shrink-0" />
        </div>
      </header>

      {/* Desktop Header/Back */}
      <div className="hidden md:flex bg-card border-b border-border px-4 py-3 sticky top-0 md:top-0 z-30 items-center">
        <a href="/community/for-you" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span className="font-medium">Back</span>
        </a>
        <h2 className="ml-4 font-bold text-foreground">Create Story</h2>
      </div>

      <div className="bg-background pt-4 md:pt-0">
        <StoryComposer isAuthenticated={!!session} />
      </div>
      
      <div className="p-8 text-center text-muted-foreground text-sm">
        Share what's on your mind. You can choose to post anonymously to protect your privacy.
      </div>
    </div>
  )
}
