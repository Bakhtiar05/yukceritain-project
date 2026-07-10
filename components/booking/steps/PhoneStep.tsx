import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { BookingFormData } from "@/lib/schemas/booking";
import { QuestionCard } from "../components/QuestionCard";
import { StepHeader } from "../components/StepHeader";
import { ValidationMessage } from "../components/ValidationMessage";
import { Phone } from "lucide-react";

export function PhoneStep() {
  const { register, formState: { errors } } = useFormContext<BookingFormData>();
  return (
    <QuestionCard>
      <StepHeader 
        title="Berapa nomor WhatsApp Anda yang aktif?" 
        description="Digunakan untuk pengingat sebelum sesi Anda dimulai." 
      />
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Phone className="h-6 w-6 text-slate-400 dark:text-muted-foreground" />
        </div>
        <Input 
          {...register("nomor_hp")} 
          type="tel"
          placeholder="081234567890"
          className="h-16 text-lg rounded-2xl pl-12 pr-4 bg-slate-50 dark:bg-card border-slate-200 dark:border-border focus:bg-white dark:focus:bg-slate-800 transition-colors"
          autoFocus
          autoComplete="tel"
        />
      </div>
      <ValidationMessage message={errors.nomor_hp?.message} />
    </QuestionCard>
  );
}
