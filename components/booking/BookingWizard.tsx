"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, BookingFormData, defaultBookingValues } from "@/lib/schemas/booking";
import { Step1DataDiri } from "./Step1DataDiri";
import { Step2InformasiKonsultasi } from "./Step2InformasiKonsultasi";
import { Step3JadwalKonsultasi } from "./Step3JadwalKonsultasi";
import { Step4InformasiTambahan } from "./Step4InformasiTambahan";
import { Step5Review } from "./Step5Review";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Check } from "lucide-react";
import { submitBooking } from "@/app/actions/booking";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { format } from "date-fns";
import { id } from "date-fns/locale";

const steps = [
  { id: "step1", title: "Data Diri" },
  { id: "step2", title: "Info Konsultasi" },
  { id: "step3", title: "Jadwal" },
  { id: "step4", title: "Info Tambahan" },
  { id: "step5", title: "Review" },
];

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const methods = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: defaultBookingValues,
    mode: "onTouched",
  });

  const { watch, trigger, getValues, reset } = methods;
  const formValues = watch();
  
  const price = parseInt(process.env.NEXT_PUBLIC_CONSULTATION_BASE_PRICE || "20000");

  useEffect(() => {
    // Load from local storage
    const savedData = localStorage.getItem("booking-draft");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Ensure dates are parsed correctly
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
    if (isMounted) {
      try {
        localStorage.setItem("booking-draft", JSON.stringify(formValues));
      } catch (e) {
        console.warn("localStorage is not available", e);
      }
    }
  }, [formValues, isMounted]);

  const handleNext = async () => {
    // Determine which fields to validate based on current step
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) {
      fieldsToValidate = ["email", "nama_lengkap", "nama_panggilan", "tanggal_lahir", "jenis_kelamin", "nik", "nomor_hp", "alamat_lengkap", "provinsi"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["status", "status_lainnya", "alasan", "alasan_lainnya", "topik_permasalahan", "topik_lainnya", "ceritakan_permasalahan"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["tanggal_konsultasi", "waktu_konsultasi", "metode_konsultasi"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["urutan_konseling", "sumber_informasi", "sumber_informasi_lainnya"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast({
        variant: "destructive",
        title: "Terdapat kesalahan",
        description: "Mohon periksa kembali isian Anda pada langkah ini.",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = async () => {
    const isValid = await trigger();
    if (!isValid) {
      const errors = methods.formState.errors;
      console.log("Form validation errors:", errors);
      toast({
        variant: "destructive",
        title: "Validasi Gagal",
        description: "Ada isian yang belum lengkap atau tidak valid di langkah sebelumnya. Mohon periksa kembali semua langkah.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = getValues();
      const res = await submitBooking(data);
      if (res.success && res.requestNumber) {
        try {
          localStorage.removeItem("booking-draft");
        } catch (e) {
          console.warn("localStorage is not available", e);
        }
        toast({
          title: "Berhasil",
          description: "Permohonan Anda berhasil dikirim. Mengalihkan ke halaman status...",
        });
        
        router.push(`/booking/success?request_number=${res.requestNumber}`);
        // Add a fallback reset just in case router.push takes time
        setTimeout(() => {
          setIsSubmitting(false);
        }, 3000);
      } else {
        throw new Error(res.error || "Gagal menyimpan data");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat mengirim permohonan. Silakan coba lagi.",
      });
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <div className="max-w-[900px] mx-auto w-full bg-white rounded-[20px] shadow-md booking-card p-6 md:p-12 border border-[#E2E8F0]">
      {/* Progress Indicator */}
      <div className="mb-12">
        <div className="flex justify-between items-start relative">
          {/* Progress line (behind circles) */}
          <div className="absolute top-[22px] left-[44px] right-[44px] h-[3px] bg-[#E2E8F0] rounded-full z-0">
            <div
              className="absolute top-0 left-0 h-full bg-[#2563EB] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center relative z-10" style={{ width: `${100 / steps.length}%` }}>
              <div
                className={`step-circle w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx < currentStep
                    ? "bg-[#2563EB] text-white shadow-md"
                    : idx === currentStep
                    ? "bg-white text-[#2563EB] border-2 border-[#2563EB] shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
                    : "bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0]"
                }`}
              >
                {idx < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  idx + 1
                )}
              </div>
              <span className={`text-xs mt-3 hidden md:block font-semibold tracking-wide ${
                idx < currentStep ? "text-[#2563EB]" : idx === currentStep ? "text-[#2563EB]" : "text-[#94A3B8]"
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl md:text-[30px] font-display font-bold text-[#0F172A] mb-2 leading-tight">
          {steps[currentStep].title}
        </h2>
        <p className="text-[#64748B] text-[15px]">
          Silakan lengkapi informasi di bawah ini dengan benar.
        </p>
      </div>

      <FormProvider {...methods}>
        <div className="space-y-8 animate-fade-enter">
          {currentStep === 0 && <Step1DataDiri />}
          {currentStep === 1 && <Step2InformasiKonsultasi />}
          {currentStep === 2 && <Step3JadwalKonsultasi />}
          {currentStep === 3 && <Step4InformasiTambahan />}
          {currentStep === 4 && <Step5Review />}
        </div>
      </FormProvider>

      {/* Navigation Buttons */}
      <div className="flex flex-row justify-between items-center gap-3 mt-14 pt-8 border-t border-[#E2E8F0]">
        {currentStep > 0 ? (
          <Button variant="outline" onClick={handleBack} className="rounded-xl px-4 md:px-6 h-12 text-sm md:text-[15px] font-medium text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-all duration-200 shrink-0">
            <ArrowLeft className="w-4 h-4 mr-1.5 md:mr-2" />
            Kembali
          </Button>
        ) : (
          <div className="w-[1px]" />
        )}

        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} className="booking-btn-primary rounded-xl px-5 md:px-8 h-12 text-sm md:text-[15px] font-semibold text-white shadow-md shrink-0">
            Selanjutnya
            <ArrowRight className="w-4 h-4 ml-1.5 md:ml-2" />
          </Button>
        ) : (
          <Button onClick={handleFinalSubmit} disabled={isSubmitting} className="bg-[#22C55E] hover:bg-[#16A34A] rounded-xl px-5 md:px-8 h-12 shadow-md text-sm md:text-[15px] text-white font-semibold transition-all duration-200 shrink-0">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 md:mr-2 animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim Permohonan"
            )}
          </Button>
        )}
      </div>

    </div>
  );
}
