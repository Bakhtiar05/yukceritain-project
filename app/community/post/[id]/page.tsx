import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StoryCard from '@/components/community/StoryCard'
import CommentComposer from '@/components/community/CommentComposer'
import DeleteCommentButton from '@/components/community/DeleteCommentButton'

export const dynamic = 'force-dynamic'

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  // Fetch the post
  const { data: post, error: postError } = await supabase
    .from('community_posts')
    .select(`
      *,
      profile:profiles(display_name, username, avatar_url),
      likes:community_likes(profile_id),
      comments:community_comments(count)
    `)
    .eq('id', id)
    .single()

  if (postError || !post) {
    notFound()
  }

  // Fetch comments
  const { data: comments } = await supabase
    .from('community_comments')
    .select(`
      id,
      profile_id,
      content,
      created_at,
      profile:profiles(display_name, username, avatar_url)
    `)
    .eq('post_id', id)
    .order('created_at', { ascending: false })

  const isLikedByMe = session ? post.likes.some((like: any) => like.profile_id === session.user.id) : false
  const commentsCount = post.comments[0]?.count || 0

  return (
    <div className="w-full bg-[#FCFCFD] min-h-screen pb-24 font-sans text-slate-800">
      {/* Back navigation */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 sticky top-0 z-30 flex items-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <a href="/community/for-you" className="flex items-center text-slate-400 hover:text-slate-900 transition-colors group">
          <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span className="font-semibold text-sm tracking-wide">Back</span>
        </a>
      </div>

      <div className="max-w-2xl mx-auto mt-8 sm:mt-12 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 overflow-hidden">
        {/* Main Post */}
        <div className="pt-2">
        <StoryCard
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
          disableCommentNavigation={true}
        />
        </div>

        {/* Comment Composer */}
        <div className="border-t border-slate-50/80">
          <CommentComposer postId={post.id} isAuthenticated={isAuthenticated} />
        </div>

        {/* Comments List */}
        <div className="bg-white pb-8">
          <div className="px-8 py-6 flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900">
              Responses
            </h3>
            <span className="text-sm font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
              {comments?.length || 0}
            </span>
          </div>
          
          {comments?.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </div>
              <h4 className="text-slate-800 font-semibold mb-1">No responses yet</h4>
              <p className="text-slate-500 text-sm max-w-[200px]">Be the first to share your thoughts.</p>
            </div>
          ) : (
            <div className="px-4 sm:px-8 space-y-6">
              {comments?.map((comment) => {
                const canDeleteComment = session?.user?.id === comment.profile_id || session?.user?.id === post.profile_id
                const profile = Array.isArray(comment.profile) ? comment.profile[0] : comment.profile
                return (
                  <div key={comment.id} className="group/comment flex space-x-4">
                    {/* Avatar */}
                    <div className="shrink-0 pt-1">
                      <Link href={`/community/user/${profile.username}`}>
                        {profile.avatar_url ? (
                          <img src={profile.avatar_url} className="w-10 h-10 rounded-full object-cover bg-slate-100 ring-2 ring-white shadow-sm" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold ring-2 ring-white shadow-sm">
                            {profile.display_name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                      </Link>
                    </div>

                    <div className="flex-1 min-w-0 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                      <div className="flex items-center justify-between mb-1.5">
                        <Link href={`/community/user/${profile.username}`} className="flex items-center space-x-2 group truncate">
                          <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{profile.display_name}</span>
                          <span className="text-slate-400 text-[13px] font-medium group-hover:text-slate-600 transition-colors">@{profile.username}</span>
                        </Link>
                        {canDeleteComment && (
                          <div className="opacity-0 group-hover/comment:opacity-100 transition-opacity">
                            <DeleteCommentButton commentId={comment.id} postId={post.id} />
                          </div>
                        )}
                      </div>
                      <p className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
