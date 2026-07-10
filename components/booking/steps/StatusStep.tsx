import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { BookingFormData } from "@/lib/schemas/booking";
import { QuestionCard } from "../components/QuestionCard";
import { StepHeader } from "../components/StepHeader";
import { ValidationMessage } from "../components/ValidationMessage";
import { cn } from "@/lib/utils";

export function StatusStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<BookingFormData>();
  const statusVal = watch("status");
  const options = ["Pelajar", "Mahasiswa", "Orang Tua", "Lainnya"];

  return (
    <QuestionCard>
      <StepHeader 
        title="Apa status aktivitas Anda saat ini?" 
        description="Membantu kami menyesuaikan pendekatan konseling yang tepat." 
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setValue("status", opt as any, { shouldValidate: true })}
            className={cn(
              "h-16 rounded-2xl border-2 text-base font-medium transition-all text-left px-5",
              statusVal === opt 
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" 
                : "border-slate-200 dark:border-border bg-white dark:bg-card text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      <ValidationMessage message={errors.status?.message} />

      {statusVal === "Lainnya" && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
          <Input 
            {...register("status_lainnya")} 
            placeholder="Sebutkan status Anda..."
            className="h-16 text-lg rounded-2xl px-4 bg-slate-50 dark:bg-card border-slate-200 dark:border-border focus:bg-white dark:focus:bg-slate-800"
            autoFocus
          />
          <ValidationMessage message={errors.status_lainnya?.message} />
        </div>
      )}
    </QuestionCard>
  );
}
