import { useFormContext } from "react-hook-form";
import { BookingFormData } from "@/lib/schemas/booking";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { provinces } from "@/lib/data-provinces";
import { CustomFormField } from "@/components/ui/custom-form-field";

export function Step1DataDiri() {
  const { control } = useFormContext<BookingFormData>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
      <CustomFormField
        control={control}
        name="email"
        label="Email *"
        placeholder="example@email.com"
        type="email"
        className="col-span-1 md:col-span-2"
      />

      <CustomFormField
        control={control}
        name="nama_lengkap"
        label="Nama Lengkap *"
        placeholder="HANNA AZZAHRA"
        description="Tulis nama menggunakan huruf kapital."
      />

      <CustomFormField
        control={control}
        name="nama_panggilan"
        label="Nama Panggilan *"
        placeholder="Mba Hanna"
        description="Contoh: Mba Hanna, Mas Andi, Kak Rina."
      />

      <FormField
        control={control}
        name="tanggal_lahir"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Tanggal Lahir *</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[100] bg-white border border-neutral-200 shadow-xl" align="start" sideOffset={8}>
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  startMonth={new Date(1900, 0)}
                  endMonth={new Date()}
                  selected={field.value ?? undefined}
                  onSelect={(date: Date | undefined) => field.onChange(date)}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="jenis_kelamin"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Jenis Kelamin *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row space-x-4"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Laki-laki" />
                  </FormControl>
                  <FormLabel className="font-normal">Laki-laki</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Perempuan" />
                  </FormControl>
                  <FormLabel className="font-normal">Perempuan</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <CustomFormField
        control={control}
        name="nik"
        label="NIK (16 Digit) *"
        placeholder="36730xxxxxxxxxxx"
        description="Jika belum memiliki KTP, gunakan NIK pada Kartu Keluarga."
      />

      <CustomFormField
        control={control}
        name="nomor_hp"
        label="Nomor HP Aktif *"
        placeholder="081234567890"
      />

      <FormField
        control={control}
        name="provinsi"
        render={({ field }) => (
          <FormItem className="flex flex-col mt-2">
            <FormLabel>Provinsi *</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? provinces.find((p) => p.value === field.value)?.label
                      : "Pilih provinsi"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full md:w-[350px] p-0 bg-white border border-neutral-200 shadow-xl z-[100]">
                <Command>
                  <CommandInput placeholder="Cari provinsi..." />
                  <CommandList>
                    <CommandEmpty>Provinsi tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {provinces.map((province) => (
                        <CommandItem
                          value={province.label}
                          key={province.value}
                          onSelect={() => {
                            field.onChange(province.value)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              province.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {province.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <CustomFormField
        control={control}
        name="alamat_lengkap"
        label="Alamat Lengkap *"
        placeholder="Jl. Sudirman No. 123, RT 01/RW 02..."
        isTextarea={true}
        className="col-span-1 md:col-span-2"
      />
    </div>
  );
}
