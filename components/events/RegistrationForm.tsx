"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationFormValues } from "@/lib/validations/events";
import { registerForEvent } from "@/app/actions/events";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

interface RegistrationFormProps {
  eventId: string;
  isFree: boolean;
}

export default function RegistrationForm({ eventId, isFree }: RegistrationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      event_id: eventId,
      full_name: "",
      email: "",
      phone: "",
      institution: "",
      city: "",
      gender: "Perempuan",
    },
  });

  async function onSubmit(data: RegistrationFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await registerForEvent(data);
      if (res.error) {
        throw new Error(res.error);
      }
      
      if (res.redirectUrl) {
        // Redirect to Xendit payment page
        window.location.href = res.redirectUrl;
      } else if (res.registrationCode) {
        // Free event, go to ticket
        router.push(`/events/ticket/${res.registrationCode}`);
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
          <input 
            {...form.register("full_name")} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" 
            placeholder="John Doe"
          />
          {form.formState.errors.full_name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.full_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email <span className="text-red-500">*</span></label>
          <input 
            type="email"
            {...form.register("email")} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" 
            placeholder="john@example.com"
          />
          {form.formState.errors.email && <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">No. WhatsApp <span className="text-red-500">*</span></label>
          <input 
            {...form.register("phone")} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" 
            placeholder="08123456789"
          />
          {form.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{form.formState.errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Asal Instansi</label>
          <input 
            {...form.register("institution")} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" 
            placeholder="Universitas / Perusahaan"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Domisili (Kota)</label>
          <input 
            {...form.register("city")} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" 
            placeholder="Jakarta"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Kelamin</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="Laki-laki" {...form.register("gender")} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
              <span>Laki-laki</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="Perempuan" {...form.register("gender")} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
              <span>Perempuan</span>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 text-white bg-blue-600 font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {isFree ? "Daftar Sekarang" : "Lanjutkan ke Pembayaran"}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
