'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, FileText, PenTool, ArrowLeft, 
  ShieldAlert, UsersRound, MessageCircle, Calendar, 
  CreditCard, UserCircle2, LineChart 
} from 'lucide-react'

interface AdminSidebarProps {
  role: string | null
}

export default function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/admin' && pathname !== '/admin') return false
    return pathname?.startsWith(path)
  }

  const linkClass = (path: string) => `flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
    isActive(path) 
      ? 'bg-blue-50 text-blue-600' 
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
  }`

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-64px)] shrink-0">
      <div className="flex-1 py-4 overflow-y-auto space-y-6 px-3">
        
        {/* Core */}
        {role === 'super_admin' && (
          <div className="space-y-1">
            <Link href="/admin" className={linkClass('/admin')}>
              <LayoutDashboard className="w-4 h-4" />
              Overview Dashboard
            </Link>
          </div>
        )}

        {/* Artikel Module */}
        {(role === 'super_admin' || role === 'admin_artikel') && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Content Management</p>
            <Link href="/admin/artikel" className={linkClass('/admin/artikel')}>
              <FileText className="w-4 h-4" />
              Articles
            </Link>
            <Link href="/admin/artikel/editor" className={linkClass('/admin/artikel/editor')}>
              <PenTool className="w-4 h-4" />
              Write Article
            </Link>
          </div>
        )}

        {/* Konseling Module */}
        {(role === 'super_admin' || role === 'admin_konseling') && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Counseling</p>
            <Link href="/admin/konseling" className={linkClass('/admin/konseling')}>
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </Link>
            <Link href="/admin/konseling/bookings" className={linkClass('/admin/konseling/bookings')}>
              <FileText className="w-4 h-4" />
              Bookings
            </Link>
            <Link href="/admin/konseling/calendar" className={linkClass('/admin/konseling/calendar')}>
              <Calendar className="w-4 h-4" />
              Calendar
            </Link>
            <Link href="/admin/konseling/payments" className={linkClass('/admin/konseling/payments')}>
              <CreditCard className="w-4 h-4" />
              Payments
            </Link>
            <Link href="/admin/konseling/counselors" className={linkClass('/admin/konseling/counselors')}>
              <UserCircle2 className="w-4 h-4" />
              Counselors
            </Link>
            <Link href="/admin/konseling/analytics" className={linkClass('/admin/konseling/analytics')}>
              <LineChart className="w-4 h-4" />
              Analytics
            </Link>
          </div>
        )}

        {/* Community Module */}
        {(role === 'super_admin' || role === 'admin_community') && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Community</p>
            <Link href="/admin/community" className={linkClass('/admin/community')}>
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/admin/community/posts" className={linkClass('/admin/community/posts')}>
              <FileText className="w-4 h-4" />
              Posts
            </Link>
            <Link href="/admin/community/comments" className={linkClass('/admin/community/comments')}>
              <MessageCircle className="w-4 h-4" />
              Comments
            </Link>
            <Link href="/admin/community/reports" className={linkClass('/admin/community/reports')}>
              <ShieldAlert className="w-4 h-4" />
              Reports
            </Link>
            <Link href="/admin/community/users" className={linkClass('/admin/community/users')}>
              <UsersRound className="w-4 h-4" />
              Users
            </Link>
          </div>
        )}

        {/* Events Module */}
        {(role === 'super_admin' || role === 'admin_events') && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Events</p>
            <Link href="/admin/events" className={linkClass('/admin/events')}>
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/admin/events/list" className={linkClass('/admin/events/list')}>
              <Calendar className="w-4 h-4" />
              All Events
            </Link>
            <Link href="/admin/events/create" className={linkClass('/admin/events/create')}>
              <PenTool className="w-4 h-4" />
              Create Event
            </Link>
            <Link href="/admin/events/registrations" className={linkClass('/admin/events/registrations')}>
              <UsersRound className="w-4 h-4" />
              Registrations
            </Link>
            <Link href="/admin/events/check-in" className={linkClass('/admin/events/check-in')}>
              <ShieldAlert className="w-4 h-4" />
              Check In
            </Link>
            <Link href="/admin/events/reports" className={linkClass('/admin/events/reports')}>
              <LineChart className="w-4 h-4" />
              Reports
            </Link>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200">
        <Link href="/" className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </Link>
      </div>
    </aside>
  )
}
