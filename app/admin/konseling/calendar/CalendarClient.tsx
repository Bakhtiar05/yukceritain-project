"use client"

import React, { useState } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BookingDrawer from '@/components/admin/konseling/BookingDrawer'
import { updateBookingStatus } from '@/app/actions/booking'
import { useToast } from '@/hooks/use-toast'

interface CalendarClientProps {
  initialData: any[]
}

export default function CalendarClient({ initialData }: CalendarClientProps) {
  const [data, setData] = useState(initialData)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { toast } = useToast()

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

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

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          {format(currentDate, 'MMMM yyyy', { locale: localeId })}
        </h2>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-600 transition-colors">
            Today
          </button>
          <button onClick={nextMonth} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  const renderDays = () => {
    const days = []
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-semibold text-sm text-slate-500 py-3 uppercase tracking-wider">
          {format(addDays(startDate, i), 'EEE', { locale: localeId })}
        </div>
      )
    }
    return <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">{days}</div>
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ''

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd')
        const cloneDay = day

        // Find bookings for this day
        const dayBookings = data.filter(b => b.tanggal_konsultasi && isSameDay(parseISO(b.tanggal_konsultasi), cloneDay))

        days.push(
          <div
            key={day.toString()}
            className={`min-h-[120px] p-2 border-r border-b border-slate-100 transition-colors
              ${!isSameMonth(day, monthStart) ? 'bg-slate-50/50 text-slate-400' : 'bg-white text-slate-800'}
            `}
          >
            <div className="flex justify-between items-start">
              <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white' : ''}`}>
                {formattedDate}
              </span>
              {dayBookings.length > 0 && (
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                  {dayBookings.length}
                </span>
              )}
            </div>
            
            <div className="mt-2 flex flex-col gap-1">
              {dayBookings.slice(0, 3).map((b, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    setSelectedBooking(b)
                    setIsDrawerOpen(true)
                  }}
                  className="text-xs px-2 py-1.5 rounded-md cursor-pointer truncate transition-colors border shadow-sm
                    bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100"
                  title={`${b.waktu_konsultasi} - ${b.nama_lengkap}`}
                >
                  <span className="font-semibold mr-1">{b.waktu_konsultasi?.split(' ')[0]}</span>
                  {b.nama_panggilan || b.nama_lengkap}
                </div>
              ))}
              {dayBookings.length > 3 && (
                <div className="text-xs text-slate-500 pl-1 font-medium mt-1">
                  +{dayBookings.length - 3} more
                </div>
              )}
            </div>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      )
      days = []
    }
    return <div>{rows}</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Calendar View</h1>
        <p className="text-slate-500 text-sm mt-1">Manage schedules and view upcoming sessions.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6">
        {renderHeader()}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {renderDays()}
          {renderCells()}
        </div>
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
