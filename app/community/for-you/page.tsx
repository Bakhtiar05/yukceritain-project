import React from 'react'
import { createClient } from '@/lib/supabase/server'
import StoryCard from '@/components/community/StoryCard'
import WelcomeHero from '@/components/community/WelcomeHero'
import InfiniteFeed from '@/components/community/InfiniteFeed'
import Link from 'next/link'
import { User, Send } from 'lucide-react'

import StoryComposerLink from '@/components/community/StoryComposerLink'

export const dynamic = 'force-dynamic'

export default async function ForYouPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  const { data: posts, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      profile:profiles(display_name, username, avatar_url),
      likes:community_likes(profile_id),
      comments:community_comments(count)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="w-full">

      {/* ── WELCOME HERO (Responsive) ───────────────────────────── */}
      <WelcomeHero />

      {/* ── STORY COMPOSER LINK ────────────────────────────────────── */}
      <StoryComposerLink />

      {/* ── FEED ──────────────────────────────────────────────── */}
      <div className="community-feed pt-2 pb-10 min-h-screen">
        {error ? (
          /* Error state */
          <div className="mx-4 mt-4 rounded-[20px] border border-red-100 bg-red-50/60 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-[15px] font-semibold text-red-700">Gagal memuat cerita</p>
            <p className="text-[13px] text-red-500 mt-1">Silakan coba lagi nanti.</p>
          </div>
        ) : posts?.length === 0 ? (
          /* Premium empty state */
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            {/* Illustration */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center mb-6 shadow-inner">
              <span className="text-5xl">🌱</span>
            </div>
            <h2 className="text-[20px] font-bold text-[#111827] mb-2">No stories yet</h2>
            <p className="text-[14px] text-[#6B7280] leading-relaxed max-w-[220px]">
              Be the first to share your thoughts and inspire the community.
            </p>
            <Link
              href="/community/create"
              className="mt-6 inline-flex items-center gap-2 bg-[#2563EB] text-white text-[14px] font-semibold px-6 py-3 rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <span>✏️</span> Create Story
            </Link>
          </div>
        ) : (
          <InfiniteFeed initialPosts={posts || []} mode="for-you" session={session} />
        )}
      </div>
    </div>
  )
}
