import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StoryDetailClient from '@/components/community/StoryDetailClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('community_posts')
    .select(`
      content,
      is_anonymous,
      profile:profiles(display_name)
    `)
    .eq('id', id)
    .single()

  if (!post) {
    return {
      title: 'Story Not Found | YukceritaIN Community',
      description: 'This story may have been deleted or does not exist.',
    }
  }

  const authorName = post.is_anonymous ? 'Anonymous' : (post.profile as any)?.display_name || 'Someone'
  const excerpt = post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '')

  return {
    title: `${authorName}'s Story | YukceritaIN Community`,
    description: excerpt,
    openGraph: {
      title: `${authorName}'s Story | YukceritaIN Community`,
      description: excerpt,
      type: 'article',
      url: `https://yukceritain.com/community/post/${id}`,
      siteName: 'YukceritaIN Community',
    },
    twitter: {
      card: 'summary',
      title: `${authorName}'s Story | YukceritaIN Community`,
      description: excerpt,
    },
  }
}

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
    <StoryDetailClient
      post={post}
      comments={comments || []}
      session={session}
      isAuthenticated={isAuthenticated}
      isLikedByMe={isLikedByMe}
      commentsCount={commentsCount}
    />
  )
}
