import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[150px] w-full rounded-lg border border-[#E2E8F0] bg-white p-4 text-base shadow-sm transition-all duration-200 placeholder:text-[#94A8BE] hover:border-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50 md:text-[15px]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
