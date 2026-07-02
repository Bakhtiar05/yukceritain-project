import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StoryCard from '@/components/community/StoryCard'
import EditProfileButton from '@/components/community/EditProfileButton'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/community/for-you')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    return <div className="p-8 text-center">Profile not found</div>
  }

  // Fetch user's posts
  const { data: posts } = await supabase
    .from('community_posts')
    .select(`
      *,
      profile:profiles(display_name, username, avatar_url),
      likes:community_likes(profile_id),
      comments:community_comments(count)
    `)
    .eq('profile_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 pt-6">
        <div className="px-6 pb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">@{profile.username}</h1>
              <p className="text-slate-500 font-medium">{profile.display_name}</p>
            </div>
            <EditProfileButton 
              initialDisplayName={profile.display_name}
              initialUsername={profile.username}
              initialBio={profile.bio || ''}
            />
          </div>

          <div className="mt-4">
            <p className="text-slate-700">{profile.bio || 'No bio yet.'}</p>
          </div>

          <div className="flex space-x-4 mt-6 border-b border-slate-200">
            <button className="pb-3 border-b-2 border-blue-600 font-semibold text-slate-900">
              Stories ({posts?.length || 0})
            </button>
            <button className="pb-3 font-semibold text-slate-500 hover:text-slate-700">
              Replies
            </button>
            <button className="pb-3 font-semibold text-slate-500 hover:text-slate-700">
              Likes
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100 pb-20">
        {posts?.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            You haven't shared any stories yet.
          </div>
        ) : (
          posts?.map((post) => (
            <StoryCard
              key={post.id}
              id={post.id}
              content={post.content}
              is_anonymous={post.is_anonymous}
              created_at={post.created_at}
              profile={post.profile as any}
              likes_count={post.likes.length}
              comments_count={post.comments[0]?.count || 0}
              is_liked_by_me={post.likes.some((l: any) => l.profile_id === session.user.id)}
              isAuthenticated={true}
              isOwner={session.user.id === post.profile_id}
            />
          ))
        )}
      </div>
    </div>
  )
}
