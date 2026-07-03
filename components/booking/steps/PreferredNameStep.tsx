import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { BookingFormData } from "@/lib/schemas/booking";
import { QuestionCard } from "../components/QuestionCard";
import { StepHeader } from "../components/StepHeader";
import { ValidationMessage } from "../components/ValidationMessage";

export function PreferredNameStep() {
  const { register, formState: { errors } } = useFormContext<BookingFormData>();
  return (
    <QuestionCard>
      <StepHeader 
        title="Apa nama panggilan Anda?" 
        description="Nama panggilan yang nyaman akan membuat sesi terasa lebih hangat." 
      />
      <div className="relative">
        <Input 
          {...register("nama_panggilan")} 
          placeholder="Contoh: Budi"
          className="h-16 text-lg rounded-2xl pl-4 pr-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          autoFocus
        />
      </div>
      <ValidationMessage message={errors.nama_panggilan?.message} />
    </QuestionCard>
  );
}
