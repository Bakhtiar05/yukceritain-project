"use client";
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { bookingSchema, BookingFormData, defaultBookingValues } from "@/lib/schemas/booking";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useBookingDraft } from "./hooks/useBookingDraft";
import { useBookingNavigation } from "./hooks/useBookingNavigation";
import { useBookingSubmit } from "./hooks/useBookingSubmit";
import { BOOKING_STEPS, TOTAL_STEPS } from "./utils/bookingSteps";

const REFLECTIONS = [
  "Tidak apa-apa jika hari ini terasa berat.",
  "Setiap langkah kecil adalah sebuah kemajuan.",
  "Terima kasih sudah meluangkan waktu untuk dirimu sendiri.",
  "Kamu tidak harus menghadapi semuanya sendirian.",
  "Semoga hari ini menjadi awal yang lebih baik."
];

export function BookingWizard() {
  const searchParams = useSearchParams();
  const preselectedCounselorId = searchParams.get("counselor");

  const methods = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      ...defaultBookingValues,
      ...(preselectedCounselorId ? { 
        counselor_preference: "manual",
        counselor_id: preselectedCounselorId 
      } : {})
    },
    mode: "onTouched",
  });

  const { currentStep, returnToReview, handleNext, handleBack, jumpToStep } = useBookingNavigation(methods);
  const { isMounted, clearDraft } = useBookingDraft(methods, currentStep);
  const { isSubmitting, handleFinalSubmit } = useBookingSubmit(methods, clearDraft);
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    // Pick a random reflection only on the client to avoid hydration mismatch
    const randomIndex = Math.floor(Math.random() * REFLECTIONS.length);
    setReflection(REFLECTIONS[randomIndex]);
  }, []);

  if (!isMounted) return null;

  // Calculate estimated time remaining (assume 10 seconds per remaining step)
  const remainingSteps = TOTAL_STEPS - 1 - currentStep;
  const estimatedSeconds = remainingSteps * 10;
  const estimatedMinutes = Math.ceil(estimatedSeconds / 60);

  const CurrentStepComponent = BOOKING_STEPS[currentStep]?.component;

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Progress Bar (Hidden on Welcome Step) */}
      {currentStep > 0 && (
        <div className="mb-6 md:mb-10 px-4 md:px-0 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-end mb-3">
            <span className="text-sm font-semibold text-slate-500">
              Langkah {currentStep} dari {TOTAL_STEPS - 1}
            </span>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              Sekitar {estimatedMinutes} menit lagi
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(currentStep / (TOTAL_STEPS - 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Form Content */}
      <FormProvider {...methods}>
        <div className="bg-white min-h-[300px] md:min-h-[400px] flex flex-col rounded-3xl md:rounded-[40px] shadow-sm border border-slate-100 p-5 py-6 md:p-8 md:py-6 relative overflow-hidden">
          
          <div className="flex-1 w-full flex flex-col justify-center">
            {CurrentStepComponent && (
              <CurrentStepComponent 
                onStart={() => jumpToStep(preselectedCounselorId ? 2 : 1, false)} 
                onEdit={(step) => jumpToStep(step, true)} 
              />
            )}
          </div>

          {/* Sticky Navigation Bottom Bar (Hidden on Welcome Step) */}
          {currentStep > 0 && (
            <div className="mt-6 md:mt-12 flex items-center justify-between gap-3 md:gap-4 pt-4 md:pt-6 border-t border-slate-100 animate-in fade-in duration-700">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                className="rounded-2xl px-2 md:px-4 h-12 md:h-14 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              >
                <ArrowLeft className="w-5 h-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Kembali</span>
              </Button>
              
              {currentStep < TOTAL_STEPS - 1 ? (
                <Button 
                  onClick={handleNext} 
                  className="rounded-2xl px-6 md:px-8 h-12 md:h-14 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base md:text-lg shadow-xl shadow-slate-900/10 transition-transform active:scale-95"
                >
                  {returnToReview ? "Simpan Perubahan" : "Lanjut"}
                  {!returnToReview && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>
              ) : (
                <Button 
                  onClick={handleFinalSubmit} 
                  disabled={isSubmitting} 
                  className="rounded-2xl px-6 md:px-8 h-12 md:h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base md:text-lg shadow-xl shadow-emerald-600/20 transition-transform active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Konfirmasi & Pesan"
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </FormProvider>
    </div>
  );
}
