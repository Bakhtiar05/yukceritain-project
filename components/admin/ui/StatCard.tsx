import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  trendDescription?: string
}

export default function StatCard({ title, value, icon: Icon, trend, trendValue, trendDescription = "from last month" }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {trend && trendValue && (
        <div className="mt-4 flex items-center text-sm">
          {trend === 'up' && (
            <span className="text-emerald-600 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              {trendValue}
            </span>
          )}
          {trend === 'down' && (
            <span className="text-rose-600 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
              {trendValue}
            </span>
          )}
          {trend === 'neutral' && (
            <span className="text-slate-500 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path></svg>
              {trendValue}
            </span>
          )}
          {trendDescription && (
            <span className="text-slate-400 ml-2">{trendDescription}</span>
          )}
        </div>
      )}
    </div>
  )
}
