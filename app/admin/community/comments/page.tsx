import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/roles'
import CommentsClient from './CommentsClient'

export const metadata = {
  title: 'Community Comments | Admin YukCeritain',
}

export default async function CommentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole()

  if (!user || (role !== 'super_admin' && role !== 'admin_community')) {
    redirect('/admin')
  }

  // Fetch comments with author info
  const { data: comments, error } = await supabase
    .from('community_comments')
    .select(`
      *,
      profile:profiles!community_comments_profile_id_fkey(id, username, display_name, avatar_url)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching comments:", error)
  }

  const safeComments = (comments || []).map(comment => ({
    ...comment,
    profile: Array.isArray(comment.profile) ? comment.profile[0] : comment.profile
  }))

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Comments Management</h1>
        <p className="text-slate-500 text-sm mt-1">Review, hide, or delete community comments.</p>
      </div>
      
      <CommentsClient initialComments={safeComments} />
    </div>
  )
}
