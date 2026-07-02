"use client"

import React, { useState } from 'react'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Search, ExternalLink, CreditCard, Clock, XCircle } from 'lucide-react'
import DataTable, { Column } from '@/components/admin/ui/DataTable'
import StatCard from '@/components/admin/ui/StatCard'

interface PaymentsClientProps {
  initialData: any[]
}

export default function PaymentsClient({ initialData }: PaymentsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = initialData.filter(item => 
    item.external_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.consultation_requests?.request_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.consultation_requests?.nama_lengkap?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalRevenue = initialData.filter(p => p.payment_status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0)
  const pendingAmount = initialData.filter(p => p.payment_status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0)
  const expiredCount = initialData.filter(p => p.payment_status === 'EXPIRED').length

  const columns: Column<any>[] = [
    {
      header: 'Invoice ID',
      accessor: 'external_id',
      sortable: true,
      render: (item) => <span className="font-mono text-xs font-semibold text-slate-700">{item.external_id}</span>
    },
    {
      header: 'Booking Ref',
      render: (item) => (
        <div>
          <div className="font-medium text-blue-600 font-mono text-xs">{item.consultation_requests?.request_number}</div>
          <div className="text-xs text-slate-500">{item.consultation_requests?.nama_lengkap}</div>
        </div>
      )
    },
    {
      header: 'Amount',
      render: (item) => (
        <span className="font-medium text-slate-900">Rp {item.amount?.toLocaleString('id-ID')}</span>
      )
    },
    {
      header: 'Status',
      render: (item) => {
        const status = item.payment_status
        let color = 'bg-slate-100 text-slate-700'
        if (status === 'PAID') color = 'bg-emerald-100 text-emerald-700'
        else if (status === 'PENDING') color = 'bg-amber-100 text-amber-700'
        else if (status === 'EXPIRED') color = 'bg-red-100 text-red-700'

        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>
      }
    },
    {
      header: 'Created At',
      render: (item) => (
        <span className="text-sm text-slate-600">
          {format(new Date(item.created_at), 'dd MMM yyyy, HH:mm', { locale: localeId })}
        </span>
      )
    },
    {
      header: 'Invoice',
      render: (item) => (
        item.invoice_url ? (
          <a 
            href={item.invoice_url} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            <span>View</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        ) : <span className="text-slate-400 text-sm">-</span>
      )
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
        <p className="text-slate-500 text-sm mt-1">Manage consultation transactions and invoices.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard 
          title="Total Paid Revenue" 
          value={`Rp ${totalRevenue.toLocaleString('id-ID')}`} 
          icon={CreditCard} 
          trend="up" 
          trendValue="Updated" 
        />
        <StatCard 
          title="Pending Payments" 
          value={`Rp ${pendingAmount.toLocaleString('id-ID')}`} 
          icon={Clock} 
          trend="neutral" 
          trendValue="Waiting" 
        />
        <StatCard 
          title="Expired Invoices" 
          value={expiredCount} 
          icon={XCircle} 
          trend="down" 
          trendValue="Lost" 
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice or patient..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredData}
          keyExtractor={(item) => item.id}
          emptyState={
            <div className="py-12 text-center text-slate-500">
              No payments found.
            </div>
          }
        />
      </div>
    </div>
  )
}
