import React from 'react'
import { createClient } from '@/lib/supabase/server'
import ExploreClient from '@/components/community/ExploreClient'

export const dynamic = 'force-dynamic'

export default async function ExplorePage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data: posts } = await supabase
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
    <ExploreClient 
      initialPosts={posts || []} 
      session={session} 
    />
  )
}
