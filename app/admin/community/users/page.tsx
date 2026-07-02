import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/roles'
import UsersClient from './UsersClient'

export const metadata = {
  title: 'Community Users | Admin YukCeritain',
}

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole()

  if (!user || (role !== 'super_admin' && role !== 'admin_community')) {
    redirect('/admin')
  }

  // Fetch users with their post and comment counts
  const { data: users, error } = await supabase
    .from('profiles')
    .select(`
      *,
      posts:community_posts(count),
      comments:community_comments(count)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Directory</h1>
        <p className="text-slate-500 text-sm mt-1">Manage community members and apply moderation actions.</p>
      </div>
      
      <UsersClient initialUsers={users || []} adminId={user.id} />
    </div>
  )
}
