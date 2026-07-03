"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/ui/AdminPageHeader'
import type { Counselor } from '@/lib/types'
import { CounselorAvailability, updateCounselorAvailability } from '@/lib/actions/availability'
import { useToast } from '@/hooks/use-toast'
import { Save, Plus, Trash2, ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'

interface ScheduleClientProps {
  counselor: Counselor;
  initialAvailability: CounselorAvailability[];
}

const DAYS_OF_WEEK = [
  { value: 2, label: 'Selasa' },
  { value: 3, label: 'Rabu' },
  { value: 4, label: 'Kamis' },
  { value: 5, label: 'Jumat' },
  { value: 6, label: 'Sabtu' },
  { value: 0, label: 'Minggu' }
]

export default function ScheduleClient({ counselor, initialAvailability }: ScheduleClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Transform flat array into mapped structure by day
  const [schedules, setSchedules] = useState<Record<number, {start: string, end: string}[]>>(() => {
    const map: Record<number, {start: string, end: string}[]> = {0:[],1:[],2:[],3:[],4:[],5:[],6:[]}
    
    if (initialAvailability.length > 0) {
      initialAvailability.forEach(avail => {
        if (avail.is_available) {
          map[avail.day_of_week].push({
            start: avail.start_time.substring(0, 5), // 'HH:mm:ss' to 'HH:mm'
            end: avail.end_time.substring(0, 5)
          })
        }
      })
    } else {
      // Default: Selasa (2) - Minggu (0), 10:00 - 22:00
      // Senin (1) Libur
      [2, 3, 4, 5, 6, 0].forEach(day => {
        map[day].push({ start: '10:00', end: '22:00' })
      })
    }
    
    return map
  })

  const addTimeBlock = (day: number) => {
    setSchedules(prev => ({
      ...prev,
      [day]: [...prev[day], { start: '10:00', end: '22:00' }]
    }))
  }

  const removeTimeBlock = (day: number, index: number) => {
    setSchedules(prev => {
      const newDay = [...prev[day]]
      newDay.splice(index, 1)
      return { ...prev, [day]: newDay }
    })
  }

  const updateTimeBlock = (day: number, index: number, field: 'start' | 'end', value: string) => {
    setSchedules(prev => {
      const newDay = [...prev[day]]
      newDay[index] = { ...newDay[index], [field]: value }
      return { ...prev, [day]: newDay }
    })
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    
    try {
      const payload: Omit<CounselorAvailability, 'id' | 'counselor_id'>[] = []
      
      // Validate and build payload
      for (const dayStr of Object.keys(schedules)) {
        const day = parseInt(dayStr)
        const blocks = schedules[day]
        
        for (const block of blocks) {
          if (!block.start || !block.end) {
            throw new Error(`Harap lengkapi semua jam pada hari ${DAYS_OF_WEEK.find(d => d.value === day)?.label}`)
          }
          if (block.start >= block.end) {
            throw new Error(`Jam mulai harus lebih awal dari jam selesai pada hari ${DAYS_OF_WEEK.find(d => d.value === day)?.label}`)
          }
          
          payload.push({
            day_of_week: day,
            start_time: `${block.start}:00`,
            end_time: `${block.end}:00`,
            is_available: true
          })
        }
      }

      const res = await updateCounselorAvailability(counselor.id, payload)
      
      if (res.success) {
        toast({ title: 'Berhasil', description: 'Jadwal ketersediaan berhasil diperbarui.' })
        router.push('/admin/konseling/counselors')
        router.refresh()
      } else {
        throw new Error(res.error || 'Gagal menyimpan jadwal')
      }
    } catch (err: any) {
      toast({ title: 'Gagal', description: err.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex items-center space-x-4 mb-2">
        <Link 
          href="/admin/konseling/counselors"
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader 
          title="Manajemen Jadwal Konselor" 
          description={`Atur jam kerja untuk ${counselor.full_name}`}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Jadwal Ketersediaan Mingguan</h3>
              <p className="text-sm text-slate-500">Sistem akan otomatis memecah jam kerja ini menjadi slot per 1 jam.</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day.value} className="flex flex-col sm:flex-row gap-4 py-4 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="w-32 flex-shrink-0 pt-2">
                <span className="font-medium text-slate-700">{day.label}</span>
              </div>
              
              <div className="flex-1 space-y-3">
                {schedules[day.value].length === 0 ? (
                  <div className="text-sm text-slate-400 italic pt-2">
                    Libur / Tidak ada jadwal
                  </div>
                ) : (
                  schedules[day.value].map((block, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input 
                        type="time" 
                        value={block.start}
                        onChange={(e) => updateTimeBlock(day.value, idx, 'start', e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <span className="text-slate-400">-</span>
                      <input 
                        type="time" 
                        value={block.end}
                        onChange={(e) => updateTimeBlock(day.value, idx, 'end', e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <button 
                        onClick={() => removeTimeBlock(day.value, idx)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                        title="Hapus jam"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
                
                <button 
                  onClick={() => addTimeBlock(day.value)}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium py-1"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Jam
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Simpan Jadwal
          </button>
        </div>
      </div>
    </div>
  )
}
