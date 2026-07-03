import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "@/lib/schemas/booking";
import { BOOKING_STEPS, TOTAL_STEPS } from "../utils/bookingSteps";

export function useBookingNavigation(methods: UseFormReturn<BookingFormData>) {
  const [currentStep, setCurrentStep] = useState(0);
  const { trigger } = methods;

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
    const stepConfig = BOOKING_STEPS[currentStep];
    const fieldsToValidate = stepConfig?.fieldsToValidate || [];

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate as any);
      if (!isValid) return; // Prevent going next if validation fails
    }

    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jumpToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < TOTAL_STEPS) {
      setCurrentStep(stepIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return { currentStep, handleNext, handleBack, jumpToStep };
}
