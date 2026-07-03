import React from "react";

interface StepHeaderProps {
  title: string;
  description?: string;
}

export function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <div className="mb-4 md:mb-6">
      <h2 className="text-3xl font-display font-bold text-slate-900">{title}</h2>
      {description && <p className="text-slate-500 mt-1 md:mt-2">{description}</p>}
    </div>
  );
}
