import React from 'react'

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 h-32 flex flex-col justify-between animate-pulse">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-20"></div>
                <div className="h-8 bg-slate-200 rounded w-16"></div>
              </div>
              <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="h-4 bg-slate-200 rounded w-32 mt-4"></div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 h-96 animate-pulse"></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 h-96 animate-pulse"></div>
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between animate-pulse">
        <div className="h-10 bg-slate-200 rounded-lg w-64"></div>
        <div className="flex space-x-2">
          <div className="h-10 bg-slate-200 rounded-lg w-32"></div>
          <div className="h-10 bg-slate-200 rounded-lg w-32"></div>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-slate-200"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-48"></div>
                <div className="h-3 bg-slate-200 rounded w-32"></div>
              </div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
