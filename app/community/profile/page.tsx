import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileClient from '@/components/community/ProfileClient'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/community/for-you')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    return <div className="p-8 text-center text-[#6B7280]">Profile not found.</div>
  }

  // Fetch user's posts with likes + comments
  const { data: posts } = await supabase
    .from('community_posts')
    .select(`
      *,
      likes:community_likes(profile_id),
      comments:community_comments(count)
    `)
    .eq('profile_id', session.user.id)
    .order('created_at', { ascending: false })

  // Total likes given by the user to others
  const { count: totalLikesGiven } = await supabase
    .from('community_likes')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', session.user.id)

  return (
    <ProfileClient
      profile={profile}
      posts={posts || []}
      totalLikesGiven={totalLikesGiven || 0}
      session={session}
    />
  )
}
