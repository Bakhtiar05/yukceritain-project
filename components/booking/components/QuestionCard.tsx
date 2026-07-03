import React from "react";
import { StepTransition } from "./StepTransition";

interface QuestionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function QuestionCard({ children, className }: QuestionCardProps) {
  return (
    <StepTransition className={`max-w-xl mx-auto space-y-4 md:space-y-6 ${className || ""}`}>
      {children}
    </StepTransition>
  );
}
