import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/roles'
import PostsClient from './PostsClient'

export const metadata = {
  title: 'Community Posts | Admin YukCeritain',
}

export default async function PostsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole()

  if (!user || (role !== 'super_admin' && role !== 'admin_community')) {
    redirect('/admin')
  }

  // Fetch posts with author info and counts
  const { data: posts, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      profile:profiles!community_posts_profile_id_fkey(id, username, display_name, avatar_url),
      likes:community_likes(count),
      comments:community_comments(count),
      reports:community_reports(count)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error)
  }

  // Supabase sometimes returns single relations as arrays depending on schema. Ensure safe casting.
  const safePosts = (posts || []).map(post => ({
    ...post,
    profile: Array.isArray(post.profile) ? post.profile[0] : post.profile
  }))

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Posts Management</h1>
        <p className="text-slate-500 text-sm mt-1">Review, hide, or delete community posts.</p>
      </div>
      
      <PostsClient initialPosts={safePosts} />
    </div>
  )
}
