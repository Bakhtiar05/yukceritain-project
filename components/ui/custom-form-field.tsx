import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CustomFormFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  description?: React.ReactNode;
  isTextarea?: boolean;
  className?: string;
  maxLength?: number;
}

export function CustomFormField({
  control,
  name,
  label,
  placeholder,
  type = "text",
  description,
  isTextarea,
  className,
  maxLength,
}: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {isTextarea ? (
              <Textarea 
                placeholder={placeholder} 
                className={maxLength ? "min-h-[150px] resize-y" : "resize-none"} 
                maxLength={maxLength}
                {...field} 
              />
            ) : (
              <Input type={type} placeholder={placeholder} {...field} />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
