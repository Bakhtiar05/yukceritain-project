"use client"

import React, { useState, useMemo } from 'react'
import { MoreVertical, Star, Calendar, MessageCircle, Edit, Trash2, Search, Filter, ArrowUpDown } from 'lucide-react'
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader'
import Link from 'next/link'
import type { Counselor } from '@/lib/types'
import { deleteCounselor } from '@/lib/actions/counselors'

export default function CounselorsClient({ initialCounselors }: { initialCounselors: Counselor[] }) {
  const [counselors, setCounselors] = useState(initialCounselors)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  const [search, setSearch] = useState("")
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all")
  const [filterPublic, setFilterPublic] = useState<"all" | "public" | "private">("all")
  const [sortBy, setSortBy] = useState<"display_order" | "name" | "experience">("display_order")

  const stats = useMemo(() => {
    return {
      total: counselors.length,
      public: counselors.filter(c => c.is_public).length,
      active: counselors.filter(c => c.is_active).length,
      inactive: counselors.filter(c => !c.is_active).length
    }
  }, [counselors])

  const filteredAndSortedCounselors = useMemo(() => {
    let result = [...counselors]

    // Search
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(c => 
        c.full_name.toLowerCase().includes(s) || 
        c.profession.toLowerCase().includes(s) || 
        c.specialization.toLowerCase().includes(s)
      )
    }

    // Filter Active
    if (filterActive === "active") result = result.filter(c => c.is_active)
    if (filterActive === "inactive") result = result.filter(c => !c.is_active)

    // Filter Public
    if (filterPublic === "public") result = result.filter(c => c.is_public)
    if (filterPublic === "private") result = result.filter(c => !c.is_public)

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") return a.full_name.localeCompare(b.full_name)
      if (sortBy === "experience") return b.experience_years - a.experience_years
      // default: display_order
      return a.display_order - b.display_order
    })

    return result
  }, [counselors, search, filterActive, filterPublic, sortBy])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this counselor? (This will hide them from public but keep their records)')) return
    setIsDeleting(id)
    const res = await deleteCounselor(id)
    if (res.success) {
      setCounselors(counselors.map(c => c.id === id ? { ...c, is_active: false } : c))
    } else {
      alert('Failed to deactivate counselor')
    }
    setIsDeleting(null)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminPageHeader 
        title="Counselors Directory" 
        description="Manage and view status of all counselors."
        action={
          <Link href="/admin/konseling/counselors/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm">
            + Add Counselor
          </Link>
        }
      />

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Total</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.public}</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Public</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <p className="text-3xl font-bold text-emerald-600">{stats.active}</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Active</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <p className="text-3xl font-bold text-rose-500">{stats.inactive}</p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Inactive</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, profession..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={filterActive} 
              onChange={(e) => setFilterActive(e.target.value as any)}
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={filterPublic} 
              onChange={(e) => setFilterPublic(e.target.value as any)}
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              <option value="all">All Visibility</option>
              <option value="public">Public Only</option>
              <option value="private">Private Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              <option value="display_order">Sort: Custom Order</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="experience">Sort: Experience</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSortedCounselors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500">No counselors found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedCounselors.map(counselor => (
            <div key={counselor.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow relative flex flex-col">
              {isDeleting === counselor.id && (
                <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              <div className="p-6 pb-4 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="relative">
                    <img src={counselor.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(counselor.full_name)}&background=random`} alt={counselor.full_name} className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 object-cover" />
                    <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white
                      ${counselor.is_active ? 'bg-emerald-500' : 'bg-slate-300'}
                    `}></span>
                  </div>
                  <div className="flex space-x-1">
                    <Link href={`/admin/konseling/counselors/${counselor.id}/edit`} className="p-1 text-slate-400 hover:text-blue-600 rounded">
                      <Edit className="w-4 h-4" />
                    </Link>
                    {counselor.is_active && (
                      <button onClick={() => handleDelete(counselor.id)} className="p-1 text-slate-400 hover:text-rose-600 rounded" title="Deactivate">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{counselor.full_name}</h3>
                <p className="text-sm text-slate-500 mt-1">{counselor.profession}</p>
                
                <div className="flex items-center mt-3 space-x-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium text-slate-700">{counselor.rating} <span className="text-slate-400">({counselor.total_reviews})</span></span>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-slate-100 p-4 grid grid-cols-2 gap-4 mt-auto">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Experience</p>
                  <p className="font-bold text-slate-900">{counselor.experience_years} years</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
                  <p className={`text-sm font-bold
                    ${counselor.is_active ? 'text-emerald-600' : 'text-rose-500'}
                  `}>{counselor.is_active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>

              <div className="p-4 flex gap-2 border-t border-slate-100">
                <Link href={`/admin/konseling/counselors/${counselor.id}/schedule`} className="flex-1 flex justify-center items-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

