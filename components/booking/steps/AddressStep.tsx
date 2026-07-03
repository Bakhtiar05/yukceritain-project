import React from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { BookingFormData } from "@/lib/schemas/booking";
import { QuestionCard } from "../components/QuestionCard";
import { StepHeader } from "../components/StepHeader";
import { ValidationMessage } from "../components/ValidationMessage";

export function AddressStep() {
  const { register, formState: { errors } } = useFormContext<BookingFormData>();
  return (
    <QuestionCard>
      <StepHeader 
        title="Bisa tuliskan alamat lengkap Anda?" 
        description="Hanya digunakan untuk pendataan administratif." 
      />
      <div className="relative">
        <Textarea 
          {...register("alamat_lengkap")} 
          placeholder="Jl. Sudirman No. 1..."
          className="min-h-[120px] text-lg rounded-2xl p-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors resize-none"
          autoFocus
        />
      </div>
      <ValidationMessage message={errors.alamat_lengkap?.message} />
    </QuestionCard>
  );
}
