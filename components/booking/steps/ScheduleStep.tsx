import React, { useState, useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { BookingFormData } from "@/lib/schemas/booking";
import { QuestionCard } from "../components/QuestionCard";
import { StepHeader } from "../components/StepHeader";
import { ValidationMessage } from "../components/ValidationMessage";
import { getBookedSlots } from "@/app/actions/booking";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "09:00 - 10:00 WIB",
  "10:00 - 11:00 WIB",
  "11:00 - 12:00 WIB",
  "13:00 - 14:00 WIB",
  "14:00 - 15:00 WIB",
  "15:00 - 16:00 WIB",
];

export function ScheduleStep() {
  const { watch, setValue, formState: { errors } } = useFormContext<BookingFormData>();
  const waktu = watch("waktu_konsultasi");
  const tgl = watch("tanggal_konsultasi");

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  const fetchTime = useCallback(async (date: Date) => {
    setLoading(true);
    setSlotError(null);
    try {
      const slots = await getBookedSlots(date);
      setBookedSlots(slots);
    } catch (e) {
      console.error(e);
      setSlotError("Gagal memuat jadwal yang sudah terisi. Silakan coba lagi nanti.");
      setBookedSlots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tgl) {
      fetchTime(tgl);
      setValue("waktu_konsultasi", "");
    }
  }, [tgl, fetchTime, setValue]);

  return (
    <QuestionCard>
      <StepHeader 
        title="Pukul berapa yang sesuai untuk Anda?" 
        description={`Menampilkan slot waktu untuk ${tgl ? format(tgl, "dd MMMM yyyy", { locale: idLocale }) : "..."}`} 
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center p-8 text-slate-500">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p>Memeriksa ketersediaan jadwal...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {TIME_SLOTS.map((time) => {
            const isBooked = bookedSlots.includes(time);
            const isSelected = waktu === time;

            return (
              <button
                key={time}
                type="button"
                disabled={isBooked}
                onClick={() => setValue("waktu_konsultasi", time, { shouldValidate: true })}
                className={cn(
                  "w-full flex flex-col items-center justify-center rounded-xl border-2 p-4 text-sm font-medium transition-all duration-200",
                  isBooked 
                    ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60" 
                    : isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600"
                )}
              >
                <span>{time}</span>
                {isBooked && <span className="text-[10px] mt-1 text-red-500 font-bold uppercase tracking-wider">Penuh</span>}
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
