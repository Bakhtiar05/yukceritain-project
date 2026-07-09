'use client'

import React, { useState } from 'react'
import DataTable, { Column } from '@/components/admin/ui/DataTable'
import FilterBar from '@/components/admin/ui/FilterBar'
import EmptyState from '@/components/admin/ui/EmptyState'
import { createClient } from '@/lib/supabase/client'
import { EyeOff, Trash2, RotateCcw } from 'lucide-react'
import { adminDeleteComment, adminUpdateCommentStatus } from '@/app/actions/adminCommunity'

export default function CommentsClient({ initialComments }: { initialComments: any[] }) {
  const [comments, setComments] = useState(initialComments)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  const supabase = createClient()

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content?.toLowerCase().includes(search.toLowerCase()) || 
                          comment.profile?.display_name?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAction = async (id: string, action: 'hide' | 'restore' | 'delete') => {
    if (action === 'delete') {
      if (!confirm('Permanently delete this comment?')) return
      setComments(comments.filter(c => c.id !== id))
      await adminDeleteComment(id)
      return
    }

    const newStatus = action === 'hide' ? 'Hidden' : 'Published'
    const isHidden = action === 'hide'

    setComments(comments.map(c => c.id === id ? { ...c, status: newStatus, is_hidden: isHidden } : c))
    await adminUpdateCommentStatus(id, newStatus, isHidden)
  }

  const columns: Column<any>[] = [
    {
      header: 'Author',
      accessor: 'profile',
      render: (comment) => (
        <div className="flex items-center space-x-3">
          <img src={comment.profile?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${comment.profile?.username}`} className="w-8 h-8 rounded-full bg-slate-100 object-cover" />
          <div>
            <p className="font-semibold text-slate-900">{comment.profile?.display_name}</p>
            <p className="text-xs text-slate-500">@{comment.profile?.username}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Comment',
      accessor: 'content',
      render: (comment) => (
        <p className="line-clamp-2 max-w-md text-slate-600 text-sm">{comment.content}</p>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (comment) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          comment.status === 'Published' ? 'bg-green-100 text-green-700' : 
          comment.status === 'Hidden' ? 'bg-amber-100 text-amber-700' : 
          'bg-red-100 text-red-700'
        }`}>
          {comment.status || 'Published'}
        </span>
      )
    },
    {
      header: 'Date',
      accessor: 'created_at',
      render: (comment) => <span suppressHydrationWarning className="text-slate-500 text-sm">{new Date(comment.created_at).toLocaleDateString()}</span>
    },
    {
      header: 'Actions',
      render: (comment) => (
        <div className="flex items-center space-x-2">
          {comment.status !== 'Published' && (
            <button onClick={() => handleAction(comment.id, 'restore')} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Restore">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          {comment.status !== 'Hidden' && (
            <button onClick={() => handleAction(comment.id, 'hide')} className="p-1.5 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors" title="Hide">
              <EyeOff className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => handleAction(comment.id, 'delete')} className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div>
      <FilterBar 
        searchPlaceholder="Search comments..."
        onSearch={setSearch}
        filters={[
          { label: 'Status', value: statusFilter, options: [
            { label: 'Published', value: 'Published' },
            { label: 'Hidden', value: 'Hidden' },
          ]}
        ]}
        onFilterChange={(_, val) => setStatusFilter(val)}
      />
      
      <DataTable 
        columns={columns}
        data={filteredComments}
        keyExtractor={(c) => c.id}
        selectable
        selectedIds={selectedIds}
        onSelectAll={(checked) => setSelectedIds(checked ? filteredComments.map(c => c.id) : [])}
        onSelectRow={(id, checked) => setSelectedIds(prev => checked ? [...prev, id] : prev.filter(i => i !== id))}
        emptyState={
          <EmptyState 
            title="No comments found" 
            description="No comments match your current search and filter criteria." 
          />
        }
      />
    </div>
  )
}
