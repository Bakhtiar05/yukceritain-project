import { useFormContext, useWatch } from "react-hook-form";
import { BookingFormData } from "@/lib/schemas/booking";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { CustomFormField } from "@/components/ui/custom-form-field";
import { SelectableChip } from "@/components/ui/selectable-chip";

export function Step4InformasiTambahan() {
  const { control } = useFormContext<BookingFormData>();
  const sumberInformasi = useWatch({ control, name: "sumber_informasi" });

  return (
    <div className="space-y-10">
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
                className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3"
              >
                {["Pertama", "Kedua", "Ketiga", "Keempat", "Lebih dari Empat"].map((item) => (
                  <SelectableChip key={item} value={item} label={item} />
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
                className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3"
              >
                {["WhatsApp", "Instagram", "Campaign", "Teman", "Lainnya"].map((item) => (
                  <SelectableChip key={item} value={item} label={item} />
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
