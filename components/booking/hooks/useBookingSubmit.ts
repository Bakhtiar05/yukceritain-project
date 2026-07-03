import { useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { submitBooking } from "@/app/actions/booking";
import { BookingFormData } from "@/lib/schemas/booking";

export function useBookingSubmit(methods: UseFormReturn<BookingFormData>, clearDraft: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleFinalSubmit = async () => {
    if (submittingRef.current) return;
    
    const isValid = await methods.trigger();
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
      const data = methods.getValues();
      const res = await submitBooking(data);

      if (res.success && res.requestNumber) {
        clearDraft();
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

  return { isSubmitting, handleFinalSubmit };
}
