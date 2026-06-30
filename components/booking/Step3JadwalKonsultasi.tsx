import { useEffect, useState, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { BookingFormData } from "@/lib/schemas/booking";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { SelectableChip } from "@/components/ui/selectable-chip";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfWeek, addWeeks, isSameWeek, isBefore, startOfDay, getDay, isAfter, endOfWeek, addDays } from "date-fns";
import { id } from "date-fns/locale";
import { getBookedSlots } from "@/app/actions/booking";
import { Loader2, AlertCircle } from "lucide-react";
import { toZonedTime } from "date-fns-tz";

const TIME_SLOTS = [
  "09:00 - 10:00 WIB",
  "10:00 - 11:00 WIB",
  "11:00 - 12:00 WIB",
  "13:00 - 14:00 WIB",
  "14:00 - 15:00 WIB",
  "15:00 - 16:00 WIB",
];

export function Step3JadwalKonsultasi() {
  const { control, setValue, clearErrors, setError } = useFormContext<BookingFormData>();
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  const selectedDate = useWatch({ control, name: "tanggal_konsultasi" });
  const selectedWaktu = useWatch({ control, name: "waktu_konsultasi" });

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

  // When selectedDate changes, reset time selection
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
      setValue("waktu_konsultasi", "");
      setSlotError(null);
    }
  }, [selectedDate, fetchBookedSlots, setValue]);

  const handleTimeSlotSelect = (time: string) => {
    setSlotError(null);
    setValue("waktu_konsultasi", time);
    clearErrors("waktu_konsultasi");
  };

  const now = new Date();
  const nowWib = toZonedTime(now, "Asia/Jakarta");
  const minDate = addDays(startOfDay(nowWib), 1);

  const isDateDisabled = (date: Date) => {
    const day = getDay(date);
    if (day < 2 || day > 5) return true;
    if (isBefore(date, minDate)) return true;
    return false;
  };

  const basePrice = parseInt(process.env.NEXT_PUBLIC_CONSULTATION_BASE_PRICE || "20000");
  const totalPrice = basePrice;

  return (
    <div className="space-y-10 font-sans text-[#0F172A]">
      {/* Session Selector removed */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Selection */}
        <FormField
          control={control}
          name="tanggal_konsultasi"
          render={({ field }) => (
            <FormItem className="flex flex-col bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
              <FormLabel className="text-base font-semibold">Tanggal Konsultasi <span className="text-red-500">*</span></FormLabel>
              <FormDescription>Pilih hari antara Selasa - Jumat.</FormDescription>
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 inline-block shadow-sm w-fit mt-4">
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
            <FormItem className="space-y-3 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col h-full">
              <FormLabel className="text-base font-semibold">Waktu Konsultasi <span className="text-red-500">*</span></FormLabel>
              <FormDescription>Zona waktu WIB (GMT+7)</FormDescription>
              
              {!selectedDate ? (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center text-[15px] text-[#64748B] mt-4">
                  Pilih tanggal terlebih dahulu untuk melihat ketersediaan waktu.
                </div>
              ) : isLoadingSlots ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center mt-4">
                  <Loader2 className="h-6 w-6 animate-spin text-[#2563EB] mb-2" />
                  <p className="text-sm text-neutral-500">Memeriksa ketersediaan jadwal...</p>
                </div>
              ) : (
                <div className="flex flex-col flex-1 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {TIME_SLOTS.map((time, idx) => {
                      const isBooked = bookedSlots.includes(time);
                      const isSelected = field.value === time;
                      
                      return (
                        <div key={time}>
                          <button
                            type="button"
                            disabled={isBooked}
                            onClick={() => handleTimeSlotSelect(time)}
                            className={`w-full flex flex-col items-center justify-center rounded-xl border-2 p-4 text-sm font-medium transition-all duration-200
                              ${isBooked 
                                ? "border-[#E2E8F0] bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed opacity-60" 
                                : isSelected
                                ? "border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]"
                                : "border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-[#CBD5E1] text-[#334155]"
                              }
                            `}
                          >
                            <span>{time}</span>
                            {isBooked && <span className="text-[10px] mt-1 text-red-500 font-bold uppercase tracking-wider">Full</span>}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  
                  {slotError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-start gap-2 animate-fade-enter">
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{slotError}</span>
                    </div>
                  )}
                </div>
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
          <FormItem className="space-y-3 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <FormLabel className="text-base font-semibold">Metode Konsultasi <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mt-2"
              >
                <SelectableChip value="Online" className="items-start text-left px-5">
                  <span className="font-bold text-[#0F172A] mb-1">Online</span>
                  <span className="text-sm font-normal text-neutral-500">Google Meet</span>
                </SelectableChip>
                <SelectableChip value="Offline" className="items-start text-left px-5">
                  <span className="font-bold text-[#0F172A] mb-1">Offline</span>
                  <span className="text-sm font-normal text-neutral-500">Hanya tersedia di Kota Serang, Banten</span>
                </SelectableChip>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Booking Summary Card */}
      {selectedDate && selectedWaktu && (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 shadow-sm animate-fade-enter">
          <h3 className="text-lg font-bold text-[#0F172A] mb-4 border-b border-[#E2E8F0] pb-3">Ringkasan Jadwal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#64748B] mb-1 font-medium">Tanggal</p>
                <p className="text-base font-semibold text-[#0F172A]">
                  {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: id })}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1 font-medium">Waktu Mulai</p>
                <p className="text-base font-semibold text-[#0F172A]">
                  {selectedWaktu}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#64748B] mb-1 font-medium">Durasi</p>
                <p className="text-base font-semibold text-[#0F172A]">
                  1 Jam
                </p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1 font-medium">Total Biaya</p>
                <p className="text-lg font-bold text-[#2563EB]">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
