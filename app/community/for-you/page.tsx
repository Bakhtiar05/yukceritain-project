import React from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import StoryComposer from '@/components/community/StoryComposer'
import StoryCard from '@/components/community/StoryCard'

export const dynamic = 'force-dynamic'

export default async function ForYouPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  // Fetch recent posts
  // Note: RLS ensures we only fetch visible posts (is_hidden = false)
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
      {/* Welcome Section */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-1">
        {/* Mobile View: Logo and Tagline Only */}
        <div className="sm:hidden flex items-center gap-3 mb-2">
          <div className="w-[48px] h-[48px] flex items-center justify-center flex-shrink-0 overflow-hidden rounded-[12px] bg-slate-50 border border-slate-100">
            <Image 
              src="/assets/navbar-bawah.png" 
              alt="Logo" 
              width={40} 
              height={40} 
              className="w-full h-full object-cover" 
            />
          </div>
          <p className="text-slate-600 text-[14px] font-medium leading-tight">Ruang aman untuk berbagi cerita.</p>
        </div>

        {/* Desktop View: Full Card */}
        <div className="hidden sm:flex bg-gradient-to-r from-blue-50/60 to-indigo-50/60 rounded-[16px] px-5 py-3.5 border border-blue-100/40 items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 flex-1 min-w-0">
            <div className="bg-white w-8 h-8 flex items-center justify-center rounded-[10px] shadow-sm border border-blue-50/50 flex-shrink-0 overflow-hidden">
              <Image 
                src="/assets/navbar-bawah.png" 
                alt="Logo" 
                width={32} 
                height={32} 
                className="w-full h-full object-cover" 
              />
            </div>
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

      <div className="pt-1 sm:pt-2">
        <StoryComposer isAuthenticated={isAuthenticated} />
      </div>

      <div className="flex flex-col pt-2 pb-8 min-h-screen">
        {error ? (
          <div className="p-8 text-center text-slate-500">
            Failed to load stories. Please try again later.
          </div>
        ) : posts?.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No stories yet. Be the first to share!
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
