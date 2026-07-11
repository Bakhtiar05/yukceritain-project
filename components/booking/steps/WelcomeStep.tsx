import React from "react";
import { Button } from "@/components/ui/button";
import { BookingStepProps } from "../types/booking";
import { StepTransition } from "../components/StepTransition";
import { Lock, Clock, UserCheck, Calendar, Shield, Heart } from "lucide-react";
import Image from "next/image";

export function WelcomeStep({ onStart }: BookingStepProps) {
  return (
    <StepTransition className="relative flex flex-col items-center justify-center text-center space-y-4 md:space-y-5 py-0 md:py-2 w-full max-w-[820px] mx-auto z-10">
      
      {/* Subtle Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10 hidden md:block opacity-70">
        <Calendar className="absolute top-[5%] left-[2%] w-6 h-6 text-blue-300/40 animate-float-1" />
        <Heart className="absolute bottom-[10%] left-[8%] w-5 h-5 text-rose-300/40 animate-float-2" />
        <Clock className="absolute top-[12%] right-[5%] w-5 h-5 text-indigo-300/40 animate-float-3" />
        <Shield className="absolute bottom-[12%] right-[2%] w-6 h-6 text-emerald-300/40 animate-float-1" />
      </div>

      {/* Logo */}
      <div className="w-16 h-16 md:w-[72px] md:h-[72px] mb-0 md:mb-2">
        <Image 
          src="/assets/logo-v5.webp" 
          alt="YukCeritain Logo" 
          width={120} 
          height={120} 
          className="w-full h-full object-contain dark:brightness-0 dark:invert"
        />
      </div>

      {/* Heading & Description */}
      <div className="space-y-2 md:space-y-3 px-4">
        <h2 className="text-3xl md:text-[42px] font-bold text-slate-900 dark:text-foreground tracking-tight leading-tight">
          Pesan Sesi Konselingmu
        </h2>
        <p className="text-[15px] md:text-[18px] text-slate-500 dark:text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Pilih jadwal yang paling sesuai untukmu dan mulai perjalanan konselingmu hanya dalam beberapa langkah mudah.
        </p>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 pt-2 px-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-card/50 text-slate-600 dark:text-white rounded-full text-xs font-medium border border-slate-100 dark:border-white/20">
          <Lock className="w-3.5 h-3.5 text-blue-500" /> 100% Rahasia
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-card/50 text-slate-600 dark:text-white rounded-full text-xs font-medium border border-slate-100 dark:border-white/20">
          <Clock className="w-3.5 h-3.5 text-blue-500" /> Hanya butuh 2 menit
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-card/50 text-slate-600 dark:text-white rounded-full text-xs font-medium border border-slate-100 dark:border-white/20">
          <UserCheck className="w-3.5 h-3.5 text-blue-500" /> Konselor Terverifikasi
        </div>
      </div>

      {/* Flow Preview */}
      <div className="w-full max-w-[400px] mx-auto pt-3 md:pt-4 pb-1 flex items-center justify-between text-[11px] md:text-[12px] font-medium text-slate-400 dark:text-white/70 relative">
        <div className="absolute left-[15%] right-[15%] top-[12px] h-[1px] bg-slate-100 dark:bg-white/40 -z-10" />
        <div className="flex flex-col items-center gap-2 w-1/4">
          <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-white/50 flex items-center justify-center text-blue-600 dark:text-white">1</div>
          <span className="text-blue-600 dark:text-white">Pesan</span>
        </div>
        <div className="flex flex-col items-center gap-2 w-1/4">
          <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-card border border-slate-100 dark:border-white/30 flex items-center justify-center">2</div>
          <span>Jadwal</span>
        </div>
        <div className="flex flex-col items-center gap-2 w-1/4">
          <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-card border border-slate-100 dark:border-white/30 flex items-center justify-center">3</div>
          <span>Bayar</span>
        </div>
        <div className="flex flex-col items-center gap-2 w-1/4">
          <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-card border border-slate-100 dark:border-white/30 flex items-center justify-center">4</div>
          <span>Selesai</span>
        </div>
      </div>

      {/* CTA Area */}
      <div className="pt-2 md:pt-4 flex flex-col items-center gap-3 w-full px-4">
        <Button 
          onClick={onStart}
          className="w-full max-w-[280px] h-[56px] text-[18px] font-semibold rounded-[18px] bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_8px_25px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_30px_-5px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 transition-all duration-300"
        >
          Mulai Konseling
        </Button>
        <p className="text-[12px] md:text-[13px] text-slate-400 font-medium flex items-center gap-1.5">
          <Lock className="w-3 h-3" /> Semua informasimu dijamin kerahasiaannya.
        </p>
      </div>

    </StepTransition>
  );
}
