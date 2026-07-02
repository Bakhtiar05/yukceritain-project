import React from 'react'

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-100 text-emerald-700'
      case 'warning':
        return 'bg-amber-100 text-amber-700'
      case 'error':
        return 'bg-rose-100 text-rose-700'
      case 'info':
        return 'bg-blue-100 text-blue-700'
      case 'default':
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getVariantStyles()} ${className}`}>
      {children}
    </span>
  )
}
