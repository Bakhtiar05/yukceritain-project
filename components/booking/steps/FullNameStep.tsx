import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { BookingFormData } from "@/lib/schemas/booking";
import { QuestionCard } from "../components/QuestionCard";
import { StepHeader } from "../components/StepHeader";
import { ValidationMessage } from "../components/ValidationMessage";

export function FullNameStep() {
  const { register, formState: { errors } } = useFormContext<BookingFormData>();
  return (
    <QuestionCard>
      <StepHeader 
        title="Siapa nama lengkap Anda?" 
        description="Kami ingin memastikan data Anda tercatat dengan benar." 
      />
      <div className="relative">
        <Input 
          {...register("nama_lengkap")} 
          placeholder="Contoh: Budi Santoso"
          className="h-16 text-lg rounded-2xl pl-4 pr-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          autoFocus
          autoComplete="name"
        />
      </div>
      <ValidationMessage message={errors.nama_lengkap?.message} />
    </QuestionCard>
  );
}
