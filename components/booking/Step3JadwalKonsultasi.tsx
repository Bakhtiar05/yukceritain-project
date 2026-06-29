import { useEffect, useState, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { BookingFormData } from "@/lib/schemas/booking";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfWeek, addWeeks, isSameWeek, isBefore, startOfDay, getDay, isAfter, endOfWeek, addDays } from "date-fns";
import { getBookedSlots } from "@/app/actions/booking";
import { Loader2 } from "lucide-react";
import { toZonedTime } from "date-fns-tz";

const TIME_SLOTS = [
  "09:00 WIB",
  "10:00 WIB",
  "11:00 WIB",
  "13:00 WIB",
  "14:00 WIB",
  "15:00 WIB",
];

export function Step3JadwalKonsultasi() {
  const { control, setValue } = useFormContext<BookingFormData>();
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const selectedDate = useWatch({ control, name: "tanggal_konsultasi" });

  const fetchBookedSlots = useCallback(async (date: Date) => {
    setIsLoadingSlots(true);
    try {
      const slots = await getBookedSlots(date);
      setBookedSlots(slots);
    } catch (e) {
      console.error(e);
      setBookedSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
      // Reset time when date changes
      setValue("waktu_konsultasi", "");
    }
  }, [selectedDate, fetchBookedSlots, setValue]);

  // Handle Timezone and Date constraints
  const now = new Date();
  // Ensure we evaluate "today" based on Jakarta time
  const nowWib = toZonedTime(now, "Asia/Jakarta");
  
  // Set minimum date to tomorrow
  const minDate = addDays(startOfDay(nowWib), 1);

  const isDateDisabled = (date: Date) => {
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const day = getDay(date);
    
    // Only allow Tue (2), Wed (3), Thu (4), Fri (5)
    if (day < 2 || day > 5) return true;

    // Must be strictly from tomorrow onwards
    if (isBefore(date, minDate)) {
      return true;
    }

    return false;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Calendar Selection */}
        <FormField
          control={control}
          name="tanggal_konsultasi"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal Konsultasi *</FormLabel>
              <FormDescription>Pilih hari antara Selasa - Jumat.</FormDescription>
              <div className="rounded-md border bg-white p-3 inline-block shadow-sm w-fit">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={isDateDisabled}
                  className="mx-auto"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Slot Selection */}
        <FormField
          control={control}
          name="waktu_konsultasi"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Waktu Konsultasi *</FormLabel>
              <FormDescription>Zona waktu WIB (GMT+7)</FormDescription>
              {!selectedDate ? (
                <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
                  Pilih tanggal terlebih dahulu untuk melihat ketersediaan waktu.
                </div>
              ) : isLoadingSlots ? (
                <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 p-4 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500 mb-2" />
                  <p className="text-sm text-neutral-500">Memeriksa ketersediaan jadwal...</p>
                </div>
              ) : (
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 gap-3"
                  >
                    {TIME_SLOTS.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                        <FormItem key={time}>
                          <FormControl>
                            <RadioGroupItem value={time} className="peer sr-only" disabled={isBooked} />
                          </FormControl>
                          <FormLabel
                            className={`flex flex-col items-center justify-center rounded-md border-2 p-3 text-sm font-medium transition-colors
                              ${isBooked 
                                ? "border-muted bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-60" 
                                : "border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 peer-data-[state=checked]:text-blue-700 cursor-pointer"
                              }
                            `}
                          >
                            {time}
                            {isBooked && <span className="text-[10px] mt-1 text-red-500 font-semibold">Penuh</span>}
                          </FormLabel>
                        </FormItem>
                      )
                    })}
                  </RadioGroup>
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="metode_konsultasi"
        render={({ field }) => (
          <FormItem className="space-y-3 pt-4 border-t border-neutral-100">
            <FormLabel>Metode Konsultasi *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="Online" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 cursor-pointer">
                    <span className="font-semibold text-base mb-1">Online</span>
                    <span className="text-sm font-normal text-neutral-500">Google Meet</span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="Offline" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 cursor-pointer">
                    <span className="font-semibold text-base mb-1">Offline</span>
                    <span className="text-sm font-normal text-neutral-500">Hanya tersedia di Kota Serang, Banten</span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
