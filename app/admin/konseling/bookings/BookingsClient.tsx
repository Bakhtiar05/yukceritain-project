"use client"

import React, { useState } from 'react'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Search, Eye } from 'lucide-react'
import DataTable, { Column } from '@/components/admin/ui/DataTable'
import BookingDrawer from '@/components/admin/konseling/BookingDrawer'
import { updateBookingStatus } from '@/app/actions/booking'
import { useToast } from '@/hooks/use-toast'

interface BookingsClientProps {
  initialData: any[]
}

export default function BookingsClient({ initialData }: BookingsClientProps) {
  const [data, setData] = useState(initialData)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  const { toast } = useToast()

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await updateBookingStatus(id, status)
      if (res.success) {
        setData(prev => prev.map(item => item.id === id ? { ...item, db_status: status } : item))
        toast({ title: 'Success', description: 'Booking status updated successfully.' })
      } else {
        toast({ title: 'Error', description: res.error, variant: 'destructive' })
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' })
    }
  }

  const filteredData = data.filter(item => 
    item.nama_lengkap?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.request_number?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<any>[] = [
    {
      header: 'Request Number',
      accessor: 'request_number',
      sortable: true,
      render: (item) => <span className="font-mono text-xs font-semibold text-blue-600">{item.request_number}</span>
    },
    {
      header: 'Patient',
      render: (item) => (
        <div>
          <div className="font-medium text-slate-900">{item.nama_lengkap}</div>
          <div className="text-xs text-slate-500">{item.nomor_hp}</div>
        </div>
      )
    },
    {
      header: 'Schedule',
      render: (item) => (
        <div>
          <div className="text-sm text-slate-900">
            {item.tanggal_konsultasi ? format(new Date(item.tanggal_konsultasi), 'dd MMM yyyy', { locale: localeId }) : '-'}
          </div>
          <div className="text-xs text-slate-500">{item.waktu_konsultasi} WIB</div>
        </div>
      )
    },
    {
      header: 'Method',
      accessor: 'metode_konsultasi',
    },
    {
      header: 'Booking Status',
      render: (item) => {
        const status = item.db_status || 'Menunggu Verifikasi'
        let color = 'bg-slate-100 text-slate-700'
        if (status === 'Menunggu Verifikasi') color = 'bg-amber-100 text-amber-700'
        else if (status === 'Disetujui' || status === 'Selesai') color = 'bg-emerald-100 text-emerald-700'
        else if (status === 'Ditolak' || status === 'Dibatalkan') color = 'bg-red-100 text-red-700'
        
        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>
      }
    },
    {
      header: 'Payment Status',
      render: (item) => {
        const status = item.payment?.payment_status || 'UNPAID'
        let color = 'bg-slate-100 text-slate-700'
        if (status === 'PAID') color = 'bg-emerald-100 text-emerald-700'
        else if (status === 'PENDING') color = 'bg-amber-100 text-amber-700'
        else if (status === 'EXPIRED') color = 'bg-red-100 text-red-700'

        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>
      }
    },
    {
      header: '',
      render: (item) => (
        <button 
          onClick={() => {
            setSelectedBooking(item)
            setIsDrawerOpen(true)
          }}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      )
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bookings Management</h1>
        <p className="text-slate-500 text-sm mt-1">Review, approve, and manage counseling requests.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search request number or patient name..."
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
              No bookings found.
            </div>
          }
        />
      </div>

      <BookingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        booking={selectedBooking}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  )
}
