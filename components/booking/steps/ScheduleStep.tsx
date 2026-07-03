import React, { useState, useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { BookingFormData } from "@/lib/schemas/booking";
import { QuestionCard } from "../components/QuestionCard";
import { StepHeader } from "../components/StepHeader";
import { ValidationMessage } from "../components/ValidationMessage";
import { getDynamicTimeSlots } from "@/lib/actions/availability";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScheduleStep() {
  const { watch, setValue, formState: { errors } } = useFormContext<BookingFormData>();
  const waktu = watch("waktu_konsultasi");
  const tgl = watch("tanggal_konsultasi");
  const counselor_id = watch("counselor_id");

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  const fetchTime = useCallback(async (date: Date, cId?: string) => {
    setLoading(true);
    setSlotError(null);
    try {
      const slots = await getDynamicTimeSlots(date, cId);
      setAvailableSlots(slots);
      
      // Clear selected time if it's no longer available
      if (waktu && !slots.includes(waktu)) {
        setValue("waktu_konsultasi", "");
      }
    } catch (e) {
      console.error(e);
      setSlotError("Gagal memuat ketersediaan jadwal. Silakan coba lagi nanti.");
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  }, [waktu, setValue]);

  useEffect(() => {
    if (tgl) {
      fetchTime(tgl, counselor_id);
    }
  }, [tgl, counselor_id, fetchTime]);

  return (
    <QuestionCard>
      <StepHeader 
        title="Pukul berapa yang sesuai untuk Anda?" 
        description={`Menampilkan ketersediaan slot waktu untuk ${tgl ? format(tgl, "dd MMMM yyyy", { locale: idLocale }) : "..."}`} 
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center p-8 text-slate-500">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p>Mencari jadwal yang tersedia...</p>
        </div>
      ) : availableSlots.length === 0 && tgl ? (
        <div className="flex flex-col items-center justify-center p-8 text-slate-500 bg-slate-50 rounded-xl border border-slate-200 mt-4">
          <p className="text-center">Maaf, tidak ada konselor yang tersedia pada tanggal ini.</p>
          <p className="text-sm mt-2">Silakan pilih tanggal lain di langkah sebelumnya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {availableSlots.map((time) => {
            const isSelected = waktu === time;

            return (
              <button
                key={time}
                type="button"
                onClick={() => setValue("waktu_konsultasi", time, { shouldValidate: true })}
                className={cn(
                  "w-full flex flex-col items-center justify-center rounded-xl border-2 p-4 text-sm font-medium transition-all duration-200",
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600"
                )}
              >
                <span>{time}</span>
              </button>
            )
          })}
        </div>
      )}
      
      {slotError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
          {slotError}
        </div>
      )}
      
      <ValidationMessage message={errors.waktu_konsultasi?.message} />
    </QuestionCard>
  );
}
