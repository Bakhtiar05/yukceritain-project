import React from 'react'
import { createClient } from '@/lib/supabase/server'
import StoryComposer from '@/components/community/StoryComposer'
import StoryCard from '@/components/community/StoryCard'
import Link from 'next/link'

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
    .limit(30)

  return (
    <div className="w-full">

      {/* ── WELCOME CARD (mobile only) ─────────────────────────── */}
      <div className="md:hidden px-4 pt-5 pb-3">
        <div
          className="relative overflow-hidden rounded-[24px] px-6 py-5"
          style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #E0EAFF 60%, #EEF2FF 100%)',
          }}
        >
          {/* Abstract blobs */}
          <div
            className="community-welcome-blob"
            style={{ width: 120, height: 120, background: '#93C5FD', top: -32, right: -28 }}
          />
          <div
            className="community-welcome-blob"
            style={{ width: 80, height: 80, background: '#A5B4FC', bottom: -20, left: 20 }}
          />

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-[18px] font-bold text-[#1E3A5F] leading-snug">
              Welcome to<br />YukceritaIN Community
            </h1>
            <p className="mt-1.5 text-[13px] text-[#3B5A85] leading-relaxed font-medium">
              A safe place to share stories, support one another, and grow together.
            </p>
            {/* Badge */}
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-sm border border-blue-100 rounded-full px-3 py-1.5 text-[12px] font-semibold text-[#2563EB]">
              <span>✨</span>
              <span>Safe • Anonymous • Positive</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── WELCOME CARD (desktop) — kept from original ────────── */}
      <div className="hidden md:block px-4 sm:px-6 pt-6 pb-1">
        <div className="flex bg-gradient-to-r from-blue-50/60 to-indigo-50/60 rounded-[16px] px-5 py-3.5 border border-blue-100/40 items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-bold text-slate-800 leading-tight truncate">Selamat Datang</h2>
              <p className="text-slate-500 text-[13px] mt-0.5 truncate">Ruang aman untuk berbagi cerita.</p>
            </div>
          </div>
          <button className="flex-shrink-0 px-3 py-1 bg-transparent text-blue-600 text-[13px] font-semibold rounded-full border border-blue-200/60 hover:bg-blue-50/50 hover:border-blue-300 transition-colors">
            Pedoman
          </button>
        </div>
      </div>

      {/* ── STORY COMPOSER ────────────────────────────────────── */}
      <div className="pt-1">
        <StoryComposer isAuthenticated={isAuthenticated} />
      </div>

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
          posts?.map((post, index) => {
            const isLikedByMe = session ? post.likes.some((like: any) => like.profile_id === session.user.id) : false
            const commentsCount = post.comments[0]?.count || 0

            return (
              <StoryCard
                key={post.id}
                id={post.id}
                content={post.content}
                is_anonymous={post.is_anonymous}
                created_at={post.created_at}
                profile={post.profile as any}
                likes_count={post.likes.length}
                comments_count={commentsCount}
                is_liked_by_me={isLikedByMe}
                isAuthenticated={isAuthenticated}
                isOwner={session?.user?.id === post.profile_id}
                index={index}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
