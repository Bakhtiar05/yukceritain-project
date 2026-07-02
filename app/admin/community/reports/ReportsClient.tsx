'use client'

import React, { useState } from 'react'
import DataTable, { Column } from '@/components/admin/ui/DataTable'
import FilterBar from '@/components/admin/ui/FilterBar'
import EmptyState from '@/components/admin/ui/EmptyState'
import ReportModal from '@/components/admin/community/ReportModal'
import { createClient } from '@/lib/supabase/client'

export default function ReportsClient({ initialReports, adminId }: { initialReports: any[], adminId: string }) {
  const [reports, setReports] = useState(initialReports)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Pending')
  const [selectedReport, setSelectedReport] = useState<any>(null)
  
  const supabase = createClient()

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.reason?.toLowerCase().includes(search.toLowerCase()) || 
                          r.reporter?.display_name?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleResolve = async (id: string, action: string, note: string) => {
    const report = reports.find(r => r.id === id)
    if (!report) return

    // Update Report Status
    await supabase.from('community_reports').update({ 
      status: 'Resolved', 
      description: note ? `[${action.toUpperCase()}] ${note}` : `[${action.toUpperCase()}]`
    }).eq('id', id)

    // Log Activity
    await supabase.from('community_activity_logs').insert({
      admin_id: adminId,
      action: `resolve_report_${action}`,
      target_type: 'report',
      target_id: id,
    })

    // Action specific logic
    if (action === 'delete_content') {
      if (report.post_id) {
        await supabase.from('community_posts').delete().eq('id', report.post_id)
      } else if (report.comment_id) {
        await supabase.from('community_comments').delete().eq('id', report.comment_id)
      }
    } else if (action === 'ban_user') {
      const targetUserId = report.post?.profile?.id || report.comment?.profile?.id
      if (targetUserId) {
         await supabase.from('profiles').update({ status: 'Banned' }).eq('id', targetUserId)
      }
    }

    setReports(reports.map(r => r.id === id ? { ...r, status: 'Resolved' } : r))
    setSelectedReport(null)
  }

  const columns: Column<any>[] = [
    {
      header: 'Reason',
      accessor: 'reason',
      render: (r) => (
        <div>
          <p className="font-semibold text-slate-900">{r.reason}</p>
          <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{r.post?.content || r.comment?.content || 'Content not found'}</p>
        </div>
      )
    },
    {
      header: 'Type',
      render: (r) => (
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${r.post_id ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-purple-50 text-purple-700 border border-purple-100'}`}>
          {r.post_id ? 'Post' : 'Comment'}
        </span>
      )
    },
    {
      header: 'Reporter',
      render: (r) => <span className="text-sm font-medium text-slate-700">{r.reporter?.display_name || 'Unknown'}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          r.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
          'bg-amber-100 text-amber-700 animate-pulse'
        }`}>
          {r.status || 'Pending'}
        </span>
      ),
      sortable: true
    },
    {
      header: 'Date',
      accessor: 'created_at',
      render: (r) => <span className="text-slate-500 text-sm">{new Date(r.created_at).toLocaleDateString()}</span>,
      sortable: true
    }
  ]

  return (
    <div>
      <FilterBar 
        searchPlaceholder="Search reports..."
        onSearch={setSearch}
        filters={[
          { label: 'Status', value: statusFilter, options: [
            { label: 'Pending', value: 'Pending' },
            { label: 'Resolved', value: 'Resolved' },
          ]}
        ]}
        onFilterChange={(_, val) => setStatusFilter(val)}
      />
      
      <DataTable 
        columns={columns}
        data={filteredReports}
        keyExtractor={(r) => r.id}
        onRowClick={(r) => setSelectedReport(r)}
        emptyState={
          <EmptyState 
            title="No reports found" 
            description="You're all caught up! No reports match your criteria." 
          />
        }
      />

      <ReportModal 
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
        onResolve={handleResolve}
      />
    </div>
  )
}
