import React from 'react'
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
      {/* Welcome Card */}
      <div className="bg-white p-6 border-b border-slate-200">
        <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-100 flex items-start space-x-4">
          <div className="text-3xl mt-1">🌿</div>
          <div>
            <h2 className="text-lg font-bold text-blue-950 mb-1">Welcome to YukCeritain Community</h2>
            <p className="text-blue-800 text-sm leading-relaxed">
              A safe place to share stories, read experiences, and support one another.
            </p>
          </div>
        </div>
      </div>

      <StoryComposer isAuthenticated={isAuthenticated} />

      <div className="divide-y divide-slate-100 bg-slate-50 min-h-screen pb-10">
        {error ? (
          <div className="p-8 text-center text-slate-500">
            Failed to load stories. Please try again later.
          </div>
        ) : posts?.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No stories yet. Be the first to share!
          </div>
        ) : (
          posts?.map((post) => {
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
              />
            )
          })
        )}
      </div>
    </div>
  )
}
