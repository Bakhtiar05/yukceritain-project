import { useFormContext, useWatch } from "react-hook-form";
import { BookingFormData } from "@/lib/schemas/booking";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomFormField } from "@/components/ui/custom-form-field";

export function Step4InformasiTambahan() {
  const { control } = useFormContext<BookingFormData>();
  const sumberInformasi = useWatch({ control, name: "sumber_informasi" });

  return (
    <div className="space-y-8">
      {/* Urutan Konseling */}
      <FormField
        control={control}
        name="urutan_konseling"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Ini adalah sesi konseling ke berapa untuk Anda? *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 md:grid-cols-5 gap-3"
              >
                {["Pertama", "Kedua", "Ketiga", "Keempat", "Lebih dari Empat"].map((item) => (
                  <FormItem key={item}>
                    <FormControl>
                      <RadioGroupItem value={item} className="peer sr-only" />
                    </FormControl>
                    <FormLabel
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 text-sm hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 cursor-pointer text-center h-full"
                    >
                      {item}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Sumber Informasi */}
      <FormField
        control={control}
        name="sumber_informasi"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Mengetahui YukceritaIN dari mana? *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 md:grid-cols-5 gap-3"
              >
                {["WhatsApp", "Instagram", "Campaign", "Teman", "Lainnya"].map((item) => (
                  <FormItem key={item}>
                    <FormControl>
                      <RadioGroupItem value={item} className="peer sr-only" />
                    </FormControl>
                    <FormLabel
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 text-sm hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 cursor-pointer text-center h-full"
                    >
                      {item}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {sumberInformasi === "Lainnya" && (
        <div className="animate-fade-enter">
          <CustomFormField
            control={control}
            name="sumber_informasi_lainnya"
            label="Sebutkan Sumber Informasi Lainnya *"
            placeholder="Contoh: TikTok, Facebook, dll"
          />
        </div>
      )}
    </div>
  );
}
