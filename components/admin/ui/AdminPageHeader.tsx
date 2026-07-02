import React from 'react'

interface AdminPageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export default function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
      </div>
      {action && (
        <div className="flex items-center shrink-0">
          {action}
        </div>
      )}
    </div>
  )
}
