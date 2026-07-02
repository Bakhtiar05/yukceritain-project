import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import StoryCard from '@/components/community/StoryCard'

export const dynamic = 'force-dynamic'

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  // Fetch the target profile by username
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) {
    notFound()
  }

  // Fetch the target user's visible posts
  const { data: posts } = await supabase
    .from('community_posts')
    .select(`
      *,
      profile:profiles(display_name, username, avatar_url),
      likes:community_likes(profile_id),
      comments:community_comments(count)
    `)
    .eq('profile_id', profile.id)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 pt-6">
        {/* Back navigation */}
        <div className="px-6 pb-2">
          <a href="/community/for-you" className="inline-flex items-center text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back
          </a>
        </div>
        
        <div className="px-6 pb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">@{profile.username}</h1>
              <p className="text-slate-500 font-medium">{profile.display_name}</p>
            </div>
            {/* If looking at own profile, we could show Edit Profile, but we have /profile for that. */}
            {session?.user?.id === profile.id && (
              <a href="/community/profile" className="px-5 py-2 border border-slate-300 rounded-full font-semibold text-slate-700 hover:bg-slate-50">
                My Profile
              </a>
            )}
          </div>

          <div className="mt-4">
            <p className="text-slate-700">{profile.bio || 'No bio yet.'}</p>
          </div>

          <div className="flex space-x-4 mt-6 border-b border-slate-200">
            <button className="pb-3 border-b-2 border-blue-600 font-semibold text-slate-900">
              Stories ({posts?.filter(p => !p.is_anonymous).length || 0})
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100 pb-20">
        {posts?.filter(p => !p.is_anonymous).length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            This user hasn't shared any public stories yet.
          </div>
        ) : (
          posts?.filter(p => !p.is_anonymous).map((post) => (
            <StoryCard
              key={post.id}
              id={post.id}
              content={post.content}
              is_anonymous={post.is_anonymous}
              created_at={post.created_at}
              profile={post.profile as any}
              likes_count={post.likes.length}
              comments_count={post.comments[0]?.count || 0}
              is_liked_by_me={session ? post.likes.some((l: any) => l.profile_id === session.user.id) : false}
              isAuthenticated={!!session}
              isOwner={session?.user?.id === post.profile_id}
            />
          ))
        )}
      </div>
    </div>
  )
}
