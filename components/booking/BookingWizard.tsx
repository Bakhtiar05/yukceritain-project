"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, BookingFormData, defaultBookingValues } from "@/lib/schemas/booking";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { submitBooking } from "@/app/actions/booking";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  WelcomeStep,
  NameStep,
  NicknameStep,
  EmailStep,
  PhoneStep,
  DobNikStep,
  GenderProvinceStep,
  AddressStep,
  StatusStep,
  TopicStep,
  StoryStep,
  MethodDateStep,
  TimeStep,
  SourceStep,
  ReviewStep
} from "./steps/BookingSteps";

const TOTAL_STEPS = 15;

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const methods = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: defaultBookingValues,
    mode: "onTouched",
  });

  const { watch, trigger, getValues, reset } = methods;
  const formValues = watch();

  useEffect(() => {
    const savedData = localStorage.getItem("booking-draft");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.tanggal_lahir) parsed.tanggal_lahir = new Date(parsed.tanggal_lahir);
        if (parsed.tanggal_konsultasi) parsed.tanggal_konsultasi = new Date(parsed.tanggal_konsultasi);
        reset(parsed);
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
    setIsMounted(true);
  }, [reset]);

  useEffect(() => {
    if (isMounted && currentStep > 0) {
      try {
        localStorage.setItem("booking-draft", JSON.stringify(formValues));
      } catch (e) {
        console.warn("localStorage is not available", e);
      }
    }
  }, [formValues, isMounted, currentStep]);

  // Handle "Enter" key to go next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger on textarea (Story step)
      if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
        e.preventDefault();
        if (currentStep > 0 && currentStep < TOTAL_STEPS - 1) {
          handleNext();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    
    // Map current step to fields that must be validated before moving next
    switch (currentStep) {
      case 1: fieldsToValidate = ["nama_lengkap"]; break;
      case 2: fieldsToValidate = ["nama_panggilan"]; break;
      case 3: fieldsToValidate = ["email"]; break;
      case 4: fieldsToValidate = ["nomor_hp"]; break;
      case 5: fieldsToValidate = ["tanggal_lahir", "nik"]; break;
      case 6: fieldsToValidate = ["jenis_kelamin", "provinsi"]; break;
      case 7: fieldsToValidate = ["alamat_lengkap"]; break;
      case 8: fieldsToValidate = ["status", "status_lainnya"]; break;
      case 9: fieldsToValidate = ["topik_permasalahan", "topik_lainnya"]; break;
      case 10: fieldsToValidate = ["ceritakan_permasalahan"]; break;
      case 11: fieldsToValidate = ["metode_konsultasi", "tanggal_konsultasi"]; break;
      case 12: fieldsToValidate = ["waktu_konsultasi"]; break;
      case 13: fieldsToValidate = ["alasan", "alasan_lainnya", "urutan_konseling", "sumber_informasi", "sumber_informasi_lainnya"]; break;
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return; // Prevent going next if validation fails
    }

    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = async () => {
    if (submittingRef.current) return;
    
    const isValid = await trigger();
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Validasi Gagal",
        description: "Ada isian yang belum lengkap. Mohon periksa kembali semua langkah.",
      });
      return;
    }

    setIsSubmitting(true);
    submittingRef.current = true;
    
    try {
      const data = getValues();
      const res = await submitBooking(data);

      if (res.success && res.requestNumber) {
        try { localStorage.removeItem("booking-draft"); } catch (e) {}
        router.push(`/booking/success?request_number=${res.requestNumber}`);
      } else {
        throw new Error(res.error || "Gagal menyimpan data");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat mengirim permohonan. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  if (!isMounted) return null;

  // Calculate estimated time remaining (assume 10 seconds per remaining step)
  const remainingSteps = TOTAL_STEPS - 1 - currentStep;
  const estimatedSeconds = remainingSteps * 10;
  const estimatedMinutes = Math.ceil(estimatedSeconds / 60);

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Progress Bar (Hidden on Welcome Step) */}
      {currentStep > 0 && (
        <div className="mb-10 px-4 md:px-0 animate-in fade-in slide-in-from-top-4 duration-500">
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
        <div className="bg-white min-h-[400px] md:min-h-[500px] flex flex-col rounded-[32px] md:rounded-[40px] shadow-sm border border-slate-100 p-6 md:p-12 md:py-16 relative overflow-hidden">
          
          <div className="flex-1 w-full flex flex-col justify-center">
            {currentStep === 0 && <WelcomeStep onStart={() => setCurrentStep(1)} />}
            {currentStep === 1 && <NameStep />}
            {currentStep === 2 && <NicknameStep />}
            {currentStep === 3 && <EmailStep />}
            {currentStep === 4 && <PhoneStep />}
            {currentStep === 5 && <DobNikStep />}
            {currentStep === 6 && <GenderProvinceStep />}
            {currentStep === 7 && <AddressStep />}
            {currentStep === 8 && <StatusStep />}
            {currentStep === 9 && <TopicStep />}
            {currentStep === 10 && <StoryStep />}
            {currentStep === 11 && <MethodDateStep />}
            {currentStep === 12 && <TimeStep />}
            {currentStep === 13 && <SourceStep />}
            {currentStep === 14 && <ReviewStep onEdit={(step) => setCurrentStep(step)} />}
          </div>

          {/* Sticky Navigation Bottom Bar (Hidden on Welcome Step) */}
          {currentStep > 0 && (
            <div className="mt-12 flex items-center justify-between gap-4 pt-6 border-t border-slate-100 animate-in fade-in duration-700">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                className="rounded-2xl px-2 md:px-4 h-14 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              >
                <ArrowLeft className="w-5 h-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Kembali</span>
              </Button>
              
              {currentStep < TOTAL_STEPS - 1 ? (
                <Button 
                  onClick={handleNext} 
                  className="rounded-2xl px-6 md:px-8 h-14 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-lg shadow-xl shadow-slate-900/10 transition-transform active:scale-95"
                >
                  Lanjut
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleFinalSubmit} 
                  disabled={isSubmitting} 
                  className="rounded-2xl px-8 h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg shadow-xl shadow-emerald-600/20 transition-transform active:scale-95"
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
