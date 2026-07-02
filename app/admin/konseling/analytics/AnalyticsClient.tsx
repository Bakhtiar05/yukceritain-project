"use client"

import React, { useMemo } from 'react'
import { format, parseISO, startOfDay, subDays } from 'date-fns'
import { 
  BarChart, Bar, 
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import StatCard from '@/components/admin/ui/StatCard'
import { TrendingUp, Users, Activity } from 'lucide-react'

interface AnalyticsClientProps {
  initialData: any[]
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AnalyticsClient({ initialData }: AnalyticsClientProps) {
  
  // Aggregate Booking Trends (last 7 days)
  const bookingTrends = useMemo(() => {
    const last7Days = Array.from({length: 7}).map((_, i) => {
      const d = subDays(new Date(), i)
      return {
        date: format(d, 'yyyy-MM-dd'),
        display: format(d, 'dd MMM'),
        count: 0
      }
    }).reverse()

    initialData.forEach(req => {
      if (!req.created_at) return
      const dateStr = req.created_at.split('T')[0]
      const day = last7Days.find(d => d.date === dateStr)
      if (day) day.count++
    })
    return last7Days
  }, [initialData])

  // Aggregate Consultation Methods
  const methodStats = useMemo(() => {
    const methods: Record<string, number> = {}
    initialData.forEach(req => {
      const m = req.metode_konsultasi || 'Unknown'
      methods[m] = (methods[m] || 0) + 1
    })
    return Object.keys(methods).map(name => ({ name, value: methods[name] }))
  }, [initialData])

  // Aggregate Status
  const statusStats = useMemo(() => {
    const statuses: Record<string, number> = {}
    initialData.forEach(req => {
      const s = req.db_status || 'Unknown'
      statuses[s] = (statuses[s] || 0) + 1
    })
    return Object.keys(statuses).map(name => ({ name, value: statuses[name] }))
  }, [initialData])

  // Aggregate Revenue (last 7 days)
  const revenueTrends = useMemo(() => {
    const last7Days = Array.from({length: 7}).map((_, i) => {
      const d = subDays(new Date(), i)
      return {
        date: format(d, 'yyyy-MM-dd'),
        display: format(d, 'dd MMM'),
        revenue: 0
      }
    }).reverse()

    initialData.forEach(req => {
      if (!req.created_at || !req.payments || req.payments.length === 0) return
      const payment = req.payments[0]
      if (payment.payment_status !== 'PAID') return
      
      const dateStr = req.created_at.split('T')[0]
      const day = last7Days.find(d => d.date === dateStr)
      if (day) day.revenue += (payment.amount || 0)
    })
    return last7Days
  }, [initialData])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Deep dive into your counseling metrics and trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Bookings" value={initialData.length} icon={Activity} />
        <StatCard title="Completed Sessions" value={initialData.filter(d => d.db_status === 'Selesai').length} icon={Users} />
        <StatCard title="Avg. Booking/Day" value={Math.round(initialData.length / 30)} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bookings Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Bookings (Last 7 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="display" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue (Last 7 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrends}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="display" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `Rp${val/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Booking Status Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Method Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Consultation Methods</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={methodStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {methodStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}
