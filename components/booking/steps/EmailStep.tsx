import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { BookingFormData } from "@/lib/schemas/booking";
import { QuestionCard } from "../components/QuestionCard";
import { StepHeader } from "../components/StepHeader";
import { ValidationMessage } from "../components/ValidationMessage";
import { Mail } from "lucide-react";

export function EmailStep() {
  const { register, formState: { errors } } = useFormContext<BookingFormData>();
  return (
    <QuestionCard>
      <StepHeader 
        title="Ke mana kami harus mengirimkan konfirmasi Anda?" 
        description="Kami akan mengirimkan jadwal dan tautan Google Meet ke email ini." 
      />
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Mail className="h-6 w-6 text-slate-400" />
        </div>
        <Input 
          {...register("email")} 
          type="email"
          placeholder="email.anda@contoh.com"
          className="h-16 text-lg rounded-2xl pl-12 pr-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          autoFocus
          autoComplete="email"
        />
      </div>
      <ValidationMessage message={errors.email?.message} />
      <p className="text-sm text-slate-400">Anda sudah melakukannya dengan baik. Privasi Anda terjaga.</p>
    </QuestionCard>
  );
}
