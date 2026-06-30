import * as React from "react"
import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface SelectableChipProps extends React.ComponentPropsWithoutRef<typeof RadioGroupItem> {
  label?: React.ReactNode;
  children?: React.ReactNode;
  value: string;
}

export function SelectableChip({ value, label, children, className, ...props }: SelectableChipProps) {
  return (
    <FormItem>
      <FormControl>
        <RadioGroupItem value={value} className="peer sr-only" {...props} />
      </FormControl>
      <FormLabel
        className={cn(
          "flex flex-col items-center justify-center min-h-[40px] rounded-xl border-2 border-[#E2E8F0] bg-white py-2.5 px-3 text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] peer-data-[state=checked]:border-[#2563EB] peer-data-[state=checked]:bg-[#EFF6FF] peer-data-[state=checked]:text-[#1D4ED8] cursor-pointer transition-all duration-200 text-center h-full",
          className
        )}
      >
        {children || label}
      </FormLabel>
    </FormItem>
  )
}
