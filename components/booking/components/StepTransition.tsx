import { cn } from "@/lib/utils";

interface StepTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function StepTransition({ children, className }: StepTransitionProps) {
  return (
    <div className={cn("animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>
      {children}
    </div>
  );
}
