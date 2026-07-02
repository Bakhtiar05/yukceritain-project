'use client'

import React, { useState } from 'react'
import DataTable, { Column } from '@/components/admin/ui/DataTable'
import FilterBar from '@/components/admin/ui/FilterBar'
import EmptyState from '@/components/admin/ui/EmptyState'
import UserProfileModal from '@/components/admin/community/UserProfileModal'
import { createClient } from '@/lib/supabase/client'
import { ShieldCheck } from 'lucide-react'

export default function UsersClient({ initialUsers, adminId }: { initialUsers: any[], adminId: string }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  
  const supabase = createClient()

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.display_name?.toLowerCase().includes(search.toLowerCase()) || 
                          u.username?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || (u.status || 'Active') === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAction = async (action: string) => {
    if (!selectedUser) return
    const id = selectedUser.id

    let newStatus = 'Active'
    if (action === 'mute') newStatus = 'Muted'
    if (action === 'suspend') newStatus = 'Suspended'
    if (action === 'ban') newStatus = 'Banned'

    // Update DB
    await supabase.from('profiles').update({ status: newStatus }).eq('id', id)

    // Log user action
    await supabase.from('community_user_actions').insert({
      profile_id: id,
      action: action,
      admin_id: adminId
    })

    // Log Activity
    await supabase.from('community_activity_logs').insert({
      admin_id: adminId,
      action: `user_${action}`,
      target_type: 'user',
      target_id: id,
    })

    // Update state
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u))
    setSelectedUser((prev: any) => prev ? { ...prev, status: newStatus } : null)
  }

  const columns: Column<any>[] = [
    {
      header: 'User',
      accessor: 'display_name',
      render: (u) => (
        <div className="flex items-center space-x-3">
          <img src={u.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${u.username}`} className="w-8 h-8 rounded-full bg-slate-100 object-cover" />
          <div>
            <p className="font-semibold text-slate-900">{u.display_name}</p>
            <p className="text-xs text-slate-500">@{u.username}</p>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Engagement',
      render: (u) => (
        <div className="text-xs text-slate-500 space-y-1">
          <p>{u.posts?.[0]?.count || 0} Posts</p>
          <p>{u.comments?.[0]?.count || 0} Comments</p>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (u) => {
        const status = u.status || 'Active'
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'Active' ? 'bg-green-100 text-green-700' : 
            status === 'Muted' ? 'bg-amber-100 text-amber-700' : 
            status === 'Suspended' ? 'bg-orange-100 text-orange-700' : 
            'bg-red-100 text-red-700'
          }`}>
            {status}
          </span>
        )
      },
      sortable: true
    },
    {
      header: 'Joined',
      accessor: 'created_at',
      render: (u) => <span className="text-slate-500 text-sm">{new Date(u.created_at).toLocaleDateString()}</span>,
      sortable: true
    }
  ]

  return (
    <div>
      <FilterBar 
        searchPlaceholder="Search users by name or username..."
        onSearch={setSearch}
        filters={[
          { label: 'Status', value: statusFilter, options: [
            { label: 'Active', value: 'Active' },
            { label: 'Muted', value: 'Muted' },
            { label: 'Suspended', value: 'Suspended' },
            { label: 'Banned', value: 'Banned' },
          ]}
        ]}
        onFilterChange={(_, val) => setStatusFilter(val)}
      />
      
      <DataTable 
        columns={columns}
        data={filteredUsers}
        keyExtractor={(u) => u.id}
        onRowClick={(u) => setSelectedUser(u)}
        emptyState={
          <EmptyState 
            title="No users found" 
            description="No users match your current search and filter criteria." 
          />
        }
      />

      <UserProfileModal 
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
        onAction={handleAction}
      />
    </div>
  )
}
