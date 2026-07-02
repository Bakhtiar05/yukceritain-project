import React from 'react'
import { FileSearch } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ElementType
}

export default function EmptyState({ title, description, icon: Icon = FileSearch }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-b-2xl border-x border-b border-slate-200">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm">{description}</p>
    </div>
  )
}
