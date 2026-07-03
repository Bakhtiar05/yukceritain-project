import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { BookingFormData } from "@/lib/schemas/booking";
import { QuestionCard } from "../components/QuestionCard";
import { StepHeader } from "../components/StepHeader";
import { ValidationMessage } from "../components/ValidationMessage";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isBefore, addDays, startOfDay, getDay } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MethodDateStep() {
  const { watch, setValue, control, formState: { errors } } = useFormContext<BookingFormData>();
  const metode = watch("metode_konsultasi");

  const now = new Date();
  const nowWib = toZonedTime(now, "Asia/Jakarta");
  const minDate = addDays(startOfDay(nowWib), 1);

  const isDateDisabled = (date: Date) => {
    const day = getDay(date);
    if (day === 1) return true; // Senin libur
    if (isBefore(date, minDate)) return true;
    return false;
  };

  return (
    <QuestionCard>
      <div>
        <StepHeader 
          title="Bagaimana Anda ingin melangsungkan sesi?" 
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          {["Online", "Offline"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setValue("metode_konsultasi", m as any, { shouldValidate: true })}
              className={cn(
                "h-16 rounded-2xl border-2 text-lg font-medium transition-all flex items-center justify-center gap-2",
                metode === m 
                  ? "border-blue-600 bg-blue-50 text-blue-700" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {m === "Online" ? "Google Meet" : "Tatap Muka"}
            </button>
          ))}
        </div>
        <ValidationMessage message={errors.metode_konsultasi?.message} />
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Kapan Anda ingin menjadwalkan sesi?</h2>
        <p className="text-slate-500">Konsultasi tersedia hari Selasa - Minggu.</p>
        <div className="mt-4">
          <Controller
            control={control}
            name="tanggal_konsultasi"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-16 text-left text-lg font-normal rounded-2xl bg-slate-50 border-slate-200 hover:bg-slate-100 px-4",
                      !field.value && "text-slate-400"
                    )}
                  >
                    {field.value ? format(field.value, "PPP", { locale: idLocale }) : <span>Pilih tanggal sesi</span>}
                    <CalendarIcon className="ml-auto h-5 w-5 text-slate-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white z-50 border border-slate-200 shadow-lg rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={isDateDisabled}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          <ValidationMessage message={errors.tanggal_konsultasi?.message} />
        </div>
      </div>
    </QuestionCard>
  );
}
