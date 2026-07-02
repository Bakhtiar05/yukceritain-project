'use client'

import React, { useState } from 'react'
import DataTable, { Column } from '@/components/admin/ui/DataTable'
import FilterBar from '@/components/admin/ui/FilterBar'
import PostDrawer from '@/components/admin/community/PostDrawer'
import EmptyState from '@/components/admin/ui/EmptyState'
import { createClient } from '@/lib/supabase/client'

export default function PostsClient({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  const supabase = createClient()

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content?.toLowerCase().includes(search.toLowerCase()) || 
                          post.profile?.display_name?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Columns definition
  const columns: Column<any>[] = [
    {
      header: 'Author',
      accessor: 'profile',
      render: (post) => (
        <div className="flex items-center space-x-3">
          {post.is_anonymous ? (
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">🕵️</div>
          ) : (
            <img src={post.profile?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${post.profile?.username}`} className="w-8 h-8 rounded-full bg-slate-100 object-cover" />
          )}
          <div>
            <p className="font-semibold text-slate-900">{post.is_anonymous ? 'Anonymous' : post.profile?.display_name}</p>
            {!post.is_anonymous && <p className="text-xs text-slate-500">@{post.profile?.username}</p>}
          </div>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Content Preview',
      accessor: 'content',
      render: (post) => (
        <p className="line-clamp-2 max-w-md text-slate-600">{post.content}</p>
      )
    },
    {
      header: 'Stats',
      render: (post) => (
        <div className="flex items-center space-x-3 text-xs text-slate-500">
          <span title="Likes">❤️ {post.likes?.[0]?.count || 0}</span>
          <span title="Comments">💬 {post.comments?.[0]?.count || 0}</span>
          <span title="Reports" className={post.reports?.[0]?.count > 0 ? 'text-red-500 font-bold' : ''}>⚠️ {post.reports?.[0]?.count || 0}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (post) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          post.status === 'Published' ? 'bg-green-100 text-green-700' : 
          post.status === 'Hidden' ? 'bg-amber-100 text-amber-700' : 
          'bg-red-100 text-red-700'
        }`}>
          {post.status || 'Published'}
        </span>
      ),
      sortable: true
    },
    {
      header: 'Date',
      accessor: 'created_at',
      render: (post) => <span className="text-slate-500">{new Date(post.created_at).toLocaleDateString()}</span>,
      sortable: true
    }
  ]

  const handleHide = async (id: string) => {
    // Optimistic update
    setPosts(posts.map(p => p.id === id ? { ...p, status: 'Hidden', is_hidden: true } : p))
    setSelectedPost((prev: any) => prev?.id === id ? { ...prev, status: 'Hidden', is_hidden: true } : prev)
    
    // DB Update
    await supabase.from('community_posts').update({ status: 'Hidden', is_hidden: true }).eq('id', id)
    // Add activity log...
  }
  
  const handleRestore = async (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status: 'Published', is_hidden: false } : p))
    setSelectedPost((prev: any) => prev?.id === id ? { ...prev, status: 'Published', is_hidden: false } : prev)
    
    await supabase.from('community_posts').update({ status: 'Published', is_hidden: false }).eq('id', id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this post?')) return
    setIsDrawerOpen(false)
    setPosts(posts.filter(p => p.id !== id))
    await supabase.from('community_posts').delete().eq('id', id)
  }

  return (
    <div>
      <FilterBar 
        searchPlaceholder="Search posts..."
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
        data={filteredPosts}
        keyExtractor={(p) => p.id}
        selectable
        selectedIds={selectedIds}
        onSelectAll={(checked) => setSelectedIds(checked ? filteredPosts.map(p => p.id) : [])}
        onSelectRow={(id, checked) => setSelectedIds(prev => checked ? [...prev, id] : prev.filter(i => i !== id))}
        onRowClick={(post) => {
          setSelectedPost(post)
          setIsDrawerOpen(true)
        }}
        emptyState={
          <EmptyState 
            title="No posts found" 
            description="No posts match your current search and filter criteria." 
          />
        }
      />

      <PostDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        post={selectedPost}
        onHide={handleHide}
        onRestore={handleRestore}
        onDelete={handleDelete}
      />
    </div>
  )
}
