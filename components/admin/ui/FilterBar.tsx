import React from 'react'
import { Search, Filter } from 'lucide-react'

interface FilterBarProps {
  onSearch: (value: string) => void
  onFilterChange: (key: string, value: string) => void
  filters: { label: string; value: string; options: { label: string; value: string }[] }[]
  searchPlaceholder?: string
}

export default function FilterBar({ onSearch, onFilterChange, filters, searchPlaceholder = 'Search...' }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-t-2xl border-b border-slate-200 gap-4">
      <div className="relative w-full sm:w-72">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-slate-50"
          placeholder={searchPlaceholder}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <div className="flex items-center text-sm font-medium text-slate-500 mr-2">
          <Filter className="w-4 h-4 mr-1.5" />
          Filters
        </div>
        
        {filters.map((filter, index) => (
          <select
            key={index}
            value={filter.value}
            onChange={(e) => onFilterChange(filter.label, e.target.value)}
            className="block w-full sm:w-auto pl-3 pr-8 py-2 text-sm border-slate-200 bg-white border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer text-slate-700"
          >
            <option value="all">All {filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  )
}
