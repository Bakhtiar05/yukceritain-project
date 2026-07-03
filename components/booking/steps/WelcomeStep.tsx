import React from "react";
import { Button } from "@/components/ui/button";
import { BookingStepProps } from "../types/booking";
import { StepTransition } from "../components/StepTransition";
import { Lock } from "lucide-react";

export function WelcomeStep({ onStart }: BookingStepProps) {
  return (
    <StepTransition className="relative flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 py-4 md:py-12 w-full">
      {/* Decorative Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 rounded-3xl md:rounded-[40px]">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 md:w-96 md:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 md:w-96 md:h-96 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-2" />
      </div>

      {/* Floating Welcome Icon */}
      <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50/80 backdrop-blur-sm text-blue-600 rounded-full flex items-center justify-center text-4xl md:text-5xl mb-2 md:mb-4 shadow-sm animate-gentle-bounce ring-4 ring-white">
        🌿
      </div>

      {/* Main Copy */}
      <div className="max-w-lg px-2">
        <p className="text-slate-500 text-sm md:text-lg leading-relaxed">
          Kami akan membantu Anda menjadwalkan sesi konseling dengan mudah dan nyaman. Proses ini hanya membutuhkan sekitar 2 menit.
        </p>
      </div>

      {/* Action Area */}
      <div className="pt-0 md:pt-2 flex flex-col items-center gap-3 md:gap-5 w-full max-w-xs">
        <Button 
          onClick={onStart}
          className="w-full h-12 md:h-16 text-base md:text-lg font-semibold rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
        >
          Booking Konseling
        </Button>
        
        {/* Trust Message */}
        <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-400 font-medium">
          <Lock className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span>Seluruh informasi Anda bersifat rahasia.</span>
        </div>
      </div>
    </StepTransition>
  );
}
