'use client'

import React, { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

export interface Column<T> {
  header: string
  accessor?: keyof T
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  selectable?: boolean
  selectedIds?: string[]
  onSelectAll?: (checked: boolean) => void
  onSelectRow?: (id: string, checked: boolean) => void
  emptyState?: React.ReactNode
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectable,
  selectedIds = [],
  onSelectAll,
  onSelectRow,
  emptyState
}: DataTableProps<T>) {
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDesc, setSortDesc] = useState(false)

  const handleSort = (accessor?: string) => {
    if (!accessor) return
    if (sortCol === accessor) {
      setSortDesc(!sortDesc)
    } else {
      setSortCol(accessor)
      setSortDesc(false)
    }
  }

  const allSelected = data.length > 0 && selectedIds.length === data.length
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length

  return (
    <div className="w-full overflow-x-auto bg-white border-x border-b border-slate-200 rounded-b-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {selectable && (
              <th className="px-4 py-3 w-12 text-center">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected
                  }}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                />
              </th>
            )}
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''}`}
                onClick={() => col.sortable && handleSort(col.accessor as string)}
              >
                <div className="flex items-center space-x-1">
                  <span>{col.header}</span>
                  {col.sortable && sortCol === col.accessor && (
                    sortDesc ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-0">
                {emptyState}
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const id = keyExtractor(item)
              const isSelected = selectedIds.includes(id)
              return (
                <tr
                  key={id}
                  className={`group transition-colors ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''} ${isSelected ? 'bg-blue-50/50' : ''}`}
                  onClick={(e) => {
                    // Prevent row click if clicking on checkbox or a button inside the row
                    if ((e.target as HTMLElement).closest('button, input, a')) return
                    onRowClick?.(item)
                  }}
                >
                  {selectable && (
                    <td className="px-4 py-3 text-center w-12">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        checked={isSelected}
                        onChange={(e) => onSelectRow?.(id, e.target.checked)}
                      />
                    </td>
                  )}
                  {columns.map((col, i) => (
                    <td key={i} className="px-4 py-4 text-sm text-slate-700 align-middle">
                      {col.render ? col.render(item) : col.accessor ? String(item[col.accessor] ?? '-') : null}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
