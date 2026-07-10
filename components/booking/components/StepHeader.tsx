import React from "react";

interface StepHeaderProps {
  title: string;
  description?: string;
}

export function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <div className="mb-4 md:mb-6">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-foreground leading-tight tracking-tight text-balance">{title}</h2>
      {description && <p className="text-slate-500 dark:text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">{description}</p>}
    </div>
  );
}
