import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/roles'
import ReportsClient from './ReportsClient'

export const metadata = {
  title: 'Community Reports | Admin YukCeritain',
}

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole()

  if (!user || (role !== 'super_admin' && role !== 'admin_community')) {
    redirect('/admin')
  }

  // Fetch reports with related post, comment, and reporter info
  const { data: reports, error } = await supabase
    .from('community_reports')
    .select(`
      *,
      reporter:profiles!community_reports_profile_id_fkey(id, username, display_name),
      post:community_posts(id, content, status, profile:profiles(username, display_name)),
      comment:community_comments(id, content, status, profile:profiles(username, display_name))
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching reports:", error)
  }

  const safeReports = (reports || []).map(r => ({
    ...r,
    reporter: Array.isArray(r.reporter) ? r.reporter[0] : r.reporter,
    post: Array.isArray(r.post) ? r.post[0] : r.post,
    comment: Array.isArray(r.comment) ? r.comment[0] : r.comment
  }))

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports Management</h1>
        <p className="text-slate-500 text-sm mt-1">Review and resolve community content reports.</p>
      </div>
      
      <ReportsClient initialReports={safeReports} adminId={user.id} />
    </div>
  )
}
