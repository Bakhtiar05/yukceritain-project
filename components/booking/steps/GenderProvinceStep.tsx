import React from "react";
import { useFormContext } from "react-hook-form";
import { BookingFormData } from "@/lib/schemas/booking";
import { QuestionCard } from "../components/QuestionCard";
import { ValidationMessage } from "../components/ValidationMessage";
import { cn } from "@/lib/utils";

const PROVINCES = [
  "Nanggroe Aceh Darussalam", "Sumatera Utara", "Sumatera Selatan", "Sumatera Barat", "Bengkulu", 
  "Riau", "Kepulauan Riau", "Jambi", "Lampung", "Bangka Belitung", 
  "Kalimantan Barat", "Kalimantan Timur", "Kalimantan Selatan", "Kalimantan Tengah", "Kalimantan Utara", 
  "Banten", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", 
  "Bali", "Nusa Tenggara Timur", "Nusa Tenggara Barat", 
  "Gorontalo", "Sulawesi Barat", "Sulawesi Tengah", "Sulawesi Utara", "Sulawesi Tenggara", "Sulawesi Selatan", 
  "Maluku Utara", "Maluku", 
  "Papua Barat", "Papua", "Papua Tengah", "Papua Pegunungan", "Papua Selatan", "Papua Barat Daya"
].sort();

export function GenderProvinceStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<BookingFormData>();
  const jenisKelamin = watch("jenis_kelamin");
  
  return (
    <QuestionCard>
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Apa jenis kelamin Anda?</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {["Laki-laki", "Perempuan"].map((jk) => (
            <button
              key={jk}
              type="button"
              onClick={() => setValue("jenis_kelamin", jk as any, { shouldValidate: true })}
              className={cn(
                "h-16 rounded-2xl border-2 text-lg font-medium transition-all",
                jenisKelamin === jk 
                  ? "border-blue-600 bg-blue-50 text-blue-700" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {jk}
            </button>
          ))}
        </div>
        <ValidationMessage message={errors.jenis_kelamin?.message} />
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Di provinsi mana Anda tinggal?</h2>
        <div className="mt-4">
          <select 
            {...register("provinsi")}
            className="w-full h-16 text-lg rounded-2xl px-4 bg-slate-50 border border-slate-200 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="" disabled>Pilih provinsi...</option>
            {PROVINCES.map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
          <ValidationMessage message={errors.provinsi?.message} />
        </div>
      </div>
    </QuestionCard>
  );
}
