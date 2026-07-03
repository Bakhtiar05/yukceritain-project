import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "@/lib/schemas/booking";

export function useBookingDraft(methods: UseFormReturn<BookingFormData>, currentStep: number) {
  const [isMounted, setIsMounted] = useState(false);
  const { watch, reset } = methods;
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

  const clearDraft = () => {
    try {
      localStorage.removeItem("booking-draft");
    } catch (e) {}
  };

  return { isMounted, clearDraft };
}
