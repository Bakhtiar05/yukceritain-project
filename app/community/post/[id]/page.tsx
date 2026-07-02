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
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Back navigation */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 md:top-0 z-30 flex items-center">
        <a href="/community/for-you" className="flex items-center text-slate-500 hover:text-slate-900 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span className="font-medium">Back to Feed</span>
        </a>
      </div>

      {/* Main Post */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
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
      <CommentComposer postId={post.id} isAuthenticated={isAuthenticated} />

      {/* Comments List */}
      <div className="bg-white divide-y divide-slate-100">
        <h3 className="px-6 py-4 font-bold text-slate-900 border-b border-slate-100">
          Comments ({comments?.length || 0})
        </h3>
        
        {comments?.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No comments yet. Be the first to reply!
          </div>
        ) : (
          comments?.map((comment) => {
            const canDeleteComment = session?.user?.id === comment.profile_id || session?.user?.id === post.profile_id
            return (
              <div key={comment.id} className="p-4 sm:p-6 flex space-x-3 sm:space-x-4 hover:bg-slate-50/50 transition-colors group/comment">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <Link href={`/community/user/${comment.profile.username}`} className="flex items-center space-x-1 group truncate">
                      <span className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 group-hover:underline transition-colors">{comment.profile.display_name}</span>
                      <span className="text-slate-500 text-xs truncate group-hover:text-blue-500 transition-colors">@{comment.profile.username}</span>
                    </Link>
                    {canDeleteComment && (
                      <div className="opacity-0 group-hover/comment:opacity-100 transition-opacity">
                        <DeleteCommentButton commentId={comment.id} postId={post.id} />
                      </div>
                    )}
                  </div>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
