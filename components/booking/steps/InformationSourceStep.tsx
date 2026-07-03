import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { BookingFormData } from "@/lib/schemas/booking";
import { QuestionCard } from "../components/QuestionCard";
import { ValidationMessage } from "../components/ValidationMessage";
import { cn } from "@/lib/utils";

export function InformationSourceStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<BookingFormData>();
  const sumber = watch("sumber_informasi");
  const alasan = watch("alasan");
  const urutan = watch("urutan_konseling");
  
  const alasans = ["Kemauan sendiri", "Saran dari teman", "Lainnya"];
  const urutans = ["Pertama", "Kedua", "Ketiga", "Keempat", "Lebih dari Empat"];
  const sources = ["WhatsApp", "Instagram", "Campaign", "Teman", "Lainnya"];

  return (
    <QuestionCard>
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Apa alasan Anda mencari layanan konseling?</h2>
        <div className="flex flex-wrap gap-3 mt-4">
          {alasans.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue("alasan", opt as any, { shouldValidate: true })}
              className={cn(
                "px-5 py-3 rounded-full border-2 text-sm font-medium transition-all",
                alasan === opt 
                  ? "border-blue-600 bg-blue-50 text-blue-700" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        {alasan === "Lainnya" && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2">
            <Input 
              {...register("alasan_lainnya")} 
              placeholder="Sebutkan alasan lainnya..."
              className="h-12 rounded-xl px-4 bg-slate-50 border-slate-200"
            />
            <ValidationMessage message={errors.alasan_lainnya?.message} />
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Ini konseling Anda yang ke berapa?</h2>
        <div className="flex flex-wrap gap-3 mt-4">
          {urutans.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue("urutan_konseling", opt as any, { shouldValidate: true })}
              className={cn(
                "px-5 py-3 rounded-full border-2 text-sm font-medium transition-all",
                urutan === opt 
                  ? "border-blue-600 bg-blue-50 text-blue-700" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        <ValidationMessage message={errors.urutan_konseling?.message} />
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Dari mana Anda mengetahui YukCeritaIN?</h2>
        <div className="flex flex-wrap gap-3 mt-4">
          {sources.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue("sumber_informasi", opt as any, { shouldValidate: true })}
              className={cn(
                "px-5 py-3 rounded-full border-2 text-sm font-medium transition-all",
                sumber === opt 
                  ? "border-blue-600 bg-blue-50 text-blue-700" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        <ValidationMessage message={errors.sumber_informasi?.message} />
        
        {sumber === "Lainnya" && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2">
            <Input 
              {...register("sumber_informasi_lainnya")} 
              placeholder="Sebutkan dari mana..."
              className="h-12 rounded-xl px-4 bg-slate-50 border-slate-200"
            />
            <ValidationMessage message={errors.sumber_informasi_lainnya?.message} />
          </div>
        )}
      </div>
    </QuestionCard>
  );
}
