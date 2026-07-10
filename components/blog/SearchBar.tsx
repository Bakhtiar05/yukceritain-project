'use client'

import { useState, useEffect, useRef } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [internal, setInternal] = useState(value)
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      onChange(internal)
    }, 220)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [internal, onChange])

  useEffect(() => { setInternal(value) }, [value])

  return (
    <div className="relative">
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        placeholder="Cari artikel..."
        className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-card rounded-full border border-neutral-200 dark:border-border text-sm text-neutral-700 dark:text-foreground placeholder:text-neutral-400 dark:placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
      />
    </div>
  )
}
