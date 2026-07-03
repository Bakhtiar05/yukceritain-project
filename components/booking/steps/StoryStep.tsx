import React from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { BookingFormData } from "@/lib/schemas/booking";
import { QuestionCard } from "../components/QuestionCard";
import { StepHeader } from "../components/StepHeader";
import { ValidationMessage } from "../components/ValidationMessage";

export function StoryStep() {
  const { register, formState: { errors } } = useFormContext<BookingFormData>();
  return (
    <QuestionCard className="max-w-3xl">
      <StepHeader
        title="Bisa ceritakan situasi yang sedang Anda alami?"
        description="Luangkan waktu Anda. Bagikan apa yang membuat Anda merasa nyaman."
      />

      <div className="relative mt-8">
        <Textarea
          {...register("ceritakan_permasalahan")}
          placeholder="Saya akhir-akhir ini merasa..."
          className="min-h-[250px] md:min-h-[350px] text-lg rounded-2xl p-6 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all resize-y shadow-inner"
          autoFocus
        />
      </div>
      <ValidationMessage message={errors.ceritakan_permasalahan?.message} />
      <p className="text-sm text-slate-400 mt-4 text-center">Tidak perlu terburu-buru. Kami di sini untuk mendengarkan.</p>
    </QuestionCard>
  );
}
