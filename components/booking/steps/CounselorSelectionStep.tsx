"use client"

import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { BookingFormData } from "@/lib/schemas/booking"
import { BookingStepProps } from "../types/booking"
import { getPublicCounselors } from "@/lib/actions/counselors"
import { Counselor } from "@/lib/types"
import { Star, Loader2, CheckCircle2 } from "lucide-react"

export function CounselorSelectionStep({ onStart, onEdit }: BookingStepProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext<BookingFormData>()
  const counselorPreference = watch("counselor_preference")
  const selectedCounselorId = watch("counselor_id")
  
  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCounselors() {
      const data = await getPublicCounselors({ limit: 100 })
      setCounselors(data.counselors)
      setLoading(false)
    }
    loadCounselors()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Memuat daftar konselor...</p>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-blue-50 text-blue-600 mb-4 md:mb-6 shadow-sm border border-blue-100">
          <Star className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <h2 className="text-2xl md:text-[32px] font-bold text-slate-900 mb-2 md:mb-3 tracking-tight">
          Pemilihan Konselor
        </h2>
        <p className="text-sm md:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
          Pilih preferensi Anda untuk sesi konsultasi ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          type="button"
          onClick={() => {
            setValue("counselor_preference", "auto", { shouldValidate: true })
            setValue("counselor_id", "")
          }}
          className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
            counselorPreference === "auto"
              ? "border-blue-600 bg-blue-50/50 shadow-md"
              : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          {counselorPreference === "auto" && (
            <div className="absolute top-4 right-4 text-blue-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
          <h3 className="font-bold text-slate-900 mb-1 pr-6">Pilihkan untuk Saya</h3>
          <p className="text-sm text-slate-500">Sistem akan mencarikan konselor profesional yang paling sesuai dan tersedia.</p>
        </button>

        <button
          type="button"
          onClick={() => setValue("counselor_preference", "manual", { shouldValidate: true })}
          className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
            counselorPreference === "manual"
              ? "border-blue-600 bg-blue-50/50 shadow-md"
              : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          {counselorPreference === "manual" && (
            <div className="absolute top-4 right-4 text-blue-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
          <h3 className="font-bold text-slate-900 mb-1 pr-6">Pilih Konselor Sendiri</h3>
          <p className="text-sm text-slate-500">Lihat profil dan pilih konselor secara langsung.</p>
        </button>
      </div>

      {counselorPreference === "manual" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="font-semibold text-slate-900">Daftar Konselor</h3>
          <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {counselors.map((counselor) => {
              const isSelected = selectedCounselorId === counselor.id
              return (
                <div
                  key={counselor.id}
                  onClick={() => setValue("counselor_id", counselor.id, { shouldValidate: true })}
                  className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 ${
                    isSelected 
                      ? "border-blue-600 bg-blue-50/50 shadow-sm" 
                      : "border-slate-100 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={counselor.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(counselor.full_name)}&background=random`} 
                      alt={counselor.full_name}
                      className="w-14 h-14 rounded-full object-cover bg-slate-100 border border-slate-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 leading-tight">{counselor.full_name}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{counselor.profession}</p>
                    </div>
                    {isSelected && (
                      <div className="text-blue-600 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {errors.counselor_id && (
            <p className="text-red-500 text-sm font-medium mt-2">
              {errors.counselor_id.message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
