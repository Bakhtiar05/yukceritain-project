export type { BookingFormData } from "@/lib/schemas/booking";

export interface BookingStepProps {
  onStart?: () => void;
  onEdit?: (step: number) => void;
}

export interface StepConfig {
  id: string;
  title?: string;
  component: React.ComponentType<BookingStepProps>;
  fieldsToValidate?: string[];
}
