import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookingFormData } from "@/lib/schemas/booking";
import { QuestionCard } from "../components/QuestionCard";
import { StepHeader } from "../components/StepHeader";
import { ValidationMessage } from "../components/ValidationMessage";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function IdentityStep() {
  const { register, control, formState: { errors } } = useFormContext<BookingFormData>();
  return (
    <QuestionCard>
      <div>
        <StepHeader 
          title="Kapan Anda lahir?" 
          description="Membantu konselor kami memahami Anda lebih baik." 
        />
        <div className="mt-4">
          <Controller
            control={control}
            name="tanggal_lahir"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-16 text-left text-lg font-normal rounded-2xl bg-slate-50 dark:bg-card border-slate-200 dark:border-border hover:bg-slate-100 dark:hover:bg-slate-800 px-4",
                      !field.value && "text-slate-400 dark:text-muted-foreground"
                    )}
                  >
                    {field.value ? format(field.value, "PPP", { locale: idLocale }) : <span>Pilih tanggal lahir</span>}
                    <CalendarIcon className="ml-auto h-5 w-5 text-slate-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-card z-50 border border-slate-200 dark:border-border shadow-lg rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    captionLayout="dropdown"
                    startMonth={new Date(1940, 0)}
                    endMonth={new Date()}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          <ValidationMessage message={errors.tanggal_lahir?.message} />
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-border">
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-foreground mb-2">Berapa Nomor Induk Kependudukan (NIK) Anda?</h2>
        <p className="text-slate-500 dark:text-muted-foreground">Diperlukan untuk keperluan administrasi resmi.</p>
        <div className="mt-4">
          <Input 
            {...register("nik")} 
            placeholder="16 digit NIK"
            className="h-16 text-lg rounded-2xl px-4 bg-slate-50 dark:bg-card border-slate-200 dark:border-border focus:bg-white dark:focus:bg-slate-800 transition-colors"
          />
          <ValidationMessage message={errors.nik?.message} />
        </div>
      </div>
    </QuestionCard>
  );
}
