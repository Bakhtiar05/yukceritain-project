"use client"

import React from 'react'
import { MoreVertical, Star, Calendar, MessageCircle, Edit } from 'lucide-react'
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader'

// Mock data since we don't have a counselors table yet
const mockCounselors = [
  {
    id: 1,
    name: "Dr. Rani Kusuma, M.Psi.",
    specialization: "Clinical Psychologist",
    status: "Online",
    sessionsToday: 4,
    rating: 4.9,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rani"
  },
  {
    id: 2,
    name: "Sari Andini, S.Psi.",
    specialization: "Mental Health Counselor",
    status: "In Session",
    sessionsToday: 6,
    rating: 4.8,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sari"
  },
  {
    id: 3,
    name: "Budi Hartono, M.Psi.",
    specialization: "Mindfulness Practitioner",
    status: "Offline",
    sessionsToday: 0,
    rating: 4.7,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi"
  },
  {
    id: 4,
    name: "Laila Putri, M.Psi.",
    specialization: "Family Therapist",
    status: "Online",
    sessionsToday: 2,
    rating: 4.9,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laila"
  },
  {
    id: 5,
    name: "Muhammad Rizal, Sp.KJ",
    specialization: "Psychiatrist",
    status: "Online",
    sessionsToday: 5,
    rating: 5.0,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rizal"
  }
]

export default function CounselorsClient() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminPageHeader 
        title="Counselors Directory" 
        description="Manage and view status of all active counselors."
        action={
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm">
            + Add Counselor
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockCounselors.map(counselor => (
          <div key={counselor.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="relative">
                  <img src={counselor.image} alt={counselor.name} className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200" />
                  <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white
                    ${counselor.status === 'Online' ? 'bg-emerald-500' : 
                      counselor.status === 'In Session' ? 'bg-amber-500' : 'bg-slate-300'}
                  `}></span>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="font-bold text-slate-900 text-lg leading-tight">{counselor.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{counselor.specialization}</p>
              
              <div className="flex items-center mt-3 space-x-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium text-slate-700">{counselor.rating}</span>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-100 p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Today's Sessions</p>
                <p className="font-bold text-slate-900">{counselor.sessionsToday}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
                <p className={`text-sm font-medium
                  ${counselor.status === 'Online' ? 'text-emerald-600' : 
                    counselor.status === 'In Session' ? 'text-amber-600' : 'text-slate-600'}
                `}>{counselor.status}</p>
              </div>
            </div>

            <div className="p-4 flex gap-2 border-t border-slate-100">
              <button className="flex-1 flex justify-center items-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </button>
              <button className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
