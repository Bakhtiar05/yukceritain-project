import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/roles'
import { Users, FileText, Calendar, CreditCard, Activity } from 'lucide-react'
import StatCard from '@/components/admin/ui/StatCard'
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader'
import OverviewClient from './OverviewClient'

export const metadata = {
  title: 'Counseling Overview | Admin YukCeritain',
}

export default async function KonselingDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole()

  if (!user || (role !== 'super_admin' && role !== 'admin_konseling')) {
    redirect('/admin')
  }

  // Fetch basic stats
  const [totalBookingsRes, pendingRes, paymentsRes] = await Promise.all([
    supabase.from('consultation_requests').select('id', { count: 'exact', head: true }),
    supabase.from('consultation_requests').select('id', { count: 'exact', head: true }).eq('db_status', 'Menunggu Verifikasi'),
    supabase.from('payments').select('amount').eq('payment_status', 'PAID')
  ])

  const totalBookings = totalBookingsRes.count || 0
  const pendingBookings = pendingRes.count || 0
  
  // Calculate total revenue
  const totalRevenue = paymentsRes.data?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminPageHeader 
        title="Counseling Overview" 
        description="Monitor bookings, revenue, and active sessions."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Bookings" 
          value={totalBookings} 
          icon={Calendar} 
          trend="up" 
          trendValue="+15%" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`Rp ${totalRevenue.toLocaleString('id-ID')}`} 
          icon={CreditCard} 
          trend="up" 
          trendValue="+8%" 
        />
        <StatCard 
          title="Pending Approval" 
          value={pendingBookings} 
          icon={Activity} 
          trend="down" 
          trendValue="-5%" 
        />
        <StatCard 
          title="Active Counselors" 
          value={8} // Mock data for now since we don't have a counselors table
          icon={Users} 
          trend="neutral" 
          trendValue="0%" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Booking Activity</h3>
          <div className="h-80">
             <OverviewClient />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-3 flex-1">
            <a href="/admin/konseling/bookings" className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-colors group">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white text-amber-500 flex items-center justify-center mr-3 shadow-sm">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-amber-900">Review Bookings</p>
                  <p className="text-xs text-amber-600">{pendingBookings} pending approvals</p>
                </div>
              </div>
              <span className="text-amber-500 transform group-hover:translate-x-1 transition-transform">→</span>
            </a>
            
            <a href="/admin/konseling/calendar" className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors group">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white text-blue-500 flex items-center justify-center mr-3 shadow-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">View Calendar</p>
                  <p className="text-xs text-blue-600">Check upcoming sessions</p>
                </div>
              </div>
              <span className="text-blue-500 transform group-hover:translate-x-1 transition-transform">→</span>
            </a>

             <a href="/admin/konseling/payments" className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors group">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white text-emerald-500 flex items-center justify-center mr-3 shadow-sm">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">Manage Payments</p>
                  <p className="text-xs text-emerald-600">Review transactions</p>
                </div>
              </div>
              <span className="text-emerald-500 transform group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
