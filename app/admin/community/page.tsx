import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/roles'
import { Users, FileText, MessageCircle, AlertTriangle } from 'lucide-react'
import StatCard from '@/components/admin/ui/StatCard'
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader'
import DashboardCharts from './DashboardCharts'

export const metadata = {
  title: 'Community Dashboard | Admin YukCeritain',
}

export default async function CommunityDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole()

  if (!user || (role !== 'super_admin' && role !== 'admin_community')) {
    redirect('/admin')
  }

  // Fetch basic stats
  const [usersCount, postsCount, commentsCount, reportsCount] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('community_posts').select('id', { count: 'exact', head: true }),
    supabase.from('community_comments').select('id', { count: 'exact', head: true }),
    supabase.from('community_reports').select('id', { count: 'exact', head: true }).eq('status', 'Pending')
  ])

  // Mock data for charts
  const activityData = [
    { name: 'Mon', posts: 40, comments: 24, users: 10 },
    { name: 'Tue', posts: 30, comments: 13, users: 15 },
    { name: 'Wed', posts: 20, comments: 98, users: 20 },
    { name: 'Thu', posts: 27, comments: 39, users: 30 },
    { name: 'Fri', posts: 18, comments: 48, users: 12 },
    { name: 'Sat', posts: 23, comments: 38, users: 18 },
    { name: 'Sun', posts: 34, comments: 43, users: 22 },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminPageHeader 
        title="Community Overview" 
        description="Manage and monitor community activity."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={usersCount.count || 0} 
          icon={Users} 
          trend="up" 
          trendValue="+12%" 
        />
        <StatCard 
          title="Total Posts" 
          value={postsCount.count || 0} 
          icon={FileText} 
          trend="up" 
          trendValue="+5%" 
        />
        <StatCard 
          title="Total Comments" 
          value={commentsCount.count || 0} 
          icon={MessageCircle} 
          trend="neutral" 
          trendValue="0%" 
        />
        <StatCard 
          title="Pending Reports" 
          value={reportsCount.count || 0} 
          icon={AlertTriangle} 
          trend="down" 
          trendValue="-2%" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Activity Trends</h3>
          <div className="h-80">
             <DashboardCharts data={activityData} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-3 flex-1">
            <a href="/admin/community/reports" className="flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors group">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white text-rose-500 flex items-center justify-center mr-3 shadow-sm">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-rose-900">Review Reports</p>
                  <p className="text-xs text-rose-600">{reportsCount.count || 0} pending reports</p>
                </div>
              </div>
              <span className="text-rose-500 transform group-hover:translate-x-1 transition-transform">→</span>
            </a>
            
            <a href="/admin/community/posts" className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors group">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white text-blue-500 flex items-center justify-center mr-3 shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Moderate Posts</p>
                  <p className="text-xs text-blue-600">View recent posts</p>
                </div>
              </div>
              <span className="text-blue-500 transform group-hover:translate-x-1 transition-transform">→</span>
            </a>

             <a href="/admin/community/users" className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white text-slate-500 flex items-center justify-center mr-3 shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Manage Users</p>
                  <p className="text-xs text-slate-600">View user directory</p>
                </div>
              </div>
              <span className="text-slate-500 transform group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
