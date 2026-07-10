import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { BookingFormData } from "@/lib/schemas/booking";
import { QuestionCard } from "../components/QuestionCard";
import { StepHeader } from "../components/StepHeader";
import { ValidationMessage } from "../components/ValidationMessage";
import { cn } from "@/lib/utils";

export function TopicStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<BookingFormData>();
  const topics = watch("topik_permasalahan") || [];
  
  const topicOptions = [
    "Kecemasan / Anxiety",
    "Depresi",
    "Stres Akademik",
    "Masalah Keluarga",
    "Hubungan Asmara",
    "Pengembangan Diri",
    "Karir / Pekerjaan",
    "Trauma",
    "Lainnya"
  ];

  const toggleTopic = (topic: string) => {
    if (topics.includes(topic)) {
      setValue("topik_permasalahan", topics.filter(t => t !== topic), { shouldValidate: true });
    } else {
      setValue("topik_permasalahan", [...topics, topic], { shouldValidate: true });
    }
  };

  return (
    <QuestionCard className="max-w-2xl">
      <StepHeader 
        title="Topik apa yang paling menggambarkan situasi Anda?" 
        description="Anda dapat memilih lebih dari satu topik." 
      />
      
      <div className="flex flex-wrap gap-3 mt-4">
        {topicOptions.map((topic) => {
          const isSelected = topics.includes(topic);
          return (
            <button
              key={topic}
              type="button"
              onClick={() => toggleTopic(topic)}
              className={cn(
                "px-5 py-3 rounded-full border-2 text-sm font-medium transition-all",
                isSelected 
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" 
                  : "border-slate-200 dark:border-border bg-white dark:bg-card text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              {topic}
            </button>
          )
        })}
      </div>
      <ValidationMessage message={errors.topik_permasalahan?.message} />

      {topics.includes("Lainnya") && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
          <Input 
            {...register("topik_lainnya")} 
            placeholder="Tuliskan topik spesifik lainnya..."
            className="h-14 text-base rounded-2xl px-4 bg-slate-50 dark:bg-card border-slate-200 dark:border-border focus:bg-white dark:focus:bg-slate-800 w-full max-w-md"
            autoFocus
          />
          <ValidationMessage message={errors.topik_lainnya?.message} />
        </div>
      )}
    </QuestionCard>
  );
}
